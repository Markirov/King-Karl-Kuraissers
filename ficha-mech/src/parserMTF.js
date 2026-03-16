// ═══════════════════════════════════════════════════
//  src/parserMTF.js — Parser de archivos .mtf
// ═══════════════════════════════════════════════════
//
//  Responsabilidades:
//    1. Leer texto plano MTF → objeto ParsedMech
//    2. Armas: identificar y asignar stats desde WEAPON_DB
//    3. Munición: detectar y calcular capacidad
//    4. Equipamiento especial: ECM, MASC, AMS, TSM, etc.
//    5. Localizaciones: armadura (front+rear) + estructura interna
//    6. Críticos: poblar 8 localizaciones con su equipamiento
//

import { WEAPON_DB } from './mechanics.js';

// ─────────────────────────────────────────────────
//  SPECIAL EQUIPMENT DATABASE
// ─────────────────────────────────────────────────
//  Keywords are lowercase. Matched against critical slot names.
//  type:  'electronic' | 'enhancement' | 'defensive' | 'misc'
//  Rules text is a brief description for the UI.

export const SPECIAL_EQUIPMENT_DB = {
    // ── Electronic Warfare ──
    'guardian ecm suite':       { type: 'electronic',   slots: 2, tonnage: 1.5,  rules: 'Burbuja ECM 6 hex: bloquea ECM enemigo, Narc, Artemis, C3' },
    'angel ecm suite':          { type: 'electronic',   slots: 2, tonnage: 2.0,  rules: 'ECM Avanzado: bloquea Streak, BAP, y todo tipo de ECM' },
    'ecm suite':                { type: 'electronic',   slots: 2, tonnage: 1.5,  rules: 'Burbuja ECM: degrada electrónica enemiga en rango' },
    'beagle active probe':      { type: 'electronic',   slots: 2, tonnage: 1.5,  rules: 'Sonda Activa: detecta unidades ocultas, niega ECM en rango 4' },
    'bloodhound active probe':  { type: 'electronic',   slots: 3, tonnage: 2.0,  rules: 'Sonda Avanzada: mayor rango, derrota Angel ECM' },
    'light active probe':       { type: 'electronic',   slots: 1, tonnage: 0.5,  rules: 'Sonda ligera de Clan: detecta unidades ocultas en rango 3' },
    'c3 master':                { type: 'electronic',   slots: 5, tonnage: 5.0,  rules: 'Ordenador Maestro C3: comparte datos con la red C3 (4 unidades)' },
    'c3 slave':                 { type: 'electronic',   slots: 1, tonnage: 1.0,  rules: 'Esclavo C3: conecta al Maestro C3, usa el mejor rango de la red' },
    'c3i':                      { type: 'electronic',   slots: 2, tonnage: 2.5,  rules: 'C3 Mejorado: red P2P (6 unidades), sin maestro' },

    // ── Enhancement Systems ──
    'masc':                     { type: 'enhancement',  slots: -1, tonnage: -1,  rules: 'MASC: dobla el movimiento de Correr; tira para evitar dañar piernas' },
    'triple strength myomer':   { type: 'enhancement',  slots: 6, tonnage: 0,    rules: 'TSM: con calor 9+, dobla daño cuerpo a cuerpo y +2 PM de Andar' },
    'tsm':                      { type: 'enhancement',  slots: 6, tonnage: 0,    rules: 'TSM: con calor 9+, dobla daño cuerpo a cuerpo y +2 PM de Andar' },
    'supercharger':             { type: 'enhancement',  slots: 1, tonnage: -1,   rules: 'Sobrealimentador: +1 PM Andar/Correr; tira o recibe impacto al motor' },
    'targeting computer':       { type: 'enhancement',  slots: -1, tonnage: -1,  rules: 'Ordenador de Puntería: -1 a la dificultad con armas de fuego directo' },

    // ── Defensive Systems ──
    'anti-missile system':      { type: 'defensive',    slots: 1, tonnage: 0.5,  rules: 'AMS: disparo auto., -4 a la tirada de impacto de misiles (usa munición)' },
    'ams':                      { type: 'defensive',    slots: 1, tonnage: 0.5,  rules: 'AMS: disparo auto., -4 a la tirada de impacto de misiles (usa munición)' },
    'laser anti-missile system':{ type: 'defensive',    slots: 2, tonnage: 1.5,  rules: 'Láser AMS: igual que AMS pero sin munición, genera 7 calor por uso' },
    'ams (is)':                 { type: 'defensive',    slots: 1, tonnage: 0.5,  rules: 'AMS (Esfera Interior): disparo auto. contra misiles, 1 ton de munición' },
    'ams (cl)':                 { type: 'defensive',    slots: 1, tonnage: 0.5,  rules: 'AMS (Clan): disparo auto. contra misiles, 1 ton de munición' },

    // ── Armor Types ──
    'ferro-fibrous':            { type: 'armor',        slots: 14, tonnage: 0,   rules: 'Blindaje Ferro-Fibroso: 12% más armadura por tonelada' },
    'ferro-fibrous (clan)':     { type: 'armor',        slots: 7,  tonnage: 0,   rules: 'Blindaje F-F de Clan: 20% más armadura por tonelada, menos críticos' },
    'light ferro-fibrous':      { type: 'armor',        slots: 7,  tonnage: 0,   rules: 'Blindaje F-F Ligero: 6% más armadura por tonelada' },
    'heavy ferro-fibrous':      { type: 'armor',        slots: 21, tonnage: 0,   rules: 'Blindaje F-F Pesado: 24% más armadura por tonelada' },
    'stealth armor':            { type: 'armor',        slots: 12, tonnage: 0,   rules: 'Blindaje Furtivo: +1 a impactar a corta, +2 a larga (requiere ECM)' },
    'hardened armor':           { type: 'armor',        slots: 0,  tonnage: 0,   rules: 'Blindaje Endurecido: recibe la mitad de daño pero pesa el doble' },
    'reactive armor':           { type: 'armor',        slots: 14, tonnage: 0,   rules: 'Blindaje Reactivo: reduce a la mitad daño de balística/misiles' },

    // ── Engine Types ──
    'xl engine':                { type: 'engine',       slots: -1, tonnage: -1,  rules: 'Motor XL: Más ligero, pero 3 críticos en cada torso lateral. Destruirlo mata al Mech.' },
    'light engine':             { type: 'engine',       slots: -1, tonnage: -1,  rules: 'Motor Ligero: 2 crits por torso lateral; requiere ambos destruidos.' },
    'xxl engine':               { type: 'engine',       slots: -1, tonnage: -1,  rules: 'Motor XXL: El más ligero, 6 crits por torso lateral; muy frágil.' },
    'compact engine':           { type: 'engine',       slots: -1, tonnage: -1,  rules: 'Motor Compacto: Más pesado, todos los crits concentrados en el Torso Central.' },

    // ── Structure Types ──
    'endo steel':               { type: 'structure',    slots: 14, tonnage: 0,   rules: 'Acero Endo: la estructura interna pesa la mitad' },
    'endo steel (clan)':        { type: 'structure',    slots: 7,  tonnage: 0,   rules: 'Acero Endo (Clan): la mitad de peso, menos slots' },
    'composite':                { type: 'structure',    slots: 0,  tonnage: 0,   rules: 'Estructura Compuesta: 50% de peso, pero doble daño por crítico' },
    'reinforced':               { type: 'structure',    slots: 0,  tonnage: 0,   rules: 'Estructura Reforzada: doble peso, pero requiere 2 crits para destruirse' },

    // ── Heat Sink Types ──
    'double heat sink':         { type: 'heatsink',     slots: 3, tonnage: 1,    rules: 'Radiador Doble: disipa 2 puntos de calor por radiador (IS: 3 crits)' },
    'dhs':                      { type: 'heatsink',     slots: 3, tonnage: 1,    rules: 'Radiador Doble: disipa 2 de calor' },
    'double (is) heat sink':    { type: 'heatsink',     slots: 3, tonnage: 1,    rules: 'Radiador Doble IS: 3 crits, 2 calor disipado' },
    'double (cl) heat sink':    { type: 'heatsink',     slots: 2, tonnage: 1,    rules: 'Radiador Doble Clan: 2 crits, 2 calor disipado' },

    // ── Miscellaneous Equipment ──
    'case':                     { type: 'misc',         slots: 1, tonnage: 0.5,  rules: 'CASE: Previene que la explosión de munición destruya el mech (salva piloto)' },
    'case ii':                  { type: 'misc',         slots: 1, tonnage: 1.0,  rules: 'CASE II: Contención avanzada, evita todo el daño de explosión' },
    'artemis iv':               { type: 'misc',         slots: 1, tonnage: 1.0,  rules: 'Artemis IV FCS: +2 en la tabla de impactos agrupados (misiles)' },
    'artemis v':                { type: 'misc',         slots: 1, tonnage: 1.0,  rules: 'Artemis V FCS: +3 en la tabla de impactos agrupados (misiles) (Clan)' },
    'jump jet':                 { type: 'misc',         slots: 1, tonnage: -1,   rules: 'Retrorreactor: +1 hex de movimiento de salto' },
    'improved jump jet':        { type: 'misc',         slots: 2, tonnage: -1,   rules: 'Retrorreactor Mejorado: +1 hex de salto (2 crits)' },
    'a-pod':                    { type: 'misc',         slots: 1, tonnage: 0.5,  rules: 'A-Pod: granada antipersonal; daña infantería a bocajarro' },
    'b-pod':                    { type: 'misc',         slots: 1, tonnage: 1.0,  rules: 'B-Pod: arma explosiva contra armaduras de batalla' },
};

// ─────────────────────────────────────────────────
//  AMMO CAPACITY TABLE
// ─────────────────────────────────────────────────

const AMMO_CAPACITY = {
    'machine gun':    200,  'light machine gun': 200,  'heavy machine gun': 100,
    'srm 2':          50,   'srm 4':             25,   'srm 6':             15,
    'streak srm 2':   50,   'streak srm 4':      25,   'streak srm 6':      15,
    'lrm 5':          24,   'lrm 10':            12,   'lrm 15':             8,   'lrm 20': 6,
    'mml 3':          40,   'mml 5':             24,   'mml 7':             17,   'mml 9':  13,
    'atm 3':          20,   'atm 6':             10,   'atm 9':              7,   'atm 12':  5,
    'ac/2':           45,   'ac/5':              20,   'ac/10':             10,   'ac/20':   5,
    'ultra ac/2':     45,   'ultra ac/5':        20,   'ultra ac/10':       10,   'ultra ac/20': 5,
    'lb 2-x ac':      45,   'lb 5-x ac':         20,   'lb 10-x ac':        10,  'lb 20-x ac': 5,
    'light ac/2':     45,   'light ac/5':        20,
    'rac/2':          45,   'rac/5':             20,
    'gauss rifle':     8,   'light gauss rifle': 16,   'heavy gauss rifle':  4,
    'plasma rifle':   10,
    'narc':           6,
    'ams':            12,   'anti-missile system': 12,
};

// ─────────────────────────────────────────────────
//  INTERNAL STRUCTURE TABLE
// ─────────────────────────────────────────────────

/**
 * Estructura interna estándar según tonelaje.
 * h = head, ct = center torso, lt/rt = side torsos, la/ra = arms, ll/rl = legs
 */
export function getInternalStructure(tonnage) {
    const h = 3;
    let ct, s, a, l;
    if      (tonnage <= 15)  { ct = 5;  s = 4;  a = 2;  l = 3;  }
    else if (tonnage <= 20)  { ct = 6;  s = 5;  a = 3;  l = 4;  }
    else if (tonnage <= 25)  { ct = 8;  s = 5;  a = 3;  l = 4;  }
    else if (tonnage <= 30)  { ct = 10; s = 7;  a = 3;  l = 5;  }
    else if (tonnage <= 35)  { ct = 11; s = 8;  a = 4;  l = 6;  }
    else if (tonnage <= 40)  { ct = 12; s = 10; a = 6;  l = 6;  }
    else if (tonnage <= 45)  { ct = 14; s = 11; a = 6;  l = 7;  }
    else if (tonnage <= 50)  { ct = 16; s = 12; a = 8;  l = 8;  }
    else if (tonnage <= 55)  { ct = 18; s = 13; a = 8;  l = 9;  }
    else if (tonnage <= 60)  { ct = 20; s = 14; a = 10; l = 10; }
    else if (tonnage <= 65)  { ct = 21; s = 15; a = 10; l = 10; }
    else if (tonnage <= 70)  { ct = 22; s = 15; a = 11; l = 11; }
    else if (tonnage <= 75)  { ct = 23; s = 16; a = 12; l = 12; }
    else if (tonnage <= 80)  { ct = 25; s = 17; a = 13; l = 13; }
    else if (tonnage <= 85)  { ct = 27; s = 18; a = 14; l = 14; }
    else if (tonnage <= 90)  { ct = 29; s = 19; a = 15; l = 15; }
    else if (tonnage <= 95)  { ct = 30; s = 20; a = 16; l = 16; }
    else                     { ct = 31; s = 21; a = 17; l = 17; }
    return { h, ct, lt: s, rt: s, la: a, ra: a, ll: l, rl: l };
}

// ─────────────────────────────────────────────────
//  WEAPON LOOKUP
// ─────────────────────────────────────────────────

/**
 * Busca stats de un arma en WEAPON_DB por coincidencia de substring.
 * Ordena por longitud de key DESC para que "er large laser" matchee antes que "large laser".
 */
function lookupWeapon(name) {
    const n = name.toLowerCase();
    // Remove (IS), (Clan), (R), etc prefix noise before lookup or display
    let cleanedName = name.replace(/\((IS|Clan|C|R|\*)\)/gi, '').trim();
    const sortedKeys = Object.keys(WEAPON_DB).sort((a, b) => b.length - a.length);
    for (const key of sortedKeys) {
        if (n.includes(key)) {
            // Strip any leading non-alphanumeric noise (like '@') safely for ammo etc
            const displayTitle = (WEAPON_DB[key].es || cleanedName).replace(/^[^\w\s@-]+/g, '').trim();
            return { ...WEAPON_DB[key], name: displayTitle, dbKey: key };
        }
    }
    // Unknown weapon — still return a usable object
    return {
        name: cleanedName.replace(/^[^\w\s]+/g, '').trim(), heat: 0, dmg: '?', minR: 0, shortR: 1, medR: 2, longR: 3, needsAmmo: false, dbKey: cleanedName.toLowerCase(),
    };
}

/**
 * Busca equipamiento especial por nombre de slot.
 * @returns {{ key: string, data: object } | null}
 */
function lookupSpecialEquipment(slotName) {
    const n = slotName.toLowerCase();
    // Sort by key length DESC for best match (e.g. "guardian ecm suite" before "ecm suite")
    const sortedKeys = Object.keys(SPECIAL_EQUIPMENT_DB).sort((a, b) => b.length - a.length);
    for (const key of sortedKeys) {
        if (n.includes(key)) {
            return { key, ...SPECIAL_EQUIPMENT_DB[key] };
        }
    }
    return null;
}

/**
 * Determina la capacidad de munición según el nombre.
 */
function getAmmoCapacity(ammoName) {
    const n = ammoName.toLowerCase();
    // Check explicit capacity in parentheses: "Ammo LRM 10 (12)"
    const match = n.match(/\((\d+)\)/);
    if (match) return parseInt(match[1], 10);

    // Match against AMMO_CAPACITY table (longest key first)
    const sortedKeys = Object.keys(AMMO_CAPACITY).sort((a, b) => b.length - a.length);
    for (const key of sortedKeys) {
        if (n.includes(key)) return AMMO_CAPACITY[key];
    }
    return 10; // fallback
}

// ─────────────────────────────────────────────────
//  SECTION MAPS
// ─────────────────────────────────────────────────

const LOC_SECTION_MAP = {
    'left arm':       'la',
    'right arm':      'ra',
    'left torso':     'lt',
    'right torso':    'rt',
    'center torso':   'ct',
    'head':           'h',
    'left leg':       'll',
    'right leg':      'rl',
};

const LOC_DISPLAY_MAP = {
    'left arm': 'Brazo Izquierdo', 'right arm': 'Brazo Derecho',
    'left torso': 'Torso Izquierdo', 'right torso': 'Torso Derecho',
    'center torso': 'Torso Central',
    'head': 'Cabeza', 'left leg': 'Pierna Izquierda', 'right leg': 'Pierna Derecha',
};

const SLOTS_PER_LOC = { h: 6, ct: 12, lt: 12, rt: 12, la: 12, ra: 12, ll: 6, rl: 6 };

// ─────────────────────────────────────────────────
//  MAIN PARSER
// ─────────────────────────────────────────────────

/**
 * @typedef {object} ParsedMech
 * @property {string} chassis
 * @property {string} variant
 * @property {string} name
 * @property {number} tonnage
 * @property {number} walk
 * @property {number} run
 * @property {number} jump
 * @property {number} heatSinks
 * @property {string} heatSinkType — 'Single', 'Double', etc.
 * @property {number} heatDissipation — effective heat dissipation per turn
 * @property {string} year
 * @property {string} techBase
 * @property {string} armorType — detected armor technology
 * @property {string} structureType — detected structure technology
 * @property {string} engineType — detected engine technology
 * @property {object} locations — { locKey: { name, short, a, aRear, s } }
 * @property {object[]} weapons — parsed weapon stats
 * @property {object[]} ammo — ammo slots with current/max
 * @property {object[]} equipment — special equipment list with loc + rules
 * @property {object} criticals — { locKey: [slotName...] }
 */

/**
 * Parsea texto MTF crudo y devuelve un objeto ParsedMech completo.
 */
export function parseMTF(text) {
    const lines = text.split('\n').map(l => l.trim());

    /** @type {ParsedMech} */
    const mech = {
        // ── Identidad ──
        chassis:       lines[1] || 'Unknown',
        variant:       lines[2] || '',
        name:          ((lines[1] || '') + ' ' + (lines[2] || '')).trim(),
        tonnage:       20,
        // ── Movimiento ──
        walk:          0,
        run:           0,
        jump:          0,
        // ── Calor ──
        heatSinks:     10,
        heatSinkType:  'Sencillos',
        heatDissipation: 10, // effective dissipation (double = ×2)
        // ── Metadata ──
        year:          '3025',
        techBase:      'Esfera Interior',
        armorType:     'Estándar',
        structureType: 'Estándar',
        engineType:    'Fusión Estándar',
        // ── Localizaciones ──
        locations: {
            h:  { name: 'Cabeza',         short: 'CB', a: 0, aRear: 0, s: 0 },
            ct: { name: 'Torso Central',  short: 'TC', a: 0, aRear: 0, s: 0 },
            lt: { name: 'Torso Izdo',     short: 'TI', a: 0, aRear: 0, s: 0 },
            rt: { name: 'Torso Dcho',     short: 'TD', a: 0, aRear: 0, s: 0 },
            la: { name: 'Brazo Izdo',     short: 'BI', a: 0, aRear: 0, s: 0 },
            ra: { name: 'Brazo Dcho',     short: 'BD', a: 0, aRear: 0, s: 0 },
            ll: { name: 'Pierna Izda',    short: 'PI', a: 0, aRear: 0, s: 0 },
            rl: { name: 'Pierna Dcha',    short: 'PD', a: 0, aRear: 0, s: 0 },
        },
        // ── Armamento ──
        weapons:   [],
        ammo:      [],
        // ── Equipamiento especial ──
        equipment: [],  // { name, loc, type, rules, key }
        // ── Críticos ──
        criticals: { h: [], ct: [], lt: [], rt: [], la: [], ra: [], ll: [], rl: [] },
        totalArmor: 0,
        totalArmorTons: 0,
        bv: 0,
    };

    // ── Parsing state machine ──
    let inWeaponsBlock   = false;
    let weaponCount      = 0;
    let weaponsRead      = 0;
    let currentCritLoc   = null;
    let critSlotsRead    = 0;

    let currentSection = null;
    let expectedLocationIndex = 0;

    // Attempt to extract BV from the lines if it exists
    const bvLine = lines.find(line => line.toLowerCase().startsWith('bv'));
    if (bvLine) {
        const bvMatch = bvLine.match(/[\d,]+/);
        if (bvMatch) mech.bv = parseInt(bvMatch[0].replace(/,/g, ''), 10);
    }

    // Armor keys → locKey
    const armorKeys = {
        'head armor': 'h',          'hd armor': 'h',
        'center torso armor': 'ct', 'ct armor': 'ct',
        'left torso armor': 'lt',   'lt armor': 'lt',
        'right torso armor': 'rt',  'rt armor': 'rt',
        'left arm armor': 'la',     'la armor': 'la',
        'right arm armor': 'ra',    'ra armor': 'ra',
        'left leg armor': 'll',     'll armor': 'll',
        'right leg armor': 'rl',    'rl armor': 'rl',
    };

    const rearArmorKeys = {
        'center torso rear armor': 'ct', 'ct rear armor': 'ct', 'rtc armor': 'ct',
        'left torso rear armor': 'lt',   'lt rear armor': 'lt', 'rtl armor': 'lt',
        'right torso rear armor': 'rt',  'rt rear armor': 'rt', 'rtr armor': 'rt',
    };

    // Track which special equipment has already been added (avoid duplicates from multi-slot items)
    const equipmentSeen = new Set();

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;

        // ── Check for location section header (e.g. "Left Arm:") ──
        const locHeader = line.replace(':', '').trim().toLowerCase();
        if (LOC_SECTION_MAP[locHeader] && line.endsWith(':')) {
            currentCritLoc = LOC_SECTION_MAP[locHeader];
            critSlotsRead = 0;
            inWeaponsBlock = false;
            continue;
        }

        // ── Read critical slot lines ──
        if (currentCritLoc) {
            const maxSlots = SLOTS_PER_LOC[currentCritLoc];
            if (critSlotsRead < maxSlots && !line.includes(':')) {
                mech.criticals[currentCritLoc].push(line);

                // ── Detect special equipment in critical slots ──
                if (line !== '-Empty-' && line !== '-empty-') {
                    const special = lookupSpecialEquipment(line);
                    if (special) {
                        const dedupeKey = `${special.key}|${currentCritLoc}`;
                        if (!equipmentSeen.has(dedupeKey)) {
                            equipmentSeen.add(dedupeKey);
                            const locName = Object.entries(LOC_SECTION_MAP)
                                .find(([, v]) => v === currentCritLoc)?.[0] || currentCritLoc;
                            mech.equipment.push({
                                name: line,
                                key:  special.key,
                                loc:  LOC_DISPLAY_MAP[locName] || locName,
                                locKey: currentCritLoc,
                                type: special.type,
                                rules: special.rules,
                            });

                            // Auto-detect armor/structure/engine technology
                            if (special.type === 'armor')     mech.armorType     = line;
                            if (special.type === 'structure')  mech.structureType = line;
                            if (special.type === 'engine')     mech.engineType    = line;
                        }
                    }
                }

                critSlotsRead++;
                if (critSlotsRead >= maxSlots) currentCritLoc = null;
                continue;
            } else if (line.includes(':')) {
                currentCritLoc = null;
                // fall through
            }
        }

        // ── Key:Value lines ──
        const parts = line.split(':');
        if (parts.length < 2 && !inWeaponsBlock) continue;

        const key    = parts[0].trim().toLowerCase();
        const rawVal = parts.slice(1).join(':').trim();
        const val    = parseInt(rawVal, 10);

        // ── General stats ──
        if (key === 'mass' || key === 'tonnage') {
            mech.tonnage = val;
        }
        else if (key === 'walk mp')   mech.walk = val;
        else if (key === 'jump mp')   mech.jump = val;
        else if (key === 'heat sinks') {
            const hsParts = rawVal.split(' ');
            mech.heatSinks = parseInt(hsParts[0], 10) || 10;
            if (hsParts.length > 1) {
                mech.heatSinkType = hsParts.slice(1).join(' ');
            }
            // Calculate effective dissipation
            const isDouble = mech.heatSinkType.toLowerCase().includes('double');
            mech.heatDissipation = isDouble ? mech.heatSinks * 2 : mech.heatSinks;
        }
        else if (key === 'year') mech.year = rawVal;
        else if (key === 'rules level' || key === 'technology' || key === 'tech base') {
            mech.techBase = rawVal;
        }
        else if (key === 'armor' && rawVal) {
            // "Armor:Ferro-Fibrous" or "Armor:Standard"
            mech.armorType = rawVal;
        }
        else if (key === 'structure' && rawVal) {
            mech.structureType = rawVal;
        }
        else if (key === 'engine') {
            mech.engineType = rawVal;
        }

        // ── Armor values ──
        else if (armorKeys[key]) {
            mech.locations[armorKeys[key]].a = val;
        }
        else if (rearArmorKeys[key]) {
            mech.locations[rearArmorKeys[key]].aRear = val;
        }

        // ── Weapons block ──
        else if (key === 'weapons') {
            inWeaponsBlock = true;
            weaponCount = val;
            weaponsRead = 0;
        }
        else if (inWeaponsBlock && weaponsRead < weaponCount && line.length > 0) {
            const wParts = line.split(',');
            if (wParts.length >= 2) {
                const wName = wParts[0].trim().replace(/^\d+\s+/, '');
                const loc   = wParts[1].trim();

                if (wName.toLowerCase().includes('ammo') || wName.toLowerCase().includes('munic')) {
                    const capacity = getAmmoCapacity(wName);
                    mech.ammo.push({
                        name:    wName,
                        loc,
                        max:     capacity,
                        current: capacity,
                    });
                } else {
                    const wData = lookupWeapon(wName);
                    mech.weapons.push({ ...wData, loc });
                }
                weaponsRead++;
            }
        }
    }

    // ── Post-processing ──

    // Compute run MP
    mech.run = Math.ceil(mech.walk * 1.5);

    // Check for MASC — doubles run speed
    const hasMASC = mech.equipment.some(e => e.key === 'masc');
    if (hasMASC) {
        mech.mascRunMP = mech.walk * 2;  // MASC-boosted run
    }

    // Assign internal structure from tonnage table
    const structure = getInternalStructure(mech.tonnage);
    for (const loc of Object.keys(mech.locations)) {
        mech.locations[loc].s = structure[loc];
    }

    // Calculate total armor points and tons
    let totalArmorPoints = 0;
    for (const loc of Object.keys(mech.locations)) {
        totalArmorPoints += mech.locations[loc].a + mech.locations[loc].aRear;
    }
    mech.totalArmor = totalArmorPoints;

    let tonnageFactor = 16; // Standard armor
    if (mech.armorType.toLowerCase().includes('ferro-fibroso') || mech.armorType.toLowerCase().includes('ferro-fibrous')) {
        if (mech.armorType.toLowerCase().includes('clan')) tonnageFactor = 19.2;
        else if (mech.armorType.toLowerCase().includes('light') || mech.armorType.toLowerCase().includes('ligero')) tonnageFactor = 16.96;
        else if (mech.armorType.toLowerCase().includes('heavy') || mech.armorType.toLowerCase().includes('pesado')) tonnageFactor = 19.84;
        else tonnageFactor = 17.92; // Inner Sphere Ferro-Fibrous
    }
    mech.totalArmorTons = Math.ceil((totalArmorPoints / tonnageFactor) * 2) / 2; // round UP to nearest 0.5 tons


    // Pad critical slots to correct size
    for (const [loc, slots] of Object.entries(mech.criticals)) {
        const maxSlots = SLOTS_PER_LOC[loc];
        while (slots.length < maxSlots) {
            slots.push('-Empty-');
        }
    }

    // Recalculate heat dissipation if double HS detected from crits
    const hasDoubleHS = mech.equipment.some(e => e.type === 'heatsink');
    if (hasDoubleHS && mech.heatSinkType === 'Sencillos') {
        mech.heatSinkType = 'Dobles';
        mech.heatDissipation = mech.heatSinks * 2;
    }

    if (!mech.techBase.match(/Esfera|Clan/i)) {
        if (mech.techBase.toLowerCase().includes('inner sphere')) {
            mech.techBase = 'Esfera Interior';
        }
    }

    return mech;
}

// ─────────────────────────────────────────────────
//  FILE UPLOAD HANDLER
// ─────────────────────────────────────────────────

/**
 * Lee un archivo MTF o SSW mediante FileReader y llama al callback con el mech parseado.
 */
export function handleFileUpload(event, onParsed) {
    const file = event.target.files[0];
    if (!file) return;
    const isSSW = file.name.toLowerCase().endsWith('.ssw');
    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target.result;
        try {
            const mech = isSSW ? parseSSW(text) : parseMTF(text);
            onParsed(mech);
        } catch (err) {
            console.error("Error parsing file:", err);
            alert("Error leyendo el archivo. Revisa la consola.");
        }
    };
    reader.readAsText(file);
}

// ─────────────────────────────────────────────────
//  SSW PARSER
// ─────────────────────────────────────────────────

function getWeaponSlots(name) {
    const n = name.toLowerCase().replace(/-/g, ' '); // Normalize hyphens to spaces (e.g. LRM-20 -> LRM 20)
    if (n.includes('heavy gauss')) return 11;
    if (n.includes('gauss')) return 7;
    if (n.includes('ac/20') || n.includes('ac 20')) return 10;
    if (n.includes('ac/10') || n.includes('ac 10')) return 7;
    if (n.includes('ac/5') || n.includes('ac 5')) return 4;
    if (n.includes('ac/2') || n.includes('ac 2')) return 1;
    if (n.includes('lrm 20')) return 5;
    if (n.includes('lrm 15')) return 3;
    if (n.includes('lrm 10')) return 2;
    if (n.includes('lrm 5')) return 1;
    if (n.includes('srm 6')) return 2;
    if (n.includes('srm 4')) return 1;
    if (n.includes('ppc')) return 3;
    if (n.includes('large laser')) return 2;
    if (n.includes('autocannon')) return 1; // Base class catch
    return 1;
}

const MAP_REVERSE = {
    'la': 'Brazo Izdo', 'ra': 'Brazo Dcho', 'lt': 'Torso Izdo', 'rt': 'Torso Dcho',
    'ct': 'Torso Central', 'h': 'Cabeza', 'll': 'Pierna Izda', 'rl': 'Pierna Dcha',
    'hd': 'Cabeza'
};

export function parseSSW(xmlText) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, "text/xml");
    const root = doc.querySelector('mech');
    if (!root) throw new Error("Invalid SSW XML");

    const mech = {
        chassis:       root.getAttribute('name') || 'Unknown',
        variant:       root.getAttribute('model') || '',
        tonnage:       parseInt(root.getAttribute('tons') || '20', 10),
        walk:          0,
        run:           0,
        jump:          0,
        heatSinks:     10,
        heatSinkType:  'Sencillos',
        heatDissipation: 10,
        year:          root.querySelector('year')?.textContent || '3025',
        techBase:      ((root.querySelector('techbase')?.textContent || '').includes('Clan') ? 'Clan' : 'Esfera Interior'),
        armorType:     root.querySelector('armor > type')?.textContent || 'Estándar',
        structureType: root.querySelector('structure > type')?.textContent || 'Estándar',
        engineType:    root.querySelector('engine')?.textContent || 'Motor Fusión',
        locations: {
            h:  { name: 'Cabeza',         short: 'CB', a: 0, aRear: 0, s: 0 },
            ct: { name: 'Torso Central',  short: 'TC', a: 0, aRear: 0, s: 0 },
            lt: { name: 'Torso Izdo',     short: 'TI', a: 0, aRear: 0, s: 0 },
            rt: { name: 'Torso Dcho',     short: 'TD', a: 0, aRear: 0, s: 0 },
            la: { name: 'Brazo Izdo',     short: 'BI', a: 0, aRear: 0, s: 0 },
            ra: { name: 'Brazo Dcho',     short: 'BD', a: 0, aRear: 0, s: 0 },
            ll: { name: 'Pierna Izda',    short: 'PI', a: 0, aRear: 0, s: 0 },
            rl: { name: 'Pierna Dcha',    short: 'PD', a: 0, aRear: 0, s: 0 },
        },
        weapons:   [],
        ammo:      [],
        equipment: [],
        totalArmor: 0,
        totalArmorTons: 0,
        bv: 0,
        criticals: {
            h:  ['-Empty-', '-Empty-', '-Empty-', '-Empty-', '-Empty-', '-Empty-'],
            ct: ['-Empty-', '-Empty-', '-Empty-', '-Empty-', '-Empty-', '-Empty-', '-Empty-', '-Empty-', '-Empty-', '-Empty-', '-Empty-', '-Empty-'],
            lt: Array(12).fill('-Empty-'),
            rt: Array(12).fill('-Empty-'),
            la: Array(12).fill('-Empty-'),
            ra: Array(12).fill('-Empty-'),
            ll: ['-Empty-', '-Empty-', '-Empty-', '-Empty-', '-Empty-', '-Empty-'],
            rl: ['-Empty-', '-Empty-', '-Empty-', '-Empty-', '-Empty-', '-Empty-'],
        },
    };
    mech.name = (mech.chassis + ' ' + mech.variant).trim();

    // ── Pre-fill Base Actuators & Systems ──
    const acts = root.querySelector('actuators');
    mech.criticals.h[0] = 'Soporte Vital'; mech.criticals.h[1] = 'Sensores'; mech.criticals.h[2] = 'Cabina'; mech.criticals.h[4] = 'Sensores'; mech.criticals.h[5] = 'Soporte Vital';
    mech.criticals.ct[0] = mech.criticals.ct[1] = mech.criticals.ct[2] = 'Motor Fusión';
    mech.criticals.ct[7] = mech.criticals.ct[8] = mech.criticals.ct[9] = 'Motor Fusión';
    mech.criticals.ct[3] = mech.criticals.ct[4] = mech.criticals.ct[5] = mech.criticals.ct[6] = 'Giroscopio';
    ['la', 'ra'].forEach(arm => {
        mech.criticals[arm][0] = 'Hombro';
        mech.criticals[arm][1] = 'Mandos Brazo Sup.';
        mech.criticals[arm][2] = 'Mandos Brazo Inf.';
        const hasHand = acts ? acts.getAttribute(arm === 'la' ? 'lh' : 'rh') === 'TRUE' : false;
        if (hasHand) mech.criticals[arm][3] = 'Mano';
    });
    ['ll', 'rl'].forEach(leg => {
        mech.criticals[leg][0] = 'Cadera';
        mech.criticals[leg][1] = 'Mandos P. Superior';
        mech.criticals[leg][2] = 'Mandos P. Inferior';
        mech.criticals[leg][3] = 'Pie';
    });
    // Engine crits in Side Torsos
    const engNode = root.querySelector('engine');
    if (engNode) {
        let ls = parseInt(engNode.getAttribute('lsstart'), 10);
        let rs = parseInt(engNode.getAttribute('rsstart'), 10);
        const crits = mech.engineType.toLowerCase().includes('xl') ? 3 : (mech.engineType.toLowerCase().includes('light') ? 2 : 0);
        if (crits > 0 && ls > -1) { for(let i=0; i<crits; i++) mech.criticals.lt[ls+i] = mech.engineType; }
        if (crits > 0 && rs > -1) { for(let i=0; i<crits; i++) mech.criticals.rt[rs+i] = mech.engineType; }
    }

    // ── Movement ──
    const bf = root.querySelector('battleforce');
    if (bf) {
        const mv = bf.getAttribute('mv') || '0';
        mech.walk = parseInt(mv, 10) || 0;
        mech.run = Math.ceil(mech.walk * 1.5);
    }
    const jjNode = root.querySelector('jumpjets');
    if (jjNode) mech.jump = parseInt(jjNode.getAttribute('number'), 10) || 0;

    // ── Armor ──
    const armorNode = root.querySelector('armor');
    if (armorNode) {
        const aKeys = ['hd','ct','lt','rt','la','ra','ll','rl'];
        aKeys.forEach(k => {
            const el = armorNode.querySelector(k);
            if (el) mech.locations[k === 'hd' ? 'h' : k].a = parseInt(el.textContent, 10);
        });
        const rKeys = ['ctr','ltr','rtr'];
        rKeys.forEach(k => {
            const el = armorNode.querySelector(k);
            if (el) mech.locations[k.slice(0, 2)].aRear = parseInt(el.textContent, 10);
        });
    }

    // ── Structure ──
    const structure = getInternalStructure(mech.tonnage);
    for (const loc of Object.keys(mech.locations)) {
        mech.locations[loc].s = structure[loc];
    }

    // ── Calculate total armor points and tons ──
    let totalArmorPoints = 0;
    for (const loc of Object.keys(mech.locations)) {
        totalArmorPoints += mech.locations[loc].a + mech.locations[loc].aRear;
    }
    mech.totalArmor = totalArmorPoints;

    let tonnageFactor = 16;
    if (mech.armorType.toLowerCase().includes('ferro-fibroso') || mech.armorType.toLowerCase().includes('ferro-fibrous')) {
        if (mech.armorType.toLowerCase().includes('clan')) tonnageFactor = 19.2;
        else if (mech.armorType.toLowerCase().includes('light') || mech.armorType.toLowerCase().includes('ligero')) tonnageFactor = 16.96;
        else if (mech.armorType.toLowerCase().includes('heavy') || mech.armorType.toLowerCase().includes('pesado')) tonnageFactor = 19.84;
        else tonnageFactor = 17.92;
    }
    mech.totalArmorTons = Math.ceil((totalArmorPoints / tonnageFactor) * 2) / 2;

    // ── Heat Sinks ──
    const hsNode = root.querySelector('heatsinks');
    if (hsNode) {
        mech.heatSinks = parseInt(hsNode.getAttribute('number'), 10) || 10;
        let hsTypeRaw = hsNode.querySelector('type')?.textContent?.toLowerCase() || 'single heat sink';
        mech.heatSinkType = hsTypeRaw.includes('double') ? 'Dobles' : 'Sencillos';
        
        const isDouble = mech.heatSinkType === 'Dobles';
        mech.heatDissipation = isDouble ? mech.heatSinks * 2 : mech.heatSinks;
        const slotsReq = isDouble ? (mech.techBase.includes('Clan') ? 2 : 3) : 1;
        
        hsNode.querySelectorAll('location').forEach(locNode => {
            const locStr = locNode.textContent.trim().toLowerCase();
            const lKey = locStr === 'hd' ? 'h' : locStr;
            const idx = parseInt(locNode.getAttribute('index'), 10);
            if (mech.criticals[lKey] && !isNaN(idx)) {
                for (let i = 0; i < slotsReq; i++) mech.criticals[lKey][idx + i] = mech.heatSinkType;
            }
        });
    }

    // Jump Jets filling
    if (jjNode) {
        const type = jjNode.querySelector('type')?.textContent || 'Standard Jump Jet';
        const slotsReq = type.toLowerCase().includes('improved') ? 2 : 1;
        jjNode.querySelectorAll('location').forEach(locNode => {
            const locStr = locNode.textContent.trim().toLowerCase();
            const lKey = locStr === 'hd' ? 'h' : locStr;
            const idx = parseInt(locNode.getAttribute('index'), 10);
            if (mech.criticals[lKey] && !isNaN(idx)) {
                for (let i = 0; i < slotsReq; i++) mech.criticals[lKey][idx + i] = type;
            }
        });
    }

    // ── Equipment / Weapons ──
    const equipmentSeen = new Set();
    const blNode = root.querySelector('baseloadout');
    if (blNode) {
        blNode.querySelectorAll('equipment').forEach(eq => {
            const nameNode = eq.querySelector('name');
            const typeNode = eq.querySelector('type');
            const locNode  = eq.querySelector('location');
            if (!nameNode || !locNode) return;
            
            // Remove starting @ and any leading/trailing spaces SSW uses for ammo
            let rawName = nameNode.textContent.trim();
            if (rawName.startsWith('@')) {
                rawName = rawName.substring(1).trim();
            }
            
            const eqType  = typeNode?.textContent?.toLowerCase() || '';
            const locStr  = locNode.textContent.trim().toLowerCase();
            const lKey    = locStr === 'hd' ? 'h' : locStr;
            const locObj  = MAP_REVERSE[locStr] || locStr.toUpperCase();
            const idx     = parseInt(locNode.getAttribute('index'), 10);

            let slotsReq = 1;

            if (eqType === 'ammunition') {
                const capacity = getAmmoCapacity(rawName);
                mech.ammo.push({ name: rawName, loc: locObj, max: capacity, current: capacity });
            } else {
                const special = lookupSpecialEquipment(rawName);
                if (special) {
                    const dedupeKey = `${special.key}|${lKey}|${idx}`;
                    if (!equipmentSeen.has(dedupeKey)) {
                        equipmentSeen.add(dedupeKey);
                        mech.equipment.push({
                            name: rawName, key: special.key, loc: locObj, locKey: lKey,
                            type: special.type, rules: special.rules
                        });
                        if (special.slots > 0) slotsReq = special.slots;
                    }
                }
                const wData = lookupWeapon(rawName);
                if (wData.heat > 0 || wData.dmg !== '?' || eqType === 'energy' || eqType === 'ballistic' || eqType === 'missile') {
                    mech.weapons.push({ ...wData, name: rawName, loc: locObj });
                    slotsReq = getWeaponSlots(rawName);
                }
            }

            if (mech.criticals[lKey] && !isNaN(idx)) {
                for (let i = 0; i < slotsReq; i++) {
                    if ((idx + i) < mech.criticals[lKey].length) {
                        mech.criticals[lKey][idx + i] = rawName;
                    }
                }
            }
        });
    }

    // Clean up empty slots
    for (const [loc, slots] of Object.entries(mech.criticals)) {
        for (let i=0; i<slots.length; i++) {
            if (!slots[i]) slots[i] = '-Empty-';
        }
    }

    // MASC check
    const hasMASC = mech.equipment.some(e => e.key === 'masc');
    if (hasMASC) mech.mascRunMP = mech.walk * 2;

    // Capture Battle Value
    const bvNode = root.querySelector('battle_value');
    if (bvNode) mech.bv = parseInt(bvNode.textContent, 10);

    return mech;
}
