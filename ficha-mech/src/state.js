// ═══════════════════════════════════════════════════
//  src/state.js — Estado global del Mech + Pub/Sub
// ═══════════════════════════════════════════════════

// ── Pub/Sub Event System ─────────────────────────
const _listeners = {};

/**
 * Subscribe to a state event.
 * @param {string} event  Event name
 * @param {Function} fn   Callback receiving event data
 * @returns {Function} Unsubscribe function
 */
export function subscribe(event, fn) {
    if (!_listeners[event]) _listeners[event] = [];
    _listeners[event].push(fn);
    return () => {
        _listeners[event] = _listeners[event].filter(f => f !== fn);
    };
}

/**
 * Notify all subscribers of a state event.
 * @param {string} event  Event name
 * @param {*} data        Payload
 */
export function notify(event, data) {
    (_listeners[event] || []).forEach(fn => fn(data));
}

// ── State ────────────────────────────────────────

/** @type {object|null} Objeto mech parseado */
let currentMech = null;

/** Calor residual acumulado */
let baseHeat = 0;

/** Calor por movimiento */
let moveHeat = 0;

/** Datos del piloto */
let pilot = {
    gunnery: 4,
    piloting: 5,
    hits: 0,
};

/** Estado de críticos marcados: { locKey: [false, false, ...] } */
let criticalDamage = {};

/** Tracking de sistemas vitales */
let systemHits = {
    engine: 0,    // max 3
    gyro: 0,      // max 2
    sensor: 0,    // max 2
    lifesupport: 0, // max 1
};

// ── Getters ──
export function getCurrentMech()  { return currentMech; }
export function getBaseHeat()     { return baseHeat; }
export function getMoveHeat()     { return moveHeat; }
export function getPilot()        { return pilot; }
export function getCriticalDamage() { return criticalDamage; }
export function getSystemHits()   { return systemHits; }

// ── Setters (with notifications) ──

export function setCurrentMech(mech) {
    currentMech = mech;
    notify('mech-loaded', mech);
}

export function setBaseHeat(value) {
    baseHeat = value;
    notify('heat-changed', { baseHeat: value, moveHeat });
}

export function setMoveHeat(value) {
    moveHeat = value;
    notify('heat-changed', { baseHeat, moveHeat: value });
}

export function setPilot(data) {
    pilot = { ...pilot, ...data };
}

export function initCriticalDamage(criticals) {
    criticalDamage = {};
    for (const [loc, slots] of Object.entries(criticals)) {
        criticalDamage[loc] = slots.map(() => false);
    }
}

export function toggleCriticalSlot(loc, index) {
    if (criticalDamage[loc]) {
        criticalDamage[loc][index] = !criticalDamage[loc][index];
        notify('crit-toggled', { loc, index, damaged: criticalDamage[loc][index] });
    }
}

export function setSystemHit(system, value) {
    systemHits[system] = value;
    notify('system-changed', { system, value });
}

export function resetSystemHits() {
    systemHits = { engine: 0, gyro: 0, sensor: 0, lifesupport: 0 };
}

// ── Armor / Structure Mutators ───────────────────

/**
 * Set armor value for a location. Mutates mech.locations[locKey].a
 * @param {string} locKey   Location key (h, ct, lt, rt, la, ra, ll, rl)
 * @param {number} value    New armor value
 * @param {boolean} isRear  Whether this is rear armor
 */
export function setArmor(locKey, value, isRear = false) {
    if (!currentMech) return;
    const loc = currentMech.locations[locKey];
    if (!loc) return;
    if (isRear) {
        loc.aRear = Math.max(0, value);
    } else {
        loc.a = Math.max(0, value);
    }
    notify('armor-changed', { locKey, isRear, value: isRear ? loc.aRear : loc.a });
}

/**
 * Set internal structure value for a location.
 * @param {string} locKey  Location key
 * @param {number} value   New structure value
 */
export function setStructure(locKey, value) {
    if (!currentMech) return;
    const loc = currentMech.locations[locKey];
    if (!loc) return;
    loc.s = Math.max(0, value);
    notify('armor-changed', { locKey, isStructure: true, value: loc.s });
}

/**
 * Applies a full snapshot of location damage (e.g. from takeDamage)
 * and notifies listeners.
 * @param {object} newLocations 
 */
export function applyDamageSnapshot(newLocations) {
    if (!currentMech) return;
    currentMech.locations = newLocations;
    Object.keys(newLocations).forEach(locKey => {
        notify('armor-changed', { locKey, isStructure: true, value: newLocations[locKey].s });
        notify('armor-changed', { locKey, isRear: false, value: newLocations[locKey].a });
        notify('armor-changed', { locKey, isRear: true, value: newLocations[locKey].aRear });
    });
}
