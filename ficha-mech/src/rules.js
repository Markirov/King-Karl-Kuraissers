// ═══════════════════════════════════════════════════
//  src/rules.js — Motor de Reglas y Modificadores
// ═══════════════════════════════════════════════════

// ── Modificadores de Daño de Sistemas (Ajustados) ──
export const SYSTEM_CRIT_NAMES = {
    engine: [
        'Motor Fusión', 'Motor XL', 'Motor Ligero', 'Motor XXL', 'Motor Compacto',
        'Fusion Engine', 'XL Engine', 'Light Engine', 'XXL Engine', 'Compact Engine', 'Motor Fusión'
    ],
    gyro: [
        'Giroscopio', 'Giroscopio XL', 'Giroscopio Compacto', 'Giroscopio Pesado',
        'Gyro', 'XL Gyro', 'Compact Gyro', 'Heavy Duty Gyro'
    ],
    sensor: [
        'Sensores', 'Sensors'
    ],
    lifesupport: [
        'Soporte Vital', 'Life Support'
    ]
};

export const SYSTEM_DAMAGE_RULES = {
    engine: {
        heatPerHit: 5,
        destroyedAt: 3,
    },
    gyro: {
        pilotingPerHit: 3,
        destroyedAt: 2,
    },
    sensor: {
        toHitPerHit: 3,
        cannotFireAt: 2,
    },
    lifesupport: {
        pilotDmgAtHeat: 15,
        maxHits: 1,
    },
};

/**
 * Evalúa el efecto actual del daño de sistemas.
 * @param {{ engine: number, gyro: number, sensor: number, lifesupport: number }} systemHits
 */
export function evaluateSystemDamage(systemHits) {
    return {
        engineHeatPenalty: systemHits.engine * SYSTEM_DAMAGE_RULES.engine.heatPerHit,
        engineDestroyed: systemHits.engine >= SYSTEM_DAMAGE_RULES.engine.destroyedAt,
        
        gyroPilotingMod: systemHits.gyro * SYSTEM_DAMAGE_RULES.gyro.pilotingPerHit,
        gyroDestroyed: systemHits.gyro >= SYSTEM_DAMAGE_RULES.gyro.destroyedAt,
        
        sensorToHitMod: systemHits.sensor * SYSTEM_DAMAGE_RULES.sensor.toHitPerHit,
        sensorsBlind: systemHits.sensor >= SYSTEM_DAMAGE_RULES.sensor.cannotFireAt,
        
        lifeSupportDamage: systemHits.lifesupport >= SYSTEM_DAMAGE_RULES.lifesupport.maxHits,
    };
}

// ── Modificadores de Ataque a Distancia (To-Hit) ──

export const ATTACKER_MOVE_MOD = {
    stationary: 0,
    walk: 1,
    run: 2,
    jump: 3,
};

/**
 * Movimiento del objetivo (en base a hexes movidos).
 */
export function getTargetMovementMod(hexesMoved) {
    if (hexesMoved <= 2) return 0;
    if (hexesMoved <= 4) return 1;
    if (hexesMoved <= 6) return 2;
    if (hexesMoved <= 9) return 3;
    if (hexesMoved <= 17) return 4;
    if (hexesMoved <= 24) return 5;
    return 6; // 25+
}

/**
 * Modificador por rango de arma.
 */
export function getRangeMod(distance, weapon) {
    if (distance <= weapon.minR) {
        // Minimum range penalty: +1 for each hex closer than minimum
        return (weapon.minR - distance) + 1;
    }
    if (distance <= weapon.shortR) return 0;
    if (distance <= weapon.medR) return 2;
    if (distance <= weapon.longR) return 4;
    return Infinity; // Out of range
}

/**
 * Modificadores por terreno comunes.
 */
export const TERRAIN_MODS = {
    light_woods: 1,
    heavy_woods: 2,
    partial_cover: 1, // Usually +1 to hit, punches/kicks vary
    water: 1,
    prone_target: -2, // Adjacent is -2, farther is +1 usually (simplified)
    immobile_target: -4,
};

/**
 * Otros modificadores.
 */
export const MISC_MODS = {
    secondary_target: 1,
    prone_firing: 2,
    indirect_fire: 1,
};

/**
 * Calcula todos los modificadores de disparo para un arma.
 */
export function calculateToHitModifiers({
    gunnery = 4,
    attackerMove = 'stationary',
    targetHexesMoved = 0,
    range = 1,
    weapon = null,
    heatLevel = 0,
    sensorHits = 0,
    terrainMod = 0,
    isSecondary = false,
    isProne = false,
    isIndirect = false,
}) {
    // Si sensores destruidos, no puede disparar
    const sys = evaluateSystemDamage({ sensor: sensorHits, engine: 0, gyro: 0, lifesupport: 0 });
    if (sys.sensorsBlind) {
        return { canFire: false, total: null, breakdown: {} };
    }

    const base = gunnery;
    const moveAttacker = ATTACKER_MOVE_MOD[attackerMove] || 0;
    const moveTarget = getTargetMovementMod(targetHexesMoved);
    
    let rangeMod = 0;
    if (weapon) {
        rangeMod = getRangeMod(range, weapon);
        if (rangeMod === Infinity) return { canFire: false, total: null, breakdown: {} };
    }

    // Heat penalty for firing (from standard BT heat scale)
    let heatMod = 0;
    if (heatLevel >= 24) heatMod = 4;
    else if (heatLevel >= 17) heatMod = 3;
    else if (heatLevel >= 13) heatMod = 2;
    else if (heatLevel >= 8)  heatMod = 1;

    const sensorMod = sys.sensorToHitMod;

    let miscMod = 0;
    if (isSecondary) miscMod += MISC_MODS.secondary_target;
    if (isProne) miscMod += MISC_MODS.prone_firing;
    if (isIndirect) miscMod += MISC_MODS.indirect_fire;

    const total = base + moveAttacker + moveTarget + rangeMod + heatMod + sensorMod + terrainMod + miscMod;

    return {
        canFire: true,
        total,
        breakdown: {
            base, moveAttacker, moveTarget, rangeMod, heatMod, sensorMod, terrainMod, miscMod
        }
    };
}

// ── Modificadores de Piloting Skill Roll (PSR) ──

/**
 * Calcula el número objetivo para un chequeo de pilotaje (PSR).
 */
export function calculatePilotingModifiers({
    piloting = 5,
    gyroHits = 0,
    legActuatorHits = 0, // hip, upper, lower, foot
    damageThisTurn = false, // >= 20 dmg
    hasDamagedLeg = false,
    isRising = false,
}) {
    const sys = evaluateSystemDamage({ gyro: gyroHits, engine: 0, sensor: 0, lifesupport: 0 });
    if (sys.gyroDestroyed) {
        return { mechDestroyed: true, total: null, breakdown: {} }; // O inmovilizado, dependiendo de reglas (en nuestro caso, Mech Destruido)
    }

    const base = piloting;
    const gyroMod = sys.gyroPilotingMod;
    let actuatorMod = legActuatorHits; // Typically +1 per non-hip actuator, +2 or impossible for hip. Simplified to +1 per hit here.
    
    let damagePSR = damageThisTurn ? 1 : 0; // standard +1 if >= 20 dmg
    
    let miscMod = 0;
    if (isRising && hasDamagedLeg) miscMod += 1;

    const total = base + gyroMod + actuatorMod + damagePSR + miscMod;

    return {
        mechDestroyed: false,
        total,
        breakdown: {
            base, gyroMod, actuatorMod, damagePSR, miscMod
        }
    };
}

// ── Ataques Físicos ──

/**
 * Calcula el daño base de un ataque físico según el tonelaje.
 */
export function calculatePhysicalDamage(tonnage, attackType) {
    if (attackType === 'punch') return Math.ceil(tonnage / 10);
    if (attackType === 'kick') return Math.ceil(tonnage / 5);
    if (attackType === 'charge') return Math.ceil(tonnage / 10); // Not fully implemented, requires distance
    if (attackType === 'hatchet' || attackType === 'sword') return Math.ceil(tonnage / 5);
    return 0;
}

// ── Utilidades de Daño y Subsistemas ──

/**
 * Verifica si una localización está completamente destruida (Estructura <= 0).
 */
export function isLocationDestroyed(mech, locKey) {
    if (!mech || !mech.locations || !mech.locations[locKey]) return false;
    return mech.locations[locKey].s <= 0;
}

/**
 * Cuenta los impactos críticos en sistemas principales (motor, giroscopio, etc.)
 * Tiene en cuenta si toda la localización fue destruida.
 */
export function countSystemHits(mech, critDamage) {
    const counts = { engine: 0, gyro: 0, sensor: 0, lifesupport: 0 };
    if (!mech || !mech.criticals) return counts;

    for (const [loc, slots] of Object.entries(mech.criticals)) {
        const locDestroyed = isLocationDestroyed(mech, loc);
        slots.forEach((slotName, i) => {
            const isDamaged = locDestroyed || (critDamage[loc]?.[i] ?? false);
            if (!isDamaged || !slotName) return;

            const name = slotName.toLowerCase();
            for (const [system, keywords] of Object.entries(SYSTEM_CRIT_NAMES)) {
                if (keywords.some(kw => name.includes(kw.toLowerCase()))) {
                    counts[system]++;
                    break;
                }
            }
        });
    }

    return counts;
}

/**
 * Calcula la pérdida de capacidad de disipación de calor por radiadores dañados.
 * Radiadores simples: 1 slot = 1 de disipación perdida.
 * Radiadores dobles: cualquier impacto en sus slots destruye todo el radiador (2 de disipación perdida).
 */
export function getHeatSinkLoss(mech, critDamage) {
    if (!mech || !mech.criticals) return 0;
    const isDouble = mech.heatSinkType === 'Double';
    let lostDissipation = 0;

    if (!isDouble) {
        // Singles: cada slot dañado resta 1 punto de disipación.
        for (const [loc, slots] of Object.entries(mech.criticals)) {
            const locDestroyed = isLocationDestroyed(mech, loc);
            slots.forEach((slotName, i) => {
                if (!slotName) return;
                const name = slotName.toLowerCase();
                const isDamaged = locDestroyed || (critDamage[loc]?.[i] ?? false);
                if (isDamaged && (name.includes('heat sink') || name.includes('radiador'))) {
                    lostDissipation += 1;
                }
            });
        }
    } else {
        // Doubles: localizamos slots consecutivos con el mismo nombre y los tratamos como bloque.
        for (const [loc, slots] of Object.entries(mech.criticals)) {
            const locDestroyed = isLocationDestroyed(mech, loc);
            let i = 0;
            while (i < slots.length) {
                const slotName = slots[i];
                if (!slotName) { i++; continue; }
                const name = slotName.toLowerCase();
                
                if (name.includes('heat sink') || name.includes('radiador')) {
                    let damagedCount = 0;
                    
                    const isDamaged = locDestroyed || (critDamage[loc]?.[i] ?? false);
                    if (isDamaged) damagedCount++;

                    let j = i + 1;
                    while (j < slots.length && slots[j] && slots[j].toLowerCase() === name) {
                        const isDamagedJ = locDestroyed || (critDamage[loc]?.[j] ?? false);
                        if (isDamagedJ) damagedCount++;
                        j++;
                    }

                    // Si al menos 1 slot del bloque de DHS está dañado, se destruye todo el radiador (pierde 2 puntos).
                    if (damagedCount > 0) {
                        lostDissipation += 2;
                    }
                    i = j; // saltamos el resto de este bloque
                } else {
                    i++;
                }
            }
        }
    }

    return lostDissipation;
}
