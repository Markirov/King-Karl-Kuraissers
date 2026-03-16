// ═══════════════════════════════════════════════════
//  src/mechanics.js — Reglas y cálculos de BattleTech
// ═══════════════════════════════════════════════════

import { getBaseHeat, setBaseHeat, setMoveHeat, getCurrentMech } from './state.js';

// ── Damage Transfer Map (BattleTech rules) ─────
// Arms → side torso, legs → side torso, side torso → CT, CT → destroyed
const DAMAGE_TRANSFER = {
    la: 'lt', ra: 'rt',
    ll: 'lt', rl: 'rt',
    lt: 'ct', rt: 'ct',
    ct: null,   // CT destroyed = mech destroyed
    h:  'ct',   // Head → CT (optional rule; head destroyed = pilot killed)
};

// ── Weapon Database ──────────────────────────────
// Keys are lowercase substrings matched against weapon names (longest match wins).
// dmg = damage, minR/shortR/medR/longR = range brackets
// needsAmmo: whether this weapon requires ammo to fire
export const WEAPON_DB = {
    // ── Energy ──
    'er ppc':            { heat: 15, dmg: 10, minR: 0, shortR: 7,  medR: 14, longR: 23, needsAmmo: false, es: 'PPC ER' },
    'ppc':               { heat: 10, dmg: 10, minR: 3, shortR: 6,  medR: 12, longR: 18, needsAmmo: false, es: 'PPC' },
    'er large laser':    { heat: 12, dmg: 8,  minR: 0, shortR: 7,  medR: 14, longR: 19, needsAmmo: false, es: 'Láser Grande ER' },
    'large pulse laser': { heat: 10, dmg: 9,  minR: 0, shortR: 6,  medR: 14, longR: 20, needsAmmo: false, es: 'Láser Grande Pulso' },
    'large laser':       { heat: 8,  dmg: 8,  minR: 0, shortR: 5,  medR: 10, longR: 15, needsAmmo: false, es: 'Láser Grande' },
    'er medium laser':   { heat: 5,  dmg: 5,  minR: 0, shortR: 4,  medR: 8,  longR: 12, needsAmmo: false, es: 'Láser Medio ER' },
    'medium pulse laser':{ heat: 4,  dmg: 6,  minR: 0, shortR: 2,  medR: 4,  longR: 6,  needsAmmo: false, es: 'Láser Medio Pulso' },
    'medium laser':      { heat: 3,  dmg: 5,  minR: 0, shortR: 3,  medR: 6,  longR: 9,  needsAmmo: false, es: 'Láser Medio' },
    'er small laser':    { heat: 2,  dmg: 3,  minR: 0, shortR: 2,  medR: 4,  longR: 5,  needsAmmo: false, es: 'Láser Pequeño ER' },
    'small pulse laser': { heat: 2,  dmg: 3,  minR: 0, shortR: 1,  medR: 2,  longR: 3,  needsAmmo: false, es: 'Láser Pequeño Pulso' },
    'small laser':       { heat: 1,  dmg: 3,  minR: 0, shortR: 1,  medR: 2,  longR: 3,  needsAmmo: false, es: 'Láser Pequeño' },
    'flamer':            { heat: 3,  dmg: 2,  minR: 0, shortR: 1,  medR: 2,  longR: 3,  needsAmmo: false, es: 'Lanzallamas' },
    'er flamer':         { heat: 4,  dmg: 2,  minR: 0, shortR: 3,  medR: 5,  longR: 7,  needsAmmo: false, es: 'Lanzallamas ER' },
    'plasma rifle':      { heat: 10, dmg: 10, minR: 0, shortR: 5,  medR: 10, longR: 15, needsAmmo: true,  es: 'Rifle de Plasma' },

    // ── Ballistic ──
    'gauss rifle':       { heat: 1,  dmg: 15, minR: 2, shortR: 7,  medR: 15, longR: 22, needsAmmo: true,  es: 'Rifle Gauss' },
    'light gauss rifle': { heat: 1,  dmg: 8,  minR: 3, shortR: 8,  medR: 17, longR: 25, needsAmmo: true,  es: 'Rifle Gauss Ligero' },
    'heavy gauss rifle': { heat: 2,  dmg: 25, minR: 4, shortR: 6,  medR: 13, longR: 20, needsAmmo: true,  es: 'Rifle Gauss Pesado' },
    'ultra ac/20':       { heat: 8,  dmg: 20, minR: 0, shortR: 3,  medR: 6,  longR: 9,  needsAmmo: true,  es: 'CA Ultra/20' },
    'ultra ac/10':       { heat: 3,  dmg: 10, minR: 0, shortR: 6,  medR: 12, longR: 18, needsAmmo: true,  es: 'CA Ultra/10' },
    'ultra ac/5':        { heat: 1,  dmg: 5,  minR: 2, shortR: 6,  medR: 12, longR: 18, needsAmmo: true,  es: 'CA Ultra/5' },
    'ultra ac/2':        { heat: 1,  dmg: 2,  minR: 3, shortR: 8,  medR: 17, longR: 25, needsAmmo: true,  es: 'CA Ultra/2' },
    'lb 10-x ac':        { heat: 2,  dmg: 10, minR: 0, shortR: 6,  medR: 12, longR: 18, needsAmmo: true,  es: 'CA LB 10-X' },
    'lb 5-x ac':         { heat: 1,  dmg: 5,  minR: 3, shortR: 7,  medR: 14, longR: 21, needsAmmo: true,  es: 'CA LB 5-X' },
    'lb 2-x ac':         { heat: 1,  dmg: 2,  minR: 4, shortR: 9,  medR: 18, longR: 27, needsAmmo: true,  es: 'CA LB 2-X' },
    'rac/5':             { heat: 1,  dmg: 5,  minR: 0, shortR: 6,  medR: 12, longR: 18, needsAmmo: true,  es: 'CA Rotatorio/5' },
    'rac/2':             { heat: 1,  dmg: 2,  minR: 0, shortR: 6,  medR: 12, longR: 18, needsAmmo: true,  es: 'CA Rotatorio/2' },
    'light ac/5':        { heat: 1,  dmg: 5,  minR: 3, shortR: 6,  medR: 12, longR: 18, needsAmmo: true,  es: 'CA Ligero/5' },
    'light ac/2':        { heat: 1,  dmg: 2,  minR: 4, shortR: 8,  medR: 16, longR: 24, needsAmmo: true,  es: 'CA Ligero/2' },
    'ac/20':             { heat: 7,  dmg: 20, minR: 0, shortR: 3,  medR: 6,  longR: 9,  needsAmmo: true,  es: 'CA/20' },
    'ac/10':             { heat: 3,  dmg: 10, minR: 0, shortR: 5,  medR: 10, longR: 15, needsAmmo: true,  es: 'CA/10' },
    'ac/5':              { heat: 1,  dmg: 5,  minR: 3, shortR: 6,  medR: 12, longR: 18, needsAmmo: true,  es: 'CA/5' },
    'ac/2':              { heat: 1,  dmg: 2,  minR: 4, shortR: 8,  medR: 16, longR: 24, needsAmmo: true,  es: 'CA/2' },
    'machine gun':       { heat: 0,  dmg: 2,  minR: 0, shortR: 1,  medR: 2,  longR: 3,  needsAmmo: true,  es: 'Ametralladora' },
    'light machine gun': { heat: 0,  dmg: 1,  minR: 0, shortR: 2,  medR: 4,  longR: 6,  needsAmmo: true,  es: 'Ametralladora Ligera' },
    'heavy machine gun': { heat: 0,  dmg: 3,  minR: 0, shortR: 1,  medR: 2,  longR: 3,  needsAmmo: true,  es: 'Ametralladora Pesada' },

    // ── Missiles ──
    'lrm 20':            { heat: 6,  dmg: '1/m', minR: 6, shortR: 7,  medR: 14, longR: 21, needsAmmo: true,  es: 'LMR 20' },
    'lrm 15':            { heat: 5,  dmg: '1/m', minR: 6, shortR: 7,  medR: 14, longR: 21, needsAmmo: true,  es: 'LMR 15' },
    'lrm 10':            { heat: 4,  dmg: '1/m', minR: 6, shortR: 7,  medR: 14, longR: 21, needsAmmo: true,  es: 'LMR 10' },
    'lrm 5':             { heat: 2,  dmg: '1/m', minR: 6, shortR: 7,  medR: 14, longR: 21, needsAmmo: true,  es: 'LMR 5' },
    'srm 6':             { heat: 4,  dmg: '2/m', minR: 0, shortR: 3,  medR: 6,  longR: 9,  needsAmmo: true,  es: 'SMR 6' },
    'srm 4':             { heat: 3,  dmg: '2/m', minR: 0, shortR: 3,  medR: 6,  longR: 9,  needsAmmo: true,  es: 'SMR 4' },
    'srm 2':             { heat: 2,  dmg: '2/m', minR: 0, shortR: 3,  medR: 6,  longR: 9,  needsAmmo: true,  es: 'SMR 2' },
    'streak srm 6':      { heat: 4,  dmg: '2/m', minR: 0, shortR: 3,  medR: 6,  longR: 9,  needsAmmo: true,  es: 'SMR Streak 6' },
    'streak srm 4':      { heat: 3,  dmg: '2/m', minR: 0, shortR: 3,  medR: 6,  longR: 9,  needsAmmo: true,  es: 'SMR Streak 4' },
    'streak srm 2':      { heat: 2,  dmg: '2/m', minR: 0, shortR: 3,  medR: 6,  longR: 9,  needsAmmo: true,  es: 'SMR Streak 2' },
    'mml 9':             { heat: 5,  dmg: '1/m', minR: 0, shortR: 7,  medR: 14, longR: 21, needsAmmo: true,  es: 'LMM 9' },
    'mml 7':             { heat: 4,  dmg: '1/m', minR: 0, shortR: 7,  medR: 14, longR: 21, needsAmmo: true,  es: 'LMM 7' },
    'mml 5':             { heat: 3,  dmg: '1/m', minR: 0, shortR: 7,  medR: 14, longR: 21, needsAmmo: true,  es: 'LMM 5' },
    'mml 3':             { heat: 2,  dmg: '1/m', minR: 0, shortR: 7,  medR: 14, longR: 21, needsAmmo: true,  es: 'LMM 3' },
    'atm 12':            { heat: 8,  dmg: '2/m', minR: 4, shortR: 5,  medR: 10, longR: 15, needsAmmo: true,  es: 'MTA 12' },
    'atm 9':             { heat: 6,  dmg: '2/m', minR: 4, shortR: 5,  medR: 10, longR: 15, needsAmmo: true,  es: 'MTA 9' },
    'atm 6':             { heat: 4,  dmg: '2/m', minR: 4, shortR: 5,  medR: 10, longR: 15, needsAmmo: true,  es: 'MTA 6' },
    'atm 3':             { heat: 2,  dmg: '2/m', minR: 4, shortR: 5,  medR: 10, longR: 15, needsAmmo: true,  es: 'MTA 3' },
    'narc':              { heat: 0,  dmg: 0,     minR: 0, shortR: 3,  medR: 6,  longR: 9,  needsAmmo: true,  es: 'Narc' },
    'tag':               { heat: 0,  dmg: 0,     minR: 0, shortR: 5,  medR: 10, longR: 15, needsAmmo: false, es: 'TAG' },

    // ── Melee / Misc ──
    'hatchet':           { heat: 0,  dmg: '?', minR: 0, shortR: 0,  medR: 0,  longR: 0, needsAmmo: false, es: 'Hacha' },
    'sword':             { heat: 0,  dmg: '?', minR: 0, shortR: 0,  medR: 0,  longR: 0, needsAmmo: false, es: 'Espada' },
};



// ── Critical Hit Effects Description ─────────────
export const CRIT_EFFECTS = {
    engine: [
        '1 impacto: +5 Calor por turno',
        '2 impactos: +10 Calor por turno',
        '3 impactos: Mech DESTRUIDO',
    ],
    gyro: [
        '1 impacto: Modificador +3 al Pilotaje',
        '2 impactos: Mech DESTRUIDO',
    ],
    sensor: [
        '1 impacto: +3 al Disparo en todos los ataques',
        '2 impactos: NO PUEDE DISPARAR',
    ],
    lifesupport: [
        '1 impacto: Piloto sufre 1 daño cada turno si el calor es ≥ 15',
    ],
};

// ── Heat Effects Table ───────────────────────────
export const HEAT_EFFECTS = [
    { level: 30, effects: ['Apagado (Shutdown)'] },
    { level: 28, effects: ['Expl. Munición, evitar con 8+'] },
    { level: 26, effects: ['Apagado, evitar con 10+'] },
    { level: 25, effects: ['-5 Puntos de Movimiento'] },
    { level: 24, effects: ['+4 Modificador al Disparo'] },
    { level: 23, effects: ['Expl. Munición, evitar con 6+'] },
    { level: 22, effects: ['Apagado, evitar con 8+'] },
    { level: 20, effects: ['-4 Puntos de Movimiento'] },
    { level: 19, effects: ['Expl. Munición, evitar con 4+'] },
    { level: 18, effects: ['Apagado, evitar con 6+'] },
    { level: 17, effects: ['+3 Modificador al Disparo'] },
    { level: 15, effects: ['-3 Puntos de Movimiento'] },
    { level: 14, effects: ['Apagado, evitar con 4+'] },
    { level: 13, effects: ['+2 Modificador al Disparo'] },
    { level: 10, effects: ['-2 Puntos de Movimiento'] },
    { level: 8,  effects: ['+1 Modificador al Disparo'] },
    { level: 5,  effects: ['-1 Puntos de Movimiento'] },
];

// ── Hit Location Table (2d6) ─────────────────────
export const HIT_LOCATION_TABLE = [
    { roll: 2,  left: 'LT (Crítico)', front: 'CT (Crítico)', right: 'RT (Crítico)', rear: 'CT (Crítico)' },
    { roll: 3,  left: 'PI',        front: 'BD',        right: 'PD',         rear: 'BD' },
    { roll: 4,  left: 'BI',        front: 'BD',        right: 'BD',         rear: 'BD' },
    { roll: 5,  left: 'PI',        front: 'PD',        right: 'PD',         rear: 'PD' },
    { roll: 6,  left: 'BI',        front: 'TD',        right: 'BD',         rear: 'TD' },
    { roll: 7,  left: 'TI',        front: 'TC',        right: 'TD',         rear: 'TC' },
    { roll: 8,  left: 'TC',        front: 'TI',        right: 'TC',         rear: 'TI' },
    { roll: 9,  left: 'PD',        front: 'PI',        right: 'PI',         rear: 'PI' },
    { roll: 10, left: 'BD',        front: 'BI',        right: 'BI',         rear: 'BI' },
    { roll: 11, left: 'PD',        front: 'BI',        right: 'PI',         rear: 'BI' },
    { roll: 12, left: 'CB',        front: 'CB',        right: 'CB',         rear: 'CB' },
];

// ── Penalties ────────────────────────────────────

export function calculatePenalties(heat) {
    let mpPenalty = 0;
    if      (heat >= 25) mpPenalty = 5;
    else if (heat >= 20) mpPenalty = 4;
    else if (heat >= 15) mpPenalty = 3;
    else if (heat >= 10) mpPenalty = 2;
    else if (heat >= 5)  mpPenalty = 1;

    let shootPenalty = 0;
    if      (heat >= 24) shootPenalty = 4;
    else if (heat >= 17) shootPenalty = 3;
    else if (heat >= 13) shootPenalty = 2;
    else if (heat >= 8)  shootPenalty = 1;

    return { mpPenalty, shootPenalty };
}

export function calculateNetHeat(base, weaponHeat, moveHeat, heatDissipation, engineHits = 0) {
    const enginePenalty = engineHits * 5; // Each engine crit = +5 heat
    let net = base + weaponHeat + moveHeat + enginePenalty - heatDissipation;
    return Math.max(0, Math.min(30, net));
}

/**
 * Pure weapon heat calculation.
 * @param {number[]} activeWeaponHeats - array of heat values from fired weapons
 * @returns {number} total weapon heat
 */
export function getWeaponHeat(activeWeaponHeats = []) {
    return activeWeaponHeats.reduce((sum, h) => sum + h, 0);
}

/**
 * Resolve end-of-turn heat.
 * Still mutates state (kept for backward compat), returns new base heat.
 */
export function resolveTurn(netHeat) {
    setBaseHeat(netHeat);
    setMoveHeat(0);
    return getBaseHeat();
}

export function useAmmo(index) {
    const mech = getCurrentMech();
    if (!mech || !mech.ammo[index]) return null;
    const slot = mech.ammo[index];
    if (slot.current > 0) slot.current--;
    return { current: slot.current, max: slot.max };
}

export function refundAmmo(index) {
    const mech = getCurrentMech();
    if (!mech || !mech.ammo[index]) return null;
    const slot = mech.ammo[index];
    if (slot.current < slot.max) slot.current++;
    return { current: slot.current, max: slot.max };
}



/**
 * Get a list of weapon names that are critically damaged (destroyed).
 * Returns an array of { name, loc } of destroyed weapons.
 */
export function getDestroyedWeapons(mech, critDamage) {
    const destroyed = [];
    if (!mech || !mech.criticals) return destroyed;
    for (const [loc, slots] of Object.entries(mech.criticals)) {
        const locDestroyed = mech.locations[loc]?.s <= 0;
        slots.forEach((slotName, i) => {
            const isDamaged = locDestroyed || (critDamage[loc]?.[i] ?? false);
            if (!isDamaged || !slotName) return;
            const name = slotName.toLowerCase();
            // Check if this slot name matches any weapon in the DB
            for (const key of Object.keys(WEAPON_DB)) {
                if (name.replace(/-/g, ' ').includes(key)) {
                    destroyed.push({ name: slotName, loc, dbKey: key });
                    break;
                }
            }
            // Also check for ammo
            if (name.includes('ammo') || name.includes('munic')) {
                destroyed.push({ name: slotName, loc, isAmmo: true });
            }
        });
    }
    return destroyed;
}

// ═══════════════════════════════════════════════════
//  HEAT GENERATION — Pure calculation
// ═══════════════════════════════════════════════════

/**
 * Calculate heat generated in a single turn.
 * @param {Array<{heat:number}>} weaponsFired - weapons activated this turn
 * @param {number} moveHeat   - 0 (stationary), 1 (walk), 2 (run), or jumpMP (jump)
 * @param {number} engineHits - number of engine critical hits (+5 heat each)
 * @returns {number} total heat generated (before sinking)
 */
export function calculateHeatGenerated(weaponsFired = [], moveHeat = 0, engineHits = 0) {
    const weaponHeat = weaponsFired.reduce((sum, w) => sum + (w.heat || 0), 0);
    const enginePenalty = engineHits * 5;
    return weaponHeat + moveHeat + enginePenalty;
}

// ═══════════════════════════════════════════════════
//  MOVEMENT PENALTY — Pure lookup from heat level
// ═══════════════════════════════════════════════════

/**
 * Get the movement-point penalty caused by current heat.
 * BattleTech standard table:  5→-1, 10→-2, 15→-3, 20→-4, 25→-5.
 * @param {number} currentHeat
 * @returns {number} MP reduction (always ≥ 0)
 */
export function getMovementPenalty(currentHeat) {
    if (currentHeat >= 25) return 5;
    if (currentHeat >= 20) return 4;
    if (currentHeat >= 15) return 3;
    if (currentHeat >= 10) return 2;
    if (currentHeat >= 5)  return 1;
    return 0;
}

// ═══════════════════════════════════════════════════
//  SHUTDOWN RISK — Pure lookup from heat level
// ═══════════════════════════════════════════════════

/**
 * Determine shutdown risk at the given heat level.
 * @param {number} currentHeat
 * @returns {{ mustShutdown: boolean, avoidOn: number|null }}
 *   mustShutdown = true at heat 30 (automatic, no roll)
 *   avoidOn = target number on 2d6 to avoid shutdown (null if no risk)
 */
export function getShutdownRisk(currentHeat) {
    if (currentHeat >= 30) return { mustShutdown: true,  avoidOn: null };
    if (currentHeat >= 26) return { mustShutdown: false, avoidOn: 10 };
    if (currentHeat >= 22) return { mustShutdown: false, avoidOn: 8 };
    if (currentHeat >= 18) return { mustShutdown: false, avoidOn: 6 };
    if (currentHeat >= 14) return { mustShutdown: false, avoidOn: 4 };
    return { mustShutdown: false, avoidOn: null };
}

// ═══════════════════════════════════════════════════
//  AMMO EXPLOSION RISK — Pure lookup from heat level
// ═══════════════════════════════════════════════════

/**
 * Determine ammo-explosion risk at the given heat level.
 * @param {number} currentHeat
 * @returns {{ risk: boolean, avoidOn: number|null }}
 *   risk = true if there is any explosion chance
 *   avoidOn = target number on 2d6 to avoid explosion (null if no risk)
 */
export function getAmmoExplosionRisk(currentHeat) {
    if (currentHeat >= 28) return { risk: true, avoidOn: 8 };
    if (currentHeat >= 23) return { risk: true, avoidOn: 6 };
    if (currentHeat >= 19) return { risk: true, avoidOn: 4 };
    return { risk: false, avoidOn: null };
}

// ═══════════════════════════════════════════════════
//  DAMAGE TRANSFER — BattleTech location chain
// ═══════════════════════════════════════════════════

/**
 * Get the location that receives overflow damage when `location` is destroyed.
 * Arms → side torso, Legs → side torso, Side torsos → CT, CT → null (mech dead).
 * @param {string} location - locKey (e.g. 'la', 'ct')
 * @returns {string|null} next location key, or null if mech is destroyed
 */
export function getDamageTransferLocation(location) {
    return DAMAGE_TRANSFER[location] ?? null;
}

// ═══════════════════════════════════════════════════
//  TAKE DAMAGE — Pure damage application
// ═══════════════════════════════════════════════════

/**
 * Apply damage to a mech location following BattleTech rules:
 *   1. Subtract from armor (front or rear).
 *   2. Remaining damage goes to internal structure.
 *   3. If structure reaches 0, location is destroyed → transfer overflow.
 *
 * This is a **pure function**: it does NOT mutate the input objects.
 * It returns a new state snapshot that the caller can apply.
 *
 * @param {object} locations   - deep copy of mech.locations
 *     Each loc: { a: number, aRear: number, s: number, ... }
 * @param {string} location    - locKey being hit (e.g. 'lt')
 * @param {number} amount      - raw damage
 * @param {boolean} [isRear=false] - true if the hit is on the rear arc
 * @returns {{
 *   locations: object,           - updated locations snapshot
 *   log: Array<{loc,event,value}>, - ordered list of damage events
 *   mechDestroyed: boolean       - true if CT structure reaches 0
 * }}
 */
export function takeDamage(locations, location, amount, isRear = false) {
    // Deep-clone so we never mutate the input
    const locs = JSON.parse(JSON.stringify(locations));
    const log = [];
    let remaining = amount;
    let currentLoc = location;

    while (remaining > 0 && currentLoc !== null) {
        const loc = locs[currentLoc];
        if (!loc) break;

        // ─── Step 1: Armor ───────────────────────────
        const armorKey = (isRear && loc.aRear !== undefined && ['ct','lt','rt'].includes(currentLoc))
            ? 'aRear'
            : 'a';

        if (loc[armorKey] > 0) {
            const absorbed = Math.min(loc[armorKey], remaining);
            loc[armorKey] -= absorbed;
            remaining -= absorbed;
            log.push({ loc: currentLoc, event: armorKey === 'aRear' ? 'rear_armor' : 'armor', value: absorbed });
        }

        // Nothing left after armor — stop
        if (remaining <= 0) break;

        // ─── Step 2: Internal Structure ──────────────
        if (loc.s > 0) {
            // Damage has breached armor → flag for critical hit check
            log.push({ loc: currentLoc, event: 'critical_check', value: null });

            const absorbed = Math.min(loc.s, remaining);
            loc.s -= absorbed;
            remaining -= absorbed;
            log.push({ loc: currentLoc, event: 'structure', value: absorbed });
        }

        // ─── Step 3: Destruction & Transfer ──────────
        if (loc.s <= 0) {
            log.push({ loc: currentLoc, event: 'destroyed', value: null });

            // Check if mech is destroyed (CT gone or head gone)
            if (currentLoc === 'ct' || currentLoc === 'h') {
                return { locations: locs, log, mechDestroyed: true };
            }

            // Transfer remaining damage along the chain
            currentLoc = getDamageTransferLocation(currentLoc);
            isRear = false; // transferred damage always hits front

            if (currentLoc) {
                log.push({ loc: currentLoc, event: 'transfer_in', value: remaining });
            }
        } else {
            // Structure survived — no more transfer
            break;
        }
    }

    return { locations: locs, log, mechDestroyed: false };
}

// ═══════════════════════════════════════════════════
//  AMMO EXPLOSION DAMAGE CALCULATION
// ═══════════════════════════════════════════════════

export function getAmmoExplosionDamage(ammoName, shotsLeft) {
    const name = ammoName.toLowerCase();
    
    // Gauss ammo does not explode (weapon does, but not the ammo itself)
    if (name.includes('gauss')) return 0;
    
    let dmgPerShot = 0;
    if (name.includes('srm 6')) dmgPerShot = 12;
    else if (name.includes('srm 4')) dmgPerShot = 8;
    else if (name.includes('srm 2')) dmgPerShot = 4;
    else if (name.includes('lrm 20')) dmgPerShot = 20;
    else if (name.includes('lrm 15')) dmgPerShot = 15;
    else if (name.includes('lrm 10')) dmgPerShot = 10;
    else if (name.includes('lrm 5'))  dmgPerShot = 5;
    else if (name.includes('ac/20') || name.includes('ac 20')) dmgPerShot = 20;
    else if (name.includes('ac/10') || name.includes('ac 10')) dmgPerShot = 10;
    else if (name.includes('ac/5') || name.includes('ac 5'))  dmgPerShot = 5;
    else if (name.includes('ac/2') || name.includes('ac 2'))  dmgPerShot = 2;
    else if (name.includes('machine gun') || name.includes('mg')) dmgPerShot = 2;
    
    // Check regex for MML / ATM
    let match;
    if ((match = name.match(/mml\s*(\d+)/))) dmgPerShot = parseInt(match[1]) * 2;
    if ((match = name.match(/atm\s*(\d+)/))) dmgPerShot = parseInt(match[1]) * 3;
    
    // Fallback if not recognized but it's ammo
    if (dmgPerShot === 0) dmgPerShot = 5; 
    
    return dmgPerShot * shotsLeft;
}
