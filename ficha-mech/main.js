// ═══════════════════════════════════════════════════
//  main.js — Punto de entrada de la aplicación
// ═══════════════════════════════════════════════════

import './style.css';

import {
    setCurrentMech, setBaseHeat, setMoveHeat,
    initCriticalDamage, resetSystemHits,
} from './src/state.js';

import { handleFileUpload, parseMTF, parseSSW } from './src/parserMTF.js';
import { resolveTurn }      from './src/mechanics.js';

import {
    initHeatScale,
    initReactiveBindings,
    renderOverview,
    renderPilotHits,
    renderWeaponsTable,
    renderAmmoTable,
    renderHitLocationTable,
    renderArmorDiagram,
    renderInternalStructure,
    renderSystemHits,
    renderCriticalHitTable,
    updateHeatMath,
    updatePenaltiesAndMovement,
    setMovement,
} from './src/ui.js';

// ── Initialize static UI ─────────────────────────
initHeatScale();
renderHitLocationTable();
renderPilotHits();
renderSystemHits();

// ── Wire reactive state → UI bindings ────────────
initReactiveBindings();

// ── Check localStorage for Campaign bridge ───────
window.addEventListener('DOMContentLoaded', () => {
    const sharedMtf = localStorage.getItem('sharedMtfFile');
    const sharedFileName = localStorage.getItem('sharedMtfFileName') || '';
    if (sharedMtf) {
        try {
            const isSSW = sharedFileName.toLowerCase().endsWith('.ssw');
            const mech = isSSW ? parseSSW(sharedMtf) : parseMTF(sharedMtf);
            loadMech(mech);
            console.log("Mech cargado con éxito desde el Generador de Campaña.");
        } catch (e) {
            console.error("Error al cargar el mech desde localStorage:", e);
        }
    }
});

// ── File Upload ──────────────────────────────────
document.getElementById('mtf-upload').addEventListener('change', (event) => {
    handleFileUpload(event, loadMech);
});

/**
 * Load a parsed mech into the full UI.
 */
function loadMech(mech) {
    // State
    setCurrentMech(mech);
    setBaseHeat(0);
    setMoveHeat(0);
    initCriticalDamage(mech.criticals);
    resetSystemHits();

    // Show containers
    document.getElementById('mech-banner').classList.remove('hidden');
    document.getElementById('app-container').classList.remove('hidden');

    // Banner
    document.getElementById('mech-name').innerText = mech.chassis;
    document.getElementById('mech-variant').innerText = mech.variant;
    document.getElementById('mech-info').innerText =
        `${mech.name} | ${mech.tonnage}t`;

    // Reset checkboxes
    document.getElementById('chk-shutdown').checked = false;
    document.getElementById('chk-prone').checked = false;

    // Render all sections
    renderOverview(mech);
    renderWeaponsTable(mech);
    renderAmmoTable(mech);
    renderArmorDiagram(mech);
    renderInternalStructure(mech);
    renderCriticalHitTable(mech);

    // Movement + Heat
    updatePenaltiesAndMovement();
    setMovement(0, document.getElementById('btn-move-0'));
    updateHeatMath();
}

// ── Movement Buttons ─────────────────────────────
document.getElementById('btn-move-0').addEventListener('click', function () {
    setMovement(0, this);
});
document.getElementById('btn-move-1').addEventListener('click', function () {
    setMovement(1, this);
});
document.getElementById('btn-move-2').addEventListener('click', function () {
    setMovement(2, this);
});
document.getElementById('btn-move-3').addEventListener('click', function () {
    const jumpHeat = parseInt(this.dataset.jumpHeat, 10) || 3;
    setMovement(jumpHeat, this);
});

// ── Resolve Heat Phase ───────────────────────────
document.getElementById('btn-resolve').addEventListener('click', () => {
    const netHeat = parseInt(document.getElementById('math-net').innerText, 10);
    resolveTurn(netHeat);

    // Deactivate all weapons
    document.querySelectorAll('.btn-toggle.active').forEach(btn => {
        btn.classList.remove('active');
        btn.innerText = '—';
    });

    // Update UI
    updatePenaltiesAndMovement();
    setMovement(0, document.getElementById('btn-move-0'));
    updateHeatMath();
});
