// ═══════════════════════════════════════════════════
//  src/ui.js — Manipulación del DOM (Record Sheet)
//  Versión reactiva con burbujas de armadura y
//  escala de calor animada para tablet
// ═══════════════════════════════════════════════════

import {
    getCurrentMech, getBaseHeat, getMoveHeat, setMoveHeat,
    getCriticalDamage, toggleCriticalSlot, setArmor, subscribe,
    applyDamageSnapshot
} from './state.js';

import {
    calculatePenalties, calculateNetHeat, getWeaponHeat,
    HEAT_EFFECTS, HIT_LOCATION_TABLE, useAmmo, refundAmmo,
    getDestroyedWeapons, CRIT_EFFECTS, WEAPON_DB,
    takeDamage, getAmmoExplosionDamage
} from './mechanics.js';

import { 
    evaluateSystemDamage, countSystemHits, getHeatSinkLoss, SYSTEM_CRIT_NAMES 
} from './rules.js';

// ═══════════════════════════════════════════════════
//  BOOT — Wire reactive subscriptions
// ═══════════════════════════════════════════════════

export function initReactiveBindings() {
    subscribe('heat-changed', () => {
        updateHeatMath();
        updatePenaltiesAndMovement();
    });
    subscribe('crit-toggled', () => {
        updateSystemHitsFromCrits();
        syncWeaponStates();
        updateHeatMath();
        updatePenaltiesAndMovement();
    });
    subscribe('armor-changed', (data) => {
        if (data.isStructure) return; // structure uses its own render
        // Bubble colors are updated inline in the click handler
    });
}

// ═══════════════════════════════════════════════════
//  OVERVIEW PANEL
// ═══════════════════════════════════════════════════

export function renderOverview(mech) {
    const grid = document.getElementById('overview-grid');
    grid.innerHTML = `
        <span class="label">TONELAJE:</span><span class="value">${mech.tonnage}t</span>
        <span class="label">BV:</span><span class="value">${mech.bv ? mech.bv.toLocaleString() : 'N/D'}</span>
        <span class="label">ANDAR:</span><span class="value">${mech.walk}</span>
        <span class="label">CORRER:</span><span class="value">${mech.run}</span>
        <span class="label">SALTAR:</span><span class="value">${mech.jump || '—'}</span>
        <span class="label">TEC. BASE:</span><span class="value">${mech.techBase}</span>
        <span class="label">RADIADORES:</span><span class="value">${mech.heatSinks} ${mech.heatSinkType}</span>
        <span class="label">BLINDAJE:</span><span class="value" title="${mech.armorType}">${mech.totalArmor} pts (${mech.totalArmorTons}t)</span>
    `;
}

// ═══════════════════════════════════════════════════
//  PILOT PANEL
// ═══════════════════════════════════════════════════

export function renderPilotHits() {
    const container = document.getElementById('pilot-hits');
    container.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        const box = document.createElement('div');
        box.className = 'pilot-hit-box';
        box.dataset.index = i;
        box.innerText = '✕';
        box.addEventListener('click', () => { box.classList.toggle('hit'); });
        container.appendChild(box);
    }
}

// ═══════════════════════════════════════════════════
//  WEAPONS TABLE — with needsAmmo indicator
// ═══════════════════════════════════════════════════

export function renderWeaponsTable(mech) {
    const tbody = document.getElementById('weapons-body');
    tbody.innerHTML = '';

    mech.weapons.forEach((w, i) => {
        const tr = document.createElement('tr');
        tr.id = `weapon-row-${i}`;
        const ammoFlag = w.needsAmmo ? '●' : '';
        tr.innerHTML = `
            <td>${i + 1}</td>
            <td style="text-align:left;">${w.name} <span style="color:var(--neon-orange);font-size:9px;">${ammoFlag}</span></td>
            <td>${w.loc}</td>
            <td style="color:var(--neon-orange);">${w.heat}</td>
            <td>${w.dmg}</td>
            <td>${w.minR || '—'}</td>
            <td>${w.shortR}</td>
            <td>${w.medR}</td>
            <td>${w.longR}</td>
            <td><button class="btn-toggle" data-heat="${w.heat}" data-weapon-idx="${i}">—</button></td>
        `;
        tbody.appendChild(tr);
    });

    // Event delegation for fire toggles
    tbody.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-toggle');
        if (!btn || btn.disabled) return;
        
        const wIdx = parseInt(btn.dataset.weaponIdx, 10);
        const mech = getCurrentMech();
        if (!mech || !mech.weapons[wIdx]) return;
        const weapon = mech.weapons[wIdx];

        if (btn.classList.contains('active')) {
            // Un-fire
            if (weapon.consumedAmmoIndex !== undefined) {
                refundAmmo(weapon.consumedAmmoIndex);
                weapon.consumedAmmoIndex = undefined;
                renderAmmoTable(mech);
            }
            btn.classList.remove('active');
            btn.innerText = '—';
        } else {
            // Fire
            if (weapon.needsAmmo) {
                // Find compatible bins that have ammo left
                const wNameFixed = weapon.name.toLowerCase().replace(/-/g, ' ').replace('lrm', 'lrm ').replace('srm', 'srm ').replace('ac/', 'ac ').replace(/\s+/g, ' ');
                const compatibleBins = mech.ammo.map((a, i) => ({...a, index: i})).filter(a => {
                    const aNameFixed = a.name.toLowerCase().replace(/-/g, ' ').replace('lrm', 'lrm ').replace('srm', 'srm ').replace('ac/', 'ac ').replace(/\s+/g, ' ');
                    // Simple cross-inclusion check
                    return a.current > 0 && (aNameFixed.includes(wNameFixed) || wNameFixed.includes(aNameFixed));
                });
                
                if (compatibleBins.length === 0) {
                    alert('Sin munición disponible para ' + weapon.name);
                    return; // Prevent firing
                } else if (compatibleBins.length === 1) {
                    const binIdx = compatibleBins[0].index;
                    useAmmo(binIdx);
                    weapon.consumedAmmoIndex = binIdx;
                    renderAmmoTable(mech);
                } else {
                    const options = compatibleBins.map((b, i) => `${i+1}: Localización [${b.loc}] - Quedan: ${b.current}`).join('\n');
                    const choice = window.prompt(`Múltiples depósitos de munición para ${weapon.name}.\nElige de dónde consumir (1-${compatibleBins.length}):\n\n${options}`, '1');
                    const selectedNumber = parseInt(choice, 10);
                    if (isNaN(selectedNumber) || selectedNumber < 1 || selectedNumber > compatibleBins.length) {
                        return; // Cancel firing
                    }
                    const binIdx = compatibleBins[selectedNumber - 1].index;
                    useAmmo(binIdx);
                    weapon.consumedAmmoIndex = binIdx;
                    renderAmmoTable(mech);
                }
            }

            btn.classList.add('active');
            btn.innerText = '🔥';
        }
        updateHeatMath();
    });
}

/**
 * Disable/enable weapons in the table based on critical damage.
 */
export function syncWeaponStates() {
    const mech = getCurrentMech();
    if (!mech) return;

    const critDamage = getCriticalDamage();
    const destroyed = getDestroyedWeapons(mech, critDamage);

    const destroyedCounts = {};
    destroyed.forEach(d => {
        if (d.isAmmo) return;
        const key = (d.dbKey || d.name) + '|' + d.loc;
        destroyedCounts[key] = (destroyedCounts[key] || 0) + 1;
    });

    const usedCounts = {};
    mech.weapons.forEach((w, i) => {
        const row = document.getElementById(`weapon-row-${i}`);
        const btn = row?.querySelector('.btn-toggle');
        if (!row || !btn) return;

        let isDestroyed = false;
        for (const [dKey, dCount] of Object.entries(destroyedCounts)) {
            const [dDbKey, dLocKey] = dKey.split('|');
            
            // Match the weapon's location string against the critical's location key
            const wLocLower = w.loc.toLowerCase();
            const locObj = mech.locations[dLocKey];
            const locMatches = (locObj && (locObj.name.toLowerCase() === wLocLower || locObj.short.toLowerCase() === wLocLower)) || (wLocLower === dLocKey.toLowerCase());

            const nameMatches = w.name.toLowerCase().includes(dDbKey) || dDbKey.includes(w.name.toLowerCase());
            if (locMatches && (w.dbKey === dDbKey || nameMatches)) {
                const used = usedCounts[dKey] || 0;
                if (used < dCount) {
                    isDestroyed = true;
                    usedCounts[dKey] = used + 1;
                    break;
                }
            }
        }

        if (isDestroyed) {
            row.style.opacity = '0.3';
            row.style.textDecoration = 'line-through';
            btn.disabled = true;
            btn.classList.remove('active');
            btn.innerText = '✕';
        } else {
            row.style.opacity = '1';
            row.style.textDecoration = 'none';
            btn.disabled = false;
            if (!btn.classList.contains('active')) {
                btn.innerText = '—';
            }
        }
    });

    updateHeatMath();
}

// ═══════════════════════════════════════════════════
//  AMMO TABLE
// ═══════════════════════════════════════════════════

export function renderAmmoTable(mech) {
    const table = document.getElementById('ammo-table');
    const tbody = document.getElementById('ammo-body');
    tbody.innerHTML = '';

    if (mech.ammo.length > 0) {
        table.classList.remove('hidden');
        mech.ammo.forEach((a, index) => {
            const tr = document.createElement('tr');
            tr.id = `ammo-row-${index}`;
            tr.innerHTML = `
                <td style="text-align:left;">${a.name}</td>
                <td>${a.loc}</td>
                <td><span id="ammo-count-${index}" style="font-weight:bold; color:var(--neon-green);">${a.current}</span>/${a.max}</td>
                <td><button class="btn-ammo" id="btn-ammo-${index}" data-ammo-index="${index}">-1</button></td>
            `;
            tbody.appendChild(tr);
        });

        tbody.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-ammo');
            if (!btn || btn.disabled) return;
            const idx = parseInt(btn.dataset.ammoIndex, 10);
            const result = useAmmo(idx);
            if (!result) return;

            const span = document.getElementById(`ammo-count-${idx}`);
            span.innerText = result.current;

            if (result.current === 0) {
                span.style.color = 'var(--neon-red)';
                btn.disabled = true;
                btn.innerText = 'VACÍA';
            } else if (result.current <= Math.ceil(result.max * 0.25)) {
                span.style.color = 'var(--neon-orange)';
            }
        });
    } else {
        table.classList.add('hidden');
    }
}

// ═══════════════════════════════════════════════════
//  HIT LOCATION TABLE
// ═══════════════════════════════════════════════════

export function renderHitLocationTable() {
    const table = document.getElementById('hit-loc-table');
    let html = `
        <thead>
            <tr><th>2d6</th><th>Izda</th><th>Frente</th><th>Dcha</th><th>Atrás</th></tr>
        </thead>
        <tbody>
    `;
    HIT_LOCATION_TABLE.forEach(row => {
        html += `<tr>
            <td style="font-weight:bold; color:var(--neon-cyan);">${row.roll}</td>
            <td>${row.left}</td>
            <td>${row.front}</td>
            <td>${row.right}</td>
            <td>${row.rear}</td>
        </tr>`;
    });
    html += '</tbody>';
    table.innerHTML = html;
}

// ═══════════════════════════════════════════════════
//  ARMOR DIAGRAM — Bubble-based with Numeric Counter
// ═══════════════════════════════════════════════════

/**
 * Determine CSS tier class based on remaining percentage.
 */
function bubbleTier(current, max) {
    if (max === 0) return '';
    const pct = current / max;
    if (pct <= 0.25) return 'tier-danger';
    if (pct <= 0.5)  return 'tier-warn';
    return '';
}

/**
 * Determine counter CSS class based on remaining percentage.
 */
function counterClass(current, max) {
    if (max === 0) return 'danger';
    const pct = current / max;
    if (pct <= 0.25) return 'danger';
    if (pct <= 0.5)  return 'warn';
    return '';
}

/**
 * Create an armor location box with clickable bubbles + counter.
 * @param {string} locKey  Location key for state
 * @param {string} label   Display label (e.g. "HD")
 * @param {number} maxVal  Maximum armor value
 * @param {boolean} isRear If this is rear armor
 */
function createArmorBubbleBox(locKey, label, maxVal, isRear = false) {
    const div = document.createElement('div');
    div.className = 'armor-loc-box';
    const stateKey = isRear ? `rear-${locKey}` : locKey;

    // Label
    const labelDiv = document.createElement('div');
    labelDiv.className = 'loc-label';
    labelDiv.innerText = label;
    div.appendChild(labelDiv);

    // Bubble container
    const bubblesDiv = document.createElement('div');
    bubblesDiv.className = 'armor-bubbles';
    bubblesDiv.id = `bubbles-${stateKey}`;

    // Track current value in a closure
    let currentVal = maxVal;

    // Create individual bubbles
    for (let i = 0; i < maxVal; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'armor-bubble filled';
        bubble.dataset.index = i;
        bubblesDiv.appendChild(bubble);
    }
    div.appendChild(bubblesDiv);

    // Counter
    const counter = document.createElement('div');
    counter.className = 'armor-counter';
    counter.id = `counter-${stateKey}`;
    counter.innerText = `${maxVal}`;
    div.appendChild(counter);

    // Max indicator
    const maxDiv = document.createElement('div');
    maxDiv.className = 'armor-max';
    maxDiv.innerText = `/ ${maxVal}`;
    div.appendChild(maxDiv);

    // Click handler on bubble container (event delegation)
    bubblesDiv.addEventListener('click', (e) => {
        const bubble = e.target.closest('.armor-bubble');
        if (!bubble) return;

        const idx = parseInt(bubble.dataset.index, 10);

        if (bubble.classList.contains('damaged')) {
            // Restore this bubble and all before it
            currentVal = idx + 1;
            // Actually we need to restore UP TO this index
            // Re-fill from 0 to idx
            for (let j = 0; j <= idx; j++) {
                bubblesDiv.children[j].classList.remove('damaged');
                bubblesDiv.children[j].classList.add('filled');
            }
        } else {
            // Damage this bubble and all after it
            currentVal = idx;
            for (let j = idx; j < maxVal; j++) {
                bubblesDiv.children[j].classList.remove('filled');
                bubblesDiv.children[j].classList.add('damaged');
            }
        }

        // Update state
        setArmor(locKey, currentVal, isRear);

        // Update counter
        counter.innerText = `${currentVal}`;
        counter.className = 'armor-counter ' + counterClass(currentVal, maxVal);

        // Update bubble tier colors
        const tier = bubbleTier(currentVal, maxVal);
        for (let j = 0; j < maxVal; j++) {
            const b = bubblesDiv.children[j];
            b.classList.remove('tier-warn', 'tier-danger');
            if (!b.classList.contains('damaged') && tier) {
                b.classList.add(tier);
            }
        }
    });

    return div;
}

export function renderArmorDiagram(mech) {
    const container = document.getElementById('armor-diagram');
    container.innerHTML = '';
    const locs = mech.locations;

    // Row 1: Head
    const hBox = createArmorBubbleBox('h', locs.h.short, locs.h.a);
    hBox.style.gridColumn = '2'; hBox.style.gridRow = '1';
    container.appendChild(hBox);

    // Row 2: LA, CT, RA
    for (const [key, col] of [['la', 1], ['ct', 2], ['ra', 3]]) {
        const box = createArmorBubbleBox(key, locs[key].short, locs[key].a);
        box.style.gridColumn = col; box.style.gridRow = '2';
        container.appendChild(box);
    }

    // Row 3: LT, Rear Armor, RT
    const ltBox = createArmorBubbleBox('lt', locs.lt.short, locs.lt.a);
    ltBox.style.gridColumn = '1'; ltBox.style.gridRow = '3';
    container.appendChild(ltBox);

    // Rear armor block
    const rearDiv = document.createElement('div');
    rearDiv.className = 'armor-loc-box';
    rearDiv.style.gridColumn = '2'; rearDiv.style.gridRow = '3';

    const rearLabel = document.createElement('div');
    rearLabel.className = 'loc-label';
    rearLabel.innerHTML = '<span class="rear-label">ATRÁS</span>';
    rearDiv.appendChild(rearLabel);

    const rearFlex = document.createElement('div');
    rearFlex.style.cssText = 'display:flex; gap:8px; justify-content:center; flex-wrap:wrap;';

    ['lt', 'ct', 'rt'].forEach(k => {
        const rearBox = document.createElement('div');
        rearBox.style.textAlign = 'center';

        const rlbl = document.createElement('div');
        rlbl.style.cssText = 'font-size:9px; color:#888;';
        rlbl.innerText = `${locs[k].short}R`;
        rearBox.appendChild(rlbl);

        // Mini bubbles for rear
        const rBubbles = document.createElement('div');
        rBubbles.className = 'armor-bubbles';
        rBubbles.id = `bubbles-rear-${k}`;
        rBubbles.style.maxWidth = '60px';

        let rCurrent = locs[k].aRear;
        const rMax = locs[k].aRear;

        for (let i = 0; i < rMax; i++) {
            const b = document.createElement('div');
            b.className = 'armor-bubble filled';
            b.dataset.index = i;
            rBubbles.appendChild(b);
        }

        const rCounter = document.createElement('div');
        rCounter.className = 'armor-counter';
        rCounter.id = `counter-rear-${k}`;
        rCounter.style.fontSize = '13px';
        rCounter.innerText = `${rMax}`;

        const rMaxDiv = document.createElement('div');
        rMaxDiv.className = 'armor-max';
        rMaxDiv.innerText = `/ ${rMax}`;

        // Click handler for rear bubbles
        rBubbles.addEventListener('click', (e) => {
            const bubble = e.target.closest('.armor-bubble');
            if (!bubble) return;
            const idx = parseInt(bubble.dataset.index, 10);

            if (bubble.classList.contains('damaged')) {
                rCurrent = idx + 1;
                for (let j = 0; j <= idx; j++) {
                    rBubbles.children[j].classList.remove('damaged');
                    rBubbles.children[j].classList.add('filled');
                }
            } else {
                rCurrent = idx;
                for (let j = idx; j < rMax; j++) {
                    rBubbles.children[j].classList.remove('filled');
                    rBubbles.children[j].classList.add('damaged');
                }
            }

            setArmor(k, rCurrent, true);
            rCounter.innerText = `${rCurrent}`;
            rCounter.className = 'armor-counter ' + counterClass(rCurrent, rMax);

            const tier = bubbleTier(rCurrent, rMax);
            for (let j = 0; j < rMax; j++) {
                const b = rBubbles.children[j];
                b.classList.remove('tier-warn', 'tier-danger');
                if (!b.classList.contains('damaged') && tier) b.classList.add(tier);
            }
        });

        rearBox.appendChild(rBubbles);
        rearBox.appendChild(rCounter);
        rearBox.appendChild(rMaxDiv);
        rearFlex.appendChild(rearBox);
    });

    rearDiv.appendChild(rearFlex);
    container.appendChild(rearDiv);

    const rtBox = createArmorBubbleBox('rt', locs.rt.short, locs.rt.a);
    rtBox.style.gridColumn = '3'; rtBox.style.gridRow = '3';
    container.appendChild(rtBox);

    // Row 4: LL, RL
    const llBox = createArmorBubbleBox('ll', locs.ll.short, locs.ll.a);
    llBox.style.gridColumn = '1'; llBox.style.gridRow = '4';
    container.appendChild(llBox);
    const rlBox = createArmorBubbleBox('rl', locs.rl.short, locs.rl.a);
    rlBox.style.gridColumn = '3'; rlBox.style.gridRow = '4';
    container.appendChild(rlBox);
}

// ═══════════════════════════════════════════════════
//  INTERNAL STRUCTURE — Bubble-based
// ═══════════════════════════════════════════════════

export function renderInternalStructure(mech) {
    const container = document.getElementById('structure-diagram');
    container.innerHTML = '';
    const order = [['la','h','ra'],['lt','ct','rt'],['ll',null,'rl']];

    order.forEach(row => {
        row.forEach(locKey => {
            if (!locKey) { container.appendChild(document.createElement('div')); return; }
            const loc = mech.locations[locKey];

            const box = document.createElement('div');
            box.className = 'structure-box';

            const lbl = document.createElement('div');
            lbl.className = 'loc-label';
            lbl.innerText = loc.short;
            box.appendChild(lbl);

            // Bubbles for structure
            const bubblesDiv = document.createElement('div');
            bubblesDiv.className = 'armor-bubbles';
            bubblesDiv.id = `str-bubbles-${locKey}`;
            bubblesDiv.style.maxWidth = '90px';

            let currentStr = loc.s;
            const maxStr = loc.s;

            for (let i = 0; i < maxStr; i++) {
                const b = document.createElement('div');
                b.className = 'armor-bubble filled';
                b.style.borderColor = 'var(--neon-orange)';
                b.style.background = 'var(--neon-orange)';
                b.style.boxShadow = '0 0 4px var(--glow-orange)';
                b.dataset.index = i;
                bubblesDiv.appendChild(b);
            }

            const counter = document.createElement('div');
            counter.className = 'armor-counter';
            counter.style.color = 'var(--neon-orange)';
            counter.id = `str-counter-${locKey}`;
            counter.innerText = `${maxStr}`;

            const maxDiv = document.createElement('div');
            maxDiv.className = 'armor-max';
            maxDiv.innerText = `/ ${maxStr}`;

            // Click handler
            bubblesDiv.addEventListener('click', (e) => {
                const bubble = e.target.closest('.armor-bubble');
                if (!bubble) return;
                const idx = parseInt(bubble.dataset.index, 10);

                if (bubble.classList.contains('damaged')) {
                    currentStr = idx + 1;
                    for (let j = 0; j <= idx; j++) {
                        const b = bubblesDiv.children[j];
                        b.classList.remove('damaged');
                        b.classList.add('filled');
                        b.style.background = 'var(--neon-orange)';
                        b.style.borderColor = 'var(--neon-orange)';
                        b.style.boxShadow = '0 0 4px var(--glow-orange)';
                    }
                } else {
                    currentStr = idx;
                    for (let j = idx; j < maxStr; j++) {
                        const b = bubblesDiv.children[j];
                        b.classList.remove('filled');
                        b.classList.add('damaged');
                        b.style.background = 'transparent';
                        b.style.borderColor = '#333';
                        b.style.boxShadow = 'none';
                    }
                }

                counter.innerText = `${currentStr}`;
                if (maxStr > 0) {
                    const pct = currentStr / maxStr;
                    if (pct <= 0.25) counter.style.color = 'var(--neon-red)';
                    else if (pct <= 0.5) counter.style.color = 'var(--neon-orange)';
                    else counter.style.color = 'var(--neon-orange)';
                }
            });

            box.appendChild(bubblesDiv);
            box.appendChild(counter);
            box.appendChild(maxDiv);
            container.appendChild(box);
        });
    });
}

// ═══════════════════════════════════════════════════
//  SYSTEM HITS — READ-ONLY, driven by Critical Table
// ═══════════════════════════════════════════════════

export function renderSystemHits() {
    const container = document.getElementById('system-hits');
    container.innerHTML = '';

    const systems = [
        { key: 'engine', label: 'Motor', max: 3 },
        { key: 'gyro', label: 'Giroscopio', max: 2 },
        { key: 'sensor', label: 'Sensores', max: 2 },
        { key: 'lifesupport', label: 'Sop. Vital', max: 1 },
    ];

    systems.forEach(sys => {
        const row = document.createElement('div');
        row.className = 'system-row';
        let pipsHTML = '';
        for (let i = 0; i < sys.max; i++) {
            pipsHTML += `<div class="system-pip" id="sys-${sys.key}-${i}" title="Marked via Critical Hit Table"></div>`;
        }
        row.innerHTML = `<span class="label">${sys.label}</span>${pipsHTML}`;
        container.appendChild(row);
    });

    const infoDiv = document.createElement('div');
    infoDiv.style.cssText = 'grid-column:1/3; font-size:9px; color:#444; margin-top:4px; font-style:italic;';
    infoDiv.innerText = '(Se actualiza auto. desde la tabla de críticos)';
    container.appendChild(infoDiv);
}

/**
 * Update the System Hits panel based on current critical damage state.
 */
export function updateSystemHitsFromCrits() {
    const mech = getCurrentMech();
    if (!mech) return;

    const critDamage = getCriticalDamage();
    const counts = countSystemHits(mech, critDamage);

    const systems = [
        { key: 'engine', max: 3 },
        { key: 'gyro', max: 2 },
        { key: 'sensor', max: 2 },
        { key: 'lifesupport', max: 1 },
    ];

    systems.forEach(sys => {
        for (let i = 0; i < sys.max; i++) {
            const pip = document.getElementById(`sys-${sys.key}-${i}`);
            if (!pip) continue;
            if (i < counts[sys.key]) {
                pip.classList.add('hit');
            } else {
                pip.classList.remove('hit');
            }
        }
    });

    updateHeatMath();
    updatePenaltiesAndMovement();
}

// ═══════════════════════════════════════════════════
//  CRITICAL HIT TABLE — with effects
// ═══════════════════════════════════════════════════

export function renderCriticalHitTable(mech) {
    const container = document.getElementById('crits-container');
    container.innerHTML = '';

    const layout = [['la','h','ra'],['lt','ct','rt'],['ll',null,'rl']];
    const critDamage = getCriticalDamage();

    layout.forEach(row => {
        row.forEach(locKey => {
            if (!locKey) { container.appendChild(document.createElement('div')); return; }

            const slots = mech.criticals[locKey] || [];
            const locDiv = document.createElement('div');
            locDiv.className = 'crit-location';

            let html = `<div class="crit-title">${mech.locations[locKey]?.name || locKey}</div>`;
            const maxSlots = (locKey === 'h' || locKey === 'll' || locKey === 'rl') ? 6 : 12;
            const midPoint = Math.ceil(maxSlots / 2);

            for (let i = 0; i < maxSlots; i++) {
                const slotName = slots[i] || '-Vacío-';
                const isEmpty = slotName === '-Vacío-' || slotName === '-vacío-' || slotName === '-Empty-' || slotName === '-empty-';
                const isDamaged = critDamage[locKey]?.[i] || false;

                let slotCategory = '';
                if (!isEmpty) {
                    const sLower = slotName.toLowerCase();
                    if (Object.values(SYSTEM_CRIT_NAMES).flat().some(kw => sLower.includes(kw))) {
                        slotCategory = 'system';
                    } else if (Object.keys(WEAPON_DB).some(kw => sLower.includes(kw))) {
                        slotCategory = 'weapon';
                    } else if (sLower.includes('ammo') || sLower.includes('munic')) {
                        slotCategory = 'ammo';
                    }
                }

                if (i === 0) html += `<div class="crit-group-label">1–${midPoint}</div>`;
                if (i === midPoint) html += `<div class="crit-group-label">${midPoint + 1}–${maxSlots}</div>`;

                html += `<div class="crit-slot ${isEmpty ? 'empty' : ''} ${isDamaged ? 'damaged' : ''} ${slotCategory ? 'cat-' + slotCategory : ''}"
                              data-loc="${locKey}" data-slot="${i}" data-category="${slotCategory}">
                    <span class="slot-num">${i + 1}.</span>
                    <span class="slot-name">${slotName}</span>
                </div>`;
            }

            locDiv.innerHTML = html;
            container.appendChild(locDiv);
        });
    });

    // Event delegation — toggling crits with side effects
    container.addEventListener('click', (e) => {
        const slot = e.target.closest('.crit-slot');
        if (!slot || slot.classList.contains('empty')) return;

        const locKey = slot.dataset.loc;
        const idx = parseInt(slot.dataset.slot, 10);
        const category = slot.dataset.category;

        // Toggle damage state
        toggleCriticalSlot(locKey, idx);
        slot.classList.toggle('damaged');

        const isDamaged = slot.classList.contains('damaged');

        // ── SYSTEM EFFECTS: update system hits panel
        if (category === 'system') {
            updateSystemHitsFromCrits();
        }

        // ── WEAPON EFFECTS: disable/enable weapon in table
        if (category === 'weapon') {
            syncWeaponStates();
        }

        // ── AMMO EFFECTS: warn about explosion risk
        if (category === 'ammo' && isDamaged) {
            const slotName = slot.querySelector('.slot-name')?.innerText || '';
            slot.classList.add('ammo-exploded');
            
            const mechLocName = mech.locations[locKey]?.short || locKey.toUpperCase();
            const locObj = mech.locations[locKey];
            
            const ammoEntry = mech.ammo.find(a => {
                const aLoc = a.loc.toLowerCase();
                const locMatches = (locObj && (locObj.name.toLowerCase() === aLoc || locObj.short.toLowerCase() === aLoc)) || (aLoc === locKey.toLowerCase());
                
                // For name matching, try substring or fallback to same damage type
                const dmgA = getAmmoExplosionDamage(a.name, 1);
                const dmgS = getAmmoExplosionDamage(slotName, 1);
                return locMatches && (slotName.toLowerCase().includes(a.name.toLowerCase()) || dmgA === dmgS);
            });
            
            let dmg = 0;
            if (ammoEntry) {
                const dmgPerShot = getAmmoExplosionDamage(slotName, 1);
                dmg = dmgPerShot * ammoEntry.current;
            } else {
                dmg = getAmmoExplosionDamage(slotName, 10); // fallback 10 shots
            }

            if (dmg > 0) {
                setTimeout(() => {
                    const doExplode = window.confirm(`⚠️ EXPLOSIÓN DE MUNICIÓN: ${slotName}\nDaño estimado al recibir el crítico: ${dmg} pts.\n\n¿Aplicar daño a la estructura interna de [${mechLocName}] automáticamente?`);
                    if (doExplode) {
                        const { locations, log, mechDestroyed } = takeDamage(mech.locations, locKey, dmg, false);
                        applyDamageSnapshot(locations);
                        renderArmorDiagram(mech);
                        renderInternalStructure(mech);
                        updatePenaltiesAndMovement();
                        syncWeaponStates();
                        if (mechDestroyed) {
                            setTimeout(() => alert('💥 EL MECH HA SIDO DESTRUIDO por la explosión.'), 100);
                        }
                    }
                }, 100);
            }
        }
        if (category === 'ammo' && !isDamaged) {
            slot.classList.remove('ammo-exploded');
        }

        // Always update heat + penalties
        updateHeatMath();
        updatePenaltiesAndMovement();
    });
}

// ═══════════════════════════════════════════════════
//  HEAT SCALE — Vertical with effects & animations
// ═══════════════════════════════════════════════════

export function initHeatScale() {
    const container = document.getElementById('heat-scale');
    container.innerHTML = '';
    const effectsMap = {};
    HEAT_EFFECTS.forEach(he => { effectsMap[he.level] = he.effects.join(', '); });

    for (let i = 30; i >= 0; i--) {
        const row = document.createElement('div');
        row.className = 'heat-row';
        const numDiv = document.createElement('div');
        numDiv.className = 'heat-num';
        numDiv.id = 'heat-box-' + i;
        numDiv.innerText = i;
        const effectDiv = document.createElement('div');
        effectDiv.className = 'heat-effect';
        effectDiv.id = 'heat-effect-' + i;
        effectDiv.innerText = effectsMap[i] || '';
        row.appendChild(numDiv);
        row.appendChild(effectDiv);
        container.appendChild(row);
    }
}

// ═══════════════════════════════════════════════════
//  HEAT MATH UPDATE — includes engine crit penalty
// ═══════════════════════════════════════════════════

export function updateHeatMath() {
    const mech = getCurrentMech();
    if (!mech) return;

    const base = getBaseHeat();
    const move = getMoveHeat();
    const weaponHeat = getWeaponHeat();

    // Count engine crits for heat penalty
    const critDamage = getCriticalDamage();
    const sysCounts = countSystemHits(mech, critDamage);
    const engineHits = sysCounts.engine;
    const enginePenalty = engineHits * 5;

    const heatSinkLoss = getHeatSinkLoss(mech, critDamage);
    const activeDissipation = Math.max(0, mech.heatDissipation - heatSinkLoss);

    const net = calculateNetHeat(base, weaponHeat, move, activeDissipation, engineHits);

    document.getElementById('current-heat-title').innerText = base;
    document.getElementById('sinks-value').innerText = activeDissipation;

    // Update heat scale with animated colors
    for (let i = 0; i <= 30; i++) {
        const box = document.getElementById('heat-box-' + i);
        const effect = document.getElementById('heat-effect-' + i);
        box.className = 'heat-num';
        effect.classList.remove('active-effect');

        if (i <= base && i > 0) {
            box.classList.add('filled');
            if (i < 14)       box.classList.add('safe');
            else if (i < 24)  box.classList.add('warn');
            else              box.classList.add('danger');
        }

        // Mark the current heat level with a special indicator
        if (i === base && base > 0) {
            box.classList.add('active-marker');
        }

        if (i <= base && effect.innerText) {
            effect.classList.add('active-effect');
        }
    }

    // Math
    document.getElementById('math-base').innerText = base;
    document.getElementById('math-weap').innerText = '+' + weaponHeat;
    document.getElementById('math-move').innerText = '+' + move;
    document.getElementById('math-sinks').innerText = '-' + activeDissipation;

    // Show engine penalty if applicable
    const engineRow = document.getElementById('math-engine');
    if (engineRow) {
        if (enginePenalty > 0) {
            engineRow.style.display = 'flex';
            engineRow.querySelector('span:last-child').innerText = '+' + enginePenalty;
        } else {
            engineRow.style.display = 'none';
        }
    }

    const netEl = document.getElementById('math-net');
    netEl.innerText = net;
    netEl.style.color = net > base ? 'var(--neon-red)' : 'var(--neon-green)';
    netEl.style.textShadow = net > base
        ? '0 0 8px var(--glow-red)'
        : '0 0 8px var(--glow-green)';
}

// ═══════════════════════════════════════════════════
//  PENALTIES & MOVEMENT
// ═══════════════════════════════════════════════════

export function updatePenaltiesAndMovement() {
    const mech = getCurrentMech();
    if (!mech) return;

    const base = getBaseHeat();
    const { mpPenalty, shootPenalty } = calculatePenalties(base);

    const critDamage = getCriticalDamage();
    const sysCounts = countSystemHits(mech, critDamage);
    const sysEffects = evaluateSystemDamage(sysCounts);
    
    const sensorPenalty = sysEffects.sensorToHitMod;
    const gyroPenalty = sysEffects.gyroPilotingMod;

    const list = document.getElementById('penalties-list');
    const box = document.getElementById('penalties-box');
    list.innerHTML = '';

    const hasProblems = mpPenalty > 0 || shootPenalty > 0 || base >= 14 || sensorPenalty > 0 || gyroPenalty > 0 || sysEffects.sensorsBlind || sysEffects.gyroDestroyed || sysEffects.engineDestroyed;

    if (!hasProblems) {
        box.classList.remove('alert');
        list.innerHTML = '<li style="color:var(--neon-green);">Sistemas operativos</li>';
    } else {
        box.classList.add('alert');
        if (mpPenalty > 0)    list.innerHTML += `<li>-${mpPenalty} Puntos Mov. (Calor)</li>`;
        if (shootPenalty > 0) list.innerHTML += `<li>+${shootPenalty} Disp. (Calor)</li>`;
        
        if (sysEffects.sensorsBlind) list.innerHTML += `<li style="color:var(--neon-red);font-weight:bold;">⚠️ SENSORES DESTRUIDOS — No dispara</li>`;
        else if (sensorPenalty > 0) list.innerHTML += `<li>+${sensorPenalty} Disp. (Crit. Sensores)</li>`;
        
        if (sysEffects.gyroDestroyed) list.innerHTML += `<li style="color:var(--neon-red);font-weight:bold;">⚠️ GIROSCOPIO DESTRUIDO — Mech Inmóvil</li>`;
        else if (gyroPenalty > 0)  list.innerHTML += `<li>+${gyroPenalty} Pilotaje (Crit. Giroscopio)</li>`;
        
        if (sysEffects.engineDestroyed) list.innerHTML += `<li style="color:var(--neon-red);font-weight:bold;">⚠️ MOTOR DESTRUIDO — Mech Eliminado</li>`;
        else if (sysCounts.engine > 0) list.innerHTML += `<li>+${sysEffects.engineHeatPenalty} Calor/turno (Crit. Motor)</li>`;
        
        if (base >= 14)       list.innerHTML += `<li>⚠️ Riesgos de Apagado/Expl. Munición activos</li>`;
    }

    const curWalk = Math.max(0, mech.walk - mpPenalty);
    const curRun = Math.ceil(curWalk * 1.5);

    const btnWalk = document.getElementById('btn-move-1');
    btnWalk.innerHTML = `Andar<br>${curWalk} PM [+1]`;
    btnWalk.disabled = curWalk === 0;

    const btnRun = document.getElementById('btn-move-2');
    btnRun.innerHTML = `Correr<br>${curRun} PM [+2]`;
    btnRun.disabled = curRun === 0;

    const btnJump = document.getElementById('btn-move-3');
    if (mech.jump > 0) {
        const jumpHeat = Math.max(3, mech.jump);
        btnJump.innerHTML = `Saltar<br>${mech.jump} PM [+${jumpHeat}]`;
        btnJump.disabled = false;
        btnJump.dataset.jumpHeat = jumpHeat;
    } else {
        btnJump.innerHTML = `Saltar<br>N/D`;
        btnJump.disabled = true;
    }
}

// ═══════════════════════════════════════════════════
//  MOVEMENT HANDLER
// ═══════════════════════════════════════════════════

export function setMovement(heat, btn) {
    if (btn.disabled) return;
    document.querySelectorAll('.btn-move').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    setMoveHeat(heat);
    updateHeatMath();
}
