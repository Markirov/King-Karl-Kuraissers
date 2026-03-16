document.addEventListener('DOMContentLoaded', poblarDesplegablesArmasBarracones);

        // --- FUNCIONES DE INTERACTIVIDAD ---
        function toggleBox(element) {
            element.classList.toggle('checked');
            const isChecked = element.classList.contains('checked');
            const modifier = isChecked ? 1 : -1; 

            if (element.classList.contains('hp-box')) return;

            const row = element.closest('tr');
            if (row) {
                const levelCell = row.querySelector('.skill-level-col');
                const rollCell = row.querySelector('.skill-roll-col'); 
                const attrCell = row.querySelector('.skill-attr-col'); 

                if (levelCell) {
                    let baseLevel = 0;
                    let currentLevel = 0;
                                const input = levelCell.querySelector('input');
                    const checkedCount = row.querySelectorAll('.chk-box.checked').length;

                    if (input) {
                        let val = parseInt(input.value) || 0;
                        input.value = val + modifier;
                        currentLevel = val + modifier;
                    } else {
                        baseLevel = parseInt(levelCell.getAttribute('data-base')) || 0;
                        currentLevel = baseLevel + checkedCount;
                        levelCell.innerText = currentLevel;
                    }

                    if (rollCell && attrCell) {
                        const currentAttrAvg = parseInt(attrCell.innerText) || 0;
                        if (currentAttrAvg > 0) {
                            rollCell.innerText = currentAttrAvg - currentLevel;
                            rollCell.style.color = (checkedCount > 0) ? "#007bff" : "#333";
                        }
                    }

                    const xpInput = document.getElementById('sheet-xp-avail');
                    if(xpInput) {
                        let currentXP = parseInt(xpInput.value) || 0;
                        let cost = 0;

                        if(isChecked) {
                            cost = XP_LEVEL_COSTS[checkedCount] || 0;
                            currentXP -= cost;
                        } else {
                            cost = XP_LEVEL_COSTS[checkedCount + 1] || 0;
                            currentXP += cost;
                        }
                                        xpInput.value = currentXP;
                    }
                }
                return;
            }

            const attrBox = element.closest('.attr-box');
            if (attrBox) {
                const valDiv = attrBox.querySelector('.attr-value');
                if (valDiv) {
                    let val = parseInt(valDiv.innerText) || 0;
                    valDiv.innerText = val + modifier;
                    valDiv.style.color = (isChecked) ? "#007bff" : "#333";
                }

                recalcularTodasLasTiradas();
            }
        }

        function recalcularTodasLasTiradas() {
            const sStr = parseInt(document.getElementById('attr-str').innerText) || 0;
            const sDex = parseInt(document.getElementById('attr-dex').innerText) || 0;
            const sInt = parseInt(document.getElementById('attr-int').innerText) || 0;
            const sCha = parseInt(document.getElementById('attr-cha').innerText) || 0;
                const newAvg = Math.round((sStr + sDex + sInt + sCha) / 4);

            const skillRows = document.querySelectorAll('.skill-table tbody tr');
            skillRows.forEach(r => {
                const rLevelCell = r.querySelector('.skill-level-col');
                const rAttrCell = r.querySelector('.skill-attr-col');
                const rRollCell = r.querySelector('.skill-roll-col');

                if (rLevelCell && rAttrCell && rRollCell) {
                    rAttrCell.innerText = newAvg;
                    let rLvl = 0;
                    const rInput = rLevelCell.querySelector('input');
                    if (rInput) rLvl = parseInt(rInput.value) || 0;
                    else rLvl = parseInt(rLevelCell.innerText) || 0;

                    const newRoll = newAvg - rLvl;
                    rRollCell.innerText = newRoll;
                    rAttrCell.style.color = "#007bff";
                }
            });
        }

        function changeCampaign() {
            const selector = document.getElementById('campaign-select');
            currentCampaign = selector.value;
            const factionSelect = document.getElementById('faction-select');
            if (currentCampaign === 'ELH') { factionSelect.value = "Mercenario (Unidad Mercenaria)"; factionSelect.disabled = true; } 
            else { factionSelect.disabled = false; }
            const mechModSelect = document.getElementById('mech-mod-select');
            const mechRollBtn = document.getElementById('btn-mech-roll');
            resetMechDisplay();
            if (currentCampaign === 'ELH') {
                mechRollBtn.innerText = "🎲 Tirar";
                mechModSelect.innerHTML = `<option value="-2">-2 (+20 pts)</option><option value="-1">-1 (+10 pts)</option><option value="0" selected>0 (0 pts)</option><option value="1">+1 (-10 pts)</option><option value="2">+2 (-20 pts)</option>`;
            } else {
                mechRollBtn.innerText = "🎲 Tirar";
                mechModSelect.innerHTML = `<option value="-3">-3 (+30 pts)</option><option value="-2">-2 (+20 pts)</option><option value="-1">-1 (+10 pts)</option><option value="0" selected>0 (0 pts)</option><option value="1">+1 (-10 pts)</option><option value="2">+2 (-20 pts)</option><option value="3">+3 (-30 pts)</option>`;
            }
            updatePoints();
        }
        function resetMechDisplay() {
            currentMechRoll = 0;
            document.getElementById('mech-result').innerText = "Sin asignar...";
            document.getElementById('hidden-mech-model').value = "";
            document.getElementById('hidden-mech-tons').value = "";
            updatePoints(); 
        }

        function calcularPuntosTotales() {
            let totalPoints = 150;
            let sStr = document.getElementById('select-str').value; if (sStr) totalPoints -= COSTS_STR[sStr] || 0;
            let sDex = document.getElementById('select-dex').value; if (sDex) totalPoints -= COSTS_DEX[sDex] || 0;
            let sInt = document.getElementById('select-int').value; if (sInt) totalPoints -= COSTS_INT[sInt] || 0;
            let sCha = document.getElementById('select-cha').value; if (sCha) totalPoints -= COSTS_CHA[sCha] || 0;
            let sStudy = document.getElementById('estudios-select').value; if (sStudy) totalPoints -= STUDY_COSTS[sStudy] || 0;
            let sMechMod = parseInt(document.getElementById('mech-mod-select').value) || 0; totalPoints -= (sMechMod * 10);
                for (let i = 1; i <= MAX_TRAITS; i++) {
                let mVal = document.getElementById('merit-select-' + i).value; if (mVal) totalPoints -= MERIT_COSTS[mVal] || 0;
                let dVal = document.getElementById('demerit-select-' + i).value; if (dVal) totalPoints += DEMERIT_COSTS[dVal] || 0;
            }
            for (let i = 1; i <= 3; i++) {
                let row = document.getElementById('skill-row-' + i);
                if (row.style.display !== 'none') {
                    let sLvl = parseInt(document.getElementById('extra-skill-level-' + i).value) || 0;
                    if (sLvl > 0) totalPoints -= SKILL_BUY_COSTS[sLvl]; 
                }
            }
            return totalPoints;
        }
        function handleTraitChange(selectElement) {
            const isMerit = selectElement.id.startsWith('merit');
            const prefix = isMerit ? 'merit-select-' : 'demerit-select-';
            let idsToCheck = []; for(let i=1; i<=MAX_TRAITS; i++) idsToCheck.push(prefix+i);
            const otherIds = idsToCheck.filter(id => id !== selectElement.id);
            const currentValue = selectElement.value;
            if (currentValue) {
                let isDuplicate = false;
                for (const id of otherIds) { if (document.getElementById(id).value === currentValue) { isDuplicate = true; break; } }
                if (isDuplicate) { alert("No puedes seleccionar '" + currentValue + "' dos veces."); selectElement.value = ""; }
            }
            updatePoints();
        }

        function getSkillsFromStudy(study, nobleSkill) {
            let skills = [];
            if (study === "Academia de Oficiales") skills = [ {n:"Pilotar Mech",v:"2",c:"DES"}, {n:"Disparo Mech",v:"2",c:"DES"}, {n:"Técnica Mech",v:"2",c:"INT"}, {n:"Pistola",v:"1",c:"DES"}, {n:"Tácticas",v:"2",c:"INT"}, {n:"Rifle",v:"1",c:"DES"}, {n:"Astronavegación",v:"1",c:"INT"} ];
            else if (study === "Academia de Combate") skills = [ {n:"Pilotar Mech",v:"2",c:"DES"}, {n:"Disparo Mech",v:"2",c:"DES"}, {n:"Técnica Mech",v:"2",c:"INT"}, {n:"Pistola",v:"1",c:"DES"}, {n:"Liderazgo",v:"1",c:"CAR"}, {n:"Supervivencia",v:"1",c:"INT"} ];
            else if (study === "Tutores Nobles") { let nName = nobleSkill === "Equitacion" ? "Equitación" : nobleSkill; skills = [ {n:"Pilotar Mech",v:"3",c:"DES"}, {n:"Disparo Mech",v:"2",c:"DES"}, {n:"Técnica Mech",v:"1",c:"INT"}, {n:"Pistola",v:"1",c:"DES"}, {n:"Admin. de Feudo",v:"2",c:"INT"}, {n:nName,v:"1",c:"DES"} ]; }
            else if (study === "Autodidacta") skills = [ {n:"Pilotar Mech",v:"3",c:"DES"}, {n:"Disparo Mech",v:"1",c:"DES"}, {n:"Técnica Mech",v:"2",c:"INT"}, {n:"Rifle",v:"1",c:"DES"}, {n:"Supervivencia",v:"1",c:"INT"} ];
            return skills;
        }

        function getPackageSkillNames(study, nobleSkill) { return getSkillsFromStudy(study, nobleSkill).map(s => s.n); }
        function updatePoints() { let pts = calcularPuntosTotales(); let div = document.getElementById('points-val'); div.innerText = pts; div.className = pts >= 0 ? "points-ok" : "points-bad"; updateMechDisplay(); }

        function rollMech() {
            if (currentCampaign === 'ELH') currentMechRoll = Math.floor(Math.random() * 16) + 1;
            else { let d1 = Math.floor(Math.random() * 6) + 1; let d2 = Math.floor(Math.random() * 6) + 1; currentMechRoll = d1 + d2; }
            updateMechDisplay();
        }

        function updateMechDisplay() {
            if (currentMechRoll === 0) return;
            let mod = parseInt(document.getElementById('mech-mod-select').value) || 0;
            let final = currentMechRoll + mod;
            let data = null;
            if (currentCampaign === 'ELH') { if (final < 1) final = 1; if (final > 16) final = 16; data = MECH_TABLE_ELH[final]; }
            else { if (final < -1) final = -1; if (final > 15) final = 15; data = MECH_TABLE_IS[final.toString()]; }
            if (data) {
                document.getElementById('mech-result').innerHTML = `Tirada: ${currentMechRoll} (${mod>=0?'+'+mod:mod}) = <strong>${final}</strong><br>Asignado: <strong>${data.model}</strong> (${data.tons} Tons)`;
                document.getElementById('hidden-mech-model').value = data.model; document.getElementById('hidden-mech-tons').value = data.tons;
            } else { document.getElementById('mech-result').innerHTML = "Error en tabla"; }
        }

        function filterDemerits() {
            const study = document.getElementById('estudios-select').value; const isAutodidacta = (study === 'Autodidacta');
            for (let i = 1; i <= MAX_TRAITS; i++) {
                const select = document.getElementById('demerit-select-' + i); const options = select.options;
                for (let j = 0; j < options.length; j++) {
                    const option = options[j];
                    if (option.value === "Ineptitud Marcial") {
                        if (isAutodidacta) { option.style.display = 'none'; option.disabled = true; if (select.value === "Ineptitud Marcial") select.value = ""; } 
                        else { option.style.display = 'block'; option.disabled = false; }
                    }
                }
            }
        }

        function filterMerits() {
            const study = document.getElementById('estudios-select').value; const isTutoresNobles = (study === 'Tutores Nobles');
            for (let i = 1; i <= MAX_TRAITS; i++) {
                const select = document.getElementById('merit-select-' + i); const options = select.options;
                for (let j = 0; j < options.length; j++) {
                    const option = options[j];
                    if (option.value === "Nobleza baja") {
                        if (isTutoresNobles) { option.style.display = 'none'; option.disabled = true; if (select.value === "Nobleza baja") select.value = ""; } 
                        else { option.style.display = 'block'; option.disabled = false; }
                    }
                }
            }
        }

        function checkEstudios() {
            var s = document.getElementById('estudios-select'); var div = document.getElementById('opcion-noble-div');
            let specialMerit = document.getElementById('special-merit-field');
            let specialDemerit = document.getElementById('special-demerit-field');
            specialMerit.innerText = ""; specialDemerit.innerText = "";

            if (s.value === 'Tutores Nobles') { 
                div.style.display = 'block'; 
                specialMerit.innerText = "(Formación) Nobleza baja"; 
            } else { 
                div.style.display = 'none'; 
                document.getElementById('noble-skill-select').value = ""; 
            }
                if (s.value === 'Autodidacta') { specialDemerit.innerText = "(Formación) Ineptitud Marcial"; }
                filterDemerits(); filterMerits(); updatePoints(); rellenarSelectoresCompra();
        }
        function actualizarSlotsHabilidades() {
            let intVal = parseInt(document.getElementById('select-int').value) || 0;
            let slots = (intVal >= 9) ? 3 : (intVal === 8) ? 2 : (intVal === 7) ? 1 : 0;
            for (let i = 1; i <= 3; i++) {
                let row = document.getElementById('skill-row-' + i);
                let selectName = document.getElementById('extra-skill-select-' + i);
                let selectLevel = document.getElementById('extra-skill-level-' + i);
                if (i <= slots) { row.style.display = 'grid'; } 
                else { row.style.display = 'none'; if (selectName.value !== "" || selectLevel.value !== "") { selectName.value = ""; selectLevel.value = ""; } }
            }
            updatePoints();
        }

        function actualizarEstudios() {
            var intVal = parseInt(document.getElementById('select-int').value); var sel = document.getElementById('estudios-select');
            actualizarSlotsHabilidades();
            if (isNaN(intVal)) { sel.disabled = true; sel.value = ""; updatePoints(); return; }
            sel.disabled = false; var reqs = { "Academia de Oficiales": 8, "Academia de Combate": 6, "Tutores Nobles": 6, "Autodidacta": 5 };
            var opts = sel.querySelectorAll("option:not([value=''])");
            opts.forEach(function(opt) {
                if (intVal >= reqs[opt.value]) { opt.style.display = 'block'; opt.disabled = false; } 
                else { opt.style.display = 'none'; opt.disabled = true; if (sel.value === opt.value) sel.value = ""; }
            });
            checkEstudios(); rellenarSelectoresCompra(); 
        }

        function rellenarLevelSelects() {
            for (let i = 1; i <= 3; i++) {
                let select = document.getElementById('extra-skill-level-' + i);
                let defaultOption = document.createElement('option'); defaultOption.value = ""; defaultOption.text = "-- Nivel --"; select.add(defaultOption);
                for (let level = 1; level <= 8; level++) {
                    let cost = SKILL_BUY_COSTS[level]; let option = document.createElement('option'); option.value = level; option.text = `Nivel ${level} (${cost} pts)`; select.add(option);
                }
            }
        }

        function rellenarSelectoresCompra() {
            let currentStudy = document.getElementById('estudios-select').value;
            let currentNobleSkill = document.getElementById('noble-skill-select').value;
            const packageSkills = getPackageSkillNames(currentStudy, currentNobleSkill);
            let eOpts = `<option value="">-- Ninguna --</option>`;
            EXTRA_SKILLS.forEach(skill => { if (!packageSkills.includes(skill)) { eOpts += `<option value="${skill}">${skill}</option>`; } });
            for(let i=1; i<=3; i++) {
                let selector = document.getElementById('extra-skill-select-' + i); let currentValue = selector.value; selector.innerHTML = eOpts;
                if (currentValue && !packageSkills.includes(currentValue)) selector.value = currentValue;
                if (!selector.value) document.getElementById('extra-skill-level-' + i).value = "";
            }
        }
        function tirarAlturaYPeso() {
            var h = Math.floor(Math.random() * 36) + 165; var w = ((h/100) * (h/100)) * 28; 
            document.getElementById('select-altura').value = h + " cm"; document.getElementById('select-peso').value = w.toFixed(1) + " kg";
        }

        function tirarEdadExtra() {
            var edad = Math.floor(Math.random() * 6) + 1;
            document.getElementById('select-edad-roll').value = edad;
        }

        function renderizarPuntosDeVida(strValue) {
            // Usar la función de círculos SVG
            generarPuntosVidaParaFicha(parseInt(strValue) || 0, []);
        }

        // Función legacy - ya no se usa
        function renderHPLocation(locationId, count, layoutType) {
            // Esta función ya no hace nada - los HP se renderizan via SVG
            console.log('renderHPLocation deprecated - using SVG circles');
        }

        // NAVEGACIÓN
        function goToGenerator() {
            document.getElementById('landing-page').style.display = 'none';
            document.getElementById('pre-generacion').style.display = 'block';
            document.getElementById('points-counter').style.display = 'block';
        }

        function goHome() {
            if(confirm("¿Volver al inicio? Se perderán los datos no guardados.")) {
                document.getElementById('landing-page').style.display = 'flex';
                document.getElementById('pre-generacion').style.display = 'none';
                document.getElementById('ficha-container').style.display = 'none';
                document.getElementById('galactic-map').style.display = 'none';
                document.getElementById('trr-infantry').style.display = 'none';
                document.getElementById('trr-utilities').style.display = 'none';
                document.getElementById('mech-hangar').style.display = 'none';
                document.getElementById('vehicle-depot').style.display = 'none';
                document.getElementById('points-counter').style.display = 'none';
            }
        }

        // Función para limpiar información de críticos al navegar
        function clearCriticalInfoDisplays() {
            const vehicleInfo = document.getElementById('critical-info-display');
            const mechInfo = document.getElementById('mech-critical-info-display');
            if (vehicleInfo) vehicleInfo.style.display = 'none';
            if (mechInfo) mechInfo.style.display = 'none';
        }

        function goHomeNoConfirm() {
            clearCriticalInfoDisplays();
            document.getElementById('landing-page').style.display = 'flex';
            document.getElementById('pre-generacion').style.display = 'none';
            document.getElementById('ficha-container').style.display = 'none';
            document.getElementById('galactic-map').style.display = 'none';
            document.getElementById('trr-infantry').style.display = 'none';
            document.getElementById('trr-utilities').style.display = 'none';
            document.getElementById('mech-hangar').style.display = 'none';
            document.getElementById('vehicle-depot').style.display = 'none';
            document.getElementById('barracones').style.display = 'none';
            document.getElementById('points-counter').style.display = 'none';
            // Ocultar barra de herramientas de Barracones
            const toolbar = document.getElementById('barracones-toolbar');
            if (toolbar) toolbar.style.display = 'none';
        }

        function goHomeFromTRR() {
            document.getElementById('landing-page').style.display = 'flex';
            document.getElementById('pre-generacion').style.display = 'none';
            document.getElementById('ficha-container').style.display = 'none';
            document.getElementById('galactic-map').style.display = 'none';
            document.getElementById('trr-infantry').style.display = 'none';
            document.getElementById('trr-utilities').style.display = 'none';
            document.getElementById('mech-hangar').style.display = 'none';
            document.getElementById('vehicle-depot').style.display = 'none';
            document.getElementById('trr-landing').style.display = 'flex';
            document.getElementById('trr-combat').style.display = 'none';
            document.getElementById('trr-weapons').style.display = 'none';
            document.getElementById('points-counter').style.display = 'none';
        }

        // ============================================================================
        // SISTEMA DE CONFIRMACIÓN DE SALIDA CON POPUP
        // ============================================================================
        let exitCallback = null; // Función a ejecutar al confirmar salida
        let currentSection = ''; // Sección actual (para limpiar datos)
        /**
         * Muestra el modal de confirmación de salida
         * @param {string} section - Sección desde la que se sale ('barracones' o 'generador')
         * @param {function} callback - Función a ejecutar al confirmar salida sin guardar
         */
        function showExitModal(section, callback) {
            currentSection = section;
            exitCallback = callback;
                // Personalizar mensaje según la sección
            const messages = {
                'barracones': '¿Salir de Barracones?',
                'generador': '¿Salir del Generador de Personajes?',
                'default': '¿Salir de esta sección?'
            };
                const message = messages[section] || messages['default'];
            document.getElementById('exit-modal-message').innerHTML = 
                message + '<br><span style="color: #ff6b6b; font-size: 0.9em;">Los datos no guardados se perderán</span>';
                // Mostrar modal
            const modal = document.getElementById('exit-confirmation-modal');
            modal.style.display = 'flex';
        }
        /**
         * Guarda en la nube y sale sin mostrar confirmación adicional
         */
        async function confirmExitAndSave() {
            const modal = document.getElementById('exit-confirmation-modal');
            modal.style.display = 'none';
                console.log('💾 Guardando y saliendo...');
                // Determinar qué función de guardado usar según la sección
            if (currentSection === 'barracones') {
                // Guardar en nube desde Barracones
                await guardarEnNubeBarracones();
            } else if (currentSection === 'generador') {
                // Guardar en nube desde Generador
                await guardarEnNube();
            }
                // Limpiar ficha y ejecutar callback de salida
            console.log('🧹 Limpiando datos de', currentSection, '...');
            limpiarFichaSeccion(currentSection);
            console.log('✅ Datos limpiados');
                if (exitCallback) {
                exitCallback();
            }
        }
        /**
         * Sale sin guardar
         */
        function confirmExitWithoutSave() {
            const modal = document.getElementById('exit-confirmation-modal');
            modal.style.display = 'none';
                console.log('🚪 Saliendo sin guardar...');
            console.log('🧹 Limpiando datos de', currentSection, '...');
                // Limpiar ficha y ejecutar callback de salida
            limpiarFichaSeccion(currentSection);
            console.log('✅ Datos limpiados');
                if (exitCallback) {
                exitCallback();
            }
        }
        /**
         * Cancela la salida y cierra el modal
         */
        function cancelExit() {
            const modal = document.getElementById('exit-confirmation-modal');
            modal.style.display = 'none';
            exitCallback = null;
            currentSection = '';
        }
        /**
         * Limpia los datos de la ficha según la sección
         * @param {string} section - Sección a limpiar ('barracones' o 'generador')
         */
        /**
         * Limpia completamente los campos de una sección de la aplicación
         * 
         * Esta función resetea TODOS los campos, selectores, tablas y estado visual
         * de la sección especificada, dejándola en su estado inicial como si
         * fuera la primera vez que se abre.
         * 
         * SECCIONES SOPORTADAS:
         * 
         * 1. 'barracones': Limpia la interfaz de Barracones
         *    - Datos personales (nombre, callsign, rango, ID táctico)
         *    - Atributos (FUE, DES, INT, CAR, MOV, INIT)
         *    - Cuadrados de mejora de atributos (remueve clase 'selected')
         *    - Estado físico (remueve clase 'damaged' de cuadrados HP)
         *    - Tabla de habilidades (elimina todas las filas excepto header)
         *    - Armas (selectores, munición, daño, alcance)
         *    - Notas
         * 
         * 2. 'generador': Limpia la interfaz del Generador de Personajes
         *    - Contador de puntos (resetea a 150)
         *    - Campos de personaje (nombre, jugador, edad, planeta, etc.)
         *    - Campaña, década y año
         *    - Atributos (resetea a 1)
         *    - Origen y afiliación
         *    - Estudios
         *    - Habilidades extra (vacía array y UI)
         *    - Habilidad noble
         *    - Modificador de mech
         * 
         * IMPORTANTE: Esta función NO navega a otra sección, solo limpia los datos.
         * La navegación se maneja en funciones separadas (goHomeFromBarracones, etc.)
         * 
         * @param {string} section - Sección a limpiar: 'barracones' o 'generador'
         * 
         * @returns {void}
         * 
         * @example
         * // Limpiar Barracones antes de cargar un nuevo personaje
         * limpiarFichaSeccion('barracones');
         * cargarPersonajeEnBarracones(nuevoPersonaje);
         * 
         * @example
         * // Limpiar Generador antes de crear un nuevo personaje
         * limpiarFichaSeccion('generador');
         * 
         * @see goHomeFromBarracones() - Navega al menú con confirmación y limpia
         * @see goHomeFromGenerador() - Navega al menú con confirmación y limpia
         * @see showExitModal() - Modal que llama a esta función antes de navegar
         */
        function limpiarFichaSeccion(section) {
            if (section === 'barracones') {
                // Limpiar Barracones (usando campos reales)
                const nombreEl = document.getElementById('barr-nombre');
                const callsignEl = document.getElementById('barr-callsign');
                const rangoEl = document.getElementById('barr-rango');
                const idEl = document.getElementById('barr-id');
                        if (nombreEl) nombreEl.value = '';
                if (callsignEl) callsignEl.value = '';
                if (rangoEl) rangoEl.value = '';
                if (idEl) idEl.value = '';
                        const fueEl = document.getElementById('barr-fue');
                const desEl = document.getElementById('barr-des');
                const intEl = document.getElementById('barr-int');
                const carEl = document.getElementById('barr-car');
                const movEl = document.getElementById('barr-mov');
                const initEl = document.getElementById('barr-init');
                        if (fueEl) fueEl.value = '0';
                if (desEl) desEl.value = '0';
                if (intEl) intEl.value = '0';
                if (carEl) carEl.value = '0';
                if (movEl) movEl.value = '';
                if (initEl) initEl.value = '';
                        // Limpiar cuadrados de mejora de atributos
                document.querySelectorAll('.barracones-attr-upgrade').forEach(sq => {
                    sq.classList.remove('selected');
                });
                        // Limpiar estado físico (quitar clase damaged de todos los cuadrados)
                console.log('🧹 Limpiando estado físico...');
                const hpSegments = document.querySelectorAll('.barracones-hp-segment, .barracones-hp-segment-vertical');
                console.log('💔 Cuadrados HP antes de limpiar:', hpSegments.length);
                hpSegments.forEach(seg => seg.classList.remove('damaged'));
                console.log('✅ Estado físico limpiado (clase damaged removida de todos los cuadrados)');
                        // Limpiar tabla de habilidades
                const skillsTable = document.getElementById('barr-skills-table');
                if (skillsTable) {
                    while (skillsTable.rows.length > 1) {
                        skillsTable.deleteRow(1);
                    }
                }
                        // Limpiar armas
                console.log('🔫 Limpiando armas...');
                const arma1Sel = document.getElementById('barr-arma1-select');
                const arma1Mun = document.getElementById('barr-arma1-mun-actual');
                const arma1Dmg = document.getElementById('barr-arma1-dmg');
                const arma1Al = document.getElementById('barr-arma1-al');
                        const arma2Sel = document.getElementById('barr-arma2-select');
                const arma2Mun = document.getElementById('barr-arma2-mun-actual');
                const arma2Dmg = document.getElementById('barr-arma2-dmg');
                const arma2Al = document.getElementById('barr-arma2-al');
                        const arma3Sel = document.getElementById('barr-arma3-select');
                const arma3Mun = document.getElementById('barr-arma3-mun-actual');
                const arma3Dmg = document.getElementById('barr-arma3-dmg');
                const arma3Al = document.getElementById('barr-arma3-al');
                        // Arma 1
                if (arma1Sel) arma1Sel.selectedIndex = 0;
                if (arma1Mun) arma1Mun.value = '';
                if (arma1Dmg) arma1Dmg.value = '';
                if (arma1Al) arma1Al.value = '';
                        // Arma 2
                if (arma2Sel) arma2Sel.selectedIndex = 0;
                if (arma2Mun) arma2Mun.value = '';
                if (arma2Dmg) arma2Dmg.value = '';
                if (arma2Al) arma2Al.value = '';
                        // Arma 3
                if (arma3Sel) arma3Sel.selectedIndex = 0;
                if (arma3Mun) arma3Mun.value = '';
                if (arma3Dmg) arma3Dmg.value = '';
                if (arma3Al) arma3Al.value = '';
                        console.log('✅ Armas limpiadas (selectores, munición, daño, alcance)');
                        // Limpiar notas
                const notasEl = document.getElementById('barr-notas');
                if (notasEl) notasEl.value = '';
                    } else if (section === 'generador') {
                // Limpiar Generador
                console.log('🧹 Limpiando generador...');
                        // Resetear puntos
                pointsUsed = 0;
                const ptsVal = document.getElementById('points-val');
                if (ptsVal) {
                    ptsVal.textContent = '150';
                }
                        // Limpiar campos principales
                const selectNombre = document.getElementById('select-nombre');
                const selectJugador = document.getElementById('select-jugador');
                if (selectNombre) selectNombre.value = '';
                if (selectJugador) selectJugador.value = '';
                        // Limpiar campos de personaje (si existen)
                const fields = ['nombre', 'edad', 'planeta', 'afiliacion', 'rango'];
                fields.forEach(field => {
                    const el = document.getElementById(field);
                    if (el) el.value = '';
                });
                        // Resetear selectores de campaña, década y año
                const campaignSelect = document.getElementById('campaign-select');
                const decadeSelect = document.getElementById('select-decade');
                const yearSelect = document.getElementById('select-year-digit');
                if (campaignSelect) campaignSelect.selectedIndex = 0;
                if (decadeSelect) decadeSelect.selectedIndex = 0;
                if (yearSelect) yearSelect.selectedIndex = 0;
                        // Resetear atributos
                const attrs = ['str', 'dex', 'int', 'cha'];
                attrs.forEach(attr => {
                    const selectEl = document.getElementById('select-' + attr);
                    const displayEl = document.getElementById(attr);
                    if (selectEl) selectEl.value = '1';
                    if (displayEl) displayEl.value = '1';
                });
                        // Resetear origen
                const origenSelect = document.getElementById('origen-select');
                if (origenSelect) origenSelect.selectedIndex = 0;
                        // Resetear afiliación
                const factionSelect = document.getElementById('faction-select');
                if (factionSelect) factionSelect.selectedIndex = 0;
                        // Limpiar selector de estudios
                const estudiosSelect = document.getElementById('estudios-select');
                if (estudiosSelect) estudiosSelect.selectedIndex = 0;
                        // Limpiar habilidades extra
                extraSkillsData = [];
                const skillList = document.getElementById('extra-skill-list');
                if (skillList) skillList.innerHTML = '';
                        // Limpiar selector de habilidad noble
                const nobleSkillSelect = document.getElementById('noble-skill-select');
                if (nobleSkillSelect) nobleSkillSelect.selectedIndex = 0;
                        // Resetear modificador de mech
                const mechModSelect = document.getElementById('mech-mod-select');
                if (mechModSelect) mechModSelect.selectedIndex = 0;
                        console.log('✅ Generador limpiado completamente');
            }
        }
        /**
         * Navega a home desde Barracones con confirmación
         */
        function goHomeFromBarracones() {
            showExitModal('barracones', function() {
                // La limpieza se hace automáticamente en el modal antes de ejecutar este callback
                console.log('🏠 Volviendo al menú desde Barracones...');
                        clearCriticalInfoDisplays();
                document.getElementById('landing-page').style.display = 'flex';
                document.getElementById('barracones').style.display = 'none';
                document.getElementById('pre-generacion').style.display = 'none';
                document.getElementById('ficha-container').style.display = 'none';
                document.getElementById('points-counter').style.display = 'none';
                        // Ocultar barra de herramientas de Barracones
                const toolbar = document.getElementById('barracones-toolbar');
                if (toolbar) toolbar.style.display = 'none';
                        console.log('✅ Menú principal mostrado');
            });
        }
        /**
         * Navega a home desde Generador con confirmación
         */
        function goHomeFromGenerador() {
            showExitModal('generador', function() {
                // La limpieza se hace automáticamente en el modal antes de ejecutar este callback
                console.log('🏠 Volviendo al menú desde Generador...');
                        clearCriticalInfoDisplays();
                document.getElementById('landing-page').style.display = 'flex';
                document.getElementById('pre-generacion').style.display = 'none';
                document.getElementById('ficha-container').style.display = 'none';
                document.getElementById('barracones').style.display = 'none';
                document.getElementById('points-counter').style.display = 'none';
                        // Ocultar barra de herramientas de Barracones
                const toolbar = document.getElementById('barracones-toolbar');
                if (toolbar) toolbar.style.display = 'none';
                        console.log('✅ Menú principal mostrado');
            });
        }

        /**
         * Navega a la sección de Registro de Combate
         * Esta sección permite registrar combates y distribuir recompensas (XP, dinero) de forma masiva
         */
        function goToRegistroCombate() {
            console.log('🎯 Navegando a Registro de Combate...');
                // Ocultar todas las secciones
            document.getElementById('landing-page').style.display = 'none';
            document.getElementById('pre-generacion').style.display = 'none';
            document.getElementById('ficha-container').style.display = 'none';
            document.getElementById('barracones').style.display = 'none';
            document.getElementById('points-counter').style.display = 'none';
                // Mostrar Registro de Combate
            document.getElementById('registro-combate').style.display = 'block';
                console.log('✅ Registro de Combate mostrado');
        }

        /**
         * Vuelve al menú principal desde Registro de Combate
         * No requiere confirmación porque no hay datos que guardar
         */
        function goHomeFromRegistroCombate() {
            console.log('🏠 Volviendo al menú desde Registro de Combate...');
                // Cerrar modal si está abierto
            cerrarModalRecompensas();
                // Ocultar Registro de Combate
            document.getElementById('registro-combate').style.display = 'none';
                // Mostrar menú principal
            document.getElementById('landing-page').style.display = 'flex';
                console.log('✅ Menú principal mostrado');
        }

        /**
         * Abre el modal de distribución de recompensas
         * Versión SIMPLIFICADA: Solo añade fila a "Respuestas de formulario 1"
         */
        function abrirModalRecompensas() {
            console.log('💰 Abriendo modal de recompensas...');
                // Resetear todos los inputs
            document.getElementById('xp-marcos').value = '0';
            document.getElementById('xp-jaime').value = '0';
            document.getElementById('xp-joan').value = '0';
            document.getElementById('xp-juan').value = '0';
            document.getElementById('recompensas-dinero-unidad').value = '0';
            document.getElementById('recompensas-gastos-unidad').value = '0';
            document.getElementById('recompensas-estado').style.display = 'none';
                // Mostrar modal
            document.getElementById('modal-recompensas').style.display = 'block';
            inicializarGastosXP();
            cargarXPDisponible();
        }

        /**
         * Abre el modal de recompensas CON XP del Battle Tracker
         * NO resetea los valores de XP ganado
         */
        function abrirModalRecompensasConXP(xpArray) {
            console.log('💰 Abriendo modal de recompensas con XP del Battle Tracker...');
            
            // Resetear solo dinero y gastos (NO resetear XP)
            document.getElementById('recompensas-dinero-unidad').value = '0';
            document.getElementById('recompensas-gastos-unidad').value = '0';
            document.getElementById('recompensas-estado').style.display = 'none';
            
            // Copiar XP del Battle Tracker
            const inputIds = ['xp-marcos', 'xp-jaime', 'xp-joan', 'xp-juan'];
            inputIds.forEach((id, idx) => {
                const input = document.getElementById(id);
                if (input && xpArray[idx] !== undefined) {
                    input.value = xpArray[idx];
                    console.log(`✓ ${id}: ${xpArray[idx]} XP`);
                }
            });
            
            // Mostrar modal
            document.getElementById('modal-recompensas').style.display = 'block';
            inicializarGastosXP();
            cargarXPDisponible();
            
            console.log('✅ Modal abierto con XP del Battle Tracker');
        }

/**
 * ============================================================================
 * SISTEMA DE GASTOS XP EN REGISTRO DE COMBATE
 * ============================================================================
 */

// Configuración de niveles y rerolls
const REROLL_CONFIG = {
    'Novato': { max: 1, cost: 100 },        // 0-5,000 XP
    'Regular': { max: 2, cost: 200 },       // 5,001-30,000 XP
    'Veterano': { max: 3, cost: 500 },     // 30,001-65,000 XP
    'Elite': { max: 4, cost: 1000 },        // 65,001-100,000 XP
    'As': { max: 5, cost: 6000 }            // 100,001+ XP
};

// Tracking de gastos por jugador
const expenseTracker = {
    'Marcos': { iniciativa: false, rerolls: 0, quirks: 0, nivel: 'Novato' },
    'Jaime': { iniciativa: false, rerolls: 0, quirks: 0, nivel: 'Novato' },
    'Joan': { iniciativa: false, rerolls: 0, quirks: 0, nivel: 'Novato' },
    'Juan': { iniciativa: false, rerolls: 0, quirks: 0, nivel: 'Novato' }
};

// ============================================================
// QUIRKS DEL BATTLEMECH MANUAL
// ============================================================
const QUIRKS_DATABASE = {
    positivos: [
        { id:'anti_air', nombre:'Anti-Aircraft Targeting', efecto:'+1 precisión contra unidades aéreas' },
        { id:'barrel_fist', nombre:'Barrel Fist', efecto:'Sin penalización cuerpo a cuerpo sin actuador de mano' },
        { id:'battle_computer', nombre:'Battle Computer', efecto:'+1 iniciativa para toda la lanza (equipo fijo)' },
        { id:'battlefists', nombre:'Battlefists', efecto:'+1 probabilidad de impacto cuerpo a cuerpo por brazo' },
        { id:'combat_computer', nombre:'Combat Computer', efecto:'-3 calor al esprintar / -3 calor al caminar' },
        { id:'command_mech', nombre:'Command Mech', efecto:'+1 iniciativa para la lanza hasta recibir impacto' },
        { id:'cowl', nombre:'Cowl', efecto:'-3 daño en la cabeza desde los lados' },
        { id:'distracting', nombre:'Distracting', efecto:'Tiradas de pánico enemigas 5% más difíciles' },
        { id:'directional_torso', nombre:'Directional Torso Mount', efecto:'Las armas pueden apuntar 360 grados' },
        { id:'easy_maintain', nombre:'Easy to Maintain', efecto:'Reparaciones 25% más rápidas' },
        { id:'easy_pilot', nombre:'Easy to Pilot', efecto:'+1 cap de evasión' },
        { id:'ext_torso', nombre:'Extended Torso Twist', efecto:'Arco de disparo extendido 120 grados' },
        { id:'full_head_eject', nombre:'Full-Head Ejection', efecto:'La cabeza no se destruye al eyectar' },
        { id:'good_rep', nombre:'Good Reputation', efecto:'+10% valor compra/venta' },
        { id:'hyper_act', nombre:'Hyper-Extending Actuators', efecto:'Arco 120°; puede voltear brazos al arco trasero' },
        { id:'imp_comms', nombre:'Improved Comms', efecto:'Puede ver a través de un ECM' },
        { id:'imp_life', nombre:'Improved Life Support', efecto:'Previene una herida al piloto' },
        { id:'imp_sensors', nombre:'Improved Sensors', efecto:'Sensor Lock mejorado; mayor rango de sensores' },
        { id:'imp_target_s', nombre:'Improved Targeting (Corto)', efecto:'+1 precisión a ≤240m' },
        { id:'imp_target_m', nombre:'Improved Targeting (Medio)', efecto:'+1 precisión entre 240m-460m' },
        { id:'imp_target_l', nombre:'Improved Targeting (Largo)', efecto:'+1 precisión a >460m' },
        { id:'modular_wpn', nombre:'Modular Weapons', efecto:'Reemplazar armas 50% más rápido' },
        { id:'multi_trac', nombre:'Multi-Trac', efecto:'+1 precisión con habilidad Multi-Objetivo' },
        { id:'narrow_profile', nombre:'Narrow/Low Profile', efecto:'+1 defensa contra impactos' },
        { id:'nimble_jumper', nombre:'Nimble Jumper', efecto:'Estabilidad se resetea como si se moviera al saltar' },
        { id:'overhead_arms', nombre:'Overhead Arms', efecto:'Penalización de obstrucción reducida en 1' },
        { id:'protected_act', nombre:'Protected Actuators', efecto:'Críticos en actuadores de pata ignorados 50%' },
        { id:'reinf_legs', nombre:'Reinforced Legs', efecto:'Daño propio por DFA reducido a la mitad' },
        { id:'rugged', nombre:'Rugged', efecto:'25-50% reducción coste mantenimiento' },
        { id:'searchlight', nombre:'Searchlight', efecto:'+25m visión; ignora penalizaciones de poca luz' },
        { id:'stable', nombre:'Stable', efecto:'+25% estabilidad' },
        { id:'stabilized_wpn', nombre:'Stabilized Weapon', efecto:'+1 precisión al arma/localización especificada' },
        { id:'variable_target', nombre:'Variable Range Targeting', efecto:'+1 precisión a todos los rangos' },
        { id:'vestigial_hands', nombre:'Vestigial Hands', efecto:'Puede levantar objetos sin actuadores de mano' },
    ],
    negativos: [
        { id:'bad_rep', nombre:'Bad Reputation', efecto:'-10% valor compra/venta' },
        { id:'cramped_cockpit', nombre:'Cramped Cockpit', efecto:'-1 generación de temple' },
        { id:'diff_ejection', nombre:'Difficult Ejection', efecto:'El piloto sufre una herida al eyectar' },
        { id:'diff_maintain', nombre:'Difficult to Maintain', efecto:'Reparaciones 25% más lentas' },
        { id:'exposed_act', nombre:'Exposed Actuators', efecto:'Actuadores de pata critables a través de armadura' },
        { id:'exposed_wpn', nombre:'Exposed Weapon Linkage', efecto:'Armas de apoyo en brazos critables a través de armadura' },
        { id:'hard_pilot', nombre:'Hard to Pilot', efecto:'-10 umbral de inestabilidad' },
        { id:'no_ejection', nombre:'No Ejection Mechanism', efecto:'El piloto no puede eyectar' },
        { id:'no_arms', nombre:'No/Minimal Arms', efecto:'-2 penalización levantarse; sin sprint ese turno' },
        { id:'non_std_parts', nombre:'Non-Standard Parts', efecto:'+25% coste de reparación' },
        { id:'oversized', nombre:'Oversized', efecto:'-1 defensa contra impactos' },
        { id:'poor_life', nombre:'Poor Life Support', efecto:'El piloto sufre herida al sobrecalentar' },
        { id:'poor_perf', nombre:'Poor Performance', efecto:'Solo puede esprintar si se movió el turno anterior' },
        { id:'prototype', nombre:'Prototype', efecto:'+25% coste mantenimiento, +10% reparación' },
        { id:'unbalanced', nombre:'Unbalanced', efecto:'-25% estabilidad' },
        { id:'weak_head', nombre:'Weak Head Armor', efecto:'-3 armadura en la cabeza' },
        { id:'weak_legs', nombre:'Weak Legs', efecto:'Daño propio por DFA duplicado' },
    ]
};

// Almacén de quirks comprados en sesión actual
let quirksComprados = {};

// ============================================================================
// INICIALIZACIÓN
// ============================================================================

/**
 * Inicializa los controles de gastos XP al cargar Registro de Combate
 */
function inicializarGastosXP() {
    console.log('🎮 Inicializando controles de gastos XP...');
    
    // Solo resetear totales
    // Los niveles y botones se generan en cargarXPDisponible()
    resetearGastosXP();
}

/**
 * Obtiene los niveles de veteranía de cada personaje desde Google Sheets
 */
async function obtenerNivelesPersonajes() {
    console.log('📊 Calculando niveles de veteranía según XP Total...');
    
    const jugadores = ['Marcos', 'Jaime', 'Joan', 'Juan'];
    
    for (const jugador of jugadores) {
        const xpTotal = xpTotalJugadores[jugador]; // Usar XP TOTAL, no disponible
        
        // Usar la función calcularNivelVeterania del sistema
        const nivelInfo = calcularNivelVeterania(xpTotal);
        expenseTracker[jugador].nivel = nivelInfo.nombre;
        
        console.log(`  ${jugador}: ${xpTotal} XP Total → ${nivelInfo.nombre}`);
    }
    
    console.log('✅ Niveles calculados:', expenseTracker);
}

/**
 * Genera los botones de reroll según el nivel del jugador
 */
function generarBotonesReroll(jugador) {
    const nivel = expenseTracker[jugador].nivel;
    const config = REROLL_CONFIG[nivel];
    const container = document.getElementById(`rerolls-${jugador}`);
    
    if (!container) return;
    
    // Limpiar botones existentes
    container.innerHTML = '';
    
    if (config.max === 0) {
        // Novato no tiene rerolls
        container.innerHTML = '<span style="font-size: 10px; color: #666;">No disponible</span>';
        return;
    }
    
    // Crear botones de reroll
    for (let i = 1; i <= config.max; i++) {
        const btn = document.createElement('button');
        btn.className = 'xp-expense-btn';
        btn.setAttribute('data-player', jugador);
        btn.setAttribute('data-type', 'reroll');
        btn.setAttribute('data-cost', config.cost);
        btn.setAttribute('data-reroll-num', i);
        btn.textContent = i;
        btn.onclick = function() { toggleRerollButtonConValidacion(this); };
        
        container.appendChild(btn);
    }
}

// ============================================================================
// MANEJO DE BOTONES
// ============================================================================

/**
 * Toggle del botón de Control de Iniciativa
 */
function toggleExpenseButton(button) {
    const player = button.getAttribute('data-player');
    const type = button.getAttribute('data-type');
    const cost = parseInt(button.getAttribute('data-cost'));
    
    if (button.classList.contains('active')) {
        // Desactivar
        button.classList.remove('active');
        expenseTracker[player][type] = false;
    } else {
        // Activar
        button.classList.add('active');
        expenseTracker[player][type] = true;
    }
    
    actualizarTotalGastado(player);
}

/**
 * Toggle de botones de reroll (se pueden activar múltiples)
 */
function toggleRerollButton(button) {
    const player = button.getAttribute('data-player');
    
    if (button.classList.contains('active')) {
        // Desactivar
        button.classList.remove('active');
        expenseTracker[player].rerolls--;
    } else {
        // Activar
        button.classList.add('active');
        expenseTracker[player].rerolls++;
    }
    
    actualizarContadorRerolls(player);
    actualizarTotalGastado(player);
}

/**
 * Actualiza el contador de rerolls usados
 */
function actualizarContadorRerolls(player) {
    const counter = document.querySelector(`[data-player-rerolls="${player}"]`);
    const nivel = expenseTracker[player].nivel;
    const config = REROLL_CONFIG[nivel];
    const usado = expenseTracker[player].rerolls;
    
    if (counter) {
        counter.textContent = `${usado}/${config.max}`;
        
        // Cambiar color según uso
        if (usado >= config.max) {
            counter.style.background = 'rgba(255, 0, 0, 0.3)';
            counter.style.borderColor = '#ff4444';
        } else if (usado > 0) {
            counter.style.background = 'rgba(255, 174, 0, 0.3)';
            counter.style.borderColor = '#ffae00';
        } else {
            counter.style.background = 'rgba(255, 174, 0, 0.2)';
            counter.style.borderColor = '#ffae00';
        }
    }
}

/**
 * Actualiza el total gastado por un jugador
 */
function actualizarTotalGastado(player) {
    const tracker = expenseTracker[player];
    const nivel = tracker.nivel;
    const rerollConfig = REROLL_CONFIG[nivel];
    
    let total = 0;
    
    // Iniciativa
    if (tracker.iniciativa) {
        total += 100;
    }
    
    // Rerolls
    total += tracker.rerolls * rerollConfig.cost;

    // Quirks de mech: positivos cuestan 1000 XP, negativos dan 1000 XP
    total += (tracker.quirks || 0) * 1000;
    total -= (tracker.quirksNegativos || 0) * 1000;
    
    // Actualizar display
    const display = document.querySelector(`[data-total="${player}"]`);
    if (display) {
        display.textContent = `-${total} XP`;
        
        // Color según cantidad
        if (total === 0) {
            display.style.color = '#666';
        } else if (total < 1000) {
            display.style.color = '#ffae00';
        } else {
            display.style.color = '#ff4444';
        }
    }
    
    return total;
}

/**
 * Resetea todos los gastos XP
 */
function resetearGastosXP() {
    Object.keys(expenseTracker).forEach(player => {
        expenseTracker[player].iniciativa = false;
        expenseTracker[player].rerolls = 0;
        expenseTracker[player].quirks = 0;
        
        // Desactivar botones
        document.querySelectorAll(`[data-player="${player}"].active`).forEach(btn => {
            btn.classList.remove('active');
        });
        
        actualizarContadorRerolls(player);
        actualizarTotalGastado(player);
    });
    
    console.log('♻️ Gastos XP reseteados');
}

/**
 * ============================================================================
 * CARGAR XP DISPONIBLE AL ABRIR MODAL DE RECOMPENSAS
 * ============================================================================
 */

// Variable global para almacenar XP disponible de cada jugador
const xpDisponibleJugadores = {
    'Marcos': 0,
    'Jaime': 0,
    'Joan': 0,
    'Juan': 0
};

// Variable global para almacenar XP Total de cada jugador (para calcular nivel)
const xpTotalJugadores = {
    'Marcos': 0,
    'Jaime': 0,
    'Joan': 0,
    'Juan': 0
};

/**
 * Carga el XP disponible de todos los jugadores desde Google Sheets
 */
async function cargarXPDisponible() {
    console.log('📊 Cargando XP disponible de jugadores...');
    
    const jugadores = ['Marcos', 'Jaime', 'Joan', 'Juan'];
    
    for (const jugador of jugadores) {
        try {
            const url = `${GOOGLE_SCRIPT_URL}?jugador=${jugador}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.result === 'success' && data.personajes && data.personajes.length > 0) {
                const personaje = data.personajes[0];
                xpDisponibleJugadores[jugador] = personaje.xpDisponible || 0;
                xpTotalJugadores[jugador] = personaje.xpTotal || 0;
                
                console.log(`  ${jugador}: ${xpDisponibleJugadores[jugador]} XP disponible | ${xpTotalJugadores[jugador]} XP total`);
                
                // Actualizar display en la tarjeta
                actualizarDisplayXPDisponible(jugador);
            }
        } catch (error) {
            console.error(`❌ Error al cargar XP de ${jugador}:`, error);
            xpDisponibleJugadores[jugador] = 0;
        }
    }
    
    // Calcular niveles de veteranía según XP Total
    await obtenerNivelesPersonajes();
    
    // Generar botones de reroll según nivel
    Object.keys(expenseTracker).forEach(jugador => {
        generarBotonesReroll(jugador);
        actualizarContadorRerolls(jugador);
    });
    
    // Actualizar estado de botones según XP disponible
    actualizarEstadoBotonesSegunXP();
    
    console.log('✅ XP disponible cargado y niveles calculados:', xpDisponibleJugadores, expenseTracker);
}

/**
 * Actualiza el display de XP disponible en la tarjeta del jugador
 */
function actualizarDisplayXPDisponible(jugador) {
    const xp = xpDisponibleJugadores[jugador];
    
    // Buscar si existe un elemento para mostrar XP disponible
    // Si no existe, crearlo
    const card = document.querySelector(`[data-player="${jugador}"]`);
    if (!card) return;
    
    let displayXP = card.querySelector('.xp-disponible-display');
    
    if (!displayXP) {
        // Crear el display si no existe
        displayXP = document.createElement('div');
        displayXP.className = 'xp-disponible-display';
        displayXP.style.cssText = `
            background: rgba(0, 255, 65, 0.1);
            border: 1px solid #00ff41;
            border-radius: 4px;
            padding: 6px;
            margin-bottom: 10px;
            text-align: center;
        `;
        
        // Insertar después del nombre del jugador
        const playerName = card.querySelector('.xp-player-name');
        if (playerName) {
            playerName.after(displayXP);
        }
    }
    
    // Actualizar contenido
    displayXP.innerHTML = `
        <div style="font-size: 10px; color: #888;">XP Disponible</div>
        <div style="font-size: 16px; color: #00ff41; font-weight: bold;">${xp} XP</div>
    `;
}

/**
 * Actualiza el estado de los botones según el XP disponible
 */
function actualizarEstadoBotonesSegunXP() {
    Object.keys(xpDisponibleJugadores).forEach(jugador => {
        const xpDisponible = xpDisponibleJugadores[jugador];
        const nivel = expenseTracker[jugador].nivel;
        const config = REROLL_CONFIG[nivel];
        
        // Verificar botón de iniciativa
        const btnIniciativa = document.querySelector(`[data-player="${jugador}"][data-type="iniciativa"]`);
        if (btnIniciativa) {
            if (xpDisponible < 100) {
                btnIniciativa.disabled = true;
                btnIniciativa.title = `Necesitas 100 XP (tienes ${xpDisponible})`;
            } else {
                btnIniciativa.disabled = false;
                btnIniciativa.title = '';
            }
        }
        
        // Verificar botones de reroll
        const botonesReroll = document.querySelectorAll(`#rerolls-${jugador} .xp-expense-btn`);
        botonesReroll.forEach(btn => {
            const costo = config.cost;
            if (xpDisponible < costo) {
                btn.disabled = true;
                btn.title = `Necesitas ${costo} XP (tienes ${xpDisponible})`;
            } else {
                btn.disabled = false;
                btn.title = '';
            }
        });
    });
}

/**
 * Valida si un jugador puede pagar un gasto
 */
function puedePermitirseGasto(jugador, costo) {
    const xpDisponible = xpDisponibleJugadores[jugador];
    const gastosActuales = calcularGastosActuales(jugador);
    
    return (xpDisponible - gastosActuales - costo) >= 0;
}

/**
 * Calcula cuánto ha gastado un jugador en esta sesión
 */
function calcularGastosActuales(jugador) {
    const tracker = expenseTracker[jugador];
    const nivel = tracker.nivel;
    const rerollConfig = REROLL_CONFIG[nivel];
    
    let total = 0;
    
    if (tracker.iniciativa) {
        total += 100;
    }
    
    total += tracker.rerolls * rerollConfig.cost;
    
    return total;
}

/**
 * Toggle mejorado con validación de XP
 */
function toggleExpenseButtonConValidacion(button) {
    const player = button.getAttribute('data-player');
    const type = button.getAttribute('data-type');
    const cost = parseInt(button.getAttribute('data-cost'));
    
    if (button.classList.contains('active')) {
        // Desactivar (siempre permitido)
        button.classList.remove('active');
        expenseTracker[player][type] = false;
    } else {
        // Activar (verificar XP)
        if (!puedePermitirseGasto(player, cost)) {
            const xpDisponible = xpDisponibleJugadores[player];
            const gastosActuales = calcularGastosActuales(player);
            
            alert(`⚠️ ${player} no tiene suficiente XP\n\n` +
                  `XP Disponible: ${xpDisponible}\n` +
                  `Ya gastado: ${gastosActuales}\n` +
                  `Intentas gastar: ${cost}\n` +
                  `Te faltan: ${cost - (xpDisponible - gastosActuales)} XP`);
            return;
        }
        
        button.classList.add('active');
        expenseTracker[player][type] = true;
    }
    
    actualizarTotalGastado(player);
}

/**
 * Toggle de reroll mejorado con validación
 */
function toggleRerollButtonConValidacion(button) {
    const player = button.getAttribute('data-player');
    const nivel = expenseTracker[player].nivel;
    const config = REROLL_CONFIG[nivel];
    const cost = config.cost;
    
    if (button.classList.contains('active')) {
        // Desactivar
        button.classList.remove('active');
        expenseTracker[player].rerolls--;
    } else {
        // Activar (verificar XP)
        if (!puedePermitirseGasto(player, cost)) {
            const xpDisponible = xpDisponibleJugadores[player];
            const gastosActuales = calcularGastosActuales(player);
            
            alert(`⚠️ ${player} no tiene suficiente XP\n\n` +
                  `XP Disponible: ${xpDisponible}\n` +
                  `Ya gastado: ${gastosActuales}\n` +
                  `Costo repetir tirada: ${cost}\n` +
                  `Te faltan: ${cost - (xpDisponible - gastosActuales)} XP`);
            return;
        }
        
        button.classList.add('active');
        expenseTracker[player].rerolls++;
    }
    
    actualizarContadorRerolls(player);
    actualizarTotalGastado(player);
}

/**
 * MODIFICAR la función abrirModalRecompensas() existente
 * Añadir esto AL FINAL de la función:
 */
/*
/*
function abrirModalRecompensas() {
    console.log('💰 Abriendo modal de recompensas...');
    
    // ... código existente ...
    
    // AÑADIR ESTAS LÍNEAS AL FINAL:
    inicializarGastosXP();
    cargarXPDisponible(); // ← NUEVA LÍNEA
}
*/

/**
 * Resetear también el XP cargado cuando se cierra el modal
 */
function resetearGastosXPCompleto() {
    resetearGastosXP();
    
    // Resetear displays de XP disponible
    Object.keys(xpDisponibleJugadores).forEach(jugador => {
        xpDisponibleJugadores[jugador] = 0;
        
        const card = document.querySelector(`[data-player="${jugador}"]`);
        if (card) {
            const displayXP = card.querySelector('.xp-disponible-display');
            if (displayXP) {
                displayXP.remove();
            }
        }
    });
}

// ============================================================================
// OBTENER DATOS PARA REGISTRO
// ============================================================================

/**
 * Obtiene todos los gastos para enviar a Google Sheets
 */
function obtenerGastosParaRegistro() {
    const gastos = [];
    
    Object.keys(expenseTracker).forEach(player => {
        const tracker = expenseTracker[player];
        const nivel = tracker.nivel;
        const rerollConfig = REROLL_CONFIG[nivel];
        
        // Control de Iniciativa
        if (tracker.iniciativa) {
            gastos.push({
                jugador: player,
                tipo: 'iniciativa',
                cantidad: 100,
                descripcion: `${player}: Control de Iniciativa`
            });
        }
        
        // Rerolls (crear una entrada por cada reroll)
        for (let i = 0; i < tracker.rerolls; i++) {
            gastos.push({
                jugador: player,
                tipo: 'reroll',
                cantidad: rerollConfig.cost,
                descripcion: `${player}: Repetir Tirada (${nivel})`
            });
        }

        // Quirks de mech (1000 XP por quirk)
        const quirksJugador = quirksComprados[player] || [];
        quirksJugador.forEach(q => {
            gastos.push({
                jugador: player,
                tipo: 'quirk',
                cantidad: 1000,
                descripcion: `${player}: Quirk "${q.nombre}" para ${q.mech}`
            });
        });
    });
    
    return gastos;
}

/**
 * Obtiene el total gastado por jugador (para restar del XP ganado)
 */
function obtenerTotalesGastados() {
    const totales = {};
    
    Object.keys(expenseTracker).forEach(player => {
        totales[player] = actualizarTotalGastado(player);
    });
    
    return totales;
}

// ============================================================================
// INTEGRACIÓN CON REGISTRO DE MISIÓN
// ============================================================================

/**
 * MODIFICACIÓN DE LA FUNCIÓN registrarMision()
 * 
 * Añadir esto ANTES de enviar a Google Sheets:
 */
async function registrarMisionConGastos() {
    console.log('✅ ===== REGISTRANDO MISIÓN CON GASTOS =====');
    
    // 1. Registrar XP ganado (lo que ya existe)
    const xpGanado = {
        marcos: parseInt(document.getElementById('xp-marcos').value) || 0,
        jaime: parseInt(document.getElementById('xp-jaime').value) || 0,
        joan: parseInt(document.getElementById('xp-joan').value) || 0,
        juan: parseInt(document.getElementById('xp-juan').value) || 0,
        dinero: parseInt(document.getElementById('dinero-ganado').value) || 0,
        gastos: parseInt(document.getElementById('gastos').value) || 0,
        descripcion: 'Misión completada'
    };
    
    // Enviar registro de misión (XP positivo)
    await enviarRegistroMision(xpGanado);
    
    // 2. Registrar gastos individuales (XP negativo)
    const gastos = obtenerGastosParaRegistro();
    
    for (const gasto of gastos) {
        await registrarGastoXPEnNube(
            gasto.jugador,
            gasto.cantidad,
            gasto.descripcion
        );
    }
    
    // 3. Resetear controles
    resetearGastosXP();
    
    console.log('✅ ===== MISIÓN Y GASTOS REGISTRADOS =====');
}

// ============================================================================
// EJEMPLO DE USO
// ============================================================================

/*
// Al cargar Registro de Combate:
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('registro-combate')) {
        inicializarGastosXP();
    }
});

// Al hacer click en "REGISTRAR MISIÓN":
document.getElementById('btn-registrar-mision').onclick = registrarMisionConGastos;
*/



        /**
         * Cierra el modal de distribución de recompensas
         */
        function cerrarModalRecompensas() {
            console.log('✕ Cerrando modal de recompensas...');
            document.getElementById('modal-recompensas').style.display = 'none';
        }

        /**
         * Registra una misión añadiendo UNA FILA a "Respuestas de formulario 1"
         * Funciona EXACTAMENTE como Google Forms - no toca personajes directamente
         * 
         * Las fórmulas en la pestaña "Unidad" se encargan de sumar automáticamente
         * 
         * @async
         */
        async function registrarMision() {
            console.log('✅ ===== REGISTRANDO MISIÓN =====');
                // === VALIDACIÓN ===
            if (GOOGLE_SCRIPT_URL.includes("YOUR_GOOGLE_SCRIPT")) {
                alert(ERROR_MESSAGES.GOOGLE_SCRIPT_NOT_CONFIGURED);
                return;
            }
                // === RECOPILAR DATOS ===
            const xpMarcos = parseInt(document.getElementById('xp-marcos').value) || 0;
            const xpJaime = parseInt(document.getElementById('xp-jaime').value) || 0;
            const xpJoan = parseInt(document.getElementById('xp-joan').value) || 0;
            const xpJuan = parseInt(document.getElementById('xp-juan').value) || 0;
            const dineroGanado = parseInt(document.getElementById('recompensas-dinero-unidad').value) || 0;
            const gastos = parseInt(document.getElementById('recompensas-gastos-unidad').value) || 0;
            
            // Obtener gastos de XP marcados (Control Iniciativa, Rerolls)
            const gastosXP = obtenerGastosParaRegistro();
            
                // Validar que hay algo que registrar (XP ganado, dinero, gastos de unidad, o gastos de XP)
            if (xpMarcos === 0 && xpJaime === 0 && xpJoan === 0 && xpJuan === 0 && 
                dineroGanado === 0 && gastos === 0 && gastosXP.length === 0) {
                alert('Por favor ingresa al menos un valor diferente de 0 o marca algún gasto de XP');
                return;
            }
                // === CREAR RESUMEN ===
            let resumen = 'Se registrará la siguiente misión:\n\n';
            resumen += `👤 Marcos: ${xpMarcos} XP\n`;
            resumen += `👤 Jaime: ${xpJaime} XP\n`;
            resumen += `👤 Joan: ${xpJoan} XP\n`;
            resumen += `👤 Juan Palacios: ${xpJuan} XP\n\n`;
            resumen += `💰 Dinero: ${dineroGanado} C-Bills\n`;
            resumen += `💸 Gastos: ${gastos} C-Bills\n\n`;
            resumen += `¿Confirmar?`;
                if (!confirm(resumen)) {
                return;
            }
                // === MOSTRAR ESTADO ===
            const estadoDiv = document.getElementById('recompensas-estado');
            estadoDiv.style.display = 'block';
            estadoDiv.style.color = '#ffae00';
            estadoDiv.innerHTML = '⏳ Registrando misión...';
                // Deshabilitar botón
            const botonRegistrar = document.querySelector('#recompensas-boton-aplicar button');
            const textoOriginal = botonRegistrar.innerHTML;
            botonRegistrar.disabled = true;
            botonRegistrar.innerHTML = '⏳ REGISTRANDO...';
                try {
                // === ENVIAR A GOOGLE SHEETS ===
                // Esto añadirá UNA FILA a "Respuestas de formulario 1"
                // Formato: [Timestamp, XP_Marcos, XP_Jaime, XP_Joan, XP_Juan, Dinero, Gastos]
                        // ⚡ USANDO GET PARA EVITAR CORS PREFLIGHT
                const params = new URLSearchParams({
                    action: 'registrarMision',
                    xpMarcos: xpMarcos,
                    xpJaime: xpJaime,
                    xpJoan: xpJoan,
                    xpJuan: xpJuan,
                    dineroGanado: dineroGanado,
                    gastos: gastos
                });
                        const response = await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`);
                const data = await response.json();
                console.log('📦 Respuesta:', data);
                        if (data.result === "success") {
                    estadoDiv.style.color = '#00ff41';
                    estadoDiv.innerHTML = '✅ Misión registrada correctamente';
                                console.log('✅ Misión registrada en "Respuestas de formulario 1"');
                                
                    // Registrar gastos de XP (Control Iniciativa, Rerolls)
                    if (gastosXP.length > 0) {
                        console.log(`📝 Registrando ${gastosXP.length} gasto(s) de XP...`);
                        estadoDiv.innerHTML += '<br>⏳ Registrando gastos de XP...';
                        
                        for (const gasto of gastosXP) {
                            await registrarGastoXPEnNube(gasto.jugador, gasto.cantidad, gasto.descripcion);
                        }
                        
                        estadoDiv.innerHTML = '✅ Misión y gastos registrados';
                        console.log('✅ Gastos de XP registrados correctamente');
                    }
                    
                    // === ACTUALIZAR PERSONAJE CON DATOS DE COMBATE ===
                    if (window.combatCurrentCharacter && window.combatLoadedWeapons) {
                        estadoDiv.innerHTML += '<br>⏳ Actualizando munición y daños...';
                        await actualizarPersonajeCombate();
                        estadoDiv.innerHTML += '<br>✅ Personaje actualizado';
                    }
                                
                                // Esperar 3 segundos y cerrar modal
                    setTimeout(() => {
                        cerrarModalRecompensas();
                    }, 3000);
                } else {
                    estadoDiv.style.color = '#ff4444';
                    estadoDiv.innerHTML = `❌ Error al registrar: ${data.msg || 'Desconocido'}`;
                }
                    } catch (error) {
                console.error('❌ Error crítico al registrar misión:', error);
                estadoDiv.style.color = '#ff4444';
                estadoDiv.innerHTML = `❌ Error crítico: ${error.message}`;
            } finally {
                // Restaurar botón
                botonRegistrar.disabled = false;
                botonRegistrar.innerHTML = textoOriginal;
            }
                console.log('✅ ===== PROCESO COMPLETADO =====');
        }
        
        /**
         * Actualiza el personaje del combate en Google Sheets con munición y daños
         */
        async function actualizarPersonajeCombate() {
            if (!window.combatCurrentCharacter) {
                console.log('⚠️ No hay personaje de combate para actualizar');
                return;
            }
            
            const personaje = window.combatCurrentCharacter;
            console.log('🔄 Actualizando personaje:', personaje.nombre);
            
            // Actualizar munición de armas
            if (window.combatLoadedWeapons && window.combatLoadedWeapons.length > 0) {
                window.combatLoadedWeapons.forEach((weapon, idx) => {
                    if (personaje.armas && personaje.armas[idx]) {
                        personaje.armas[idx].munActual = String(weapon.munActual);
                        console.log(`   🔫 Arma ${idx + 1}: munActual = ${weapon.munActual}`);
                    }
                });
            }
            
            // Actualizar estado físico (daños)
            const combatHPBoxes = document.querySelectorAll('#combat-silueta-container .combat-hp-box');
            if (combatHPBoxes.length > 0) {
                personaje.estadoFisico = [];
                combatHPBoxes.forEach((box, idx) => {
                    personaje.estadoFisico.push({
                        index: idx,
                        damaged: box.classList.contains('damaged')
                    });
                });
                console.log(`   💔 Estado físico: ${personaje.estadoFisico.filter(e => e.damaged).length} daños`);
            }
            
            // Guardar en Sheets
            try {
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    body: JSON.stringify(personaje)
                });
                const data = await response.json();
                
                if (data.result === "success") {
                    console.log('✅ Personaje actualizado en Sheets');
                } else {
                    console.error('❌ Error al actualizar personaje:', data.msg);
                }
            } catch (error) {
                console.error('❌ Error de conexión:', error);
            }
        }

        function goToSheetDirectly() {
            document.getElementById('landing-page').style.display = 'none';
            document.getElementById('pre-generacion').style.display = 'none';
            document.getElementById('ficha-container').style.display = 'block';
            document.getElementById('points-counter').style.display = 'none';

            // Inicializar visualización básica
            renderizarPuntosDeVida(0);
            document.getElementById('sheet-title-text').innerText = "HOJA DE SERVICIO (MODO EDICIÓN)";

            // Inicializar skill container vacío si no existe
            const skillContainer = document.getElementById('skill-list-container');
            if(skillContainer && !skillContainer.innerHTML) {
                skillContainer.innerHTML = '<p style="text-align:center; color:#666;">Carga un personaje para ver sus habilidades</p>';
            }

            // Scroll al inicio
            window.scrollTo(0, 0);
        }

        // FUNCIÓN PARA VOLVER A MODO EDICIÓN/GENERADOR
        function volverAEdicion() {
            if(confirm("¿Volver al generador de personajes? Los cambios realizados directamente en la ficha se conservarán en los campos del generador.")) {
                const fichaContainer = document.getElementById('ficha-container');
                const preGen = document.getElementById('pre-generacion');
                const counter = document.getElementById('points-counter');
                        if(fichaContainer) fichaContainer.style.display = 'none';
                if(preGen) preGen.style.display = 'block';
                if(counter) counter.style.display = 'block';
                        // Scroll al inicio
                window.scrollTo(0, 0);
            }
        }

        function goToGalacticMap() {
            document.getElementById('landing-page').style.display = 'none';
            document.getElementById('galactic-map').style.display = 'block';
            document.getElementById('trr-infantry').style.display = 'none';
            document.getElementById('trr-utilities').style.display = 'none';
            document.getElementById('mech-hangar').style.display = 'none';
            document.getElementById('vehicle-depot').style.display = 'none';
            document.getElementById('pre-generacion').style.display = 'none';
            document.getElementById('ficha-container').style.display = 'none';
            document.getElementById('points-counter').style.display = 'none';
        }

        function goToTRRInfantry() {
            document.getElementById('landing-page').style.display = 'none';
            document.getElementById('galactic-map').style.display = 'none';
            document.getElementById('trr-infantry').style.display = 'block';
            document.getElementById('trr-utilities').style.display = 'none';
            document.getElementById('mech-hangar').style.display = 'none';
            document.getElementById('vehicle-depot').style.display = 'none';
            document.getElementById('trr-landing').style.display = 'flex';
            document.getElementById('trr-combat').style.display = 'none';
            document.getElementById('trr-weapons').style.display = 'none';
            document.getElementById('pre-generacion').style.display = 'none';
            document.getElementById('ficha-container').style.display = 'none';
            document.getElementById('points-counter').style.display = 'none';
        }

        // ============================================
        // NAVEGACIÓN - NUEVOS HUBS
        // ============================================
        
        /**
         * Navega al landing page principal
         */
        function goToLanding() {
            // Ocultar todas las secciones principales
            const sections = ['pre-generacion', 'ficha-container', 'barracones', 'points-counter', 
                              'registro-combate', 'trr-section', 'battle-tracker', 'trr-hub-section',
                              'mech-hangar', 'vehicle-depot', 'galactic-map', 'cronicas-section',
                              'cronicas-hub-section', 'historial-logros-section', 'tro-section',
                              'trr-infantry', 'trr-utilities'];
            sections.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.display = 'none';
            });
            
            // Resetear sub-secciones de mech-hangar
            const mechLanding = document.getElementById('mech-hangar-landing');
            if (mechLanding) mechLanding.style.display = 'flex';
            const mechLocations = document.getElementById('mech-locations');
            if (mechLocations) mechLocations.style.display = 'none';
            const mechCriticals = document.getElementById('mech-criticals');
            if (mechCriticals) mechCriticals.style.display = 'none';
            
            // Resetear sub-secciones de vehicle-depot
            const vehicleLanding = document.getElementById('vehicle-depot-landing');
            if (vehicleLanding) vehicleLanding.style.display = 'flex';
            const vehicleLocations = document.getElementById('vehicle-locations');
            if (vehicleLocations) vehicleLocations.style.display = 'none';
            const vehicleCriticals = document.getElementById('vehicle-criticals');
            if (vehicleCriticals) vehicleCriticals.style.display = 'none';
            const vehicleMotive = document.getElementById('vehicle-motive');
            if (vehicleMotive) vehicleMotive.style.display = 'none';
            
            // Resetear sub-secciones de trr-infantry
            const trrLanding = document.getElementById('trr-landing');
            if (trrLanding) trrLanding.style.display = 'flex';
            const trrCombat = document.getElementById('trr-combat');
            if (trrCombat) trrCombat.style.display = 'none';
            const trrWeapons = document.getElementById('trr-weapons');
            if (trrWeapons) trrWeapons.style.display = 'none';
            
            // Resetear sub-secciones de trr-utilities
            const trrUtilitiesLanding = document.getElementById('trr-utilities-landing');
            if (trrUtilitiesLanding) trrUtilitiesLanding.style.display = 'flex';
            const clusterTable = document.getElementById('cluster-table');
            if (clusterTable) clusterTable.style.display = 'none';
            const damageGrouper = document.getElementById('damage-grouper');
            if (damageGrouper) damageGrouper.style.display = 'none';
            const modifiersTable = document.getElementById('modifiers-table');
            if (modifiersTable) modifiersTable.style.display = 'none';
            
            // Mostrar landing
            document.getElementById('landing-page').style.display = 'flex';
            
            // Scroll al inicio
            window.scrollTo(0, 0);
        }
        
        /**
         * Navega al TRR Hub (centro de tablas)
         */
        function goToTRRHub() {
            // Ocultar todas las secciones
            const sections = ['pre-generacion', 'ficha-container', 'barracones', 'points-counter', 
                              'registro-combate', 'trr-section', 'landing-page', 'battle-tracker',
                              'mech-hangar', 'vehicle-depot', 'galactic-map', 'cronicas-section',
                              'cronicas-hub-section', 'historial-logros-section', 'tro-section',
                              'trr-infantry', 'trr-utilities'];
            sections.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.display = 'none';
            });
            
            // Mostrar TRR Hub
            document.getElementById('trr-hub-section').style.display = 'block';
        }
        
        /**
         * Navega al Crónicas Hub
         */
        function goToCronicasHub() {
            // Ocultar todas las secciones
            const sections = ['pre-generacion', 'ficha-container', 'barracones', 'points-counter', 
                              'registro-combate', 'trr-section', 'landing-page', 'battle-tracker',
                              'mech-hangar', 'vehicle-depot', 'galactic-map', 'cronicas-section',
                              'trr-hub-section', 'historial-logros-section', 'tro-section',
                              'trr-infantry', 'trr-utilities'];
            sections.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.display = 'none';
            });
            
            // Mostrar Crónicas Hub
            document.getElementById('cronicas-hub-section').style.display = 'block';
        }

        // ============================================
        // NAVEGACIÓN DESDE TRR HUB - WRAPPERS
        // ============================================
        // Estas funciones primero ocultan el TRR Hub y muestran la sección padre,
        // luego navegan a la sub-sección específica
        
        function hubGoToMechLocations() {
            document.getElementById('trr-hub-section').style.display = 'none';
            document.getElementById('mech-hangar').style.display = 'block';
            document.getElementById('mech-hangar-landing').style.display = 'none';
            document.getElementById('mech-locations').style.display = 'block';
            document.getElementById('mech-criticals').style.display = 'none';
        }
        
        function hubGoToMechCriticals() {
            document.getElementById('trr-hub-section').style.display = 'none';
            document.getElementById('mech-hangar').style.display = 'block';
            document.getElementById('mech-hangar-landing').style.display = 'none';
            document.getElementById('mech-locations').style.display = 'none';
            document.getElementById('mech-criticals').style.display = 'block';
        }
        
        function hubGoToVehicleLocations() {
            clearCriticalInfoDisplays();
            document.getElementById('trr-hub-section').style.display = 'none';
            document.getElementById('vehicle-depot').style.display = 'block';
            document.getElementById('vehicle-depot-landing').style.display = 'none';
            document.getElementById('vehicle-locations').style.display = 'block';
            document.getElementById('vehicle-criticals').style.display = 'none';
            document.getElementById('vehicle-motive').style.display = 'none';
        }
        
        function hubGoToVehicleCriticals() {
            clearCriticalInfoDisplays();
            document.getElementById('trr-hub-section').style.display = 'none';
            document.getElementById('vehicle-depot').style.display = 'block';
            document.getElementById('vehicle-depot-landing').style.display = 'none';
            document.getElementById('vehicle-locations').style.display = 'none';
            document.getElementById('vehicle-criticals').style.display = 'block';
            document.getElementById('vehicle-motive').style.display = 'none';
        }
        
        function hubGoToVehicleMotive() {
            clearCriticalInfoDisplays();
            document.getElementById('trr-hub-section').style.display = 'none';
            document.getElementById('vehicle-depot').style.display = 'block';
            document.getElementById('vehicle-depot-landing').style.display = 'none';
            document.getElementById('vehicle-locations').style.display = 'none';
            document.getElementById('vehicle-criticals').style.display = 'none';
            document.getElementById('vehicle-motive').style.display = 'block';
        }
        
        function hubGoToTRRCombat() {
            document.getElementById('trr-hub-section').style.display = 'none';
            document.getElementById('trr-infantry').style.display = 'block';
            document.getElementById('trr-landing').style.display = 'none';
            document.getElementById('trr-combat').style.display = 'block';
            document.getElementById('trr-weapons').style.display = 'none';
        }
        
        function hubGoToTRRWeapons() {
            document.getElementById('trr-hub-section').style.display = 'none';
            document.getElementById('trr-infantry').style.display = 'block';
            document.getElementById('trr-landing').style.display = 'none';
            document.getElementById('trr-combat').style.display = 'none';
            document.getElementById('trr-weapons').style.display = 'block';
        }
        
        function hubGoToClusterTable() {
            document.getElementById('trr-hub-section').style.display = 'none';
            document.getElementById('trr-utilities').style.display = 'block';
            document.getElementById('trr-utilities-landing').style.display = 'none';
            document.getElementById('cluster-table').style.display = 'block';
            const dmgGrouper = document.getElementById('damage-grouper');
            if (dmgGrouper) dmgGrouper.style.display = 'none';
            const modTable = document.getElementById('modifiers-table');
            if (modTable) modTable.style.display = 'none';
            // Generar la tabla de cluster
            if (typeof generateClusterTableHTML === 'function') {
                generateClusterTableHTML();
            }
        }
        
        function hubGoToDamageGrouper() {
            document.getElementById('trr-hub-section').style.display = 'none';
            document.getElementById('trr-utilities').style.display = 'block';
            document.getElementById('trr-utilities-landing').style.display = 'none';
            const clusterTable = document.getElementById('cluster-table');
            if (clusterTable) clusterTable.style.display = 'none';
            document.getElementById('damage-grouper').style.display = 'block';
            const modTable = document.getElementById('modifiers-table');
            if (modTable) modTable.style.display = 'none';
        }
        
        function hubGoToModifiersTable() {
            document.getElementById('trr-hub-section').style.display = 'none';
            document.getElementById('trr-utilities').style.display = 'block';
            document.getElementById('trr-utilities-landing').style.display = 'none';
            const clusterTable = document.getElementById('cluster-table');
            if (clusterTable) clusterTable.style.display = 'none';
            const dmgGrouper = document.getElementById('damage-grouper');
            if (dmgGrouper) dmgGrouper.style.display = 'none';
            document.getElementById('modifiers-table').style.display = 'block';
        }
        
        /**
         * Abre el Mapa Estelar desde el Hub de Ayudas
         */
        function hubGoToGalacticMap() {
            document.getElementById('trr-hub-section').style.display = 'none';
            document.getElementById('galactic-map').style.display = 'block';
        }
        
        /**
         * Vuelve al TRR Hub desde cualquier sub-sección
         */
        function backToTRRHub() {
            // Ocultar todas las secciones de TRR
            const trrInfantry = document.getElementById('trr-infantry');
            if (trrInfantry) trrInfantry.style.display = 'none';
            
            const trrUtilities = document.getElementById('trr-utilities');
            if (trrUtilities) trrUtilities.style.display = 'none';
            
            const mechHangar = document.getElementById('mech-hangar');
            if (mechHangar) mechHangar.style.display = 'none';
            
            const vehicleDepot = document.getElementById('vehicle-depot');
            if (vehicleDepot) vehicleDepot.style.display = 'none';
            
            // Resetear sub-secciones
            const trrLanding = document.getElementById('trr-landing');
            if (trrLanding) trrLanding.style.display = 'flex';
            const trrCombat = document.getElementById('trr-combat');
            if (trrCombat) trrCombat.style.display = 'none';
            const trrWeapons = document.getElementById('trr-weapons');
            if (trrWeapons) trrWeapons.style.display = 'none';
            
            const trrUtilitiesLanding = document.getElementById('trr-utilities-landing');
            if (trrUtilitiesLanding) trrUtilitiesLanding.style.display = 'flex';
            const clusterTable = document.getElementById('cluster-table');
            if (clusterTable) clusterTable.style.display = 'none';
            const damageGrouper = document.getElementById('damage-grouper');
            if (damageGrouper) damageGrouper.style.display = 'none';
            const modifiersTable = document.getElementById('modifiers-table');
            if (modifiersTable) modifiersTable.style.display = 'none';
            
            const mechLanding = document.getElementById('mech-hangar-landing');
            if (mechLanding) mechLanding.style.display = 'flex';
            const mechLocations = document.getElementById('mech-locations');
            if (mechLocations) mechLocations.style.display = 'none';
            const mechCriticals = document.getElementById('mech-criticals');
            if (mechCriticals) mechCriticals.style.display = 'none';
            
            const vehicleLanding = document.getElementById('vehicle-depot-landing');
            if (vehicleLanding) vehicleLanding.style.display = 'flex';
            const vehicleLocations = document.getElementById('vehicle-locations');
            if (vehicleLocations) vehicleLocations.style.display = 'none';
            const vehicleCriticals = document.getElementById('vehicle-criticals');
            if (vehicleCriticals) vehicleCriticals.style.display = 'none';
            const vehicleMotive = document.getElementById('vehicle-motive');
            if (vehicleMotive) vehicleMotive.style.display = 'none';
            
            // Ocultar Mapa Estelar
            const galacticMap = document.getElementById('galactic-map');
            if (galacticMap) galacticMap.style.display = 'none';
            
            // Mostrar TRR Hub
            document.getElementById('trr-hub-section').style.display = 'block';
            window.scrollTo(0, 0);
        }

        // TABLAS TRR INFANTERÍA
        const INFANTRY_TABLE = {
            "11": "Brazo Izquierdo", "12": "Brazo Izquierdo", "13": "Brazo Izquierdo",
            "14": "Pierna Izquierda", "15": "Pierna Derecha", "16": "Pierna Derecha",
            "21": "Pierna Derecha", "22": "Pierna Derecha", "23": "Pierna Derecha",
            "24": "Cabeza", "25": "Cabeza", "26": "Cabeza",
            "31": "Cabeza", "32": "Brazo Izquierdo", "33": "Torso", "34": "Torso",
            "35": "Torso", "36": "Torso", "41": "Torso", "42": "Torso", "43": "Torso",
            "44": "Torso", "45": "Torso", "46": "Torso", "51": "Torso", "52": "Torso",
            "53": "Brazo Derecho", "54": "Brazo Derecho", "55": "Brazo Derecho", "56": "Brazo Derecho",
            "61": "Brazo Derecho", "62": "Pierna Izquierda", "63": "Pierna Izquierda",
            "64": "Pierna Izquierda", "65": "Pierna Izquierda", "66": "Pierna Izquierda"
        };

        const CRIT_TRIGGER_MAP = {
            "11": "Brazo", "22": "Pierna", "33": "Torso",
            "44": "Torso", "55": "Brazo", "66": "Pierna"
        };

        const CRIT_TABLES = {
            "Brazo": { 1: "Hombro dislocado", 2: "Brazo fracturado", 3: "Hemorragia interna 1", 4: "Muñeca fracturada", 5: "Dedo(s) amputado(s)", 6: "Codo destrozado" },
            "Pierna": { 1: "Ligamentos rotos", 2: "Hemorragia interna 1", 3: "Pierna fracturada", 4: "Tobillo destrozado", 5: "Hemorragia interna 2", 6: "Pie amputado" },
            "Torso": { 1: "Costillas rotas", 2: "Hemorragia interna 1", 3: "Esternón roto", 4: "Hemorragia interna 2", 5: "Pulmón perforado", 6: "Bazo perforado" }
        };

        const INJURY_TO_RULE = {
            "Hombro dislocado": "HOMBRO DISLOCADO", "Brazo fracturado": "HUESOS ROTOS", "Muñeca fracturada": "HUESOS ROTOS", "Pierna fracturada": "HUESOS ROTOS", 
            "Costillas rotas": "COSTILLAS ROTAS", "Esternón roto": "HUESOS ROTOS", "Hemorragia interna 1": "HEMORRAGIA INTERNA I", "Hemorragia interna 2": "HEMORRAGIA INTERNA II", 
            "Dedo(s) amputado(s)": "DEDO(S) CERCENADO(S)", "Codo destrozado": "CODO/TOBILLO DESTROZADO", "Ligamentos rotos": "LIGAMENTOS DESGARRADOS", 
            "Tobillo destrozado": "CODO/TOBILLO DESTROZADO", "Pie amputado": "PIE ARRANCADO", "Pulmón perforado": "PULMÓN PERFORADO", "Bazo perforado": "BAZO PERFORADO"
        };

        const CRIT_RULES = {
            "HUESOS ROTOS": "Un tercero debe recolocar el hueso para que pueda soldarse de nuevo. Para determinar si el hueso está bien colocado, haz una tirada de habilidad de 2D6 contra un Objetivo de 9, restando 2 por cada nivel de habilidad en Medicina/Primeros Auxilios. Los huesos mal colocados tardan el doble en sanar y son propensos a volver a lesionarse.",
            "HOMBRO DISLOCADO": "Durante dos semanas, esta lesión añade +2 a todas las tiradas de combate o de habilidad basadas en DES realizadas con el brazo afectado.",
            "HEMORRAGIA INTERNA I": "Las lesiones de la víctima causan hemorragia interna. El médico tratante debe hacer una Tirada de Habilidad de Emergencia contra su Objetivo de Habilidad Médica +3 para salvar la vida, o la víctima muere en 2D6 horas. Añade 1 al Objetivo por cada hora de retraso.",
            "HEMORRAGIA INTERNA II": "Igual que Hemorragia I, pero la Tirada de Emergencia es contra Objetivo de Habilidad Médica +6, y el penalizador aumenta +1 por cada 15 minutos de retraso.",
            "DEDO(S) CERCENADO(S)": "Un personaje pierde de 1 a 3 dedos (1D6: 1-3=1, 4-5=2, 6=3). Reduce en 1 todas las Tiradas de Impacto (si es la mano de disparo) y las tiradas de DES para destreza manual con esa mano.",
            "CODO/TOBILLO DESTROZADO": "Requiere cirugía delicada. El médico debe hacer Tirada de Emergencia contra Objetivo +5. Éxito: trata como hueso roto normal. Fallo: discapacidad permanente (salvo reemplazo biónico).",
            "LIGAMENTOS DESGARRADOS": "El personaje sufre una reducción de la mitad en su capacidad de PM caminando durante 1D6 x 1D6 días. No puede Correr/Esquivar o Sprintar hasta sanar.",
            "PIE ARRANCADO": "El pie es arrancado. Médico con Nivel 4+ puede intentar reimplantar en 30 min (Tirada Emergencia Objetivo +6). Éxito: trata como pierna rota. Fallo: lisiado (PM reducidos 2/3) hasta biónico.",
            "COSTILLAS ROTAS": "La capacidad de PM se reduce en 1 durante tres semanas. No se permite levantar pesos pesados.",
            "PULMÓN PERFORADO": "Médico debe hacer Tirada Emergencia contra Objetivo +4 o resulta en peritonitis (entonces víctima tira Constitución +2 o muere). Si vive, mitad de PM durante 2D6 semanas.",
            "BAZO PERFORADO": "Médico debe hacer Tirada Emergencia contra Objetivo +4 para salvar la vida. Fallo: muerte. Éxito: 12 semanas de recuperación."
        };

        let currentCritLocation = "";

        function rollHitLocation() {
            // Tirar dos dados d6
            const dice1 = Math.floor(Math.random() * 6) + 1;
            const dice2 = Math.floor(Math.random() * 6) + 1;
                // Mostrar dados con animación
            document.getElementById('dice1').textContent = dice1;
            document.getElementById('dice2').textContent = dice2;
                // Construir resultado (11-66)
            const result = "" + dice1 + dice2;
                processHitResult(result);
        }

        function processHitResult(result) {
            // Buscar localización
            const location = INFANTRY_TABLE[result];
                // Mostrar resultado
            document.getElementById('hit-location-text').textContent = location;
                // Ocultar resultados anteriores de crítico
            document.getElementById('crit-result').style.display = 'none';
                // Remover highlight anterior
            document.querySelectorAll('.trr-row-table').forEach(row => {
                const rowResult = row.getAttribute('data-result');
                const isCritical = (rowResult[0] === rowResult[1]);
                        if (isCritical) {
                    row.style.background = 'rgba(183, 28, 28, 0.15)';
                } else {
                    row.style.background = '';
                }
            });
                // Highlight de la fila seleccionada
            const selectedRow = document.querySelector(`.trr-row-table[data-result="${result}"]`);
            if (selectedRow) {
                selectedRow.style.background = 'rgba(183, 28, 28, 0.4)';
            }
                // Verificar si es crítico (dobles)
            const dice1 = result[0];
            const dice2 = result[1];
                if (dice1 === dice2 && CRIT_TRIGGER_MAP[result]) {
                currentCritLocation = CRIT_TRIGGER_MAP[result];
                document.getElementById('crit-location-type').textContent = currentCritLocation;
                document.getElementById('crit-alert').style.display = 'block';
            } else {
                document.getElementById('crit-alert').style.display = 'none';
                currentCritLocation = "";
            }
        }

        function selectHitFromTable(result) {
            // Simular que se tiraron los dados con ese resultado
            const dice1 = parseInt(result[0]);
            const dice2 = parseInt(result[1]);
                document.getElementById('dice1').textContent = dice1;
            document.getElementById('dice2').textContent = dice2;
                processHitResult(result);
        }

        function clearResults() {
            // Limpiar dados
            document.getElementById('dice1').textContent = '-';
            document.getElementById('dice2').textContent = '-';
                // Limpiar localización
            document.getElementById('hit-location-text').textContent = '-';
                // Ocultar resultados
            document.getElementById('crit-alert').style.display = 'none';
            document.getElementById('crit-result').style.display = 'none';
                // Remover highlights
            document.querySelectorAll('.trr-row-table').forEach(row => {
                const result = row.getAttribute('data-result');
                const isCritical = (result[0] === result[1]);
                        if (isCritical) {
                    row.style.background = 'rgba(183, 28, 28, 0.15)';
                } else {
                    row.style.background = '';
                }
            });
                currentCritLocation = "";
        }

        function rollCritical() {
            if (!currentCritLocation) return;
                // Tirar 1d6
            const critRoll = Math.floor(Math.random() * 6) + 1;
                // Buscar lesión en la tabla correspondiente
            const injury = CRIT_TABLES[currentCritLocation][critRoll];
            const ruleName = INJURY_TO_RULE[injury];
            const consequences = CRIT_RULES[ruleName];
                // Mostrar resultado
            document.getElementById('crit-dice-value').textContent = critRoll;
            document.getElementById('crit-injury-name').textContent = injury.toUpperCase();
            document.getElementById('crit-consequences').textContent = consequences;
            document.getElementById('crit-result').style.display = 'block';
        }

        // Añadir event listeners a las filas de la tabla cuando cargue la página
        document.addEventListener('DOMContentLoaded', function() {
            // Event listeners para las filas de tabla
            document.querySelectorAll('.trr-row-table').forEach(row => {
                row.addEventListener('click', function() {
                    const result = this.getAttribute('data-result');
                    selectHitFromTable(result);
                });
                        // Hover effect para tablas
                row.addEventListener('mouseenter', function() {
                    const currentBg = this.style.background;
                    if (!currentBg.includes('rgba(183, 28, 28, 0.4)')) {
                        this.style.background = 'rgba(183, 28, 28, 0.3)';
                    }
                });
                        row.addEventListener('mouseleave', function() {
                    const result = this.getAttribute('data-result');
                                // Solo restaurar el fondo si no está seleccionado
                    if (this.style.background !== 'rgba(183, 28, 28, 0.4)') {
                        // Verificar si es crítico (11, 22, 33, 44, 55, 66)
                        const isCritical = (result[0] === result[1]);
                        if (isCritical) {
                            this.style.background = 'rgba(183, 28, 28, 0.15)';
                        } else {
                            this.style.background = '';
                        }
                    }
                });
            });
                // Cargar tabla de armas al inicio
            loadWeaponsTable();
        });

        // NAVEGACIÓN TRR SUBSECCIONES
        function goToTRRCombat() {
            document.getElementById('trr-landing').style.display = 'none';
            document.getElementById('trr-combat').style.display = 'block';
            document.getElementById('trr-weapons').style.display = 'none';
        }

        function goToTRRWeapons() {
            document.getElementById('trr-landing').style.display = 'none';
            document.getElementById('trr-combat').style.display = 'none';
            document.getElementById('trr-weapons').style.display = 'block';
        }

        // NAVEGACIÓN TRR UTILIDADES
        function goToTRRUtilities() {
            document.getElementById('landing-page').style.display = 'none';
            document.getElementById('trr-utilities').style.display = 'block';
            document.getElementById('trr-utilities-landing').style.display = 'flex';
            document.getElementById('cluster-table').style.display = 'none';
            document.getElementById('damage-grouper').style.display = 'none';
            document.getElementById('modifiers-table').style.display = 'none';
            document.getElementById('pre-generacion').style.display = 'none';
            document.getElementById('ficha-container').style.display = 'none';
            document.getElementById('points-counter').style.display = 'none';
        }

        /**
         * Navega a la sección de Tabla de Clúster de Misiles
         * Oculta todas las demás secciones de TRR Utilities y genera la tabla dinámicamente
         * 
         * @returns {void}
         * 
         * ELEMENTOS DOM MODIFICADOS:
         * - #trr-utilities-landing: Landing page de TRR Utilities (oculto)
         * - #cluster-table: Sección de tabla de clúster (visible)
         * - #damage-grouper: Sección de agrupador de daños (oculto)
         * - #modifiers-table: Sección de tabla de modificadores (oculto)
         * 
         * VALIDACIONES:
         * - Verifica que todos los elementos DOM existan antes de modificarlos
         * - Si falta algún elemento, registra warning en consola pero continúa
         * 
         * EFECTOS SECUNDARIOS:
         * - Llama a generateClusterTableHTML() para construir la tabla
         * - Si la tabla ya existe, la regenera (previene contenido obsoleto)
         * 
         * LLAMADO POR:
         * - Botón "🎯 TABLA DE CLUSTER" en TRR Utilities Landing
         * 
         * NOTAS DE MANTENIMIENTO:
         * - Para añadir nuevas secciones, añadir línea display='none'
         * - Mantener generateClusterTableHTML() al final
         */
        function goToClusterTable() {
            // VALIDACIÓN: Verificar existencia de elementos críticos
            const landingElement = document.getElementById('trr-utilities-landing');
            const clusterElement = document.getElementById('cluster-table');
            const grouperElement = document.getElementById('damage-grouper');
            const modifiersElement = document.getElementById('modifiers-table');
                // Verificar landing (crítico)
            if (!landingElement) {
                console.error('goToClusterTable: Elemento trr-utilities-landing no encontrado');
                return;
            }
                // Verificar cluster table (crítico)
            if (!clusterElement) {
                console.error('goToClusterTable: Elemento cluster-table no encontrado');
                return;
            }
                // Verificar elementos opcionales (solo warnings)
            if (!grouperElement) {
                console.warn('goToClusterTable: Elemento damage-grouper no encontrado');
            }
            if (!modifiersElement) {
                console.warn('goToClusterTable: Elemento modifiers-table no encontrado');
            }
                // NAVEGACIÓN: Ocultar todas las secciones
            landingElement.style.display = 'none';
            if (grouperElement) grouperElement.style.display = 'none';
            if (modifiersElement) modifiersElement.style.display = 'none';
                // Mostrar sección de cluster
            clusterElement.style.display = 'block';
                // GENERACIÓN: Construir tabla HTML dinámicamente
            // Esto se hace cada vez para asegurar contenido actualizado
            try {
                generateClusterTableHTML();
            } catch (error) {
                console.error('goToClusterTable: Error al generar tabla de clúster:', error);
            }
        }
        /**
         * Navega a la sección de Agrupador de Daños de Misiles
         * Oculta todas las demás secciones de TRR Utilities
         * 
         * @returns {void}
         * 
         * ELEMENTOS DOM MODIFICADOS:
         * - #trr-utilities-landing: Landing page de TRR Utilities (oculto)
         * - #cluster-table: Sección de tabla de clúster (oculto)
         * - #damage-grouper: Sección de agrupador de daños (visible)
         * - #modifiers-table: Sección de tabla de modificadores (oculto)
         * 
         * VALIDACIONES:
         * - Verifica que todos los elementos DOM existan antes de modificarlos
         * - Si falta algún elemento crítico, aborta la operación
         * 
         * LLAMADO POR:
         * - Botón "💥 AGRUPADOR DE DAÑOS" en TRR Utilities Landing
         * 
         * NOTAS:
         * - No requiere generación dinámica (contenido estático)
         * - Los resultados se generan al usar procesarMisiles()
         */
        function goToDamageGrouper() {
            // VALIDACIÓN: Verificar existencia de elementos críticos
            const landingElement = document.getElementById('trr-utilities-landing');
            const clusterElement = document.getElementById('cluster-table');
            const grouperElement = document.getElementById('damage-grouper');
            const modifiersElement = document.getElementById('modifiers-table');
                // Verificar landing (crítico)
            if (!landingElement) {
                console.error('goToDamageGrouper: Elemento trr-utilities-landing no encontrado');
                return;
            }
                // Verificar damage grouper (crítico)
            if (!grouperElement) {
                console.error('goToDamageGrouper: Elemento damage-grouper no encontrado');
                return;
            }
                // Verificar elementos opcionales (solo warnings)
            if (!clusterElement) {
                console.warn('goToDamageGrouper: Elemento cluster-table no encontrado');
            }
            if (!modifiersElement) {
                console.warn('goToDamageGrouper: Elemento modifiers-table no encontrado');
            }
                // NAVEGACIÓN: Ocultar todas las secciones
            landingElement.style.display = 'none';
            if (clusterElement) clusterElement.style.display = 'none';
            if (modifiersElement) modifiersElement.style.display = 'none';
                // Mostrar sección de agrupador
            grouperElement.style.display = 'block';
        }
        /**
         * Navega a la sección de Tabla de Modificadores
         * Oculta todas las demás secciones de TRR Utilities
         * 
         * @returns {void}
         * 
         * ELEMENTOS DOM MODIFICADOS:
         * - #trr-utilities-landing: Landing page de TRR Utilities (oculto)
         * - #cluster-table: Sección de tabla de clúster (oculto)
         * - #damage-grouper: Sección de agrupador de daños (oculto)
         * - #modifiers-table: Sección de tabla de modificadores (visible)
         * 
         * VALIDACIONES:
         * - Verifica que todos los elementos DOM existan antes de modificarlos
         * - Si falta algún elemento crítico, aborta la operación
         * 
         * LLAMADO POR:
         * - Botón "📊 TABLA DE MODIFICADORES" en TRR Utilities Landing
         * 
         * NOTAS:
         * - Tabla de modificadores es contenido estático
         * - No requiere generación dinámica
         */
        function goToModifiersTable() {
            // VALIDACIÓN: Verificar existencia de elementos críticos
            const landingElement = document.getElementById('trr-utilities-landing');
            const clusterElement = document.getElementById('cluster-table');
            const grouperElement = document.getElementById('damage-grouper');
            const modifiersElement = document.getElementById('modifiers-table');
                // Verificar landing (crítico)
            if (!landingElement) {
                console.error('goToModifiersTable: Elemento trr-utilities-landing no encontrado');
                return;
            }
                // Verificar modifiers table (crítico)
            if (!modifiersElement) {
                console.error('goToModifiersTable: Elemento modifiers-table no encontrado');
                return;
            }
                // Verificar elementos opcionales (solo warnings)
            if (!clusterElement) {
                console.warn('goToModifiersTable: Elemento cluster-table no encontrado');
            }
            if (!grouperElement) {
                console.warn('goToModifiersTable: Elemento damage-grouper no encontrado');
            }
                // NAVEGACIÓN: Ocultar todas las secciones
            landingElement.style.display = 'none';
            if (clusterElement) clusterElement.style.display = 'none';
            if (grouperElement) grouperElement.style.display = 'none';
                // Mostrar sección de modificadores
            modifiersElement.style.display = 'block';
        }
        /**
         * Regresa al landing page de TRR Utilities
         * Oculta todas las subsecciones y muestra el menú principal
         * 
         * @returns {void}
         * 
         * ELEMENTOS DOM MODIFICADOS:
         * - #trr-utilities-landing: Landing page de TRR Utilities (visible con display: flex)
         * - #cluster-table: Sección de tabla de clúster (oculto)
         * - #damage-grouper: Sección de agrupador de daños (oculto)
         * - #modifiers-table: Sección de tabla de modificadores (oculto)
         * 
         * VALIDACIONES:
         * - Verifica que el elemento landing exista (crítico)
         * - Verifica existencia de subsecciones (opcional, solo warnings)
         * 
         * DISPLAY MODE:
         * - Landing usa display: flex (no block) para centrado vertical
         * - Subsecciones usan display: none
         * 
         * LLAMADO POR:
         * - Botón "⬅️ VOLVER" en cada subsección de TRR Utilities
         * 
         * NOTAS:
         * - Esta función es el "home" de TRR Utilities
         * - No confundir con goHomeNoConfirm() que va al menú principal global
         */
        // NAVEGACIÓN MECH HANGAR
        function goToMechHangar() {
            document.getElementById('landing-page').style.display = 'none';
            document.getElementById('mech-hangar').style.display = 'block';
            document.getElementById('mech-hangar-landing').style.display = 'flex';
            document.getElementById('mech-locations').style.display = 'none';
            document.getElementById('mech-criticals').style.display = 'none';
            document.getElementById('pre-generacion').style.display = 'none';
            document.getElementById('ficha-container').style.display = 'none';
            document.getElementById('points-counter').style.display = 'none';
        }

        function goToMechLocations() {
            document.getElementById('mech-hangar-landing').style.display = 'none';
            document.getElementById('mech-locations').style.display = 'block';
            document.getElementById('mech-criticals').style.display = 'none';
        }

        function goToMechCriticals() {
            document.getElementById('mech-hangar-landing').style.display = 'none';
            document.getElementById('mech-locations').style.display = 'none';
            document.getElementById('mech-criticals').style.display = 'block';
        }

        // NAVEGACIÓN DEPOSITO DE VEHICULOS
        function goToVehicleDepot() {
            clearCriticalInfoDisplays();
            document.getElementById('landing-page').style.display = 'none';
            document.getElementById('vehicle-depot').style.display = 'block';
            document.getElementById('vehicle-depot-landing').style.display = 'flex';
            document.getElementById('vehicle-locations').style.display = 'none';
            document.getElementById('vehicle-criticals').style.display = 'none';
            document.getElementById('vehicle-motive').style.display = 'none';
            document.getElementById('pre-generacion').style.display = 'none';
            document.getElementById('ficha-container').style.display = 'none';
            document.getElementById('points-counter').style.display = 'none';
        }

        function goToVehicleLocations() {
            clearCriticalInfoDisplays();
            document.getElementById('vehicle-depot-landing').style.display = 'none';
            document.getElementById('vehicle-locations').style.display = 'block';
            document.getElementById('vehicle-criticals').style.display = 'none';
            document.getElementById('vehicle-motive').style.display = 'none';
        }

        function goToVehicleCriticals() {
            clearCriticalInfoDisplays();
            document.getElementById('vehicle-depot-landing').style.display = 'none';
            document.getElementById('vehicle-locations').style.display = 'none';
            document.getElementById('vehicle-criticals').style.display = 'block';
            document.getElementById('vehicle-motive').style.display = 'none';
        }

        function goToVehicleMotive() {
            clearCriticalInfoDisplays();
            document.getElementById('vehicle-depot-landing').style.display = 'none';
            document.getElementById('vehicle-locations').style.display = 'none';
            document.getElementById('vehicle-criticals').style.display = 'none';
            document.getElementById('vehicle-motive').style.display = 'block';
            window.scrollTo(0, 0);
        }

        // ============================================================================
        // NAVEGACIÓN TRO: TECHNICAL READOUT
        // ============================================================================
        function goToTRO() {
            document.getElementById('landing-page').style.display = 'none';
            document.getElementById('tro-section').style.display = 'block';
            document.getElementById('pre-generacion').style.display = 'none';
            document.getElementById('ficha-container').style.display = 'none';
            document.getElementById('points-counter').style.display = 'none';
            // Limpiar búsqueda anterior
            document.getElementById('tro-search-input').value = '';
            document.getElementById('tro-results').innerHTML = '';
            document.getElementById('tro-unit-detail').innerHTML = '';
            updateTROStats();
        }

        function backToHomeFromTRO() {
            document.getElementById('tro-section').style.display = 'none';
            document.getElementById('landing-page').style.display = 'flex';
        }

        function updateTROStats() {
            document.getElementById('tro-mech-count').textContent = MECH_DATABASE.length;
            document.getElementById('tro-vehicle-count').textContent = VEHICLE_DATABASE.length;
            document.getElementById('tro-total-count').textContent = MECH_DATABASE.length + VEHICLE_DATABASE.length;
            updateTROBattleTrackerBanner();
        }

        function updateTROBattleTrackerBanner() {
            // Verificar cuántas unidades hay en el Battle Tracker
            if (typeof btState !== 'undefined' && btState.enemies) {
                const count = btState.enemies.length;
                const queueBox = document.getElementById('tro-bt-queue-box');
                const queueCount = document.getElementById('tro-bt-queue-count');
                const banner = document.getElementById('tro-bt-banner');
                const bannerCount = document.getElementById('tro-bt-banner-count');
                
                if (count > 0) {
                    queueBox.style.display = 'block';
                    queueCount.textContent = count;
                    banner.style.display = 'flex';
                    bannerCount.textContent = count;
                } else {
                    queueBox.style.display = 'none';
                    banner.style.display = 'none';
                }
            }
        }

        function goToBattleTrackerFromTRO() {
            document.getElementById('tro-section').style.display = 'none';
            goToBattleTracker();
        }

        function troSearch() {
            const query = document.getElementById('tro-search-input').value.trim();
            const filterType = document.getElementById('tro-filter-type').value;
            const resultsDiv = document.getElementById('tro-results');
            
            if (query.length < 2) {
                resultsDiv.innerHTML = '<div class="tro-message">Ingresa al menos 2 caracteres para buscar...</div>';
                return;
            }

            let mechs = [];
            let vehicles = [];

            if (filterType === 'all' || filterType === 'mech') {
                mechs = searchMechs(query);
            }
            if (filterType === 'all' || filterType === 'vehicle') {
                vehicles = searchVehicles(query);
            }

            let html = '';

            if (mechs.length === 0 && vehicles.length === 0) {
                html = '<div class="tro-message">No se encontraron unidades con ese término.</div>';
            } else {
                if (mechs.length > 0) {
                    html += '<div class="tro-category-header">🤖 BATTLEMECHS (' + mechs.length + ')</div>';
                    html += '<div class="tro-results-grid">';
                    mechs.forEach(mech => {
                        html += `<div class="tro-result-card" onclick="showTRODetail('mech', '${mech.name.replace(/'/g, "\\'")}')">
                            <div class="tro-result-name">${mech.name}</div>
                            <div class="tro-result-bv">BV2: ${mech.bv2}</div>
                        </div>`;
                    });
                    html += '</div>';
                }

                if (vehicles.length > 0) {
                    html += '<div class="tro-category-header">🚛 VEHÍCULOS (' + vehicles.length + ')</div>';
                    html += '<div class="tro-results-grid">';
                    vehicles.forEach(vehicle => {
                        html += `<div class="tro-result-card vehicle" onclick="showTRODetail('vehicle', '${vehicle.name.replace(/'/g, "\\'")}')">
                            <div class="tro-result-name">${vehicle.name}</div>
                            <div class="tro-result-bv">BV2: ${vehicle.bv2}</div>
                            <div class="tro-result-type">${vehicle.type}</div>
                        </div>`;
                    });
                    html += '</div>';
                }
            }

            resultsDiv.innerHTML = html;
        }

        function showTRODetail(type, name) {
            const detailDiv = document.getElementById('tro-unit-detail');
            let unit = type === 'mech' ? getMechByName(name) : getVehicleByName(name);
            
            if (!unit) {
                detailDiv.innerHTML = '<div class="tro-message">Unidad no encontrada.</div>';
                return;
            }

            let html = '<div class="tro-detail-card">';
            html += '<div class="tro-detail-header">';
            html += type === 'mech' ? '🤖 BATTLEMECH' : '🚛 VEHÍCULO';
            html += '</div>';
            html += '<div class="tro-detail-name">' + unit.name + '</div>';
            html += '<div class="tro-detail-stats">';
            html += '<div class="tro-stat"><span class="tro-stat-label">Battle Value 2:</span> <span class="tro-stat-value">' + unit.bv2 + '</span></div>';
            if (unit.type) {
                html += '<div class="tro-stat"><span class="tro-stat-label">Tipo:</span> <span class="tro-stat-value">' + unit.type + '</span></div>';
            }
            html += '</div>';
            
            // Botón para enviar al Battle Tracker
            html += '<div class="tro-action-buttons" style="margin-top: 20px; display: flex; gap: 10px; flex-wrap: wrap;">';
            html += `<button class="tro-send-btn" onclick="sendToBattleTracker('${unit.name.replace(/'/g, "\\'")}', ${unit.bv2})" style="
                background: linear-gradient(135deg, #b71c1c 0%, #8b0000 100%);
                border: 2px solid #ff4444;
                color: #fff;
                padding: 12px 25px;
                font-family: 'Share Tech Mono', monospace;
                font-size: 13px;
                font-weight: bold;
                cursor: pointer;
                text-transform: uppercase;
                letter-spacing: 1px;
                transition: all 0.3s;
                clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
            " onmouseover="this.style.boxShadow='0 0 20px rgba(255, 68, 68, 0.6)'; this.style.transform='scale(1.02)'" 
               onmouseout="this.style.boxShadow='none'; this.style.transform='scale(1)'">
                🎯 ENVIAR A BATTLE TRACKER
            </button>`;
            html += `<button class="tro-send-btn" onclick="sendToBattleTrackerStay('${unit.name.replace(/'/g, "\\'")}', ${unit.bv2})" style="
                background: rgba(183, 28, 28, 0.3);
                border: 1px solid #b71c1c;
                color: #ff8c42;
                padding: 12px 25px;
                font-family: 'Share Tech Mono', monospace;
                font-size: 13px;
                font-weight: bold;
                cursor: pointer;
                text-transform: uppercase;
                letter-spacing: 1px;
                transition: all 0.3s;
            " onmouseover="this.style.background='rgba(183, 28, 28, 0.5)'" 
               onmouseout="this.style.background='rgba(183, 28, 28, 0.3)'">
                ➕ AÑADIR (QUEDARSE AQUÍ)
            </button>`;
            html += '</div>';
            
            // Buscar variantes del mismo chasis
            const chassisName = unit.name.split(' ')[0];
            let variants = type === 'mech' 
                ? MECH_DATABASE.filter(m => m.name.startsWith(chassisName) && m.name !== unit.name)
                : VEHICLE_DATABASE.filter(v => v.name.startsWith(chassisName) && v.name !== unit.name);
            
            if (variants.length > 0) {
                html += '<div class="tro-variants-header">Otras variantes de ' + chassisName + ':</div>';
                html += '<div class="tro-variants-list">';
                variants.slice(0, 10).forEach(v => {
                    html += `<span class="tro-variant-tag" onclick="showTRODetail('${type}', '${v.name.replace(/'/g, "\\'")}')">${v.name.split(' ').slice(1).join(' ')} (${v.bv2})</span>`;
                });
                if (variants.length > 10) {
                    html += '<span class="tro-variant-more">+' + (variants.length - 10) + ' más</span>';
                }
                html += '</div>';
            }
            
            html += '</div>';
            detailDiv.innerHTML = html;
            detailDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Función para enviar unidad al Battle Tracker e ir allí
        function sendToBattleTracker(unitName, bv2) {
            // Añadir al estado del Battle Tracker
            const enemy = {
                id: Date.now().toString(),
                name: unitName,
                xp: bv2
            };
            
            // Asegurarse de que btState existe
            if (typeof btState !== 'undefined') {
                btState.enemies.push(enemy);
                btState.hits[enemy.id] = Array(btState.numPlayers).fill(0);
                btState.deadEnemies[enemy.id] = true;
                console.log('🎯 Unidad enviada al Battle Tracker:', enemy);
            }
            
            // Ir al Battle Tracker
            document.getElementById('tro-section').style.display = 'none';
            goToBattleTracker();
            
            // Actualizar la lista de enemigos
            if (typeof renderEnemiesList === 'function') {
                renderEnemiesList();
                updateStartButton();
            }
        }

        // Función para añadir unidad al Battle Tracker sin salir del TRO
        function sendToBattleTrackerStay(unitName, bv2) {
            // Añadir al estado del Battle Tracker
            const enemy = {
                id: Date.now().toString(),
                name: unitName,
                xp: bv2
            };
            
            // Asegurarse de que btState existe
            if (typeof btState !== 'undefined') {
                btState.enemies.push(enemy);
                btState.hits[enemy.id] = Array(btState.numPlayers).fill(0);
                btState.deadEnemies[enemy.id] = true;
                console.log('➕ Unidad añadida al Battle Tracker:', enemy);
                
                // Actualizar banner del Battle Tracker
                updateTROBattleTrackerBanner();
                
                // Mostrar confirmación visual
                const detailDiv = document.getElementById('tro-unit-detail');
                const confirmMsg = document.createElement('div');
                confirmMsg.id = 'tro-confirm-msg';
                confirmMsg.style.cssText = 'background: rgba(22, 163, 74, 0.2); border: 1px solid #22c55e; color: #22c55e; padding: 10px 15px; margin-top: 15px; font-family: "Share Tech Mono", monospace; text-align: center; animation: fadeIn 0.3s;';
                confirmMsg.innerHTML = '✅ <strong>' + unitName + '</strong> añadido al Battle Tracker (BV2: ' + bv2 + ')';
                
                // Remover mensaje anterior si existe
                const oldMsg = document.getElementById('tro-confirm-msg');
                if (oldMsg) oldMsg.remove();
                
                detailDiv.querySelector('.tro-detail-card').appendChild(confirmMsg);
                
                // Remover mensaje después de 3 segundos
                setTimeout(() => {
                    const msg = document.getElementById('tro-confirm-msg');
                    if (msg) msg.remove();
                }, 3000);
            }
        }

        function troBrowseByType(type) {
            const resultsDiv = document.getElementById('tro-results');
            let units = [];
            let title = '';

            switch(type) {
                case 'mech-light':
                    units = MECH_DATABASE.filter(m => m.bv2 < 800);
                    title = '🤖 BATTLEMECHS LIGEROS (BV2 < 800)';
                    break;
                case 'mech-medium':
                    units = MECH_DATABASE.filter(m => m.bv2 >= 800 && m.bv2 < 1200);
                    title = '🤖 BATTLEMECHS MEDIOS (BV2 800-1199)';
                    break;
                case 'mech-heavy':
                    units = MECH_DATABASE.filter(m => m.bv2 >= 1200 && m.bv2 < 1600);
                    title = '🤖 BATTLEMECHS PESADOS (BV2 1200-1599)';
                    break;
                case 'mech-assault':
                    units = MECH_DATABASE.filter(m => m.bv2 >= 1600);
                    title = '🤖 BATTLEMECHS DE ASALTO (BV2 1600+)';
                    break;
                case 'vehicle-hover':
                    units = VEHICLE_DATABASE.filter(v => v.type === 'Hover');
                    title = '🚛 VEHÍCULOS HOVER';
                    break;
                case 'vehicle-tracked':
                    units = VEHICLE_DATABASE.filter(v => v.type === 'Tracked');
                    title = '🚛 VEHÍCULOS TRACKED (ORUGAS)';
                    break;
                case 'vehicle-wheeled':
                    units = VEHICLE_DATABASE.filter(v => v.type === 'Wheeled');
                    title = '🚛 VEHÍCULOS WHEELED (RUEDAS)';
                    break;
                case 'vehicle-vtol':
                    units = VEHICLE_DATABASE.filter(v => v.type === 'VTOL');
                    title = '🚁 VTOL / HELICOPTEROS';
                    break;
            }

            units.sort((a, b) => a.bv2 - b.bv2);

            let html = '<div class="tro-category-header">' + title + ' (' + units.length + ')</div>';
            html += '<div class="tro-results-grid">';
            
            const isMech = type.startsWith('mech');
            units.forEach(unit => {
                html += `<div class="tro-result-card ${isMech ? '' : 'vehicle'}" onclick="showTRODetail('${isMech ? 'mech' : 'vehicle'}', '${unit.name.replace(/'/g, "\\'")}')">
                    <div class="tro-result-name">${unit.name}</div>
                    <div class="tro-result-bv">BV2: ${unit.bv2}</div>
                    ${unit.type ? '<div class="tro-result-type">' + unit.type + '</div>' : ''}
                </div>`;
            });
            
            html += '</div>';
            resultsDiv.innerHTML = html;
        }

        // NAVEGACIÓN BARRACONES
        function goToBarracones() {
            console.log('🎯 goToBarracones() llamada');
                // Poblar selectores de armas PRIMERO
            poblarSelectoresArmasBarracones();
                // Intentar cargar datos del generador antes de ir a Barracones
            const nombrePersonaje = document.getElementById('select-nombre')?.value;
            console.log('📊 Nombre en generador:', nombrePersonaje);
                if (nombrePersonaje) {
                console.log('✅ Hay datos en el generador, cargando en Barracones...');
                // Recoger todos los datos del generador
                const datos = recogerDatosDeUI();
                console.log('📦 Datos del generador:', datos);
                // Cargar en Barracones
                rellenarBarraconesDesdeGenerador(datos);
            } else {
                console.log('⚠️ No hay datos en el generador');
            }
                // Cambiar a vista de Barracones
            document.getElementById('landing-page').style.display = 'none';
            document.getElementById('barracones').style.display = 'block';
            document.getElementById('pre-generacion').style.display = 'none';
            document.getElementById('ficha-container').style.display = 'none';
            document.getElementById('points-counter').style.display = 'none';
                // Mostrar barra de herramientas de Barracones
            const toolbar = document.getElementById('barracones-toolbar');
            console.log('🔍 Toolbar element:', toolbar);
            if (toolbar) {
                toolbar.style.display = 'block';
                console.log('✅ Toolbar display set to block');
                console.log('📊 Toolbar computed style:', window.getComputedStyle(toolbar).display);
                console.log('📊 Toolbar z-index:', window.getComputedStyle(toolbar).zIndex);
            } else {
                console.error('❌ Toolbar element not found!');
            }
        }

        // TABLA DE ARMAS DE INFANTERÍA
        const INFANTRY_WEAPON_TABLE = [
            { name: "Arco Corto", dmg: "1D6+1", s: "2", m: "5", l: "8", car: "8", rec: "1", w: "2", tipo: "Arco", especial: "Insonoro", clase: "Arco", size: "Pequeño" },
            { name: "Arco Largo", dmg: "2D6+3", s: "4", m: "9", l: "14", car: "8", rec: "1", w: "3", tipo: "Arco", especial: "Insonoro", clase: "Arco", size: "Medio" },
            { name: "Ballesta Ligera", dmg: "2D6", s: "2", m: "5", l: "10", car: "1", rec: "1", w: "4", tipo: "Rifle", especial: "Insonoro", clase: "Ballesta", size: "Medio" },
            { name: "Ballesta Pesada", dmg: "2D6+3", s: "3", m: "7", l: "13", car: "1", rec: "1", w: "6", tipo: "Rifle", especial: "Insonoro", clase: "Ballesta", size: "Grande" },
            { name: "Blazer", dmg: "4D6+2 X2", s: "9", m: "21", l: "30", car: "2", rec: "1", w: "10", tipo: "Rifle", especial: "", clase: "Laser", size: "Grande" },
            { name: "Carabina GyroSlug", dmg: "2D6+5", s: "6", m: "15", l: "30", car: "20", rec: "1", w: "3", tipo: "Rifle", especial: "", clase: "Gyro", size: "Medio" },
            { name: "Escopeta", dmg: "3D6+2", s: "3", m: "5", l: "8", car: "6", rec: "1", w: "4", tipo: "Rifle", especial: "", clase: "Balistica", size: "Pequeño" },
            { name: "Escopeta 2 cañones", dmg: "3D6+2", s: "3", m: "4", l: "5", car: "2", rec: "1", w: "3", tipo: "Rifle", especial: "", clase: "Balistica", size: "Medio" },
            { name: "Lanzador AMCA", dmg: "5D6+6", s: "10", m: "36", l: "54", car: "2", rec: "1", w: "18", tipo: "Rifle", especial: "", clase: "Misil", size: "Enorme" },
            { name: "Lanzador AMCA Pesado", dmg: "10D6+6", s: "15", m: "40", l: "48", car: "4", rec: "4", w: "20", tipo: "Rifle", especial: "", clase: "Misil", size: "Enorme" },
            { name: "Lanzallamas", dmg: "2D6", s: "2", m: "4", l: "6", car: "12", rec: "1", w: "15", tipo: "Rifle", especial: "Inflamable", clase: "Inflamable", size: "Enorme" },
            { name: "Mauser 960 Lanzagranadas", dmg: "2D6+3", s: "6", m: "15", l: "25", car: "6", rec: "-", w: "10", tipo: "Rifle", especial: "Explosivo", clase: "Explosivo", size: "Grande" },
            { name: "Mauser 960 Laser Pulso", dmg: "3D6+3", s: "7", m: "15", l: "30", car: "10", rec: "-", w: "10", tipo: "Rifle", especial: "-2 Impactar", clase: "Pulso", size: "Grande" },
            { name: "MG", dmg: "4D6+3", s: "10", m: "20", l: "42", car: "15", rec: "1", w: "10", tipo: "Rifle", especial: "", clase: "Balistica", size: "Medio" },
            { name: "Pistola Agujas", dmg: "1D6+2", s: "3", m: "-", l: "-", car: "10", w: "1", rec: "1", tipo: "Pistola", especial: "Ignora Blindaje", clase: "Agujas", size: "Pequeño" },
            { name: "Pistola Automatica", dmg: "2D6", s: "2", m: "4", l: "8", car: "10", w: "1.5", rec: "1", tipo: "Pistola", especial: "", clase: "Balistica", size: "Pequeño" },
            { name: "Pistola Automatica Mydron", dmg: "1D6+3", s: "2", m: "4", l: "12", car: "20", w: "1.5", rec: "1", tipo: "Pistola", especial: "", clase: "Balistica", size: "Pequeño" },
            { name: "Pistola de Pulsos", dmg: "3D6", s: "2", m: "4", l: "8", car: "10", w: "1", rec: "1", tipo: "Pistola", especial: "-2 Impactar", clase: "Pulso", size: "Medio" },
            { name: "Pistola GyroJet", dmg: "3D6+3", s: "1", m: "2", l: "-", car: "2", w: "2", rec: "1", tipo: "Pistola", especial: "", clase: "Gyro", size: "Medio" },
            { name: "Pistola Laser", dmg: "4D6", s: "3", m: "6", l: "12", car: "20", w: "1", rec: "1", tipo: "Pistola", especial: "", clase: "Laser", size: "Medio" },
            { name: "Pistola Laser Nakjama", dmg: "3D6", s: "4", m: "9", l: "14", car: "20", w: "1", rec: "1", tipo: "Pistola", especial: "", clase: "Laser", size: "Medio" },
            { name: "Pistola Laser Sunbeam", dmg: "5D6", s: "3", m: "6", l: "11", car: "5", w: "1", rec: "1", tipo: "Pistola", especial: "", clase: "Laser", size: "Medio" },
            { name: "Pistola LaserM", dmg: "2D6", s: "2", m: "4", l: "6", car: "3", w: "0.5", rec: "1", tipo: "Pistola", especial: "", clase: "Laser", size: "A" },
            { name: "Pistola Semi", dmg: "2D6+3", s: "2", m: "4", l: "8", car: "6", w: "1", rec: "1", tipo: "Pistola", especial: "", clase: "Balistica", size: "Pequeño" },
            { name: "Pistola Sonica", dmg: "S", s: "2", m: "5", l: "8", car: "25", w: "1.5", rec: "1", tipo: "Pistola", especial: "Especial", clase: "Sonica", size: "Medio" },
            { name: "Pistola Sternsnacht", dmg: "4D6+2", s: "2", m: "4", l: "12", car: "3", w: "2.5", rec: "1", tipo: "Pistola", especial: "", clase: "Balistica", size: "Pequeño" },
            { name: "Pistola Tranquilizante", dmg: "S", s: "2", m: "4", l: "6", car: "10", w: "1", rec: "1", tipo: "Pistola", especial: "Especial", clase: "Tranquilizante", size: "Medio" },
            { name: "PistolaM", dmg: "1D6+3", s: "2", m: "-", l: "-", car: "5", w: "0.5", rec: "1", tipo: "Pistola", especial: "", clase: "Balistica", size: "A" },
            { name: "PistolaM Agujas", dmg: "1D6", s: "1", m: "-", l: "-", car: "5", w: "0.3", rec: "1", tipo: "Pistola", especial: "", clase: "Agujas", size: "A" },
            { name: "Rifle", dmg: "3D6", s: "6", m: "15", l: "30", car: "10", w: "4", rec: "1", tipo: "Rifle", especial: "", clase: "Balistica", size: "Grande" },
            { name: "Rifle Agujas", dmg: "2D6+2", s: "6", m: "7", l: "8", car: "20", w: "2", rec: "1", tipo: "Rifle", especial: "Ignora Blindaje", clase: "Agujas", size: "Medio" },
            { name: "Rifle de Pulsos", dmg: "3D6+2", s: "6", m: "14", l: "28", car: "5", w: "5", rec: "1", tipo: "Rifle", especial: "-2 Impactar", clase: "Pulso", size: "Medio" },
            { name: "Rifle Federated", dmg: "2D6+2", s: "8", m: "18", l: "33", car: "10", w: "4.5", rec: "1", tipo: "Rifle", especial: "", clase: "Balistica", size: "Grande" },
            { name: "Rifle GyroJet", dmg: "3D6+6", s: "12", m: "36", l: "72", car: "10", w: "6", rec: "1", tipo: "Rifle", especial: "", clase: "Gyro", size: "Grande" },
            { name: "Rifle GyroJet Pesado", dmg: "6D6+6", s: "12", m: "36", l: "72", car: "5", w: "18", rec: "1", tipo: "Rifle", especial: "", clase: "Gyro", size: "Grande" },
            { name: "Rifle GyroSlug", dmg: "3D6+3", s: "8", m: "35", l: "42", car: "50", w: "12", rec: "1", tipo: "Rifle", especial: "", clase: "Gyro", size: "Grande" },
            { name: "Rifle Laser", dmg: "4D6+2", s: "9", m: "21", l: "42", car: "10", w: "5", rec: "1", tipo: "Rifle", especial: "", clase: "Laser", size: "Medio" },
            { name: "Rifle Laser Intek", dmg: "2D6+2", s: "12", m: "30", l: "51", car: "10", w: "8", rec: "1", tipo: "Rifle", especial: "", clase: "Laser", size: "Medio" },
            { name: "Rifle Laser MagnaStar", dmg: "4D6+2", s: "9", m: "21", l: "30", car: "4", w: "5", rec: "1", tipo: "Rifle", especial: "", clase: "Laser", size: "Medio" },
            { name: "Rifle Pesado Zeus", dmg: "6D6", s: "7", m: "18", l: "28", car: "5", w: "12", rec: "1", tipo: "Rifle", especial: "", clase: "Balistica", size: "Grande" },
            { name: "SMG", dmg: "3D6", s: "3", m: "7", l: "10", car: "50", w: "3", rec: "1", tipo: "Rifle", especial: "Rafaga", clase: "Balistica", size: "Medio" },
            { name: "SMG Imperator", dmg: "2D6", s: "4", m: "8", l: "11", car: "50", w: "4", rec: "1", tipo: "Rifle", especial: "Rafaga", clase: "Balistica", size: "Medio" },
            { name: "SMG Rorynex", dmg: "3D6+3", s: "3", m: "6", l: "9", car: "100", w: "3", rec: "1", tipo: "Rifle", especial: "Rafaga", clase: "Balistica", size: "Medio" }
        ];

        /**
         * Puebla los selectores de armas en Barracones con las armas disponibles
         * Debe llamarse cuando se carga Barracones o cuando se carga la página
         */
        function poblarSelectoresArmasBarracones() {
            console.log('🔫 Poblando selectores de armas en Barracones...');
                const select1 = document.getElementById('barr-arma1-select');
            const select2 = document.getElementById('barr-arma2-select');
            const select3 = document.getElementById('barr-arma3-select');
                if (!select1 || !select2 || !select3) {
                console.log('⚠️ No se encontraron los selectores de armas');
                return;
            }
                // Limpiar opciones existentes (excepto la primera que es el placeholder)
            [select1, select2, select3].forEach(select => {
                while (select.options.length > 1) {
                    select.remove(1);
                }
            });
                // Añadir opciones de armas
            INFANTRY_WEAPON_TABLE.forEach((weapon, index) => {
                const option1 = document.createElement('option');
                option1.value = index;
                option1.textContent = weapon.name;
                select1.appendChild(option1);
                        const option2 = document.createElement('option');
                option2.value = index;
                option2.textContent = weapon.name;
                select2.appendChild(option2);
                        const option3 = document.createElement('option');
                option3.value = index;
                option3.textContent = weapon.name;
                select3.appendChild(option3);
            });
                console.log('✅ Selectores de armas poblados con ' + INFANTRY_WEAPON_TABLE.length + ' armas');
        }

        function loadWeaponsTable() {
            renderWeaponsTable(INFANTRY_WEAPON_TABLE);
        }

        function renderWeaponsTable(weapons) {
            const tbody = document.getElementById('weapons-tbody');
            const noResults = document.getElementById('no-results');
            const counter = document.getElementById('results-count');
                tbody.innerHTML = '';
                if (weapons.length === 0) {
                noResults.style.display = 'block';
                counter.textContent = '0';
                return;
            }
                noResults.style.display = 'none';
            counter.textContent = weapons.length;
                weapons.forEach((weapon, index) => {
                const row = document.createElement('tr');
                row.style.borderBottom = '1px solid rgba(183, 28, 28, 0.2)';
                row.style.transition = 'background 0.3s';
                        // Alternar colores de fila
                if (index % 2 === 0) {
                    row.style.background = 'rgba(0, 0, 0, 0.3)';
                }
                        // Hover effect
                row.addEventListener('mouseenter', function() {
                    this.style.background = 'rgba(183, 28, 28, 0.2)';
                });
                row.addEventListener('mouseleave', function() {
                    this.style.background = index % 2 === 0 ? 'rgba(0, 0, 0, 0.3)' : 'transparent';
                });
                        row.innerHTML = `
                    <td style="padding: 10px 8px; color: #ddd;">${weapon.name}</td>
                    <td style="padding: 10px 8px; text-align: center; color: #ff8c42; font-weight: bold;">${weapon.dmg}</td>
                    <td style="padding: 10px 8px; text-align: center; color: #aaa;">${weapon.s}</td>
                    <td style="padding: 10px 8px; text-align: center; color: #aaa;">${weapon.m}</td>
                    <td style="padding: 10px 8px; text-align: center; color: #aaa;">${weapon.l}</td>
                    <td style="padding: 10px 8px; text-align: center; color: #aaa;">${weapon.car}</td>
                    <td style="padding: 10px 8px; text-align: center; color: #aaa;">${weapon.rec}</td>
                    <td style="padding: 10px 8px; text-align: center; color: #aaa;">${weapon.w}</td>
                    <td style="padding: 10px 8px; text-align: center; color: #4a9eff;">${weapon.tipo}</td>
                    <td style="padding: 10px 8px; text-align: center; color: #b71c1c;">${weapon.clase}</td>
                    <td style="padding: 10px 8px; text-align: center; color: #888;">${weapon.size}</td>
                    <td style="padding: 10px 8px; color: ${weapon.especial ? '#00ff00' : '#666'};">${weapon.especial || '-'}</td>
                `;
                        tbody.appendChild(row);
            });
        }

        function filterWeapons() {
            const nameFilter = document.getElementById('filter-name').value.toLowerCase();
            const tipoFilter = document.getElementById('filter-tipo').value;
            const claseFilter = document.getElementById('filter-clase').value;
            const sizeFilter = document.getElementById('filter-size').value;
                const filtered = INFANTRY_WEAPON_TABLE.filter(weapon => {
                const matchName = weapon.name.toLowerCase().includes(nameFilter);
                const matchTipo = !tipoFilter || weapon.tipo === tipoFilter;
                const matchClase = !claseFilter || weapon.clase === claseFilter;
                const matchSize = !sizeFilter || weapon.size === sizeFilter;
                        return matchName && matchTipo && matchClase && matchSize;
            });
                renderWeaponsTable(filtered);
        }

        function clearFilters() {
            document.getElementById('filter-name').value = '';
            document.getElementById('filter-tipo').value = '';
            document.getElementById('filter-clase').value = '';
            document.getElementById('filter-size').value = '';
            filterWeapons();
        }

        // AÑADIR NUEVA HABILIDAD MANUAL
        function agregarHabilidadManual() {
            const container = document.getElementById('skill-list-container');
            const table = container.querySelector('.skill-table tbody');
                const strInt = parseInt(document.getElementById('attr-str').innerText) || 0;
            const dexInt = parseInt(document.getElementById('attr-dex').innerText) || 0;
            const intInt = parseInt(document.getElementById('attr-int').innerText) || 0;
            const chaInt = parseInt(document.getElementById('attr-cha').innerText) || 0;
            const universalCaract = Math.round((strInt + dexInt + intInt + chaInt) / 4);
                const squaresHTML = '<div class="q-box-container"><div class="chk-box"></div><div class="chk-box"></div><div class="chk-box"></div><div class="chk-box"></div></div>';
                const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td class="skill-xp-col">${squaresHTML}</td>
                <td><input type="text" class="sheet-input" placeholder="Nueva habilidad"></td>
                <td class="skill-level-col"><input type="text" class="sheet-input" style="text-align:center" value="0" onchange="recalcularFilaManual(this)"></td>
                <td class="skill-attr-col">${universalCaract}</td>
                <td class="skill-roll-col">${universalCaract}</td>
            `;
                table.appendChild(newRow);
        }

        function recalcularFilaManual(inputElement) {
            const row = inputElement.closest('tr');
            const levelValue = parseInt(inputElement.value) || 0;
            const attrCell = row.querySelector('.skill-attr-col');
            const rollCell = row.querySelector('.skill-roll-col');
                const attrValue = parseInt(attrCell.innerText) || 0;
            rollCell.innerText = attrValue - levelValue;
        }

        function init() {
            // Estado inicial: Landing Page visible, lo demás oculto
            document.getElementById('landing-page').style.display = 'flex';
            document.getElementById('pre-generacion').style.display = 'none';
            document.getElementById('ficha-container').style.display = 'none';
            document.getElementById('points-counter').style.display = 'none';

            const originSelect = document.getElementById('origen-select');
            ORIGIN_LIST.forEach(o => { let opt = document.createElement('option'); opt.value = o; opt.text = o; originSelect.add(opt); });

            const factionSelect = document.getElementById('faction-select');
            FACTION_LIST.forEach(f => { let opt = document.createElement('option'); opt.value = f.v; opt.text = f.t; factionSelect.add(opt); });

            ['str','dex','int','cha'].forEach(id => {
                let s = document.getElementById('select-str');
                if(id!=='str') s = document.getElementById('select-'+id);
                if(s.options.length <= 1){ for(let i=2; i<=12; i++) { let o = document.createElement('option'); o.value = i; o.text = i; s.add(o); } }
            });
                if(document.getElementById('merit-select-1').options.length <= 1) {
                 let mKeys = Object.keys(MERIT_COSTS).sort();
                 let mOpts = ""; mKeys.forEach(k => { mOpts += `<option value="${k}">${k} (${MERIT_COSTS[k]} pts)</option>`; });
                 for(let i=1; i<=MAX_TRAITS; i++) document.getElementById('merit-select-'+i).innerHTML += mOpts;
                          let dKeys = Object.keys(DEMERIT_COSTS).sort();
                 let dOpts = ""; dKeys.forEach(k => { dOpts += `<option value="${k}">${k} (+${DEMERIT_COSTS[k]} pts)</option>`; });
                 for(let i=1; i<=MAX_TRAITS; i++) document.getElementById('demerit-select-'+i).innerHTML += dOpts;
            }

            rellenarLevelSelects(); rellenarSelectoresCompra(); actualizarSlotsHabilidades(); changeCampaign(); updatePoints();
            populateWeaponSelects();

            document.getElementById('select-int').addEventListener('change', actualizarEstudios);
            document.getElementById('estudios-select').addEventListener('change', checkEstudios);
            document.getElementById('select-str').addEventListener('change', updatePoints);
            document.getElementById('select-dex').addEventListener('change', updatePoints);
            document.getElementById('select-int').addEventListener('change', updatePoints);
            document.getElementById('select-cha').addEventListener('change', updatePoints);
                for(let i=1; i<=MAX_TRAITS; i++) {
                document.getElementById('merit-select-' + i).addEventListener('change', function() { handleTraitChange(this); });
                document.getElementById('demerit-select-' + i).addEventListener('change', function() { handleTraitChange(this); });
            }
            for(let i=1; i<=3; i++) {
                 document.getElementById('extra-skill-select-' + i).addEventListener('change', updatePoints); 
                 document.getElementById('extra-skill-level-' + i).addEventListener('change', updatePoints); 
            }

            document.getElementById('mech-mod-select').addEventListener('change', resetMechDisplay);
            document.getElementById('noble-skill-select').addEventListener('change', updatePoints);
            document.getElementById('campaign-select').addEventListener('change', changeCampaign);
        }

        function generarFicha() {
            try {
                let decade = parseInt(document.getElementById('select-decade').value) || 2990;
                let yearDigit = parseInt(document.getElementById('select-year-digit').value) || 0;
                let ageRoll = parseInt(document.getElementById('select-edad-roll').value) || 0;
                let finalYear = decade + yearDigit + ageRoll;

                let vals = {
                    nombre: document.getElementById('select-nombre').value,
                    jugador: document.getElementById('select-jugador').value,
                    origen: document.getElementById('origen-select').value,
                    afiliacion: document.getElementById('faction-select').value,
                    estudios: document.getElementById('estudios-select').value,
                    str: document.getElementById('select-str').value,
                    dex: document.getElementById('select-dex').value,
                    int: document.getElementById('select-int').value,
                    cha: document.getElementById('select-cha').value,
                    finalYear: finalYear,
                    sexo: document.getElementById('select-sexo').value,
                    altura: document.getElementById('select-altura').value,
                    peso: document.getElementById('select-peso').value,
                    pelo: document.getElementById('select-pelo').value,
                    ojos: document.getElementById('select-ojos').value,
                    mechModel: document.getElementById('hidden-mech-model').value, 
                    mechTons: document.getElementById('hidden-mech-tons').value,
                    nobleSkill: document.getElementById('noble-skill-select').value
                };

                let total = calcularPuntosTotales();
                if (total < 0) { alert("¡Error! Tienes PUNTOS NEGATIVOS (" + total + "). Debes ajustar tus gastos."); return; }
                if (!vals.nombre || !vals.jugador) return alert("Falta Nombre o Jugador");
                if (!vals.str || !vals.dex || !vals.int || !vals.cha) return alert("Faltan Atributos");
                if (!vals.origen || !vals.estudios) return alert("Falta Origen o Estudios");
                if (!vals.afiliacion) return alert("Falta seleccionar Afiliación");
                if (!vals.mechTons) return alert("Falta tirar el BattleMech");

                let skills = getSkillsFromStudy(vals.estudios, vals.nobleSkill);
                for (let i = 1; i <= 3; i++) {
                    let row = document.getElementById('skill-row-' + i);
                    if (row.style.display !== 'none') {
                        let extraSkillName = document.getElementById('extra-skill-select-' + i).value;
                        let extraSkillLevel = document.getElementById('extra-skill-level-' + i).value;
                        if (extraSkillName && extraSkillLevel) skills.push({ n: extraSkillName, v: extraSkillLevel, c: "UNI" }); 
                    }
                }
                        let skillContainer = document.getElementById('skill-list-container');
                let html = '<table class="skill-table"><thead><tr><th>↑</th><th>Habilidad</th><th>Nivel</th><th>Caract.</th><th>Tirada</th></tr></thead><tbody>';
                let strInt = parseInt(vals.str); let dexInt = parseInt(vals.dex); let intInt = parseInt(vals.int); let chaInt = parseInt(vals.cha);
                let universalCaract = Math.round((strInt + dexInt + intInt + chaInt) / 4);
                        const squaresHTML = '<div class="q-box-container"><div class="chk-box"></div><div class="chk-box"></div><div class="chk-box"></div><div class="chk-box"></div></div>';
                        skills.forEach(s => {
                    let rollCalc = universalCaract - parseInt(s.v);
                    let skillNameDisplay = s.n === "Lenguaje" ? "Lenguaje (Elegido)" : s.n; 
                    html += `<tr><td class="skill-xp-col">${squaresHTML}</td><td>${skillNameDisplay}</td><td class="skill-level-col" data-base="${s.v}">${s.v}</td><td class="skill-attr-col">${universalCaract}</td><td class="skill-roll-col" style="text-align: center; font-weight: bold;">${rollCalc}</td></tr>`;
                });
                        let filasParaRellenar = intInt - skills.length;
                for(let i=0; i < filasParaRellenar; i++) {
                       html += `<tr><td class="skill-xp-col">${squaresHTML}</td><td><input type="text" class="sheet-input" placeholder="Nueva habilidad"></td><td class="skill-level-col"><input type="text" class="sheet-input" style="text-align:center" value="0" onchange="recalcularFilaManual(this)"></td><td class="skill-attr-col">${universalCaract}</td><td class="skill-roll-col">${universalCaract}</td></tr>`;
                }
                html += '</tbody></table>';
                skillContainer.innerHTML = html;

                document.getElementById('nombre-field').value = vals.nombre; 
                document.getElementById('jugador-field').value = vals.jugador;
                document.getElementById('origen-output').value = vals.origen; 
                document.getElementById('estudios-output').value = vals.estudios;
                document.getElementById('faction-output').value = vals.afiliacion;
                        if (currentCampaign === 'IS') { document.getElementById('mech-output').value = vals.mechTons + " Tons"; } 
                else { document.getElementById('mech-output').value = vals.mechModel + " (" + vals.mechTons + " Tons)"; }

                document.getElementById('edad-field').value = vals.finalYear; 
                document.getElementById('sexo-field').value = vals.sexo;
                document.getElementById('altura-field').value = vals.altura; 
                document.getElementById('peso-field').value = vals.peso;
                document.getElementById('pelo-field').value = vals.pelo; 
                document.getElementById('ojos-field').value = vals.ojos;
                document.getElementById('attr-str').innerText = vals.str; 
                document.getElementById('attr-dex').innerText = vals.dex;
                document.getElementById('attr-int').innerText = vals.int; 
                document.getElementById('attr-cha').innerText = vals.cha;
                        document.getElementById('sheet-cbills').value = document.getElementById('gen-cbills').value;
                document.getElementById('sheet-salary').value = document.getElementById('gen-salary').value;
                document.getElementById('sheet-xp-total').value = document.getElementById('gen-xp-total').value;
                document.getElementById('sheet-xp-avail').value = document.getElementById('gen-xp-avail').value;

                // MERITS Y DEMERITS EDITABLES
                const meritContainer = document.getElementById('merit-container');
                const demeritContainer = document.getElementById('demerit-container');
                        meritContainer.innerHTML = '';
                demeritContainer.innerHTML = '';
                        for(let i=1; i<=MAX_TRAITS; i++) {
                    let mVal = document.getElementById('merit-select-'+i).value;
                    if(mVal) {
                        meritContainer.innerHTML += `<div class="field">${mVal}</div>`;
                    }
                                let dVal = document.getElementById('demerit-select-'+i).value;
                    if(dVal) {
                        demeritContainer.innerHTML += `<div class="field">${dVal}</div>`;
                    }
                }
                        // Añadir méritos/deméritos especiales
                let specialMerit = document.getElementById('special-merit-field').innerText;
                let specialDemerit = document.getElementById('special-demerit-field').innerText;
                        if(specialMerit) {
                    meritContainer.innerHTML += `<div class="special-trait">${specialMerit}</div>`;
                }
                if(specialDemerit) {
                    demeritContainer.innerHTML += `<div class="special-trait">${specialDemerit}</div>`;
                }

                const sheetTitle = document.getElementById('sheet-title-text');
                if (currentCampaign === 'ELH') sheetTitle.innerText = "REGISTRO DE LA CABALLERÍA LIGERA DE ERIDANI";
                else sheetTitle.innerText = "HOJA DE SERVICIO MECHWARRIOR";

                renderizarPuntosDeVida(vals.str);

                document.getElementById('pre-generacion').style.display = 'none';
                document.getElementById('points-counter').style.display = 'none';
                document.getElementById('ficha-container').style.display = 'block';
                        // Guardado automático en la nube (transparente para el usuario)
                guardarEnNubeAutomatico();
            } catch (error) { console.error("Error:", error); alert("Error al generar la ficha."); }
        }
        function guardarEnNubeAutomatico() {
            // Guardado silencioso en la nube sin alertas al usuario
            if (GOOGLE_SCRIPT_URL.includes("YOUR_GOOGLE_SCRIPT")) {
                console.log("Guardado en nube deshabilitado: URL no configurada");
                return;
            }
            const datos = recogerDatosDeUI();
            if (!datos.nombre) { 
                console.log("No se puede guardar en nube: falta nombre del personaje");
                return; 
            }

            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(datos)
            })
            .then(response => response.json())
            .then(data => {
                if (data.result === "success") {
                    console.log("✓ Personaje guardado automáticamente en la nube");
                } else {
                    console.warn("Error al guardar automáticamente:", data.msg);
                }
            })
            .catch(error => {
                console.warn("Error de conexión al guardar automáticamente:", error);
            });
        }

        // ========================================================================================
        // TABLA DE CLÚSTER DE MISILES - BATTLETECH
        // ========================================================================================
        // Tabla de referencia para calcular impactos de misiles según tirada de 2D6
        // Filas: Resultado de 2D6 (2-12)
        // Columnas: Tamaño del lanzador (2, 4, 5, 6, 10, 15, 20)
        // Valores: Número de misiles que impactan
        // ========================================================================================
        const CLUSTER_TABLE = {
            2: {2:1, 4:1, 5:1, 6:2, 10:3, 12:4, 15:5, 20:6},
            3: {2:1, 4:2, 5:2, 6:2, 10:3, 12:4, 15:5, 20:6},
            4: {2:1, 4:2, 5:2, 6:3, 10:4, 12:5, 15:6, 20:9},
            5: {2:1, 4:2, 5:3, 6:3, 10:6, 12:8, 15:9, 20:12},
            6: {2:1, 4:2, 5:3, 6:4, 10:6, 12:8, 15:9, 20:12},
            7: {2:1, 4:3, 5:3, 6:4, 10:6, 12:8, 15:9, 20:12},
            8: {2:2, 4:3, 5:3, 6:4, 10:6, 12:8, 15:9, 20:12},
            9: {2:2, 4:3, 5:4, 6:5, 10:8, 12:10, 15:11, 20:16},
            10: {2:2, 4:3, 5:4, 6:5, 10:9, 12:11, 15:13, 20:18},
            11: {2:2, 4:4, 5:5, 6:6, 10:10, 12:12, 15:15, 20:20},
            12: {2:2, 4:4, 5:5, 6:6, 10:10, 12:12, 15:15, 20:20}
        };
        /**
         * Genera dinámicamente la tabla HTML de referencia de clúster de misiles
         * 
         * @returns {void}
         * 
         * COMPORTAMIENTO:
         * - Busca el contenedor 'cluster-table-container' en el DOM
         * - Si no existe, termina silenciosamente (fail-safe)
         * - Genera tabla con headers sticky para scroll vertical
         * - Aplica estilos inline para independencia de CSS externo
         * - Usa IDs únicos para cada celda para highlights posteriores
         * 
         * ESTRUCTURA HTML GENERADA:
         * <table id="missile-cluster-table">
         *   <thead>
         *     <tr>
         *       <th>2D6</th>
         *       <th>2</th><th>4</th>...<th>20</th>
         *     </tr>
         *   </thead>
         *   <tbody>
         *     <tr>
         *       <td id="row-missile-2">2</td>
         *       <td id="cell-missile-2-2">1</td>...
         *     </tr>
         *     ...
         *   </tbody>
         * </table>
         * 
         * DEPENDENCIAS:
         * - CLUSTER_TABLE (constante global)
         * - Elemento DOM: #cluster-table-container
         * 
         * LLAMADO POR:
         * - goToClusterTable() al navegar a la sección
         * 
         * NOTAS DE MANTENIMIENTO:
         * - Para cambiar colores, modificar los valores rgba() en estilos inline
         * - Para añadir/quitar columnas, modificar array 'cols'
         * - Headers sticky requieren position: sticky y z-index > 1
         */
        function generateClusterTableHTML() {
            // VALIDACIÓN: Verificar que el contenedor existe en el DOM
            const container = document.getElementById('cluster-table-container');
            if (!container) {
                console.warn('generateClusterTableHTML: Contenedor cluster-table-container no encontrado');
                return;
            }
                // CONFIGURACIÓN: Definir columnas visibles (tamaños de lanzadores)
            const cols = [2, 4, 5, 6, 10, 15, 20];
                // CONSTRUCCIÓN: Iniciar tabla con header 2D6
            let html = '<table id="missile-cluster-table" style="width: 100%; border-collapse: collapse; font-size: 9pt;">';
            html += '<thead><tr>';
            html += '<th style="background: linear-gradient(135deg, #b71c1c 0%, #8b0000 100%); color: #fff; padding: 6px; border: 1px solid #b71c1c; position: sticky; top: 0; z-index: 2; width: 50px;">2D6</th>';
                // HEADERS: Generar encabezados para cada tamaño de lanzador
            cols.forEach(c => {
                html += `<th style="background: linear-gradient(135deg, #b71c1c 0%, #8b0000 100%); color: #fff; padding: 8px; border: 1px solid #b71c1c; position: sticky; top: 0; z-index: 2;">${c}</th>`;
            });
            html += '</tr></thead><tbody>';
                // FILAS: Generar una fila por cada resultado posible de 2D6 (2-12)
            for (let roll = 2; roll <= 12; roll++) {
                // Alternar colores de fondo para mejor legibilidad
                const rowBg = roll % 2 === 0 ? 'rgba(26, 26, 26, 0.7)' : 'rgba(10, 10, 10, 0.7)';
                        // Celda de resultado de tirada (primera columna)
                html += `<tr><td id="row-missile-${roll}" style="background: ${rowBg}; color: #ff8c42; font-weight: bold; padding: 6px; border: 1px solid #b71c1c; text-align: center; width: 50px;"><strong>${roll}</strong></td>`;
                        // Celdas de impactos para cada tamaño de lanzador
                cols.forEach(c => {
                    // VALIDACIÓN: Verificar que el valor existe en CLUSTER_TABLE
                    const cellValue = CLUSTER_TABLE[roll] && CLUSTER_TABLE[roll][c] !== undefined 
                        ? CLUSTER_TABLE[roll][c] 
                        : '-';
                                // ID único para permitir highlight individual
                    html += `<td id="cell-missile-${roll}-${c}" style="background: ${rowBg}; color: #e0e0e0; padding: 6px; border: 1px solid #b71c1c; text-align: center;">${cellValue}</td>`;
                });
                html += '</tr>';
            }
                html += '</tbody></table>';
                // INSERCIÓN: Reemplazar contenido del contenedor con la tabla generada
            container.innerHTML = html;
        }
        /**
         * Ejecuta una tirada de 2D6 y calcula los impactos de misiles según CLUSTER_TABLE
         * Actualiza el display de resultados y aplica highlight visual a la tabla
         * 
         * @returns {void}
         * 
         * PROCESO:
         * 1. Lee el tamaño del lanzador seleccionado
         * 2. Valida que sea un número válido
         * 3. Tira 2D6 (aleatorio entre 2-12)
         * 4. Consulta CLUSTER_TABLE[roll][launcherSize]
         * 5. Muestra resultado en #missile-result-display
         * 6. Limpia highlights previos
         * 7. Aplica highlight a la fila y celda correspondientes
         * 
         * ELEMENTOS DOM REQUERIDOS:
         * - #launcher-select: select con value = tamaño del lanzador
         * - #missile-result-display: div para mostrar resultados
         * - #row-missile-{roll}: td de la fila de la tirada
         * - #cell-missile-{roll}-{size}: td específica del resultado
         * 
         * VALIDACIONES:
         * - Verifica que launcherSize sea un número válido
         * - Verifica que el resultado exista en CLUSTER_TABLE
         * - Verifica que los elementos DOM existan antes de modificarlos
         * 
         * EFECTOS VISUALES:
         * - Background rojo (rgba(183,28,28,0.8)) en fila/celda activa
         * - Color verde (#00ff41) en texto resaltado
         * - Font-size aumentado (14pt) en celda específica
         * 
         * DEPENDENCIAS:
         * - CLUSTER_TABLE (constante global)
         * - generateClusterTableHTML debe haber sido llamada previamente
         * 
         * NOTAS DE MANTENIMIENTO:
         * - Para cambiar colores de highlight, modificar rgba() y hex colors
         * - Clase .cell-highlight se añade para posibles estilos CSS adicionales
         * - Limpieza de highlights previene acumulación de estilos
         */
        function rollCluster() {
            // VALIDACIÓN 1: Verificar que el selector existe y obtener valor
            const selectElement = document.getElementById('launcher-select');
            if (!selectElement) {
                console.error('rollCluster: Elemento launcher-select no encontrado');
                return;
            }
                const launcherSize = parseInt(selectElement.value);
                // VALIDACIÓN 2: Verificar que el valor es un número válido
            if (isNaN(launcherSize)) {
                console.warn('rollCluster: Tamaño de lanzador no válido:', selectElement.value);
                return;
            }
                // VALIDACIÓN 3: Verificar que el tamaño existe en CLUSTER_TABLE
            // Verificamos con la primera fila de la tabla
            if (!CLUSTER_TABLE[2] || CLUSTER_TABLE[2][launcherSize] === undefined) {
                console.warn('rollCluster: Tamaño de lanzador no soportado:', launcherSize);
                return;
            }
                // TIRADA: Generar resultado aleatorio 2D6 (rango: 2-12)
            // Math.random() genera [0,1), * 11 = [0,11), floor = [0,10], +2 = [2,12]
            const roll = Math.floor(Math.random() * 11) + 2;
                // CONSULTA: Obtener número de impactos de la tabla
            const hits = CLUSTER_TABLE[roll][launcherSize] !== undefined 
                ? CLUSTER_TABLE[roll][launcherSize] 
                : 0;
                // DISPLAY: Actualizar el elemento de resultados
            const resultDisplay = document.getElementById('missile-result-display');
            if (!resultDisplay) {
                console.error('rollCluster: Elemento missile-result-display no encontrado');
                return;
            }
                resultDisplay.innerHTML = `
                <div style="font-size: 20px; color: #00ff41; text-shadow: 0 0 10px rgba(0, 255, 65, 0.5);">
                    Tirada: <strong style="color: #ff8c42;">${roll}</strong>
                </div>
                <div style="font-size: 24px; margin-top: 10px;">
                    Impactos: <strong style="color: #ff8c42; text-shadow: 0 0 15px rgba(255, 140, 66, 0.8);">${hits}</strong>
                </div>
            `;
                // LIMPIEZA: Remover todos los highlights previos
            // Esto previene acumulación de estilos en tiradas múltiples
            document.querySelectorAll('.cell-highlight').forEach(el => {
                el.classList.remove('cell-highlight');
                el.style.background = '';  // Resetear a estilo por defecto
                el.style.color = '';
                el.style.fontWeight = '';
                el.style.fontSize = '';
            });
                // HIGHLIGHT 1: Resaltar toda la fila de la tirada
            const row = document.getElementById(`row-missile-${roll}`);
            if (row) {
                row.classList.add('cell-highlight');
                row.style.background = 'rgba(183, 28, 28, 0.8)';  // Rojo BattleTech
                row.style.color = '#00ff41';  // Verde terminal
            } else {
                console.warn(`rollCluster: Fila row-missile-${roll} no encontrada`);
            }
                // HIGHLIGHT 2: Resaltar la celda específica del resultado
            const cell = document.getElementById(`cell-missile-${roll}-${launcherSize}`);
            if (cell) {
                cell.classList.add('cell-highlight');
                cell.style.background = 'rgba(183, 28, 28, 0.8)';
                cell.style.color = '#00ff41';
                cell.style.fontWeight = 'bold';
                cell.style.fontSize = '14pt';  // Aumentar tamaño para énfasis
            } else {
                console.warn(`rollCluster: Celda cell-missile-${roll}-${launcherSize} no encontrada`);
            }
        }
        // ========================================================================================
        // AGRUPADOR DE DAÑOS DE MISILES
        // ========================================================================================
        // Sistema para procesar impactos de misiles y asignar automáticamente localizaciones
        // de daño en un Mech según tiradas de 2D6
        // ========================================================================================
        /**
         * Genera un resultado aleatorio de tirada de 2D6 (rango: 2-12)
         * 
         * @returns {number} Resultado de la tirada (2-12)
         * 
         * DISTRIBUCIÓN PROBABILÍSTICA:
         * - 2 o 12: 2.78% cada uno (1/36)
         * - 3 o 11: 5.56% cada uno (2/36)
         * - 4 o 10: 8.33% cada uno (3/36)
         * - 5 o 9:  11.11% cada uno (4/36)
         * - 6 o 8:  13.89% cada uno (5/36)
         * - 7:      16.67% (6/36) - más probable
         * 
         * USO:
         * Esta función simula tirar dos dados de 6 caras y sumar los resultados.
         * Se usa para determinar la localización del daño en Mechs según reglas BattleTech.
         */
        function roll2D6() {
            // Math.random() * 11 genera [0, 11)
            // Math.floor lo convierte a [0, 10]
            // +2 desplaza el rango a [2, 12]
            return Math.floor(Math.random() * 11) + 2;
        }
        /**
         * Convierte un resultado de 2D6 a una localización de daño en un Mech
         * 
         * @param {number} roll - Resultado de 2D6 (debe estar entre 2-12)
         * @returns {string} Nombre de la localización (ej: "Torso Central (CT)")
         * 
         * TABLA DE LOCALIZACIONES (según reglas BattleTech):
         * 2:       Cabeza (Head)
         * 3:       Brazo Derecho (RA - Right Arm)
         * 4:       Pierna Derecha (RL - Right Leg)
         * 5:       Torso Derecho (RT - Right Torso)
         * 6,7,12:  Torso Central (CT - Center Torso) - localización más común
         * 8:       Torso Izquierdo (LT - Left Torso)
         * 9:       Pierna Izquierda (LL - Left Leg)
         * 10:      Brazo Izquierdo (LA - Left Arm)
         * 11:      Cabeza (Head)
         * 
         * VALIDACIÓN:
         * - Si el roll está fuera del rango [2,12], devuelve "Desconocido"
         * - Incluye warning en consola para debugging
         * 
         * NOTAS:
         * - El Torso Central (6,7,12) es la localización más probable (27.78%)
         * - La Cabeza (2,11) es la más difícil de impactar (8.33%)
         * - Los nombres incluyen abreviatura en inglés para compatibilidad con hojas de registro
         */
        function getLocation(roll) {
            switch (roll) {
                case 2:
                    return "Cabeza (Head)";
                case 3:
                    return "Brazo Derecho (RA)";
                case 4:
                    return "Pierna Derecha (RL)";
                case 5:
                    return "Torso Derecho (RT)";
                case 6:
                case 7:
                case 12:
                    return "Torso Central (CT)";
                case 8:
                    return "Torso Izquierdo (LT)";
                case 9:
                    return "Pierna Izquierda (LL)";
                case 10:
                    return "Brazo Izquierdo (LA)";
                case 11:
                    return "Cabeza (Head)";
                default:
                    console.warn(`getLocation: Valor de roll inválido: ${roll}`);
                    return "Desconocido";
            }
        }
        /**
         * Procesa un ataque de misiles y calcula automáticamente la distribución de daño
         * por localización según reglas de agrupamiento de BattleTech
         * 
         * @returns {void}
         * 
         * REGLAS DE AGRUPAMIENTO:
         * - LRM (Long Range Missiles): Se agrupan en bloques de 5 daño
         *   Cada grupo de 5 misiles causa 5 puntos de daño en una localización
         *   Cada misil causa 1 punto de daño
         * 
         * - SRM (Short Range Missiles): Se agrupan en bloques de 2 daño
         *   Cada grupo de 2 misiles causa 4 puntos de daño en una localización
         *   Cada misil causa 2 puntos de daño
         * 
         * PROCESO:
         * 1. Leer tipo de misil (LRM/SRM) del selector
         * 2. Leer cantidad de misiles que impactaron
         * 3. Validar inputs
         * 4. Calcular grupos completos (divisiones exactas)
         * 5. Calcular misiles residuales (resto de la división)
         * 6. Para cada grupo:
         *    - Tirar 2D6 para determinar localización
         *    - Acumular daño en esa localización
         *    - Registrar en tabla de detalle
         * 7. Procesar grupo residual (si existe)
         * 8. Generar tabla resumen ordenada por daño total
         * 9. Mostrar resultados en #resultados
         * 
         * ELEMENTOS DOM REQUERIDOS:
         * - #tipoMisil: select con options "LRM" o "SRM"
         * - #cantidadHits: input type="number" con cantidad de impactos
         * - #resultados: div contenedor para mostrar tablas de resultados
         * 
         * VALIDACIONES:
         * - Verifica que los elementos DOM existan
         * - Verifica que cantidadHits sea un número válido
         * - Verifica que cantidadHits > 0
         * - Maneja inputs inválidos con mensajes de error apropiados
         * 
         * ESTRUCTURA DE DATOS:
         * damageByLocation = {
         *   "Torso Central (CT)": 15,
         *   "Brazo Derecho (RA)": 10,
         *   ...
         * }
         * 
         * SALIDA VISUAL:
         * - Tabla RESUMEN: Localizaciones ordenadas por daño (mayor a menor)
         * - Tabla DETALLE: Registro completo de cada tirada y asignación
         * - Grupo residual marcado visualmente con color diferente
         * 
         * DEPENDENCIAS:
         * - roll2D6(): Para generar tiradas
         * - getLocation(): Para convertir tiradas a localizaciones
         * 
         * NOTAS DE MANTENIMIENTO:
         * - Para cambiar reglas de agrupamiento, modificar damageGrouping
         * - Para cambiar daño por misil, modificar damageUnit
         * - Los estilos están inline para independencia de CSS externo
         */
        function procesarMisiles() {
            // ============================================================
            // FASE 1: VALIDACIÓN Y LECTURA DE INPUTS
            // ============================================================
                // Verificar que los elementos DOM existen
            const tipoMisilElement = document.getElementById('tipoMisil');
            const cantidadHitsElement = document.getElementById('cantidadHits');
            const resultadosElement = document.getElementById('resultados');
                if (!tipoMisilElement || !cantidadHitsElement || !resultadosElement) {
                console.error('procesarMisiles: Elementos DOM requeridos no encontrados');
                if (resultadosElement) {
                    resultadosElement.innerHTML = '<p style="color: #ff8c42;">❌ Error: Elementos del formulario no encontrados</p>';
                }
                return;
            }
                // Leer valores de los inputs
            const tipoMisil = tipoMisilElement.value;
            const cantidadHits = parseInt(cantidadHitsElement.value);
                // VALIDACIÓN 1: Verificar que cantidadHits es un número
            if (isNaN(cantidadHits)) {
                resultadosElement.innerHTML = '<h3 style="color: #ff8c42;">Resultados:</h3><p style="color: #ff8c42;">❌ Por favor, introduce un número válido de misiles.</p>';
                return;
            }
                // VALIDACIÓN 2: Verificar que cantidadHits es positivo
            if (cantidadHits <= 0) {
                resultadosElement.innerHTML = '<h3 style="color: #ff8c42;">Resultados:</h3><p style="color: #ff8c42;">❌ La cantidad de misiles debe ser mayor que 0.</p>';
                return;
            }
                // ============================================================
            // FASE 2: CONFIGURACIÓN SEGÚN TIPO DE MISIL
            // ============================================================
                let damageUnit;       // Daño que causa cada misil individual
            let damageGrouping;   // Cuántos misiles se agrupan juntos
                if (tipoMisil === "LRM") {
                damageUnit = 1;       // Cada LRM causa 1 punto de daño
                damageGrouping = 5;   // Los LRMs se agrupan de 5 en 5
            } else if (tipoMisil === "SRM") {
                damageUnit = 2;       // Cada SRM causa 2 puntos de daño
                damageGrouping = 2;   // Los SRMs se agrupan de 2 en 2
            } else {
                // Tipo de misil no reconocido
                resultadosElement.innerHTML = '<h3 style="color: #ff8c42;">Resultados:</h3><p style="color: #ff8c42;">❌ Tipo de misil no válido. Selecciona LRM o SRM.</p>';
                return;
            }
                // ============================================================
            // FASE 3: CÁLCULO DE GRUPOS
            // ============================================================
                // Calcular cuántos grupos completos hay
            // Ej: 12 LRMs = 2 grupos completos de 5 + 2 residuales
            const numFullGroups = Math.floor(cantidadHits / damageGrouping);
                // Calcular misiles restantes que no forman un grupo completo
            const remainingHits = cantidadHits % damageGrouping;
                // ============================================================
            // FASE 4: PROCESAMIENTO DE GRUPOS Y ACUMULACIÓN DE DAÑO
            // ============================================================
                // Objeto para acumular daño total por localización
            // Estructura: { "Torso Central (CT)": 15, "Brazo Derecho (RA)": 10, ... }
            const damageByLocation = {};
                // Array para registrar cada grupo procesado (para tabla de detalle)
            const detailRows = [];
                // PROCESAR GRUPOS COMPLETOS
            for (let i = 0; i < numFullGroups; i++) {
                // Tirar 2D6 para determinar localización
                const roll = roll2D6();
                const location = getLocation(roll);
                        // Calcular daño de este grupo
                const groupDamage = damageGrouping * damageUnit;
                        // Acumular daño en la localización
                if (!damageByLocation[location]) {
                    damageByLocation[location] = 0;
                }
                damageByLocation[location] += groupDamage;
                        // Registrar para tabla de detalle
                // Background alternado para mejor legibilidad
                const rowBg = i % 2 === 0 ? 'rgba(26,26,26,0.7)' : 'rgba(10,10,10,0.7)';
                detailRows.push({
                    groupNum: i + 1,
                    roll: roll,
                    location: location,
                    damage: groupDamage,
                    background: rowBg,
                    isResidual: false
                });
            }
                // PROCESAR GRUPO RESIDUAL (si existe)
            if (remainingHits > 0) {
                const roll = roll2D6();
                const location = getLocation(roll);
                const residualDamage = remainingHits * damageUnit;
                        // Acumular daño residual
                if (!damageByLocation[location]) {
                    damageByLocation[location] = 0;
                }
                damageByLocation[location] += residualDamage;
                        // Registrar grupo residual con estilo especial
                detailRows.push({
                    groupNum: numFullGroups + 1,
                    roll: roll,
                    location: location,
                    damage: residualDamage,
                    background: 'rgba(183,28,28,0.3)',  // Fondo rojizo para destacar
                    isResidual: true
                });
            }
                // ============================================================
            // FASE 5: GENERACIÓN DE TABLA RESUMEN
            // ============================================================
                // Convertir objeto a array y ordenar por daño (mayor a menor)
            const sortedLocations = Object.entries(damageByLocation)
                .sort((a, b) => b[1] - a[1]);  // b[1] - a[1] = orden descendente
                // Calcular daño total para mostrar en pie de tabla
            const totalDamage = sortedLocations.reduce((sum, [loc, dmg]) => sum + dmg, 0);
                // Construir HTML de tabla resumen
            let summaryHTML = `
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #00ff41; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 2px;">
                        📊 RESUMEN POR LOCALIZACIÓN
                    </h3>
                    <table style="width: 100%; border-collapse: collapse; font-size: 10pt;">
                        <thead>
                            <tr>
                                <th style="background: linear-gradient(135deg, #b71c1c 0%, #8b0000 100%); color: #fff; padding: 10px; border: 1px solid #b71c1c; text-align: left;">
                                    Localización
                                </th>
                                <th style="background: linear-gradient(135deg, #b71c1c 0%, #8b0000 100%); color: #fff; padding: 10px; border: 1px solid #b71c1c; text-align: center;">
                                    Daño Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
            `;
                // Añadir fila por cada localización con daño
            sortedLocations.forEach(([location, damage], index) => {
                const rowBg = index % 2 === 0 ? 'rgba(26,26,26,0.7)' : 'rgba(10,10,10,0.7)';
                summaryHTML += `
                    <tr>
                        <td style="background: ${rowBg}; color: #e0e0e0; padding: 10px; border: 1px solid #b71c1c;">
                            ${location}
                        </td>
                        <td style="background: ${rowBg}; color: #00ff41; padding: 10px; border: 1px solid #b71c1c; text-align: center; font-weight: bold; font-size: 16pt;">
                            ${damage}
                        </td>
                    </tr>
                `;
            });
                // Añadir fila de total
            summaryHTML += `
                            <tr>
                                <td style="background: rgba(183,28,28,0.5); color: #ff8c42; padding: 10px; border: 1px solid #b71c1c; text-align: right; font-weight: bold; font-size: 12pt;">
                                    TOTAL:
                                </td>
                                <td style="background: rgba(183,28,28,0.5); color: #ff8c42; padding: 10px; border: 1px solid #b71c1c; text-align: center; font-weight: bold; font-size: 24px; text-shadow: 0 0 15px rgba(255, 140, 66, 0.8);">
                                    ${totalDamage}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
                // ============================================================
            // FASE 6: GENERACIÓN DE TABLA DE DETALLE
            // ============================================================
                let detailHTML = `
                <div style="margin-top: 30px;">
                    <h3 style="color: #00ff41; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 2px;">
                        📋 DETALLE DE GRUPOS
                    </h3>
                    <div style="max-height: 500px; overflow-y: auto; background: rgba(10,10,10,0.8); border: 2px solid #b71c1c; border-radius: 5px;">
                        <table style="width: 100%; border-collapse: collapse; font-size: 10pt;">
                            <thead>
                                <tr>
                                    <th style="background: linear-gradient(135deg, #b71c1c 0%, #8b0000 100%); color: #fff; padding: 10px; border: 1px solid #b71c1c; position: sticky; top: 0; z-index: 1;">
                                        Grupo
                                    </th>
                                    <th style="background: linear-gradient(135deg, #b71c1c 0%, #8b0000 100%); color: #fff; padding: 10px; border: 1px solid #b71c1c; position: sticky; top: 0; z-index: 1;">
                                        2D6
                                    </th>
                                    <th style="background: linear-gradient(135deg, #b71c1c 0%, #8b0000 100%); color: #fff; padding: 10px; border: 1px solid #b71c1c; position: sticky; top: 0; z-index: 1;">
                                        Localización
                                    </th>
                                    <th style="background: linear-gradient(135deg, #b71c1c 0%, #8b0000 100%); color: #fff; padding: 10px; border: 1px solid #b71c1c; position: sticky; top: 0; z-index: 1;">
                                        Daño Aplicado
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
            `;
                // Añadir fila por cada grupo procesado
            detailRows.forEach(row => {
                // Estilo especial para grupo residual
                const textStyle = row.isResidual 
                    ? 'color: #ff8c42; font-style: italic;' 
                    : 'color: #e0e0e0;';
                        const groupLabel = row.isResidual 
                    ? `${row.groupNum} (Residual)` 
                    : row.groupNum;
                        detailHTML += `
                    <tr>
                        <td style="background: ${row.background}; ${textStyle} padding: 8px; border: 1px solid #b71c1c; text-align: center;">
                            ${groupLabel}
                        </td>
                        <td style="background: ${row.background}; ${textStyle} padding: 8px; border: 1px solid #b71c1c; text-align: center;">
                            ${row.roll}
                        </td>
                        <td style="background: ${row.background}; ${textStyle} padding: 8px; border: 1px solid #b71c1c;">
                            ${row.location}
                        </td>
                        <td style="background: ${row.background}; ${textStyle} padding: 8px; border: 1px solid #b71c1c; text-align: center; font-weight: bold;">
                            ${row.damage}
                        </td>
                    </tr>
                `;
            });
                detailHTML += `
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
                // ============================================================
            // FASE 7: INSERCIÓN DE RESULTADOS EN EL DOM
            // ============================================================
                resultadosElement.innerHTML = `
                <h3 style="color: #ff8c42; border-bottom: 2px solid #ff8c42; padding-bottom: 10px; margin-bottom: 20px;">
                    ⚡ RESULTADOS DEL ATAQUE ⚡
                </h3>
                <p style="color: #e0e0e0; margin-bottom: 20px;">
                    <strong>Tipo:</strong> ${tipoMisil} | 
                    <strong>Impactos:</strong> ${cantidadHits} | 
                    <strong>Grupos completos:</strong> ${numFullGroups} | 
                    <strong>Residuales:</strong> ${remainingHits}
                </p>
                ${summaryHTML}
                ${detailHTML}
            `;
        }

        // SISTEMA DE ROTACIÓN DE DATOS DE MECHS
        const ICONIC_MECHS = [
            {
                name: "GM MAD-3D MARAUDER",
                chassis: "GM Marauder (Pesado)",
                mass: "75 TONS",
                engine: "Vlar 300 Fusión",
                speed: "43.2/64.8 km/h",
                armor: "11.5 Tons Blindaje",
                heatsinks: "20 Disipadores",
                weapons: "2x PPC, 1x LL, 2x ML"
            },
            {
                name: "STARCORPS WHM-6D WARHAMMER",
                chassis: "StarCorps 100 (Pesado)",
                mass: "70 TONS",
                engine: "VOX 280 Fusión",
                speed: "43.2/64.8 km/h",
                armor: "13 Tons Blindaje",
                heatsinks: "20 Disipadores",
                weapons: "2x PPC, 2x ML, 2x SL"
            },
            {
                name: "EARTHWERKS BLR-1G BATTLEMASTER",
                chassis: "Hollis Hard Core (Asalto)",
                mass: "85 TONS",
                engine: "VOX 340 Fusión",
                speed: "43.2/64.8 km/h",
                armor: "14.5 Tons Blindaje",
                heatsinks: "18 Disipadores",
                weapons: "1x PPC, 6x ML, 1x SRM-6, 2x MG"
            },
            {
                name: "BERGAN LCT-1V LOCUST",
                chassis: "Bergan XIV (Ligero)",
                mass: "20 TONS",
                engine: "LTV 160 Fusión",
                speed: "86.4/129.6 km/h",
                armor: "4 Tons Blindaje",
                heatsinks: "10 Disipadores",
                weapons: "1x ML, 2x MG"
            },
            {
                name: "GENERAL MECHANICS WSP-1A WASP",
                chassis: "Type 1000 (Ligero)",
                mass: "20 TONS",
                engine: "Hermes 120 Fusión",
                speed: "64.8/97.2 km/h (Salto: 180m)",
                armor: "3 Tons Blindaje",
                heatsinks: "10 Disipadores",
                weapons: "1x ML, 1x SRM-2"
            }
        ];

        let currentMechIndex = 0;

        // ============================================
        // SISTEMA DE ROTACIÓN DE MECHS CON ESCANEO
        // ============================================
        const SCAN_MECHS = ['marauder-scan', 'warhammer-scan', 'battlemaster-scan', 'locust-scan', 'wasp-scan'];
        let currentScanMechIndex = 0;
        let nextScanMechIndex = 1;
        
        function initMechScanSystem() {
            const layerCurrent = document.getElementById('mech-layer-current');
            const layerNext = document.getElementById('mech-layer-next');
            const storage = document.getElementById('mech-svg-storage');
            const laser = document.getElementById('scan-laser');
            
            if (!layerCurrent || !layerNext || !storage) return;
            
            // Al inicio: el mech visible completo es el que se muestra en el lateral
            // currentScanMechIndex = 0 (Marauder visible, se va borrando)
            // nextScanMechIndex = 1 (Warhammer apareciendo)
            // El lateral muestra Marauder (el visible)
            
            // Cargar el primer mech en la capa actual (visible, se está borrando)
            const currentSvgContainer = document.getElementById('mech-svg-' + SCAN_MECHS[currentScanMechIndex]);
            if (currentSvgContainer) {
                layerCurrent.innerHTML = currentSvgContainer.innerHTML;
                const currentSvg = layerCurrent.querySelector('svg');
                if (currentSvg) {
                    currentSvg.style.animation = 'mech-erase 12s linear forwards';
                }
            }
            
            // Cargar el siguiente mech en la capa next (apareciendo)
            const nextSvgContainer = document.getElementById('mech-svg-' + SCAN_MECHS[nextScanMechIndex]);
            if (nextSvgContainer) {
                layerNext.innerHTML = nextSvgContainer.innerHTML;
                const nextSvg = layerNext.querySelector('svg');
                if (nextSvg) {
                    nextSvg.style.animation = 'mech-reveal 12s linear forwards';
                }
            }
            
            // El lateral muestra el mech que se está DIBUJANDO (nextScanMechIndex)
            currentMechIndex = nextScanMechIndex;
            updateSidebarMech();
            updateBlueprintSilhouette();
            
            // Iniciar animación del láser
            if (laser) {
                laser.style.animation = 'scan-line 12s linear forwards';
            }
            
            // Rotar cada 12 segundos (sincronizado con la animación del láser)
            setInterval(rotateScanMechs, 12000);
        }
        
        function rotateScanMechs() {
            const layerCurrent = document.getElementById('mech-layer-current');
            const layerNext = document.getElementById('mech-layer-next');
            const landingPage = document.getElementById('landing-page');
            
            if (!layerCurrent || !layerNext) return;
            
            // Avanzar índices
            currentScanMechIndex = nextScanMechIndex;
            nextScanMechIndex = (nextScanMechIndex + 1) % SCAN_MECHS.length;
            
            // El lateral muestra el mech que se está DIBUJANDO (nextScanMechIndex)
            currentMechIndex = nextScanMechIndex;
            
            // El mech que estaba en "next" pasa a "current" (ahora visible, se borra)
            layerCurrent.innerHTML = layerNext.innerHTML;
            
            // Cargar el nuevo mech en "next" (se va a dibujar)
            const nextSvgContainer = document.getElementById('mech-svg-' + SCAN_MECHS[nextScanMechIndex]);
            if (nextSvgContainer) {
                layerNext.innerHTML = nextSvgContainer.innerHTML;
            }
            
            // Reiniciar animaciones de SVGs
            const currentSvg = layerCurrent.querySelector('svg');
            const nextSvg = layerNext.querySelector('svg');
            
            if (currentSvg) {
                currentSvg.style.animation = 'none';
                currentSvg.offsetHeight; // Trigger reflow
                currentSvg.style.animation = 'mech-erase 12s linear forwards';
            }
            
            if (nextSvg) {
                nextSvg.style.animation = 'none';
                nextSvg.offsetHeight; // Trigger reflow
                nextSvg.style.animation = 'mech-reveal 12s linear forwards';
            }
            
            // Reiniciar animación del láser
            const laser = document.getElementById('scan-laser');
            if (laser) {
                laser.style.animation = 'none';
                laser.offsetHeight; // Trigger reflow
                laser.style.animation = 'scan-line 12s linear forwards';
            }
            
            // Actualizar panel lateral (sin el setTimeout de rotateMechData)
            updateSidebarMech();
            
            // Actualizar silueta del blueprint lateral
            updateBlueprintSilhouette();
        }
        
        // Actualizar el panel de datos del mech lateral
        function updateSidebarMech() {
            const content = document.querySelector('.mech-data-content');
            if (!content) return;
            
            const mech = ICONIC_MECHS[currentMechIndex];
            content.innerHTML = `
                <div class="mech-name">${mech.name}</div>
                <div class="mech-spec">CHASIS: ${mech.chassis}</div>
                <div class="mech-spec">MASA: ${mech.mass}</div>
                <div class="mech-spec">MOTOR: ${mech.engine}</div>
                <div class="mech-spec">VELOCIDAD: ${mech.speed}</div>
                <div class="mech-spec">BLINDAJE: ${mech.armor}</div>
                <div class="mech-spec">TÉRMICO: ${mech.heatsinks}</div>
                <div class="mech-spec">ARMAS: ${mech.weapons}</div>
            `;
        }
        
        // Actualizar la silueta del blueprint lateral
        function updateBlueprintSilhouette() {
            const marauderSvg = document.getElementById('mech-svg-marauder');
            const warhammerSvg = document.getElementById('mech-svg-warhammer');
            const battlemasterSvg = document.getElementById('mech-svg-battlemaster');
            const locustSvg = document.getElementById('mech-svg-locust');
            const waspSvg = document.getElementById('mech-svg-wasp');
            
            if (marauderSvg && warhammerSvg && battlemasterSvg && locustSvg && waspSvg) {
                // Ocultar todos
                marauderSvg.style.display = 'none';
                warhammerSvg.style.display = 'none';
                battlemasterSvg.style.display = 'none';
                locustSvg.style.display = 'none';
                waspSvg.style.display = 'none';
                
                // Mostrar el correspondiente
                if (currentMechIndex === 0) {
                    marauderSvg.style.display = 'block';
                } else if (currentMechIndex === 1) {
                    warhammerSvg.style.display = 'block';
                } else if (currentMechIndex === 2) {
                    battlemasterSvg.style.display = 'block';
                } else if (currentMechIndex === 3) {
                    locustSvg.style.display = 'block';
                } else if (currentMechIndex === 4) {
                    waspSvg.style.display = 'block';
                }
            }
        }

        window.onload = function() {
            init();
            initMechScanSystem();
        };

        // --- CRÍTICOS DE VEHÍCULOS ---
        const VEHICLE_CRITICALS = {
            "Conductor": "El conductor ha sido eliminado. Cada turno el vehículo realiza un chequeo de Pilotaje para evitar girar en una dirección aleatoria.",
            "Carga": "La munición o carga del vehículo ha sido dañada. Tira en la tabla de críticos de armas para determinar qué arma es afectada.",
            "Fallo de arma": "Un arma específica falla y no puede ser usada. Determina aleatoriamente qué arma.",
            "Estabilizador": "Los sistemas de estabilización fallan. +2 al modificador de ataque.",
            "Tripulación aturdida": "La tripulación está aturdida durante 1 turno completo. No puede realizar acciones.",
            "Torreta atascada": "La torreta no puede rotar. Mantiene su orientación actual.",
            "Torreta bloqueada": "La torreta está completamente bloqueada y no puede disparar ni rotar.",
            "Arma destruida": "Un arma es destruida permanentemente. Determina aleatoriamente cuál.",
            "Impacto motor": "El motor ha sido dañado. Reduce PM en 1 y haz un chequeo de crítico de movimiento.",
            "Sensores": "Los sensores están dañados. +2 al modificador de ataque.",
            "Comandante": "El comandante ha sido eliminado. La tripulación sufre -2 a todas las tiradas.",
            "Munición/Arma destruida": "La munición explota o el arma es destruida. 2D6 daño al vehículo.",
            "Combustible/Motor": "El combustible o motor es destruido. El vehículo queda inmovilizado. Tira para evitar explosión.",
            "Tripulación muerta": "Toda la tripulación ha sido eliminada. El vehículo queda inoperativo.",
            "Torreta destruida": "La torreta es completamente destruida con todas sus armas."
        };

        // --- CRÍTICOS DE BATTLEMECH ---
        const MECH_CRITICALS = {
            "Motor": "El motor ha sido dañado. Cada impacto reduce el movimiento. 3 impactos = mech destruido.",
            "Giroscopo": "El giroscopo está dañado. +3 al modificador de Pilotaje. 2 impactos = caída automática cada turno.",
            "Sensor": "Los sensores están dañados. +2 al modificador de ataque con armas.",
            "Sistema de soporte vital": "Los sistemas de soporte vital fallan. El piloto sufre daño por calor adicional.",
            "Actuador de hombro": "El actuador del hombro está destruido. No se pueden usar armas de ese brazo. +4 al modificador de ataque.",
            "Actuador de brazo superior": "El actuador superior está destruido. +1 al modificador de ataque para armas del brazo.",
            "Actuador de brazo inferior": "El actuador inferior está destruido. +1 al modificador de ataque para armas del brazo.",
            "Actuador de mano": "La mano está destruida. No se pueden realizar ataques físicos con esa mano.",
            "Actuador de cadera": "La cadera está dañada. +2 al modificador de Pilotaje.",
            "Actuador de pierna superior": "El actuador de pierna superior está destruido. +1 al modificador de Pilotaje.",
            "Actuador de pierna inferior": "El actuador de pierna inferior está destruido. +1 al modificador de Pilotaje.",
            "Actuador de pie": "El pie está destruido. +1 al modificador de Pilotaje.",
            "Disipadores de calor": "Un disipador de calor está destruido. -1 a la capacidad de disipación de calor.",
            "Salto Jets": "Un salto jet está destruido. Reduce la capacidad de salto en 1.",
            "Arma": "Un arma es destruida permanentemente. Determina aleatoriamente cuál.",
            "Munición": "La munición explota. 2D6 daño a la localización. Tira para determinar si se destruyen más sistemas.",
            "Cabeza golpeada": "El piloto recibe daño directo. Tira para consciencia del piloto."
        };

        function showCriticalInfo(criticalName) {
            const infoDiv = document.getElementById('critical-info-display');
            const criticalText = document.getElementById('critical-text-display');
                if (VEHICLE_CRITICALS[criticalName]) {
                criticalText.innerHTML = `<strong style="color: #ff8c42;">${criticalName}:</strong> ${VEHICLE_CRITICALS[criticalName]}`;
                infoDiv.style.display = 'block';
                        // Scroll suave al div de información
                infoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                infoDiv.style.display = 'none';
            }
        }

        function showMechCriticalInfo(criticalName) {
            const infoDiv = document.getElementById('mech-critical-info-display');
            const criticalText = document.getElementById('mech-critical-text-display');
                if (MECH_CRITICALS[criticalName]) {
                criticalText.innerHTML = `<strong style="color: #ff8c42;">${criticalName}:</strong> ${MECH_CRITICALS[criticalName]}`;
                infoDiv.style.display = 'block';
                        // Scroll suave al div de información
                infoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                infoDiv.style.display = 'none';
            }
        }
    
        // Contraseña para acceder a los paneles de configuración
        const CONFIG_PASSWORD = 'Mark';
        
        // Variable para saber qué panel abrir después de autenticar
        let configPanelPendiente = null;
        
        /**
         * Muestra el modal de contraseña para configuración
         */
        function mostrarConfigPasswordModal(panelType, title) {
            try {
                configPanelPendiente = panelType;
                const modal = document.getElementById('config-password-modal');
                if (!modal) {
                    console.error('Modal no encontrado');
                    alert('Error: Modal de contraseña no encontrado');
                    return;
                }
                document.getElementById('config-modal-title').textContent = title;
                document.getElementById('config-password-input').value = '';
                document.getElementById('config-password-error').style.display = 'none';
                modal.style.display = 'flex';
                setTimeout(() => {
                    document.getElementById('config-password-input').focus();
                }, 100);
            } catch (e) {
                console.error('Error en mostrarConfigPasswordModal:', e);
                alert('Error: ' + e.message);
            }
        }
        
        /**
         * Verifica la contraseña del modal de configuración
         */
        function verificarConfigPassword() {
            try {
                const pwd = document.getElementById('config-password-input').value;
                console.log('🔐 verificarConfigPassword - pwd:', pwd, 'expected:', CONFIG_PASSWORD);
                if (pwd === CONFIG_PASSWORD) {
                    // Guardar el panel pendiente ANTES de cerrar el modal
                    const panelAAbrir = configPanelPendiente;
                    console.log('✅ Contraseña correcta, panel a abrir:', panelAAbrir);
                    cerrarConfigPasswordModal();
                    
                    if (panelAAbrir === 'database') {
                        console.log('🔧 Llamando abrirPanelDatabase()...');
                        abrirPanelDatabase();
                    } else if (panelAAbrir === 'cronicas') {
                        console.log('📜 Llamando abrirPanelCronicas()...');
                        abrirPanelCronicas();
                    } else {
                        console.log('⚠️ panelAAbrir no reconocido:', panelAAbrir);
                    }
                } else {
                    document.getElementById('config-password-error').style.display = 'block';
                    document.getElementById('config-password-input').value = '';
                    document.getElementById('config-password-input').focus();
                }
            } catch (e) {
                console.error('Error en verificarConfigPassword:', e);
                alert('Error: ' + e.message);
            }
        }
        
        /**
         * Cierra el modal de contraseña
         */
        function cerrarConfigPasswordModal() {
            document.getElementById('config-password-modal').style.display = 'none';
            configPanelPendiente = null;
        }
        
        /**
         * Toggle del panel de configuración técnica (clic en D)
         */
        function toggleConfigDatabase() {
            try {
                const panel = document.getElementById('config-database-panel');
                
                if (panel.style.display === 'none' || panel.style.display === '') {
                    mostrarConfigPasswordModal('database', '⚙️ CONFIGURACIÓN TÉCNICA ⚙️');
                } else {
                    panel.style.display = 'none';
                }
            } catch (e) {
                console.error('Error en toggleConfigDatabase:', e);
                alert('Error: ' + e.message);
            }
        }
        
        /**
         * Abre el panel de database después de autenticar
         */
        function abrirPanelDatabase() {
            console.log('🔧 abrirPanelDatabase() llamado');
            const panel = document.getElementById('config-database-panel');
            if (!panel) {
                console.error('❌ Panel config-database-panel no encontrado');
                alert('Error: Panel no encontrado');
                return;
            }
            // Posición fixed para evitar overflow:hidden del landing-page
            panel.style.display = 'block';
            panel.style.position = 'fixed';
            panel.style.top = '50%';
            panel.style.left = '50%';
            panel.style.transform = 'translate(-50%, -50%)';
            panel.style.zIndex = '9000';
            panel.style.maxHeight = '80vh';
            panel.style.overflowY = 'auto';
            
            console.log('✅ Panel abierto');
            
            // Cargar URL guardada en localStorage
            const savedUrl = localStorage.getItem('GOOGLE_SCRIPT_URL_CUSTOM');
            if (savedUrl) {
                document.getElementById('config-apps-script-url').value = savedUrl;
            } else {
                document.getElementById('config-apps-script-url').value = typeof GOOGLE_SCRIPT_URL !== 'undefined' ? GOOGLE_SCRIPT_URL : '';
            }
        }
        
        /**
         * Guarda la URL de Apps Script en localStorage
         */
        /**
         * Ajusta el año de campaña
         */
        function ajustarAnoCampana(delta) {
            const input = document.getElementById('config-campaign-year');
            let year = parseInt(input.value) || 3026;
            year = Math.max(2300, Math.min(3200, year + delta));
            input.value = year;
        }
        
        /**
         * Guarda el año de campaña en localStorage Y en Google Sheets
         */
        async function guardarAnoCampana() {
            const year = parseInt(document.getElementById('config-campaign-year')?.value) || 3026;
            
            // Guardar en localStorage
            localStorage.setItem('CAMPAIGN_YEAR', year);
            document.getElementById('current-campaign-year').textContent = year;
            
            // Sincronizar con input de crónicas si existe
            const cronicasInput = document.getElementById('config-año-campana');
            if (cronicasInput) cronicasInput.value = year;
            
            // Guardar en Google Sheets
            try {
                const scriptUrl = localStorage.getItem('GOOGLE_SCRIPT_URL_CUSTOM') || (typeof GOOGLE_SCRIPT_URL !== 'undefined' ? GOOGLE_SCRIPT_URL : '');
                if (scriptUrl) {
                    const params = new URLSearchParams({
                        action: 'saveConfiguracionBatch',
                        config: JSON.stringify({ 'AÑO_CAMPANA': year.toString() })
                    });
                    
                    const response = await fetch(`${scriptUrl}?${params.toString()}`);
                    const data = await response.json();
                    
                    if (data.result === 'success') {
                        console.log('📅 Año sincronizado con Sheets:', year);
                    } else {
                        console.warn('⚠️ Error al sincronizar año con Sheets:', data.msg);
                    }
                }
            } catch (error) {
                console.warn('⚠️ No se pudo sincronizar año con Sheets:', error.message);
            }
            
            console.log('📅 Año de campaña guardado:', year);
        }
        
        /**
         * Carga el año de campaña desde Google Sheets (primero) o localStorage
         */
        async function cargarAnoCampana() {
            let year = 3026;
            
            // Intentar cargar desde Sheets primero
            try {
                const scriptUrl = localStorage.getItem('GOOGLE_SCRIPT_URL_CUSTOM') || (typeof GOOGLE_SCRIPT_URL !== 'undefined' ? GOOGLE_SCRIPT_URL : '');
                if (scriptUrl) {
                    const response = await fetch(`${scriptUrl}?action=getConfiguracion`);
                    const data = await response.json();
                    
                    if (data.result === 'success' && data.config && data.config['AÑO_CAMPANA']) {
                        year = parseInt(data.config['AÑO_CAMPANA']) || 3026;
                        localStorage.setItem('CAMPAIGN_YEAR', year);
                        console.log('📅 Año cargado desde Sheets:', year);
                    }
                }
            } catch (error) {
                console.warn('⚠️ No se pudo cargar año desde Sheets, usando localStorage');
                year = parseInt(localStorage.getItem('CAMPAIGN_YEAR')) || 3026;
            }
            
            // Fallback a localStorage si no hay conexión
            if (!year || year === 3026) {
                const savedYear = localStorage.getItem('CAMPAIGN_YEAR');
                if (savedYear) year = parseInt(savedYear);
            }
            
            // Actualizar display en portada
            const displayEl = document.getElementById('current-campaign-year');
            if (displayEl) displayEl.textContent = year;
            
            // Actualizar input en config del panel Database
            const inputEl = document.getElementById('config-campaign-year');
            if (inputEl) inputEl.value = year;
            
            // Sincronizar con input de crónicas si existe
            const cronicasInput = document.getElementById('config-año-campana');
            if (cronicasInput) cronicasInput.value = year;
            
            console.log('📅 Año de campaña:', year);
            return year;
        }
        
        // Cargar año al iniciar
        document.addEventListener('DOMContentLoaded', cargarAnoCampana);
        
        function guardarConfiguracionDatabase() {
            const url = document.getElementById('config-apps-script-url').value.trim();
            
            // Guardar año de campaña
            guardarAnoCampana();
            
            if (!url) {
                alert('✅ Año de campaña guardado.');
                return;
            }
            
            if (!url.startsWith('https://script.google.com/')) {
                alert('⚠️ La URL debe ser de Google Apps Script');
                return;
            }
            
            localStorage.setItem('GOOGLE_SCRIPT_URL_CUSTOM', url);
            alert('✅ Configuración guardada. Recarga la página para aplicar los cambios.');
        }
        
        /**
         * Prueba la conexión con Apps Script
         */
        async function testConexionAppsScript() {
            const statusEl = document.getElementById('config-connection-status');
            const url = document.getElementById('config-apps-script-url').value.trim() || (typeof GOOGLE_SCRIPT_URL !== 'undefined' ? GOOGLE_SCRIPT_URL : '');
            
            statusEl.innerHTML = '⏳ Probando...';
            statusEl.style.color = '#ffae00';
            
            try {
                const response = await fetch(`${url}?action=getConfiguracion`);
                const data = await response.json();
                
                if (data.result === 'success') {
                    statusEl.innerHTML = '✅ Conectado';
                    statusEl.style.color = '#22c55e';
                } else {
                    statusEl.innerHTML = '⚠️ Respuesta inválida';
                    statusEl.style.color = '#f59e0b';
                }
            } catch (error) {
                statusEl.innerHTML = '❌ Error de conexión';
                statusEl.style.color = '#ef4444';
                console.error('Error de conexión:', error);
            }
        }
        

    // Variables para el zoom del mapa
    let currentZoom = 1;
    const minZoom = 0.5;
    const maxZoom = 4;
    const baseWidth = 1400; // Ancho base del mapa
    
    // Función para cambiar el mapa estelar
    function cambiarMapaEstelar(year) {
        // Actualizar el mapa
        const mapDisplay = document.getElementById('stellar-map-display');
        const fileName = year + '_Inner_Sphere__Sarna_.svg';
        mapDisplay.data = fileName;
        
        // Actualizar el label del año
        document.getElementById('current-map-year').textContent = year;
        
        // Actualizar estilos de botones
        const allButtons = document.querySelectorAll('.map-year-btn');
        allButtons.forEach(btn => {
            btn.style.background = 'transparent';
            btn.style.color = '#ff8c42';
        });
        
        const activeButton = document.getElementById('map-btn-' + year);
        if (activeButton) {
            activeButton.style.background = '#ff8c42';
            activeButton.style.color = '#000';
        }
        
        console.log('🗺️ Mapa cambiado a año:', year);
    }
    
    // Función para zoom del mapa
    function zoomMapa(delta) {
        currentZoom = Math.max(minZoom, Math.min(maxZoom, currentZoom + delta));
        aplicarZoom();
    }
    
    // Reset zoom
    function resetZoomMapa() {
        currentZoom = 1;
        aplicarZoom();
        // Centrar el scroll
        const container = document.getElementById('map-container');
        container.scrollLeft = 0;
        container.scrollTop = 0;
    }
    
    // Aplicar el zoom actual - usando ancho real para scroll correcto
    function aplicarZoom() {
        const mapDisplay = document.getElementById('stellar-map-display');
        const mapWrapper = document.getElementById('map-wrapper');
        const zoomPercent = Math.round(currentZoom * 100);
        const newWidth = baseWidth * currentZoom;
        
        // Cambiar el ancho real del elemento (no transform)
        mapDisplay.style.width = newWidth + 'px';
        
        document.getElementById('zoom-level').textContent = zoomPercent + '%';
        console.log('🔍 Zoom:', zoomPercent + '%', 'Ancho:', newWidth + 'px');
    }
    
    // Zoom con rueda del ratón
    document.addEventListener('DOMContentLoaded', function() {
        const mapContainer = document.getElementById('map-container');
        if (mapContainer) {
            mapContainer.addEventListener('wheel', function(e) {
                if (e.ctrlKey) {
                    e.preventDefault();
                    const delta = e.deltaY > 0 ? -0.1 : 0.1;
                    zoomMapa(delta);
                }
            }, { passive: false });
        }
    });
    

/**
 * ============================================================================
 * GENERADOR DE PDF PARA BARRACONES - MECHWARRIOR
 * Sistema completo para crear PDF en B/N con silueta y cuadrados de vida
 * ============================================================================
 */

/**
 * Genera el PDF de la ficha del personaje
 */
async function generarPDFPersonaje() {
    console.log('📄 Iniciando generación de PDF...');
    
    // Verificar que jsPDF esté cargado
    if (typeof window.jspdf === 'undefined') {
        alert('Error: Librería jsPDF no cargada. Recarga la página.');
        return;
    }
    
    try {
        // DETECTAR ORIGEN: Generador o Barracones
        const fichaContainer = document.getElementById('ficha-container');
        const fichaVisible = fichaContainer && fichaContainer.style.display !== 'none';
        const barraconesVisible = document.getElementById('barracones')?.style.display === 'block';
        
        let elementToCapture;
        let wasHidden = false;
        let originalDisplay = '';
        
        if (fichaVisible) {
            // CASO 1: Estamos en el Generador - capturar directamente ficha-container
            console.log('📍 Capturando desde Generador (ficha-container)');
            elementToCapture = fichaContainer;
            
        } else if (barraconesVisible) {
            // CASO 2: Estamos en Barracones - necesitamos mostrar ficha-container temporalmente
            console.log('📍 Capturando desde Barracones');
            
            // Verificar que hay datos cargados
            if (!datosPersonajeBarracones) {
                alert('No hay personaje cargado. Carga un personaje primero.');
                return;
            }
            
            // IMPORTANTE: Actualizar datosPersonajeBarracones con el estado ACTUAL del DOM
            // Esto captura los daños marcados, XP gastado, etc. desde que se cargó
            const datosActuales = recogerDatosBarracones();
            // Mergear datos actuales con los originales (los actuales tienen prioridad)
            datosPersonajeBarracones = { ...datosPersonajeBarracones, ...datosActuales };
            console.log('📦 Datos actualizados para PDF:', datosPersonajeBarracones);
            console.log('💔 Estado físico actual:', datosPersonajeBarracones.estadoFisico);
            
            // Ocultar Barracones temporalmente
            const barracones = document.getElementById('barracones');
            const toolbar = document.getElementById('barracones-toolbar');
            barracones.style.display = 'none';
            if (toolbar) toolbar.style.display = 'none';
            
            // Mostrar ficha-container
            originalDisplay = fichaContainer.style.display;
            fichaContainer.style.display = 'block';
            wasHidden = true;
            
            // Rellenar la ficha con los datos de Barracones
            rellenarFichaDesdeBarracones(datosPersonajeBarracones);
            
            elementToCapture = fichaContainer;
            
        } else {
            alert('No hay personaje visible. Genera o carga un personaje primero.');
            return;
        }
        
        // Ocultar botones de la ficha antes de capturar
        const noprints = elementToCapture.querySelectorAll('.no-print');
        noprints.forEach(el => el.style.display = 'none');
        
        // ========== APLICAR ESTILOS BLANCO Y NEGRO PARA PDF ==========
        // Guardar estilos originales
        const originalStyles = {
            containerBg: elementToCapture.style.backgroundColor,
            containerColor: elementToCapture.style.color,
            containerBorder: elementToCapture.style.border
        };
        
        // Aplicar fondo blanco y texto negro
        elementToCapture.style.backgroundColor = '#ffffff';
        elementToCapture.style.color = '#000000';
        elementToCapture.style.border = 'none';
        
        // Cambiar colores de la silueta SVG
        const svgPaths = elementToCapture.querySelectorAll('#character-silhouette path, #character-silhouette ellipse, #character-silhouette rect');
        const originalSvgStyles = [];
        svgPaths.forEach((el, i) => {
            originalSvgStyles[i] = { fill: el.getAttribute('fill'), stroke: el.getAttribute('stroke') };
            el.setAttribute('fill', '#e0e0e0');
            el.setAttribute('stroke', '#333333');
        });
        
        // Cambiar colores de los círculos HP
        const hpCircles = elementToCapture.querySelectorAll('.hp-circle');
        const originalCircleStyles = [];
        hpCircles.forEach((circle, i) => {
            originalCircleStyles[i] = { fill: circle.getAttribute('fill'), stroke: circle.getAttribute('stroke') };
            if (circle.classList.contains('checked')) {
                circle.setAttribute('fill', '#555555');
            } else {
                circle.setAttribute('fill', '#ffffff');
            }
            circle.setAttribute('stroke', '#000000');
        });
        
        // Cambiar colores de secciones, títulos, etc.
        const sections = elementToCapture.querySelectorAll('.section');
        const originalSectionStyles = [];
        sections.forEach((el, i) => {
            originalSectionStyles[i] = { bg: el.style.backgroundColor, border: el.style.border };
            el.style.backgroundColor = '#ffffff';
            el.style.border = '1px solid #999999';
        });
        
        const h2s = elementToCapture.querySelectorAll('h2');
        const originalH2Styles = [];
        h2s.forEach((el, i) => {
            originalH2Styles[i] = { bg: el.style.backgroundColor, color: el.style.color };
            el.style.backgroundColor = '#eeeeee';
            el.style.color = '#000000';
        });
        
        const h1s = elementToCapture.querySelectorAll('h1');
        const originalH1Styles = [];
        h1s.forEach((el, i) => {
            originalH1Styles[i] = { bg: el.style.backgroundColor, color: el.style.color };
            el.style.backgroundColor = '#eeeeee';
            el.style.color = '#000000';
        });
        
        const attrBoxes = elementToCapture.querySelectorAll('.attr-box');
        const originalAttrStyles = [];
        attrBoxes.forEach((el, i) => {
            originalAttrStyles[i] = { bg: el.style.backgroundColor };
            el.style.backgroundColor = '#f9f9f9';
        });
        
        const attrValues = elementToCapture.querySelectorAll('.attr-value');
        attrValues.forEach(el => el.style.color = '#000000');
        
        const attrLabels = elementToCapture.querySelectorAll('.attr-label');
        attrLabels.forEach(el => el.style.color = '#000000');
        
        const fieldLabels = elementToCapture.querySelectorAll('.field-label');
        fieldLabels.forEach(el => el.style.color = '#555555');
        
        const inputs = elementToCapture.querySelectorAll('.sheet-input');
        inputs.forEach(el => el.style.color = '#000000');
        
        const tables = elementToCapture.querySelectorAll('.skill-table, .weapon-table');
        tables.forEach(el => el.style.backgroundColor = '#ffffff');
        
        const ths = elementToCapture.querySelectorAll('.skill-table th, .weapon-table th');
        ths.forEach(el => {
            el.style.backgroundColor = '#eeeeee';
            el.style.color = '#000000';
        });
        
        const tds = elementToCapture.querySelectorAll('.skill-table td, .weapon-table td');
        tds.forEach(el => el.style.color = '#000000');
        
        // Mostrar mensaje de progreso
        alert('Generando PDF... Esto puede tardar unos segundos.');
        
        // Esperar un momento para que se renderice todo
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Usar html2canvas para capturar
        const canvas = await html2canvas(elementToCapture, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            windowWidth: 900,
            width: 900
        });
        
        // Restaurar botones
        noprints.forEach(el => el.style.display = '');
        
        // ========== RESTAURAR ESTILOS ORIGINALES ==========
        elementToCapture.style.backgroundColor = originalStyles.containerBg;
        elementToCapture.style.color = originalStyles.containerColor;
        elementToCapture.style.border = originalStyles.containerBorder;
        
        svgPaths.forEach((el, i) => {
            if (originalSvgStyles[i]) {
                el.setAttribute('fill', originalSvgStyles[i].fill);
                el.setAttribute('stroke', originalSvgStyles[i].stroke);
            }
        });
        
        hpCircles.forEach((circle, i) => {
            if (originalCircleStyles[i]) {
                circle.setAttribute('fill', originalCircleStyles[i].fill);
                circle.setAttribute('stroke', originalCircleStyles[i].stroke);
            }
        });
        
        sections.forEach((el, i) => {
            if (originalSectionStyles[i]) {
                el.style.backgroundColor = originalSectionStyles[i].bg;
                el.style.border = originalSectionStyles[i].border;
            }
        });
        
        h2s.forEach((el, i) => {
            if (originalH2Styles[i]) {
                el.style.backgroundColor = originalH2Styles[i].bg;
                el.style.color = originalH2Styles[i].color;
            }
        });
        
        h1s.forEach((el, i) => {
            if (originalH1Styles[i]) {
                el.style.backgroundColor = originalH1Styles[i].bg;
                el.style.color = originalH1Styles[i].color;
            }
        });
        
        attrBoxes.forEach((el, i) => {
            if (originalAttrStyles[i]) {
                el.style.backgroundColor = originalAttrStyles[i].bg;
            }
        });
        
        attrValues.forEach(el => el.style.color = '');
        attrLabels.forEach(el => el.style.color = '');
        fieldLabels.forEach(el => el.style.color = '');
        inputs.forEach(el => el.style.color = '');
        tables.forEach(el => el.style.backgroundColor = '');
        ths.forEach(el => { el.style.backgroundColor = ''; el.style.color = ''; });
        tds.forEach(el => el.style.color = '');
        
        // Si estábamos en Barracones, restaurar la vista
        if (wasHidden) {
            fichaContainer.style.display = originalDisplay || 'none';
            document.getElementById('barracones').style.display = 'block';
            const toolbar = document.getElementById('barracones-toolbar');
            if (toolbar) toolbar.style.display = 'block';
        }
        
        // Crear PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        // Calcular proporciones para ajustar al A4
        const canvasRatio = canvas.height / canvas.width;
        const pageRatio = pdfHeight / pdfWidth;
        
        let imgWidth = pdfWidth;
        let imgHeight = pdfWidth * canvasRatio;
        
        // Si la imagen es más alta que la página, ajustar
        if (imgHeight > pdfHeight) {
            imgHeight = pdfHeight;
            imgWidth = pdfHeight / canvasRatio;
        }
        
        // Centrar en la página
        const xOffset = (pdfWidth - imgWidth) / 2;
        const yOffset = 0;
        
        pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
        
        // Obtener nombre del personaje
        const nombreField = document.getElementById('nombre-field');
        const barrNombre = document.getElementById('barr-nombre');
        const nombre = nombreField?.value || barrNombre?.value || 'Personaje';
        
        // Descargar
        const fileName = `${nombre.replace(/\s+/g, '_')}_Ficha.pdf`;
        pdf.save(fileName);
        
        console.log('✅ PDF generado exitosamente');
        
    } catch (error) {
        console.error('❌ Error al generar PDF:', error);
        alert('Error al generar PDF: ' + error.message);
        
        // Intentar restaurar la vista en caso de error
        const fichaContainer = document.getElementById('ficha-container');
        const barracones = document.getElementById('barracones');
        if (barracones && fichaContainer) {
            if (document.getElementById('barracones-toolbar')?.style.display === 'none') {
                fichaContainer.style.display = 'none';
                barracones.style.display = 'block';
                document.getElementById('barracones-toolbar').style.display = 'block';
            }
        }
    }
}

/**
 * Rellena ficha-container con datos desde Barracones/datosPersonajeBarracones
 * para poder capturarla como PDF
 * NO recalcula nada - usa los datos tal cual están guardados
 */
function rellenarFichaDesdeBarracones(datos) {
    console.log('📋 Rellenando ficha desde datos de Barracones...');
    console.log('📦 Datos recibidos:', datos);
    
    // Datos personales - usar tal cual vienen del JSON
    const nombreField = document.getElementById('nombre-field');
    const jugadorField = document.getElementById('jugador-field');
    const origenOutput = document.getElementById('origen-output');
    const estudiosOutput = document.getElementById('estudios-output');
    const factionOutput = document.getElementById('faction-output');
    const mechOutput = document.getElementById('mech-output');
    
    if (nombreField) nombreField.value = datos.nombre || '';
    if (jugadorField) jugadorField.value = datos.jugador || '';
    if (origenOutput) origenOutput.value = datos.origen || '';
    if (estudiosOutput) estudiosOutput.value = datos.estudios || '';
    if (factionOutput) factionOutput.value = datos.afiliacion || '';
    if (mechOutput) mechOutput.value = datos.mech || ''; // Usar el mech guardado directamente
    
    // Datos físicos - usar tal cual
    const edadField = document.getElementById('edad-field');
    const sexoField = document.getElementById('sexo-field');
    const alturaField = document.getElementById('altura-field');
    const ojosField = document.getElementById('ojos-field');
    const peloField = document.getElementById('pelo-field');
    const pesoField = document.getElementById('peso-field');
    
    // Año de nacimiento desde decade + year
    let edadText = '';
    if (datos.decade) {
        edadText = datos.decade.toString().substring(0, 3) + (datos.year || '0');
    }
    
    if (edadField) edadField.value = edadText;
    if (sexoField) sexoField.value = datos.sexo || '';
    if (alturaField) alturaField.value = datos.altura || '';
    if (ojosField) ojosField.value = datos.ojos || '';
    if (peloField) peloField.value = datos.pelo || '';
    if (pesoField) pesoField.value = datos.peso || '';
    
    // Atributos - usar valores actuales de Barracones (pueden haber subido)
    const attrStr = document.getElementById('attr-str');
    const attrDex = document.getElementById('attr-dex');
    const attrInt = document.getElementById('attr-int');
    const attrCha = document.getElementById('attr-cha');
    
    if (attrStr) attrStr.textContent = datos.str || '0';
    if (attrDex) attrDex.textContent = datos.dex || '0';
    if (attrInt) attrInt.textContent = datos.int || '0';
    if (attrCha) attrCha.textContent = datos.cha || '0';
    
    // XP - usar valores actuales de Barracones
    const sheetXpTotal = document.getElementById('sheet-xp-total');
    const sheetXpAvail = document.getElementById('sheet-xp-avail');
    if (sheetXpTotal) sheetXpTotal.value = datos.xpTotal || '0';
    if (sheetXpAvail) sheetXpAvail.value = datos.xpDisponible || datos.xpAvail || '0';
    
    // C-Bills y Salario
    const sheetCbills = document.getElementById('sheet-cbills');
    const sheetSalary = document.getElementById('sheet-salary');
    if (sheetCbills) sheetCbills.value = datos.cbills || '';
    if (sheetSalary) sheetSalary.value = datos.salary || '';
    
    // Habilidades - usar las del JSON (con niveles actualizados)
    // SIN botón de añadir habilidad (es para PDF)
    const skillContainer = document.getElementById('skill-list-container');
    if (skillContainer && datos.extraSkills && datos.extraSkills.length > 0) {
        let skillHTML = `
            <table class="skill-table" id="skills-display-table">
                <thead>
                    <tr>
                        <th style="width: 35px;">↑</th>
                        <th>HABILIDAD</th>
                        <th style="width: 50px;">NIVEL</th>
                        <th style="width: 60px;">CARACT.</th>
                        <th style="width: 50px;">TIRADA</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        datos.extraSkills.forEach(skill => {
            if (skill && (skill.name || skill.nombre)) {
                const nombre = skill.name || skill.nombre;
                const nivel = parseInt(skill.level) || parseInt(skill.nivel) || 0;
                const tir = 7 - nivel;
                if (nivel > 0) {
                    skillHTML += `
                        <tr>
                            <td class="skill-xp-col">
                                <div class="q-box-container">
                                    <div class="chk-box"></div>
                                    <div class="chk-box"></div>
                                </div>
                            </td>
                            <td>${nombre}</td>
                            <td class="skill-level-col">${nivel}</td>
                            <td class="skill-attr-col">7</td>
                            <td class="skill-roll-col">${tir}</td>
                        </tr>
                    `;
                }
            }
        });
        
        skillHTML += `
                </tbody>
            </table>
        `;
        // NO añadir botón "+ Añadir Habilidad" - esto es para PDF
        
        skillContainer.innerHTML = skillHTML;
    }
    
    // === ARMAS PERSONALES ===
    // Cargar armas desde datos.armas en la tabla weapon-table
    // El select guarda el ÍNDICE en INFANTRY_WEAPON_TABLE, no el nombre
    const weaponTable = document.querySelector('#ficha-container .weapon-table tbody');
    if (weaponTable && datos.armas && datos.armas.length > 0) {
        const rows = weaponTable.querySelectorAll('tr');
        
        datos.armas.forEach((arma, index) => {
            if (index < rows.length && arma.select !== '' && arma.select !== undefined) {
                const row = rows[index];
                const cells = row.querySelectorAll('td');
                
                // El select guarda el índice en INFANTRY_WEAPON_TABLE
                const weaponIndex = parseInt(arma.select);
                
                if (!isNaN(weaponIndex) && weaponIndex >= 0 && weaponIndex < INFANTRY_WEAPON_TABLE.length) {
                    const weaponData = INFANTRY_WEAPON_TABLE[weaponIndex];
                    
                    if (cells.length >= 8 && weaponData) {
                        // Celda 0: Nombre del arma
                        const selectOrInput = cells[0].querySelector('select, input');
                        if (selectOrInput) {
                            if (selectOrInput.tagName === 'SELECT') {
                                selectOrInput.innerHTML = `<option value="${weaponIndex}">${weaponData.name}</option>`;
                                selectOrInput.value = weaponIndex;
                            } else {
                                selectOrInput.value = weaponData.name;
                            }
                        }
                        
                        // Celda 1: Daño
                        const dmgInput = cells[1].querySelector('input');
                        if (dmgInput) dmgInput.value = weaponData.dmg || '';
                        
                        // Celda 2: Alcance C (corto)
                        const sInput = cells[2].querySelector('input');
                        if (sInput) sInput.value = weaponData.s || '';
                        
                        // Celda 3: Alcance M (medio)
                        const mInput = cells[3].querySelector('input');
                        if (mInput) mInput.value = weaponData.m || '';
                        
                        // Celda 4: Alcance L (largo)
                        const lInput = cells[4].querySelector('input');
                        if (lInput) lInput.value = weaponData.l || '';
                        
                        // Celda 5: CAR (cargador)
                        const carInput = cells[5].querySelector('input');
                        if (carInput) carInput.value = weaponData.car || '';
                        
                        // Celda 6: REC (retroceso)
                        const recInput = cells[6].querySelector('input');
                        if (recInput) recInput.value = weaponData.rec || '';
                        
                        // Celda 7: PESO
                        const wInput = cells[7].querySelector('input');
                        if (wInput) wInput.value = weaponData.w || '';
                        
                        console.log(`🔫 Arma ${index + 1}: ${weaponData.name} (índice ${weaponIndex})`);
                    }
                }
            }
        });
        
        console.log('🔫 Armas cargadas en tabla desde índices:', datos.armas);
    }
    
    // Méritos - usar tal cual del JSON
    const meritContainer = document.getElementById('merit-container');
    if (meritContainer) {
        let meritHTML = '';
        if (datos.merits && datos.merits.length > 0) {
            datos.merits.forEach(m => {
                if (m) meritHTML += `<div class="field">${m}</div>`;
            });
        }
        meritContainer.innerHTML = meritHTML || '';
    }
    
    // Deméritos - usar tal cual del JSON
    const demeritContainer = document.getElementById('demerit-container');
    if (demeritContainer) {
        let demeritHTML = '';
        if (datos.demerits && datos.demerits.length > 0) {
            datos.demerits.forEach(d => {
                if (d) demeritHTML += `<div class="field">${d}</div>`;
            });
        }
        demeritContainer.innerHTML = demeritHTML || '';
    }
    
    // Generar puntos de vida en la silueta basándose en FUE actual
    // Incluir estado de daño (cuadrados marcados)
    const str = parseInt(datos.str) || 0;
    if (str > 0) {
        generarPuntosVidaParaFicha(str, datos.estadoFisico);
    }
    
    console.log('✅ Ficha rellenada desde Barracones');
}

/**
 * Genera los puntos de vida en la silueta de ficha-container
 * @param {number} str - Valor de Fuerza
 * @param {Array} estadoFisico - Array de {index, damaged} con estado de cada cuadrado
 */
function generarPuntosVidaParaFicha(str, estadoFisico) {
    // Distribución según fórmula
    const distribucion = {
        cabeza: str,
        torso: str * 3,
        brazoIzq: Math.floor(str * 2),
        brazoDer: Math.floor(str * 2),
        piernaIzq: Math.ceil(str * 2),
        piernaDer: Math.ceil(str * 2)
    };
    
    // Crear set de índices dañados para búsqueda rápida
    const dañados = new Set();
    if (estadoFisico && Array.isArray(estadoFisico)) {
        estadoFisico.forEach(estado => {
            if (estado.damaged) {
                dañados.add(estado.index);
            }
        });
    }
    
    let indexGlobal = 0;
    const radio = 6; // Radio de los círculos
    const espaciado = 14; // Espaciado entre círculos
    
    // Definición de regiones con coordenadas SVG
    // {x, y} = esquina superior izquierda, cols = columnas máximas
    const regiones = {
        cabeza:     { x: 82, y: 18, cols: 3, contenedor: 'hp-head' },
        brazoIzq:   { x: 15, y: 100, cols: 2, contenedor: 'hp-arm-l' },
        torso:      { x: 70, y: 103, cols: 5, contenedor: 'hp-torso' },
        brazoDer:   { x: 163, y: 100, cols: 2, contenedor: 'hp-arm-r' },
        piernaIzq:  { x: 52, y: 200, cols: 2, contenedor: 'hp-leg-l' },
        piernaDer:  { x: 120, y: 200, cols: 2, contenedor: 'hp-leg-r' }
    };
    
    // Función para crear círculos SVG en una región
    const crearCirculosSVG = (cantidad, region) => {
        const contenedor = document.getElementById(region.contenedor);
        if (!contenedor) return;
        
        // Limpiar contenedor
        contenedor.innerHTML = '';
        
        // Calcular filas completas y resto
        const filasCompletas = Math.floor(cantidad / region.cols);
        const resto = cantidad % region.cols;
        
        let idx = 0;
        
        // Generar filas completas
        for (let fila = 0; fila < filasCompletas; fila++) {
            for (let col = 0; col < region.cols; col++) {
                const cx = region.x + (col * espaciado) + radio;
                const cy = region.y + (fila * espaciado) + radio;
                
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', cx);
                circle.setAttribute('cy', cy);
                circle.setAttribute('r', radio);
                circle.setAttribute('fill', dañados.has(indexGlobal) ? '#4a9eff' : '#1a1a1a');
                circle.setAttribute('stroke', '#888');
                circle.setAttribute('stroke-width', '1.5');
                circle.setAttribute('class', dañados.has(indexGlobal) ? 'hp-circle checked' : 'hp-circle');
                
                contenedor.appendChild(circle);
                indexGlobal++;
            }
        }
        
        // Generar última fila centrada si hay resto
        if (resto > 0) {
            const offsetX = ((region.cols - resto) * espaciado) / 2;
            for (let col = 0; col < resto; col++) {
                const cx = region.x + offsetX + (col * espaciado) + radio;
                const cy = region.y + (filasCompletas * espaciado) + radio;
                
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', cx);
                circle.setAttribute('cy', cy);
                circle.setAttribute('r', radio);
                circle.setAttribute('fill', dañados.has(indexGlobal) ? '#4a9eff' : '#1a1a1a');
                circle.setAttribute('stroke', '#888');
                circle.setAttribute('stroke-width', '1.5');
                circle.setAttribute('class', dañados.has(indexGlobal) ? 'hp-circle checked' : 'hp-circle');
                
                contenedor.appendChild(circle);
                indexGlobal++;
            }
        }
    };
    
    // Generar círculos EN EL MISMO ORDEN QUE BARRACONES:
    // CABEZA → B.IZQ → TORSO → B.DER → P.IZQ → P.DER
    crearCirculosSVG(distribucion.cabeza, regiones.cabeza);
    crearCirculosSVG(distribucion.brazoIzq, regiones.brazoIzq);
    crearCirculosSVG(distribucion.torso, regiones.torso);
    crearCirculosSVG(distribucion.brazoDer, regiones.brazoDer);
    crearCirculosSVG(distribucion.piernaIzq, regiones.piernaIzq);
    crearCirculosSVG(distribucion.piernaDer, regiones.piernaDer);
    
    console.log(`💔 HP generados: ${indexGlobal} círculos SVG, ${dañados.size} dañados`);
}

/**
 * Obtiene los datos del personaje actual en Barracones
 */

/**
 * CORRECCIÓN COMPLETA - Captura de habilidades, vida y antecedentes
 */

// ========== FUNCIÓN CORREGIDA: HABILIDADES ==========
function obtenerHabilidadesParaPDF() {
    const habilidades = [];
    const table = document.getElementById('barr-skills-table');
    
    if (!table) {
        console.warn('⚠ Tabla de habilidades no encontrada');
        return habilidades;
    }
    
    // Empezar desde fila 1 para saltar el header (fila 0)
    for (let i = 1; i < table.rows.length; i++) {
        const row = table.rows[i];
        const index = i - 1; // Índice para IDs (0, 1, 2...)
        
        // ESTRUCTURA REAL:
        // Celda 0: textContent con nombre de habilidad
        // Celda 1: input con id barr-skill-{index}-nv
        // Celda 2: input con id barr-skill-{index}-tir
        
        const nombre = row.cells[0]?.textContent?.trim();
        const nvInput = document.getElementById(`barr-skill-${index}-nv`);
        const tirInput = document.getElementById(`barr-skill-${index}-tir`);
        
        if (!nombre) continue;
        
        const nivel = parseInt(nvInput?.value) || 0;
        const tir = parseInt(tirInput?.value) || 0;
        
        // Solo añadir si tiene nombre y nivel > 0
        if (nombre && nivel > 0) {
            habilidades.push({ 
                nombre, 
                nivel,
                tir
            });
            console.log(`  ✓ Habilidad: ${nombre} (Nivel ${nivel}, TIR ${tir})`);
        }
    }
    
    console.log(`✅ Total habilidades capturadas: ${habilidades.length}`);
    return habilidades;
}

// ========== FUNCIÓN CORREGIDA: PUNTOS DE VIDA ==========
function calcularPuntosVidaParaPDF() {
    // FÓRMULA CORRECTA:
    // CABEZA: FUE
    // TORSO: FUE × 3
    // BRAZOS: FUE × 2 cada uno (floor si no es exacto)
    // PIERNAS: FUE × 2 cada una (ceil si no es exacto)
    
    const fue = parseInt(document.getElementById('barr-fue')?.value) || 0;
    
    const distribucion = {
        cabeza: fue,
        torso: fue * 3,
        brazoIzq: Math.floor(fue * 2),
        brazoDer: Math.floor(fue * 2),
        piernaIzq: Math.ceil(fue * 2),
        piernaDer: Math.ceil(fue * 2)
    };
    
    const totalCuadrados = distribucion.cabeza + distribucion.torso + 
                          distribucion.brazoIzq + distribucion.brazoDer + 
                          distribucion.piernaIzq + distribucion.piernaDer;
    
    // Contar cuadrados marcados como heridos
    const cuadradosMarcados = document.querySelectorAll('.hit-point-square.hit').length;
    
    console.log(`💓 Puntos de vida: ${totalCuadrados - cuadradosMarcados} / ${totalCuadrados}`);
    console.log(`   Distribución (FUE=${fue}):`);
    console.log(`   - CABEZA: ${distribucion.cabeza}`);
    console.log(`   - TORSO: ${distribucion.torso}`);
    console.log(`   - B.IZQ: ${distribucion.brazoIzq}`);
    console.log(`   - B.DER: ${distribucion.brazoDer}`);
    console.log(`   - P.IZQ: ${distribucion.piernaIzq}`);
    console.log(`   - P.DER: ${distribucion.piernaDer}`);
    
    return {
        total: totalCuadrados,
        usados: cuadradosMarcados,
        restantes: totalCuadrados - cuadradosMarcados
    };
}

// ========== FUNCIÓN PRINCIPAL CORREGIDA ==========
function obtenerDatosPersonajeActual() {
    console.log('📋 ====== CAPTURANDO DATOS COMPLETOS ======');
    
    // DETECTAR ORIGEN: Generador (ficha-container) o Barracones
    const fichaVisible = document.getElementById('ficha-container')?.style.display !== 'none';
    const barraconesVisible = document.getElementById('barracones')?.style.display === 'block';
    
    let nombre, jugador, campaign, str, dex, int, cha, origen, afiliacion, estudios, historia;
    let habilidades = [];
    let puntosVida = { total: 0, usados: 0, restantes: 0 };
    let xpTotal = 0, xpDisponible = 0;
    
    if (fichaVisible) {
        // LEER DESDE GENERADOR (ficha-container)
        console.log('📍 Origen: GENERADOR DE PERSONAJES');
        
        nombre = document.getElementById('nombre-field')?.value || '';
        jugador = document.getElementById('jugador-field')?.value || '';
        campaign = ''; // No hay campaign en generador
        
        // Atributos (divs, no inputs)
        str = parseInt(document.getElementById('attr-str')?.textContent) || 0;
        dex = parseInt(document.getElementById('attr-dex')?.textContent) || 0;
        int = parseInt(document.getElementById('attr-int')?.textContent) || 0;
        cha = parseInt(document.getElementById('attr-cha')?.textContent) || 0;
        
        origen = document.getElementById('origen-output')?.value || '';
        afiliacion = document.getElementById('faction-output')?.value || '';
        estudios = document.getElementById('estudios-output')?.value || '';
        historia = ''; // No hay historia en generador
        
        // Habilidades desde tabla skills-display-table
        const skillTable = document.getElementById('skills-display-table');
        if (skillTable) {
            const rows = skillTable.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 4) {
                    const nombre = cells[1]?.textContent?.trim();
                    const nivel = parseInt(cells[2]?.textContent) || 0;
                    const tir = parseInt(cells[3]?.textContent) || 0;
                    if (nombre && nivel > 0) {
                        habilidades.push({ nombre, nivel, tir });
                    }
                }
            });
        }
        
        // Puntos de vida con fórmula correcta
        puntosVida = {
            total: str * 12,
            usados: 0, // No podemos saber heridas desde el generador
            restantes: str * 12
        };
        
        // XP desde generador
        xpTotal = parseInt(document.getElementById('xp-display')?.textContent) || 0;
        xpDisponible = xpTotal; // Sin gastar en generador
        
    } else if (barraconesVisible) {
        // LEER DESDE BARRACONES
        console.log('📍 Origen: BARRACONES');
        
        nombre = document.getElementById('barr-nombre')?.value || '';
        jugador = document.getElementById('barr-callsign')?.value || ''; // ← CORREGIDO: barr-callsign, no barr-jugador
        campaign = ''; // No existe en Barracones
        
        // Atributos desde inputs
        str = parseInt(document.getElementById('barr-fue')?.value) || 0;
        dex = parseInt(document.getElementById('barr-des')?.value) || 0;
        int = parseInt(document.getElementById('barr-int')?.value) || 0;
        cha = parseInt(document.getElementById('barr-car')?.value) || 0;
        
        // LEER DESDE VARIABLE GLOBAL (datos históricos que no están en inputs)
        if (datosPersonajeBarracones) {
            console.log('📦 Usando datos históricos desde variable global');
            origen = datosPersonajeBarracones.origen || '';
            afiliacion = datosPersonajeBarracones.afiliacion || '';
            estudios = datosPersonajeBarracones.estudios || '';
            historia = datosPersonajeBarracones.historia || '';
        } else {
            console.warn('⚠️ No hay datos históricos disponibles (datosPersonajeBarracones es null)');
            origen = '';
            afiliacion = '';
            estudios = '';
            historia = '';
        }
        
        // Habilidades desde Barracones
        habilidades = obtenerHabilidadesParaPDF();
        
        // Puntos de vida con heridas marcadas
        puntosVida = calcularPuntosVidaParaPDF();
        
        // XP desde Barracones
        xpTotal = parseInt(document.getElementById('barr-xp-total')?.value) || 0;
        xpDisponible = parseInt(document.getElementById('barr-xp-disponible')?.value) || 0;
        
    } else {
        console.warn('⚠ No hay personaje visible');
        return null;
    }
    
    if (!nombre) {
        console.warn('⚠ No hay personaje cargado');
        return null;
    }
    
    console.log(`👤 Personaje: ${nombre} (${jugador})`);
    console.log(`📊 FUE=${str}, DES=${dex}, INT=${int}, CHA=${cha}`);
    console.log(`💓 Vida: ${puntosVida.restantes} / ${puntosVida.total}`);
    console.log(`🎯 Habilidades: ${habilidades.length}`);
    
    const datos = {
        nombre: nombre,
        jugador: jugador,
        campaign: campaign,
        str: str,
        dex: dex,
        int: int,
        cha: cha,
        origen: origen,
        afiliacion: afiliacion,
        estudios: estudios,
        historia: historia,
        habilidades: habilidades,
        puntosVida: puntosVida,
        xpTotal: xpTotal,
        xpDisponible: xpDisponible
    };
    
    console.log('✅ ====== CAPTURA COMPLETA ======');
    
    return datos;
}



/**
 * Genera el HTML completo para el PDF (FORMATO CORRECTO DEL GENERADOR)
 */
function generarHTMLParaPDF(personaje) {
    // Generar HTML de habilidades
    let habilidadesHTML = '';
    if (personaje.habilidades && personaje.habilidades.length > 0) {
        personaje.habilidades.forEach((hab) => {
            const caract = 7; // Por defecto FUE
            const tirada = hab.tir || (7 - hab.nivel);
            habilidadesHTML += `
                <tr>
                    <td style="padding: 8px; border: 1px solid black; text-align: center;">
                        <div style="display: flex; gap: 4px; justify-content: center;">
                            <div style="width: 14px; height: 14px; border: 2px solid black;"></div>
                            <div style="width: 14px; height: 14px; border: 2px solid black;"></div>
                        </div>
                    </td>
                    <td style="padding: 8px; border: 1px solid black; font-weight: bold;">${hab.nombre}</td>
                    <td style="padding: 8px; border: 1px solid black; text-align: center; font-weight: bold;">${hab.nivel}</td>
                    <td style="padding: 8px; border: 1px solid black; text-align: center;">${caract}</td>
                    <td style="padding: 8px; border: 1px solid black; text-align: center; font-weight: bold;">${tirada}</td>
                </tr>
            `;
        });
    } else {
        habilidadesHTML = '<tr><td colspan="5" style="padding: 20px; text-align: center; color: #999;">Sin habilidades</td></tr>';
    }
    
    // Generar filas de armas personales
    const armasHTML = Array(6).fill(0).map(() => 
        '<tr><td style="padding: 6px; border: 1px solid black;">-- Arma --</td><td style="padding: 6px; border: 1px solid black;"></td><td style="padding: 6px; border: 1px solid black;"></td></tr>'
    ).join('');
    
    return `
        <div style="font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; background: white;">
            <div style="text-align: center; border: 3px solid black; padding: 15px; margin-bottom: 20px; background: #f5f5f5;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 1px;">REGISTRO DE LA CABALLERÍA LIGERA DE ERIDANI</h1>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                    <div style="border: 2px solid black; padding: 15px; margin-bottom: 10px;">
                        <div style="margin-bottom: 10px;">
                            <div style="font-size: 11px; font-weight: bold; margin-bottom: 3px;">NOMBRE DEL PERSONAJE:</div>
                            <div style="font-size: 16px; font-weight: bold;">${personaje.nombre}</div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div>
                                <div style="font-size: 10px; font-weight: bold; margin-bottom: 3px;">JUGADOR:</div>
                                <div style="font-size: 13px;">${personaje.jugador}</div>
                            </div>
                            <div>
                                <div style="font-size: 10px; font-weight: bold; margin-bottom: 3px;">LUGAR DE NACIMIENTO:</div>
                                <div style="font-size: 13px;">${personaje.origen}</div>
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <div>
                                <div style="font-size: 10px; font-weight: bold; margin-bottom: 3px;">FORMACIÓN:</div>
                                <div style="font-size: 13px;">${personaje.estudios}</div>
                            </div>
                            <div>
                                <div style="font-size: 10px; font-weight: bold; margin-bottom: 3px;">AFILIACIÓN:</div>
                                <div style="font-size: 13px;">${personaje.afiliacion}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="border: 2px solid black; padding: 10px;">
                        <h3 style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; text-align: center; border-bottom: 1px solid black; padding-bottom: 5px;">ATRIBUTOS</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <div style="border: 2px solid black; padding: 8px; text-align: center;">
                                <div style="display: flex; gap: 3px; justify-content: center; margin-bottom: 5px;">
                                    <div style="width: 12px; height: 12px; border: 2px solid black;"></div>
                                    <div style="width: 12px; height: 12px; border: 2px solid black;"></div>
                                </div>
                                <div style="font-size: 11px; font-weight: bold; margin-bottom: 5px;">Fuerza (FUE)</div>
                                <div style="font-size: 24px; font-weight: bold;">${personaje.str}</div>
                            </div>
                            <div style="border: 2px solid black; padding: 8px; text-align: center;">
                                <div style="display: flex; gap: 3px; justify-content: center; margin-bottom: 5px;">
                                    <div style="width: 12px; height: 12px; border: 2px solid black;"></div>
                                    <div style="width: 12px; height: 12px; border: 2px solid black;"></div>
                                </div>
                                <div style="font-size: 11px; font-weight: bold; margin-bottom: 5px;">Destreza (DES)</div>
                                <div style="font-size: 24px; font-weight: bold;">${personaje.dex}</div>
                            </div>
                            <div style="border: 2px solid black; padding: 8px; text-align: center;">
                                <div style="display: flex; gap: 3px; justify-content: center; margin-bottom: 5px;">
                                    <div style="width: 12px; height: 12px; border: 2px solid black;"></div>
                                    <div style="width: 12px; height: 12px; border: 2px solid black;"></div>
                                </div>
                                <div style="font-size: 11px; font-weight: bold; margin-bottom: 5px;">Inteligencia (INT)</div>
                                <div style="font-size: 24px; font-weight: bold;">${personaje.int}</div>
                            </div>
                            <div style="border: 2px solid black; padding: 8px; text-align: center;">
                                <div style="display: flex; gap: 3px; justify-content: center; margin-bottom: 5px;">
                                    <div style="width: 12px; height: 12px; border: 2px solid black;"></div>
                                    <div style="width: 12px; height: 12px; border: 2px solid black;"></div>
                                </div>
                                <div style="font-size: 11px; font-weight: bold; margin-bottom: 5px;">Carisma (CAR)</div>
                                <div style="font-size: 24px; font-weight: bold;">${personaje.cha}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style="border: 2px solid black; padding: 10px;">
                    ${generarSiluetaConVida(personaje)}
                    <div style="text-align: center; margin-top: 10px; font-size: 14px; font-weight: bold;">
                        Vida Restante: ${personaje.puntosVida.restantes} / ${personaje.puntosVida.total}
                    </div>
                </div>
            </div>
            
            <div style="border: 2px solid black; padding: 10px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; text-align: center; border-bottom: 1px solid black; padding-bottom: 5px;">HABILIDADES</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                    <thead>
                        <tr style="background: #e0e0e0;">
                            <th style="padding: 6px; border: 1px solid black; width: 50px;">↑</th>
                            <th style="padding: 6px; border: 1px solid black; text-align: left;">HABILIDAD</th>
                            <th style="padding: 6px; border: 1px solid black; width: 60px;">NIVEL</th>
                            <th style="padding: 6px; border: 1px solid black; width: 80px;">CARACT.</th>
                            <th style="padding: 6px; border: 1px solid black; width: 70px;">TIRADA</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${habilidadesHTML}
                    </tbody>
                </table>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div style="border: 2px solid black; padding: 10px;">
                    <h3 style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold; text-align: center; border-bottom: 1px solid black; padding-bottom: 5px;">FINANZAS Y EQUIPO</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 10px;">
                        <div>
                            <div style="font-weight: bold;">C-BILLS:</div>
                            <div style="border: 1px solid black; padding: 4px; min-height: 20px;"></div>
                        </div>
                        <div>
                            <div style="font-weight: bold;">SALARIO/INGRESOS:</div>
                            <div style="border: 1px solid black; padding: 4px; min-height: 20px;"></div>
                        </div>
                        <div>
                            <div style="font-weight: bold;">PX TOTALES:</div>
                            <div style="border: 1px solid black; padding: 4px; text-align: center;">${personaje.xpTotal}</div>
                        </div>
                        <div>
                            <div style="font-weight: bold;">PX DISP.:</div>
                            <div style="border: 1px solid black; padding: 4px; text-align: center;">${personaje.xpDisponible}</div>
                        </div>
                    </div>
                </div>
                
                <div style="border: 2px solid black; padding: 10px;">
                    <h3 style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold; text-align: center; border-bottom: 1px solid black; padding-bottom: 5px;">ARMAS PERSONALES</h3>
                    <table style="width: 100%; border-collapse: collapse; font-size: 9px;">
                        <thead>
                            <tr style="background: #e0e0e0;">
                                <th style="padding: 3px; border: 1px solid black;">ARMA</th>
                                <th style="padding: 3px; border: 1px solid black; width: 40px;">DAÑO</th>
                                <th style="padding: 3px; border: 1px solid black;">ALCANCE</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${armasHTML}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div style="border: 2px solid black; padding: 10px;">
                <h3 style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold; text-align: center; border-bottom: 1px solid black; padding-bottom: 5px;">TRASFONDO Y NOTAS</h3>
                <div style="min-height: 80px; font-size: 11px; line-height: 1.4;">
                    ${personaje.historia || ''}
                </div>
            </div>
        </div>
    `;
}

/**
 * Genera la silueta con los cuadrados de vida posicionados
 * FÓRMULA CORRECTA:
 * - CABEZA: FUE
 * - TORSO: FUE × 3
 * - BRAZOS: FUE × 2 (cada uno, redondear hacia ABAJO si no es exacto)
 * - PIERNAS: FUE × 2 (cada una, redondear hacia ARRIBA si no es exacto)
 */
function generarSiluetaConVida(personaje) {
    const str = personaje.str;
    
    // Distribución según fórmula correcta
    const distribucion = {
        cabeza: str,
        torso: str * 3,
        brazoIzq: Math.floor(str * 2),
        brazoDer: Math.floor(str * 2),
        piernaIzq: Math.ceil(str * 2),
        piernaDer: Math.ceil(str * 2)
    };
    
    const totalCuadrados = distribucion.cabeza + distribucion.torso + 
                          distribucion.brazoIzq + distribucion.brazoDer + 
                          distribucion.piernaIzq + distribucion.piernaDer;
    
    console.log(`📊 Distribución de vida (FUE=${str}):`);
    console.log(`   CABEZA: ${distribucion.cabeza}`);
    console.log(`   TORSO: ${distribucion.torso}`);
    console.log(`   B.IZQ: ${distribucion.brazoIzq}`);
    console.log(`   B.DER: ${distribucion.brazoDer}`);
    console.log(`   P.IZQ: ${distribucion.piernaIzq}`);
    console.log(`   P.DER: ${distribucion.piernaDer}`);
    console.log(`   TOTAL: ${totalCuadrados}`);
    
    return `
        <div style="position: relative; width: 250px; height: 500px; margin: 0 auto;">
            <!-- Silueta SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 400" width="250" height="500" style="position: absolute; top: 0; left: 0;">
                <!-- CABEZA -->
                <ellipse cx="100" cy="30" rx="22" ry="28" fill="none" stroke="black" stroke-width="3"/>
                
                <!-- TORSO -->
                <rect x="68" y="55" width="64" height="125" rx="5" fill="none" stroke="black" stroke-width="3"/>
                
                <!-- BRAZO IZQUIERDO -->
                <path d="M 68 70 L 35 80 L 35 145 L 45 150 L 45 115 L 58 110 L 68 125" fill="none" stroke="black" stroke-width="3"/>
                
                <!-- BRAZO DERECHO -->
                <path d="M 132 70 L 165 80 L 165 145 L 155 150 L 155 115 L 142 110 L 132 125" fill="none" stroke="black" stroke-width="3"/>
                
                <!-- PIERNA IZQUIERDA -->
                <path d="M 78 180 L 73 275 L 68 330 L 73 360 L 85 360 L 92 330 L 97 275 L 90 180" fill="none" stroke="black" stroke-width="3"/>
                
                <!-- PIERNA DERECHA -->
                <path d="M 122 180 L 127 275 L 132 330 L 127 360 L 115 360 L 108 330 L 103 275 L 110 180" fill="none" stroke="black" stroke-width="3"/>
                
                <!-- Etiquetas de sección -->
                <text x="100" y="20" text-anchor="middle" font-size="12" font-family="monospace" fill="black" font-weight="bold">CABEZA</text>
                <text x="100" y="120" text-anchor="middle" font-size="12" font-family="monospace" fill="black" font-weight="bold">TORSO</text>
                <text x="30" y="115" text-anchor="middle" font-size="10" font-family="monospace" fill="black" font-weight="bold">B.IZQ</text>
                <text x="170" y="115" text-anchor="middle" font-size="10" font-family="monospace" fill="black" font-weight="bold">B.DER</text>
                <text x="73" y="380" text-anchor="middle" font-size="10" font-family="monospace" fill="black" font-weight="bold">P.IZQ</text>
                <text x="127" y="380" text-anchor="middle" font-size="10" font-family="monospace" fill="black" font-weight="bold">P.DER</text>
            </svg>
            
            <!-- Cuadrados de vida -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 400" width="250" height="500" style="position: absolute; top: 0; left: 0;">
                ${generarCuadradosSeccionSVG('cabeza', distribucion.cabeza, 100, 30, personaje.puntosVida, 0)}
                ${generarCuadradosSeccionSVG('torso', distribucion.torso, 100, 117, personaje.puntosVida, distribucion.cabeza)}
                ${generarCuadradosSeccionSVG('brazoIzq', distribucion.brazoIzq, 50, 110, personaje.puntosVida, distribucion.cabeza + distribucion.torso)}
                ${generarCuadradosSeccionSVG('brazoDer', distribucion.brazoDer, 150, 110, personaje.puntosVida, distribucion.cabeza + distribucion.torso + distribucion.brazoIzq)}
                ${generarCuadradosSeccionSVG('piernaIzq', distribucion.piernaIzq, 83, 270, personaje.puntosVida, distribucion.cabeza + distribucion.torso + distribucion.brazoIzq + distribucion.brazoDer)}
                ${generarCuadradosSeccionSVG('piernaDer', distribucion.piernaDer, 117, 270, personaje.puntosVida, distribucion.cabeza + distribucion.torso + distribucion.brazoIzq + distribucion.brazoDer + distribucion.piernaIzq)}
            </svg>
        </div>
    `;
}

/**
 * Genera cuadrados de vida en formato SVG para una sección
 * MEJORADO: Muestra cuadrados heridos en rojo
 * 
 * @param {string} seccion - Nombre de la sección
 * @param {number} cantidad - Cantidad de cuadrados en esta sección
 * @param {number} centerX - Posición X central
 * @param {number} centerY - Posición Y central  
 * @param {object} puntosVida - Objeto con total, usados, restantes
 * @param {number} offset - Offset para calcular qué cuadrados están heridos
 */
function generarCuadradosSeccionSVG(seccion, cantidad, centerX, centerY, puntosVida = null, offset = 0) {
    const cuadrados = [];
    const size = 8; // Reducido de 10 a 8 para acomodar más cuadrados
    const spacing = 1.5; // Reducido de 2 a 1.5
    
    // Calcular filas y columnas para mejor distribución
    let cols, rows;
    if (cantidad <= 3) {
        cols = cantidad;
        rows = 1;
    } else if (cantidad <= 6) {
        cols = 3;
        rows = 2;
    } else if (cantidad <= 9) {
        cols = 3;
        rows = 3;
    } else if (cantidad <= 16) {
        cols = 4;
        rows = Math.ceil(cantidad / 4);
    } else {
        // Para cantidades grandes (torso, brazos, piernas)
        cols = 5;
        rows = Math.ceil(cantidad / 5);
    }
    
    const totalWidth = cols * (size + spacing) - spacing;
    const totalHeight = rows * (size + spacing) - spacing;
    const startX = centerX - totalWidth / 2;
    const startY = centerY - totalHeight / 2;
    
    for (let i = 0; i < cantidad; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const x = startX + col * (size + spacing);
        const y = startY + row * (size + spacing);
        
        // Determinar si este cuadrado está herido
        let fill = "white";
        let strokeColor = "black";
        
        if (puntosVida && puntosVida.usados > 0) {
            // Los cuadrados se marcan de izquierda a derecha, arriba a abajo
            // offset indica cuántos cuadrados previos hay
            const globalIndex = offset + i;
            if (globalIndex < puntosVida.usados) {
                fill = "#ff0000"; // Rojo para herido
                strokeColor = "#990000";
            }
        }
        
        cuadrados.push(`<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${fill}" stroke="${strokeColor}" stroke-width="1.5"/>`);
    }
    
    return cuadrados.join('');
}

/**
 * Genera la lista de habilidades
 */
function generarListaHabilidades(habilidades) {
    if (habilidades.length === 0) {
        return '<p style="text-align: center; color: #666; grid-column: 1 / -1;">Sin habilidades</p>';
    }
    
    return habilidades.map(hab => `
        <div style="padding: 10px; border: 2px solid black; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 14px;">${hab.nombre}</span>
            <span style="font-size: 16px; font-weight: bold;">${hab.nivel}</span>
        </div>
    `).join('');
}

console.log('✅ Generador de PDF integrado correctamente');


// ============================================
// HISTORIAL, LOGROS & CRÓNICAS - JAVASCRIPT
// ============================================

// La API Key de Gemini ahora está en Google Apps Script (segura)

// ============================================
// NAVEGACIÓN - CRÓNICAS (SECCIÓN SEPARADA)
// ============================================

/**
 * Navega a la sección de Crónicas
 */
function goToCronicas() {
    // Ocultar todas las secciones
    const sections = ['pre-generacion', 'ficha-container', 'barracones', 'points-counter', 
                      'registro-combate', 'trr-section', 'landing-page', 'battle-tracker',
                      'mech-hangar', 'vehicle-depot', 'galactic-map', 'historial-logros-section'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    
    // Mostrar sección
    document.getElementById('cronicas-section').style.display = 'block';
    
    // Cargar crónicas (vista por defecto es leer)
    cargarCronicas();
    
    console.log('📜 Abierta sección Crónicas');
}

/**
 * Vuelve al menú principal desde Crónicas
 */
function goHomeFromCronicas() {
    document.getElementById('cronicas-section').style.display = 'none';
    document.getElementById('landing-page').style.display = 'flex';
}

/**
 * Cambia entre pestañas de Crónicas
 */
function switchCronicaTab(tab) {
    // Ocultar todos los paneles
    document.getElementById('panel-cronica-leer').style.display = 'none';
    document.getElementById('panel-cronica-crear').style.display = 'none';
    
    // Resetear estilos de pestañas
    ['tab-cronica-leer', 'tab-cronica-crear'].forEach(id => {
        const btn = document.getElementById(id);
        btn.style.background = 'rgba(26, 26, 26, 0.8)';
        btn.style.color = '#888';
        btn.style.borderBottom = '3px solid transparent';
    });
    
    // Activar pestaña seleccionada
    const activeTab = document.getElementById('tab-cronica-' + tab);
    activeTab.style.background = 'linear-gradient(135deg, #ffae00 0%, #ff8c42 100%)';
    activeTab.style.color = '#000';
    activeTab.style.borderBottom = '3px solid #ffae00';
    
    // Mostrar panel correspondiente
    document.getElementById('panel-cronica-' + tab).style.display = 'block';
    
    // Cargar datos si es necesario
    if (tab === 'leer') cargarCronicas();
}

// ============================================
// CONFIGURACIÓN - PANELES OCULTOS
// ============================================

// Variable global para almacenar la configuración cargada
let configCargada = {};

/**
 * Toggle del panel de configuración de Crónicas (clic en 📜)
 * Usa el modal visual de contraseña
 */
function toggleConfigCronicas() {
    const panel = document.getElementById('config-cronicas-panel');
    
    if (panel.style.display === 'none' || panel.style.display === '') {
        // Usar el modal visual de contraseña (definido en landing-page)
        if (typeof mostrarConfigPasswordModal === 'function') {
            mostrarConfigPasswordModal('cronicas', '📜 CONFIGURACIÓN DE CRÓNICAS 📜');
        } else {
            // Fallback si la función no está disponible
            console.error('Modal de contraseña no disponible');
        }
    } else {
        panel.style.display = 'none';
    }
}

/**
 * Abre el panel de crónicas después de autenticar
 * (Llamada desde el modal de contraseña)
 */
function abrirPanelCronicas() {
    const panel = document.getElementById('config-cronicas-panel');
    panel.style.display = 'block';
    cargarConfiguracion(); // Cargar datos al abrir
}

/**
 * Toggle modo manual de escritura
 */
function toggleManualMode(isManual) {
    const textarea = document.getElementById('cronica-input');
    const btn = document.getElementById('btn-generar-cronica');
    const label = textarea.previousElementSibling;
    
    if (isManual) {
        // Modo manual: el textarea es para escribir la crónica directamente
        textarea.placeholder = 'Escribe aquí tu crónica completa...';
        textarea.style.height = '300px';
        label.innerHTML = 'Escribe tu crónica:';
        btn.innerHTML = '💾 GUARDAR CRÓNICA';
        btn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
        btn.style.borderColor = '#22c55e';
    } else {
        // Modo IA: el textarea es para el resumen
        textarea.placeholder = 'Ej: Emboscada en pantano. 2 Locusts y 1 Hunchback. Joan perdió un brazo. Jaime dio el tiro final.';
        textarea.style.height = '150px';
        label.innerHTML = 'Resumen de la sesión:';
        btn.innerHTML = '🪶 GENERAR CRÓNICA';
        btn.style.background = 'linear-gradient(135deg, #ffae00 0%, #ff8c42 100%)';
        btn.style.borderColor = '#00ff41';
    }
}

/**
 * Carga la configuración desde Google Sheets
 */
async function cargarConfiguracion() {
    try {
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getConfiguracion`);
        const data = await response.json();
        
        if (data.result === 'success' && data.config) {
            configCargada = data.config;
            
            // Rellenar campos del formulario
            document.getElementById('config-compania-nombre').value = data.config['COMPANIA_NOMBRE'] || '';
            document.getElementById('config-año-campana').value = data.config['AÑO_CAMPANA'] || '';
            document.getElementById('config-sistema-actual').value = data.config['SISTEMA_ACTUAL'] || '';
            document.getElementById('config-faccion-actual').value = data.config['FACCION_ACTUAL'] || '';
            document.getElementById('config-prompt-instrucciones').value = data.config['PROMPT_INSTRUCCIONES'] || '';
            
            // Pilotos
            for (let i = 1; i <= 4; i++) {
                document.getElementById(`config-piloto${i}-nombre`).value = data.config[`PILOTO_${i}_NOMBRE`] || '';
                document.getElementById(`config-piloto${i}-rango`).value = data.config[`PILOTO_${i}_RANGO`] || '';
                document.getElementById(`config-piloto${i}-mech`).value = data.config[`PILOTO_${i}_MECH`] || '';
            }
            
            console.log('⚙️ Configuración cargada desde Sheets');
        }
    } catch (error) {
        console.error('Error cargando configuración:', error);
    }
}

/**
 * Guarda la configuración de crónicas en Google Sheets
 */
async function guardarConfiguracionCronicas() {
    const config = {
        'COMPANIA_NOMBRE': document.getElementById('config-compania-nombre').value,
        'AÑO_CAMPANA': document.getElementById('config-año-campana').value,
        'SISTEMA_ACTUAL': document.getElementById('config-sistema-actual').value,
        'FACCION_ACTUAL': document.getElementById('config-faccion-actual').value,
        'PROMPT_INSTRUCCIONES': document.getElementById('config-prompt-instrucciones').value,
        'PILOTO_1_NOMBRE': document.getElementById('config-piloto1-nombre').value,
        'PILOTO_1_RANGO': document.getElementById('config-piloto1-rango').value,
        'PILOTO_1_MECH': document.getElementById('config-piloto1-mech').value,
        'PILOTO_2_NOMBRE': document.getElementById('config-piloto2-nombre').value,
        'PILOTO_2_RANGO': document.getElementById('config-piloto2-rango').value,
        'PILOTO_2_MECH': document.getElementById('config-piloto2-mech').value,
        'PILOTO_3_NOMBRE': document.getElementById('config-piloto3-nombre').value,
        'PILOTO_3_RANGO': document.getElementById('config-piloto3-rango').value,
        'PILOTO_3_MECH': document.getElementById('config-piloto3-mech').value,
        'PILOTO_4_NOMBRE': document.getElementById('config-piloto4-nombre').value,
        'PILOTO_4_RANGO': document.getElementById('config-piloto4-rango').value,
        'PILOTO_4_MECH': document.getElementById('config-piloto4-mech').value
    };
    
    try {
        const params = new URLSearchParams({
            action: 'saveConfiguracionBatch',
            config: JSON.stringify(config)
        });
        
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`);
        const data = await response.json();
        
        if (data.result === 'success') {
            alert('✅ Configuración guardada en Google Sheets');
            configCargada = {...configCargada, ...config};
            
            // Sincronizar año en portada y panel Database
            const year = config['AÑO_CAMPANA'];
            if (year) {
                localStorage.setItem('CAMPAIGN_YEAR', year);
                const displayEl = document.getElementById('current-campaign-year');
                if (displayEl) displayEl.textContent = year;
                const configInput = document.getElementById('config-campaign-year');
                if (configInput) configInput.value = year;
            }
        } else {
            throw new Error(data.msg || 'Error desconocido');
        }
    } catch (error) {
        console.error('Error guardando configuración:', error);
        alert('❌ Error al guardar: ' + error.message);
    }
}

// ============================================
// NAVEGACIÓN - HISTORIAL & LOGROS
// ============================================

/**
 * Navega a la sección de Historial y Logros
 */
function goToHistorialLogros() {
    // Ocultar todas las secciones
    const sections = ['pre-generacion', 'ficha-container', 'barracones', 'points-counter', 
                      'registro-combate', 'trr-section', 'landing-page', 'battle-tracker',
                      'mech-hangar', 'vehicle-depot', 'galactic-map', 'cronicas-section'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    
    // Mostrar sección
    document.getElementById('historial-logros-section').style.display = 'block';
    
    // Cargar datos
    cargarHistorialCombates();
    
    console.log('📊 Abierta sección Historial & Logros');
}

/**
 * Vuelve al menú principal
 */
function goHomeFromHistorial() {
    document.getElementById('historial-logros-section').style.display = 'none';
    document.getElementById('landing-page').style.display = 'flex';
}

/**
 * Cambia entre pestañas de Historial/Logros
 */
function switchHistorialTab(tab) {
    // Ocultar todos los paneles
    document.getElementById('panel-historial').style.display = 'none';
    document.getElementById('panel-logros').style.display = 'none';
    
    // Resetear estilos de pestañas
    ['tab-historial', 'tab-logros'].forEach(id => {
        const btn = document.getElementById(id);
        btn.style.background = 'rgba(26, 26, 26, 0.8)';
        btn.style.color = '#888';
        btn.style.borderBottom = '3px solid transparent';
    });
    
    // Activar pestaña seleccionada
    const activeTab = document.getElementById('tab-' + tab);
    activeTab.style.background = 'linear-gradient(135deg, #ffae00 0%, #ff8c42 100%)';
    activeTab.style.color = '#000';
    activeTab.style.borderBottom = '3px solid #ffae00';
    
    // Mostrar panel correspondiente
    document.getElementById('panel-' + tab).style.display = 'block';
    
    // Cargar datos según la pestaña
    if (tab === 'historial') cargarHistorialCombates();
    if (tab === 'logros') cargarLogros();
}

// ============================================
// HISTORIAL DE COMBATES
// ============================================

async function cargarHistorialCombates() {
    const tbody = document.getElementById('historial-tbody');
    tbody.innerHTML = '<tr><td colspan="8" style="padding: 30px; text-align: center; color: #ffae00;">⏳ Cargando...</td></tr>';
    
    try {
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getHistorial`);
        const data = await response.json();
        
        if (data.result === 'success' && data.historial && data.historial.length > 0) {
            renderHistorial(data.historial);
        } else {
            tbody.innerHTML = '<tr><td colspan="8" style="padding: 30px; text-align: center; color: #666; font-style: italic;">No hay combates registrados. Crea la hoja "Historial_Combates" en tu Google Sheets.</td></tr>';
            resetStats();
        }
    } catch (error) {
        console.error('Error cargando historial:', error);
        tbody.innerHTML = '<tr><td colspan="8" style="padding: 30px; text-align: center; color: #f44336;">❌ Error al cargar historial: ' + error.message + '</td></tr>';
        resetStats();
    }
}

function renderHistorial(historial) {
    const tbody = document.getElementById('historial-tbody');
    let html = '';
    let totalXP = 0;
    let totalEnemigos = 0;
    
    historial.forEach((combate, index) => {
        const rowBg = index % 2 === 0 ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.4)';
        totalXP += parseInt(combate.xpTotal) || 0;
        
        // Contar enemigos (aproximado basado en comas)
        const enemigosStr = combate.enemigos || '';
        totalEnemigos += (enemigosStr.match(/,/g) || []).length + 1;
        
        html += `
            <tr style="background: ${rowBg}; border-bottom: 1px solid #333;">
                <td style="padding: 10px 8px; color: #888;">${formatearFecha(combate.fecha)}</td>
                <td style="padding: 10px 8px; color: #e0e0e0;">${combate.enemigos || '-'}</td>
                <td style="padding: 10px 8px; text-align: center; color: #00ff41; font-weight: bold;">${combate.xpTotal || 0}</td>
                <td style="padding: 10px 8px; text-align: center; color: #4a9eff;">${combate.marcos || 0}</td>
                <td style="padding: 10px 8px; text-align: center; color: #4a9eff;">${combate.jaime || 0}</td>
                <td style="padding: 10px 8px; text-align: center; color: #4a9eff;">${combate.joan || 0}</td>
                <td style="padding: 10px 8px; text-align: center; color: #4a9eff;">${combate.juan || 0}</td>
                <td style="padding: 10px 8px; color: #888; font-size: 11px;">${combate.notas || ''}</td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
    
    // Actualizar estadísticas
    document.getElementById('stat-total-combates').textContent = historial.length;
    document.getElementById('stat-total-xp').textContent = totalXP.toLocaleString();
    document.getElementById('stat-enemigos').textContent = totalEnemigos;
    document.getElementById('stat-promedio-xp').textContent = Math.round(totalXP / historial.length);
}

function resetStats() {
    document.getElementById('stat-total-combates').textContent = '0';
    document.getElementById('stat-total-xp').textContent = '0';
    document.getElementById('stat-enemigos').textContent = '0';
    document.getElementById('stat-promedio-xp').textContent = '0';
}

function formatearFecha(fecha) {
    if (!fecha) return '-';
    try {
        const d = new Date(fecha);
        return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
        return fecha;
    }
}

// ============================================
// LOGROS / MEDALLAS
// ============================================

const JUGADORES_COLORES = {
    'Marcos': '#ffae00',
    'Jaime': '#4a9eff',
    'Joan': '#00ff41',
    'Juan': '#f44336'
};

async function cargarLogros() {
    const container = document.getElementById('logros-container');
    container.innerHTML = '<div style="grid-column: span 2; padding: 30px; text-align: center; color: #ffae00;">⏳ Cargando logros...</div>';
    
    try {
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getLogros`);
        const data = await response.json();
        
        if (data.result === 'success' && data.logros && data.logros.length > 0) {
            renderLogros(data.logros);
        } else {
            container.innerHTML = '<div style="grid-column: span 2; padding: 30px; text-align: center; color: #666; font-style: italic;">No hay logros definidos. Crea la hoja "Logros" en tu Google Sheets.</div>';
        }
    } catch (error) {
        console.error('Error cargando logros:', error);
        container.innerHTML = '<div style="grid-column: span 2; padding: 30px; text-align: center; color: #f44336;">❌ Error al cargar logros: ' + error.message + '</div>';
    }
}

function renderLogros(logros) {
    const container = document.getElementById('logros-container');
    const jugadores = ['Marcos', 'Jaime', 'Joan', 'Juan'];
    
    let html = '';
    
    jugadores.forEach(jugador => {
        const color = JUGADORES_COLORES[jugador];
        const logrosJugador = logros.filter(l => l[jugador.toLowerCase()]);
        const totalLogros = logros.length;
        const conseguidos = logrosJugador.length;
        
        html += `
            <div style="background: linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(26,26,26,0.8) 100%); border: 2px solid ${color}; padding: 20px; clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid ${color}; padding-bottom: 10px;">
                    <h3 style="color: ${color}; font-family: 'Share Tech Mono', monospace; margin: 0; font-size: 18px; text-transform: uppercase;">
                        ${jugador}
                    </h3>
                    <span style="color: #888; font-size: 12px; font-family: 'Share Tech Mono', monospace;">
                        ${conseguidos}/${totalLogros} 🎖️
                    </span>
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        `;
        
        logros.forEach(logro => {
            const conseguido = logro[jugador.toLowerCase()];
            const opacity = conseguido ? '1' : '0.3';
            const borderColor = conseguido ? color : '#333';
            const fecha = conseguido ? `<br><span style="font-size: 9px; color: #888;">${formatearFecha(conseguido)}</span>` : '';
            
            html += `
                <div style="background: rgba(0,0,0,0.5); border: 1px solid ${borderColor}; padding: 8px 12px; text-align: center; opacity: ${opacity}; min-width: 80px;" title="${logro.descripcion || logro.logro}">
                    <div style="font-size: 20px;">${logro.icono || '🎖️'}</div>
                    <div style="font-size: 9px; color: #ccc; margin-top: 4px; font-family: 'Share Tech Mono', monospace;">${logro.logro}</div>
                    ${fecha}
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ============================================
// CRÓNICAS CON GEMINI (via Apps Script proxy)
// ============================================

async function generarCronica() {
    const input = document.getElementById('cronica-input').value.trim();
    // Obtener estilo de los radio buttons
    const estiloRadio = document.querySelector('input[name="estilo-cronica"]:checked');
    const estilo = estiloRadio ? estiloRadio.value : 'epico';
    const btn = document.getElementById('btn-generar-cronica');
    const outputContainer = document.getElementById('cronica-output-container');
    const output = document.getElementById('cronica-output');
    
    if (!input) {
        alert(estilo === 'manual' ? 'Escribe tu crónica primero.' : 'Escribe un resumen de la sesión primero.');
        return;
    }
    
    // MODO MANUAL: Guardar directamente sin generar con IA
    if (estilo === 'manual') {
        btn.disabled = true;
        btn.innerHTML = '⏳ GUARDANDO...';
        
        try {
            const params = new URLSearchParams({
                action: 'saveCronica',
                fecha: new Date().toISOString(),
                resumen: 'Crónica manual',
                estilo: 'manual',
                texto: input
            });
            
            const response = await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`);
            const data = await response.json();
            
            if (data.result === 'success') {
                alert('✅ Crónica guardada en Google Sheets');
                // Limpiar el formulario
                document.getElementById('cronica-input').value = '';
                // Cambiar a la pestaña de leer
                switchCronicaTab('leer');
            } else {
                throw new Error(data.msg || 'Error desconocido');
            }
        } catch (error) {
            console.error('Error guardando crónica manual:', error);
            alert('❌ Error al guardar: ' + error.message);
        } finally {
            btn.disabled = false;
            btn.innerHTML = '💾 GUARDAR CRÓNICA';
        }
        return;
    }
    
    // MODO IA: Generar con Gemini
    btn.disabled = true;
    btn.innerHTML = '⏳ GENERANDO...';
    output.innerHTML = '<div style="text-align: center; color: #ffae00;">Invocando a los escribas de la Esfera Interior...</div>';
    outputContainer.style.display = 'block';

    try {
        // Llamar a Apps Script que hace de proxy seguro a Gemini
        const params = new URLSearchParams({
            action: 'generarCronica',
            resumen: input,
            estilo: estilo
        });
        
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`);
        const data = await response.json();
        
        if (data.result === 'success' && data.cronica) {
            output.innerHTML = data.cronica;
            console.log('📜 Crónica generada exitosamente');
            // Auto-scroll para mostrar el resultado
            outputContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
        } else {
            throw new Error(data.msg || 'Error al generar crónica');
        }
        
    } catch (error) {
        console.error('Error generando crónica:', error);
        output.innerHTML = `<div style="color: #f44336;">❌ Error: ${error.message}</div>`;
    } finally {
        btn.disabled = false;
        btn.innerHTML = '🪶 GENERAR CRÓNICA';
    }
}

function copiarCronica() {
    const cronica = document.getElementById('cronica-output').innerText;
    navigator.clipboard.writeText(cronica).then(() => {
        alert('✅ Crónica copiada al portapapeles');
    }).catch(err => {
        console.error('Error copiando:', err);
    });
}

async function guardarCronicaEnSheets() {
    const cronica = document.getElementById('cronica-output').innerText;
    const resumen = document.getElementById('cronica-input').value.trim();
    // Obtener estilo de los radio buttons
    const estiloRadio = document.querySelector('input[name="estilo-cronica"]:checked');
    const estilo = estiloRadio ? estiloRadio.value : 'epico';
    
    if (!cronica || cronica.includes('Error') || cronica.includes('Invocando')) {
        alert('No hay crónica válida para guardar.');
        return;
    }
    
    try {
        // Usar GET en lugar de POST para evitar CORS
        const params = new URLSearchParams({
            action: 'saveCronica',
            fecha: new Date().toISOString(),
            resumen: resumen,
            estilo: estilo,
            texto: cronica
        });
        
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`);
        const data = await response.json();
        
        if (data.result === 'success') {
            alert('✅ Crónica guardada en Google Sheets');
            // Limpiar el formulario
            document.getElementById('cronica-input').value = '';
            document.getElementById('cronica-output-container').style.display = 'none';
            // Cambiar a la pestaña de leer
            switchCronicaTab('leer');
        } else {
            throw new Error(data.msg || 'Error desconocido');
        }
    } catch (error) {
        console.error('Error guardando crónica:', error);
        alert('❌ Error al guardar: ' + error.message);
    }
}

async function cargarCronicas() {
    const container = document.getElementById('cronicas-lista');
    if (!container) return;
    
    container.innerHTML = '<p style="color: #ffae00; font-style: italic; text-align: center; padding: 40px;">⏳ Cargando crónicas...</p>';
    
    try {
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getCronicas`);
        const data = await response.json();
        
        if (data.result === 'success' && data.cronicas && data.cronicas.length > 0) {
            let html = '';
            
            // Iconos por estilo
            const iconosEstilo = {
                epico: '🎭',
                reportaje: '📰',
                diario: '📓',
                cinematico: '🎬',
                militar: '🎖️'
            };
            
            data.cronicas.forEach((cronica, index) => {
                const icono = iconosEstilo[cronica.estilo] || '📜';
                const estiloCapitalizado = cronica.estilo ? cronica.estilo.charAt(0).toUpperCase() + cronica.estilo.slice(1) : 'Épico';
                
                html += `
                    <div style="background: linear-gradient(135deg, rgba(255, 174, 0, 0.05) 0%, rgba(0,0,0,0.4) 100%); border: 2px solid #5c4200; padding: 0; overflow: hidden; ${index === 0 ? 'border-color: #ffae00;' : ''}">
                        <!-- Cabecera -->
                        <div style="background: rgba(255, 174, 0, 0.15); padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #5c4200;">
                            <div>
                                <span style="color: #00ff41; font-size: 11px; font-family: 'Share Tech Mono', monospace; text-transform: uppercase; letter-spacing: 1px;">
                                    ${formatearFecha(cronica.fecha)}
                                </span>
                                ${index === 0 ? '<span style="background: #ffae00; color: #000; padding: 2px 8px; font-size: 10px; margin-left: 10px; font-weight: bold;">MÁS RECIENTE</span>' : ''}
                            </div>
                            <span style="color: #ffae00; font-size: 12px; font-family: 'Share Tech Mono', monospace;">
                                ${icono} ${estiloCapitalizado}
                            </span>
                        </div>
                        
                        <!-- Texto de la crónica -->
                        <div style="padding: 20px;">
                            <p style="color: #e0e0e0; font-family: Georgia, 'Times New Roman', serif; font-size: 14px; line-height: 1.8; margin: 0; white-space: pre-wrap;">${cronica.texto}</p>
                        </div>
                        
                        <!-- Botón copiar -->
                        <div style="padding: 10px 20px; background: rgba(0,0,0,0.3); text-align: right;">
                            <button onclick="navigator.clipboard.writeText(\`${cronica.texto.replace(/`/g, '\\`').replace(/\\/g, '\\\\')}\`).then(() => alert('✅ Crónica copiada'))" style="background: rgba(255, 174, 0, 0.2); border: 1px solid #ffae00; color: #ffae00; font-family: 'Share Tech Mono', monospace; padding: 6px 12px; cursor: pointer; font-size: 11px;">
                                📋 COPIAR TEXTO
                            </button>
                        </div>
                    </div>
                `;
            });
            
            container.innerHTML = html;
        } else {
            container.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: #666;">
                    <div style="font-size: 48px; margin-bottom: 20px;">📜</div>
                    <p style="font-family: 'Share Tech Mono', monospace; font-size: 14px; margin-bottom: 10px;">No hay crónicas guardadas aún</p>
                    <p style="font-size: 12px;">Ve a la pestaña "Crear Crónica" para escribir tu primera historia.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error cargando crónicas:', error);
        container.innerHTML = '<p style="color: #f44336; text-align: center; padding: 40px;">❌ Error al cargar crónicas: ' + error.message + '</p>';
    }
}

console.log('📊 Sistema de Historial, Logros y Crónicas inicializado');


// ============================================
// BATTLE TRACKER - ESTADO GLOBAL
// ============================================

// Nombres de jugadores por defecto
const PLAYER_NAMES = {
    1: 'Marcos',
    2: 'Jaime', 
    3: 'Joan',
    4: 'Juan Palacios',
    5: 'Invitado'
};

let btState = {
    step: 'setup',
    numPlayers: 4,
    enemies: [],
    hits: {},
    deadEnemies: {},
    xpBonus: {} // bonus/malus manual por jugador (índice 0-based)
};

// ============================================
// FUNCIONES DE SETUP
// ============================================

function selectPlayers(num) {
    btState.numPlayers = num;
    
    // Actualizar botones
    document.querySelectorAll('.bt-player-btn').forEach(btn => {
        if (parseInt(btn.dataset.num) === num) {
            btn.style.background = '#b71c1c';
            btn.style.borderColor = '#ffae00';
            btn.style.color = '#000';
            btn.style.boxShadow = '0 0 20px rgba(255, 174, 0, 0.5)';
        } else {
            btn.style.background = 'rgba(26, 26, 26, 0.8)';
            btn.style.borderColor = '#5c4200';
            btn.style.color = '#888';
            btn.style.boxShadow = 'none';
        }
    });
    
    // Mostrar lista de jugadores
    renderPlayersList();
    
    console.log('👥 Jugadores seleccionados:', num);
}

function renderPlayersList() {
    const list = document.getElementById('bt-players-list');
    
    let html = '<div style="color: #ffae00; font-family: \'Share Tech Mono\', monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; border-bottom: 1px solid #5c4200; padding-bottom: 8px;">COMBATIENTES ACTIVOS:</div>';
    
    for (let i = 1; i <= btState.numPlayers; i++) {
        const name = PLAYER_NAMES[i];
        html += `
            <div style="background: rgba(0, 0, 0, 0.5); border-left: 3px solid #ffae00; padding: 8px 12px; font-family: 'Share Tech Mono', monospace; color: #00ff41; font-size: 14px; display: flex; align-items: center; gap: 10px;">
                <span style="color: #ffae00; font-weight: bold;">[P${i}]</span> ${name}
            </div>
        `;
    }
    
    list.innerHTML = html;
}

function addEnemy() {
    const nameInput = document.getElementById('bt-enemy-name');
    const xpInput = document.getElementById('bt-enemy-xp');
    
    const name = nameInput.value.trim();
    const xp = parseInt(xpInput.value);
    
    if (!name || !xp || xp <= 0) {
        alert('Ingresa un nombre y XP válidos');
        return;
    }
    
    const enemy = {
        id: Date.now().toString(),
        name: name,
        xp: xp
    };
    
    btState.enemies.push(enemy);
    btState.hits[enemy.id] = Array(btState.numPlayers).fill(0);
    btState.deadEnemies[enemy.id] = true;
    
    nameInput.value = '';
    xpInput.value = '';
    
    renderEnemiesList();
    updateStartButton();
    
    console.log('➕ Enemigo añadido:', enemy);
}

function removeEnemy(id) {
    btState.enemies = btState.enemies.filter(e => e.id !== id);
    delete btState.hits[id];
    delete btState.deadEnemies[id];
    
    renderEnemiesList();
    updateStartButton();
    
    console.log('➖ Enemigo eliminado:', id);
}

function renderEnemiesList() {
    const list = document.getElementById('bt-enemies-list');
    
    if (btState.enemies.length === 0) {
        list.innerHTML = '<p style="color: #5c4200; text-align: center; font-size: 14px; padding: 20px; font-style: italic; font-family: \'Share Tech Mono\', monospace;">ESPERANDO DATOS DE HOSTILES...</p>';
        return;
    }
    
    list.innerHTML = btState.enemies.map(enemy => {
        const color = enemy.color || '#ffae00';
        return `
        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0, 0, 0, 0.5); border-left: 3px solid ${color}; padding: 12px; border-bottom: 1px solid #5c4200; gap: 10px;">
            <div style="flex-grow: 1;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                    <input type="text" value="${enemy.name}" 
                        onchange="updateEnemyName('${enemy.id}', this.value)"
                        style="background: rgba(0,0,0,0.5); border: 1px solid ${color}; color: ${color}; padding: 6px 10px; font-family: 'Share Tech Mono', monospace; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; flex-grow: 1; min-width: 120px;">
                    <div style="display: flex; gap: 4px;">
                        <button onclick="setEnemyColor('${enemy.id}', '#ff4444')" title="Rojo" style="width: 22px; height: 22px; background: #ff4444; border: 2px solid ${color === '#ff4444' ? '#fff' : '#ff4444'}; cursor: pointer; ${color === '#ff4444' ? 'box-shadow: 0 0 8px #ff4444;' : ''}"></button>
                        <button onclick="setEnemyColor('${enemy.id}', '#44ff44')" title="Verde" style="width: 22px; height: 22px; background: #44ff44; border: 2px solid ${color === '#44ff44' ? '#fff' : '#44ff44'}; cursor: pointer; ${color === '#44ff44' ? 'box-shadow: 0 0 8px #44ff44;' : ''}"></button>
                        <button onclick="setEnemyColor('${enemy.id}', '#4488ff')" title="Azul" style="width: 22px; height: 22px; background: #4488ff; border: 2px solid ${color === '#4488ff' ? '#fff' : '#4488ff'}; cursor: pointer; ${color === '#4488ff' ? 'box-shadow: 0 0 8px #4488ff;' : ''}"></button>
                        <button onclick="setEnemyColor('${enemy.id}', '#ffae00')" title="Amarillo (default)" style="width: 22px; height: 22px; background: #ffae00; border: 2px solid ${color === '#ffae00' ? '#fff' : '#ffae00'}; cursor: pointer; ${color === '#ffae00' ? 'box-shadow: 0 0 8px #ffae00;' : ''}"></button>
                        <button onclick="setEnemyColor('${enemy.id}', '#ff44ff')" title="Magenta" style="width: 22px; height: 22px; background: #ff44ff; border: 2px solid ${color === '#ff44ff' ? '#fff' : '#ff44ff'}; cursor: pointer; ${color === '#ff44ff' ? 'box-shadow: 0 0 8px #ff44ff;' : ''}"></button>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-size: 11px; color: #888; font-family: 'Share Tech Mono', monospace;">VALOR:</span>
                    <input type="number" value="${enemy.xp}" 
                        onchange="updateEnemyXP('${enemy.id}', this.value)"
                        style="width: 70px; background: rgba(0,0,0,0.5); border: 1px solid #00ff41; color: #00ff41; padding: 4px 8px; font-family: 'Share Tech Mono', monospace; font-size: 12px; font-weight: bold; text-align: center;">
                    <span style="font-size: 11px; color: #00ff41; font-family: 'Share Tech Mono', monospace;">XP</span>
                </div>
            </div>
            <button onclick="removeEnemy('${enemy.id}')" style="background: transparent; border: 1px solid #b71c1c; color: #b71c1c; cursor: pointer; padding: 8px 12px; font-family: 'Share Tech Mono', monospace; font-weight: bold; transition: all 0.3s;" onmouseover="this.style.background='#b71c1c'; this.style.color='#000'" onmouseout="this.style.background='transparent'; this.style.color='#b71c1c'">DEL</button>
        </div>
    `}).join('');
}

function updateEnemyXP(id, newXP) {
    const enemy = btState.enemies.find(e => e.id === id);
    if (enemy) {
        enemy.xp = parseInt(newXP) || 0;
        console.log('💰 XP actualizado:', id, '->', enemy.xp);
        updateCombatButton();
    }
}

function updateEnemyName(id, newName) {
    const enemy = btState.enemies.find(e => e.id === id);
    if (enemy) {
        enemy.name = newName;
        console.log('✏️ Nombre actualizado:', id, '->', newName);
    }
}

function setEnemyColor(id, color) {
    const enemy = btState.enemies.find(e => e.id === id);
    if (enemy) {
        enemy.color = color;
        renderEnemiesList();
        console.log('🎨 Color actualizado:', id, '->', color);
    }
}

// ============================================
// GESTIÓN DE FUERZAS GUARDADAS
// ============================================

const BT_FORCES_STORAGE_KEY = 'mechwarrior_bt_saved_forces';

function getSavedForces() {
    try {
        const saved = localStorage.getItem(BT_FORCES_STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error('Error al cargar fuerzas guardadas:', e);
        return [];
    }
}

function saveForcesToStorage(forces) {
    try {
        localStorage.setItem(BT_FORCES_STORAGE_KEY, JSON.stringify(forces));
    } catch (e) {
        console.error('Error al guardar fuerzas:', e);
    }
}

function saveCurrentForce() {
    const nameInput = document.getElementById('bt-force-name');
    const forceName = nameInput.value.trim();
    
    if (!forceName) {
        alert('Ingresa un nombre para la fuerza');
        return;
    }
    
    if (btState.enemies.length === 0) {
        alert('No hay unidades para guardar');
        return;
    }
    
    const forces = getSavedForces();
    
    // Verificar si ya existe una fuerza con ese nombre
    const existingIndex = forces.findIndex(f => f.name.toLowerCase() === forceName.toLowerCase());
    if (existingIndex !== -1) {
        if (!confirm(`Ya existe una fuerza llamada "${forceName}". ¿Deseas sobrescribirla?`)) {
            return;
        }
        forces.splice(existingIndex, 1);
    }
    
    // Crear la fuerza a guardar
    const force = {
        id: Date.now().toString(),
        name: forceName,
        createdAt: new Date().toISOString(),
        units: btState.enemies.map(e => ({
            name: e.name,
            xp: e.xp,
            color: e.color || '#ffae00'
        })),
        totalBV: btState.enemies.reduce((sum, e) => sum + e.xp, 0)
    };
    
    forces.push(force);
    saveForcesToStorage(forces);
    
    nameInput.value = '';
    renderSavedForcesList();
    
    console.log('💾 Fuerza guardada:', force);
    
    // Mostrar confirmación
    showForceNotification(`✅ Fuerza "${forceName}" guardada (${force.units.length} unidades)`);
}

function loadForce(forceId) {
    const forces = getSavedForces();
    // Comparar como strings para evitar problemas de tipo (número vs string)
    const force = forces.find(f => String(f.id) === String(forceId));
    
    console.log('🔍 loadForce - buscando ID:', forceId, 'tipo:', typeof forceId);
    console.log('🔍 IDs disponibles:', forces.map(f => ({ id: f.id, tipo: typeof f.id, name: f.name })));
    
    if (!force) {
        alert('Fuerza no encontrada. ID buscado: ' + forceId);
        return;
    }
    
    // Preguntar si quiere reemplazar o añadir
    let mode = 'replace';
    if (btState.enemies.length > 0) {
        const choice = confirm(`Ya hay ${btState.enemies.length} unidades.\n\n[Aceptar] = Reemplazar todas\n[Cancelar] = Añadir a las existentes`);
        mode = choice ? 'replace' : 'add';
    }
    
    if (mode === 'replace') {
        // Limpiar enemigos actuales
        btState.enemies = [];
        btState.hits = {};
        btState.deadEnemies = {};
    }
    
    // Añadir unidades de la fuerza
    force.units.forEach(unit => {
        const enemy = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: unit.name,
            xp: unit.xp,
            color: unit.color
        };
        
        btState.enemies.push(enemy);
        btState.hits[enemy.id] = Array(btState.numPlayers).fill(0);
        btState.deadEnemies[enemy.id] = true;
    });
    
    renderEnemiesList();
    updateStartButton();
    
    console.log('📂 Fuerza cargada:', force.name, '- Modo:', mode);
    showForceNotification(`📂 Fuerza "${force.name}" cargada (${force.units.length} unidades)`);
}

function deleteForce(forceId) {
    const forces = getSavedForces();
    // Comparar como strings para evitar problemas de tipo
    const force = forces.find(f => String(f.id) === String(forceId));
    
    if (!force) return;
    
    if (!confirm(`¿Eliminar la fuerza "${force.name}"?\n\nEsta acción no se puede deshacer.`)) {
        return;
    }
    
    const updatedForces = forces.filter(f => String(f.id) !== String(forceId));
    saveForcesToStorage(updatedForces);
    
    renderSavedForcesList();
    
    console.log('🗑️ Fuerza eliminada:', force.name);
    showForceNotification(`🗑️ Fuerza "${force.name}" eliminada`);
}

function renderSavedForcesList() {
    const list = document.getElementById('bt-saved-forces-list');
    const forces = getSavedForces();
    
    if (forces.length === 0) {
        list.innerHTML = '<p style="color: #5c4200; text-align: center; font-size: 14px; padding: 15px; font-style: italic; font-family: \'Share Tech Mono\', monospace;">No hay fuerzas guardadas...</p>';
        return;
    }
    
    // Ordenar por fecha de creación (más recientes primero)
    forces.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    list.innerHTML = forces.map(force => {
        const unitColors = force.units.slice(0, 5).map(u => u.color || '#ffae00');
        const colorDots = unitColors.map(c => `<span style="display: inline-block; width: 8px; height: 8px; background: ${c}; border-radius: 50%; margin-right: 3px;"></span>`).join('');
        const moreUnits = force.units.length > 5 ? `<span style="color: #666; font-size: 10px;">+${force.units.length - 5}</span>` : '';
        
        return `
        <div style="background: rgba(0, 0, 0, 0.5); border: 1px solid #5c4200; padding: 12px; display: flex; justify-content: space-between; align-items: center; gap: 10px;">
            <div style="flex-grow: 1; min-width: 0;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                    <span style="font-weight: bold; color: #ffae00; font-family: 'Share Tech Mono', monospace; font-size: 14px; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${force.name}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 11px; color: #00ff41; font-family: 'Share Tech Mono', monospace;">${force.units.length} unidades</span>
                    <span style="font-size: 11px; color: #888; font-family: 'Share Tech Mono', monospace;">BV: ${force.totalBV}</span>
                    <span style="display: flex; align-items: center;">${colorDots}${moreUnits}</span>
                </div>
            </div>
            <div style="display: flex; gap: 6px; flex-shrink: 0;">
                <button onclick="loadForce('${force.id}')" style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); border: 1px solid #3b82f6; color: #fff; padding: 8px 12px; font-family: 'Share Tech Mono', monospace; font-weight: bold; font-size: 11px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.boxShadow='0 0 10px rgba(59, 130, 246, 0.5)'" onmouseout="this.style.boxShadow='none'" title="Cargar fuerza">
                    📂 CARGAR
                </button>
                <button onclick="deleteForce('${force.id}')" style="background: transparent; border: 1px solid #b71c1c; color: #b71c1c; padding: 8px 10px; font-family: 'Share Tech Mono', monospace; font-weight: bold; font-size: 11px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#b71c1c'; this.style.color='#000'" onmouseout="this.style.background='transparent'; this.style.color='#b71c1c'" title="Eliminar fuerza">
                    🗑️
                </button>
            </div>
        </div>
    `}).join('');
}

// ============================================
// EXPORTAR / IMPORTAR FUERZAS (NUBE)
// ============================================

function exportForcesToFile() {
    const forces = getSavedForces();
    
    if (forces.length === 0) {
        alert('No hay fuerzas guardadas para exportar');
        return;
    }
    
    // Crear objeto de exportación con metadatos
    const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        appName: 'MechWarrior Battle Tracker',
        forcesCount: forces.length,
        forces: forces
    };
    
    // Crear blob y descargar
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `mechwarrior_fuerzas_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('☁️ Fuerzas exportadas:', forces.length);
    showForceNotification(`☁️ ${forces.length} fuerzas exportadas a archivo`);
}

function importForcesFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importData = JSON.parse(e.target.result);
            
            // Validar formato
            if (!importData.forces || !Array.isArray(importData.forces)) {
                throw new Error('Formato de archivo inválido');
            }
            
            const importedForces = importData.forces;
            
            if (importedForces.length === 0) {
                alert('El archivo no contiene fuerzas');
                return;
            }
            
            // Preguntar modo de importación
            const existingForces = getSavedForces();
            let mode = 'replace';
            
            if (existingForces.length > 0) {
                const choice = confirm(
                    `Se importarán ${importedForces.length} fuerzas.\n` +
                    `Ya tienes ${existingForces.length} fuerzas guardadas.\n\n` +
                    `[Aceptar] = Reemplazar todas las fuerzas\n` +
                    `[Cancelar] = Fusionar (añadir sin duplicados)`
                );
                mode = choice ? 'replace' : 'merge';
            }
            
            let finalForces;
            
            if (mode === 'replace') {
                finalForces = importedForces;
            } else {
                // Fusionar evitando duplicados por nombre
                finalForces = [...existingForces];
                let addedCount = 0;
                
                importedForces.forEach(importedForce => {
                    const exists = finalForces.some(f => 
                        f.name.toLowerCase() === importedForce.name.toLowerCase()
                    );
                    if (!exists) {
                        // Generar nuevo ID para evitar colisiones
                        importedForce.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
                        finalForces.push(importedForce);
                        addedCount++;
                    }
                });
                
                console.log(`📥 Fusión: ${addedCount} nuevas, ${importedForces.length - addedCount} duplicadas ignoradas`);
            }
            
            // Guardar
            saveForcesToStorage(finalForces);
            renderSavedForcesList();
            
            // Limpiar input para permitir reimportar el mismo archivo
            event.target.value = '';
            
            console.log('📥 Fuerzas importadas:', finalForces.length);
            showForceNotification(`📥 ${importedForces.length} fuerzas importadas correctamente`);
            
        } catch (error) {
            console.error('Error al importar:', error);
            alert('Error al leer el archivo. Asegúrate de que es un archivo de fuerzas válido.');
            event.target.value = '';
        }
    };
    
    reader.readAsText(file);
}

// ============================================
// SINCRONIZACIÓN CON GOOGLE SHEETS
// ============================================

/**
 * Sube todas las fuerzas guardadas localmente a Google Sheets
 * Usa la hoja "Fuerzas" del mismo spreadsheet de personajes
 */
function subirFuerzasANube() {
    const forces = getSavedForces();
    
    if (forces.length === 0) {
        alert('No hay fuerzas guardadas para subir');
        return;
    }
    
    // Verificar configuración
    if (GOOGLE_SCRIPT_URL.includes("YOUR_GOOGLE_SCRIPT") || GOOGLE_SCRIPT_URL.includes("AKfycbzEBozWGpueZ")) {
        alert("¡Error! Debes configurar la variable GOOGLE_SCRIPT_URL en el código HTML primero.");
        return;
    }
    
    const btn = document.getElementById('btn-sync-upload');
    const originalText = btn.innerText;
    btn.disabled = true;
    btn.innerText = "SUBIENDO...";
    btn.style.opacity = "0.6";
    
    // Preparar datos para enviar
    const payload = {
        action: 'saveFuerzas',
        fuerzas: forces
    };
    
    console.log('☁️⬆ Subiendo fuerzas a Google Sheets...', forces.length, 'fuerzas');
    
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        btn.disabled = false;
        btn.innerText = originalText;
        btn.style.opacity = "1";
        
        if (data.result === "success") {
            console.log('✅ Fuerzas subidas correctamente');
            showForceNotification(`☁️✅ ${forces.length} fuerzas sincronizadas con Google Sheets`);
        } else {
            throw new Error(data.msg || 'Error desconocido');
        }
    })
    .catch(error => {
        btn.disabled = false;
        btn.innerText = originalText;
        btn.style.opacity = "1";
        
        console.error('❌ Error al subir fuerzas:', error);
        alert('Error al subir fuerzas: ' + error.message + '\n\nAsegúrate de que tu Google Apps Script tiene la función doPost actualizada para manejar fuerzas.');
    });
}

/**
 * Descarga las fuerzas desde Google Sheets
 */
function descargarFuerzasDeNube() {
    // Verificar configuración
    if (GOOGLE_SCRIPT_URL.includes("YOUR_GOOGLE_SCRIPT") || GOOGLE_SCRIPT_URL.includes("AKfycbzEBozWGpueZ")) {
        alert("¡Error! Debes configurar la variable GOOGLE_SCRIPT_URL en el código HTML primero.");
        return;
    }
    
    const btn = document.getElementById('btn-sync-download');
    const originalText = btn.innerText;
    btn.disabled = true;
    btn.innerText = "DESCARGANDO...";
    btn.style.opacity = "0.6";
    
    console.log('☁️⬇ Descargando fuerzas de Google Sheets...');
    
    fetch(`${GOOGLE_SCRIPT_URL}?action=getFuerzas`)
    .then(response => response.json())
    .then(data => {
        btn.disabled = false;
        btn.innerText = originalText;
        btn.style.opacity = "1";
        
        if (data.result === "success") {
            const cloudForces = data.fuerzas || [];
            
            if (cloudForces.length === 0) {
                showForceNotification('☁️ No hay fuerzas en la nube');
                return;
            }
            
            // Asegurar que todas las fuerzas de la nube tienen ID válido (como string)
            cloudForces.forEach(cloudForce => {
                if (!cloudForce.id) {
                    cloudForce.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
                } else {
                    // Convertir ID existente a string para consistencia
                    cloudForce.id = String(cloudForce.id);
                }
            });
            
            // Preguntar modo de importación
            const localForces = getSavedForces();
            let finalForces;
            
            if (localForces.length > 0) {
                const choice = confirm(
                    `Se encontraron ${cloudForces.length} fuerzas en la nube.\n` +
                    `Tienes ${localForces.length} fuerzas locales.\n\n` +
                    `[Aceptar] = Reemplazar locales con las de la nube\n` +
                    `[Cancelar] = Fusionar (añadir sin duplicados)`
                );
                
                if (choice) {
                    finalForces = cloudForces;
                } else {
                    // Fusionar
                    finalForces = [...localForces];
                    cloudForces.forEach(cloudForce => {
                        const exists = finalForces.some(f => 
                            f.name.toLowerCase() === cloudForce.name.toLowerCase()
                        );
                        if (!exists) {
                            finalForces.push(cloudForce);
                        }
                    });
                }
            } else {
                finalForces = cloudForces;
            }
            
            // Guardar localmente
            saveForcesToStorage(finalForces);
            renderSavedForcesList();
            
            console.log('✅ Fuerzas descargadas:', finalForces.length);
            showForceNotification(`☁️✅ ${cloudForces.length} fuerzas descargadas de la nube`);
            
        } else {
            throw new Error(data.msg || 'Error desconocido');
        }
    })
    .catch(error => {
        btn.disabled = false;
        btn.innerText = originalText;
        btn.style.opacity = "1";
        
        console.error('❌ Error al descargar fuerzas:', error);
        alert('Error al descargar fuerzas: ' + error.message + '\n\nAsegúrate de que tu Google Apps Script tiene la función doGet actualizada para manejar fuerzas.');
    });
}

function showForceNotification(message) {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.9);
        border: 2px solid #ffae00;
        color: #ffae00;
        padding: 15px 25px;
        font-family: 'Share Tech Mono', monospace;
        font-size: 14px;
        z-index: 9999;
        animation: slideUp 0.3s ease-out;
        box-shadow: 0 0 20px rgba(255, 174, 0, 0.3);
    `;
    notification.textContent = message;
    
    // Añadir animación CSS si no existe
    if (!document.getElementById('force-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'force-notification-styles';
        style.textContent = `
            @keyframes slideUp {
                from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Inicializar lista de fuerzas al cargar
function initSavedForces() {
    renderSavedForcesList();
}

function updateStartButton() {
    const btn = document.getElementById('bt-start-combat-btn');
    if (btState.enemies.length > 0) {
        btn.disabled = false;
        btn.style.background = 'linear-gradient(135deg, #b71c1c 0%, #991616 100%)';
        btn.style.borderColor = '#ffae00';
        btn.style.color = '#ffae00';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 0 20px rgba(183, 28, 28, 0.5)';
        btn.innerHTML = '⚔️ INICIAR COMBATE';
    } else {
        btn.disabled = true;
        btn.style.background = 'linear-gradient(135deg, rgba(127, 29, 29, 0.6) 0%, rgba(153, 27, 27, 0.4) 100%)';
        btn.style.borderColor = '#991b1b';
        btn.style.color = '#7f1d1d';
        btn.style.cursor = 'not-allowed';
        btn.style.boxShadow = 'none';
        btn.innerHTML = '⚔️ AÑADE ENEMIGOS PARA COMBATIR';
    }
}

function startCombat() {
    if (btState.enemies.length === 0) return;
    
    btState.step = 'combat';
    btState.xpBonus = {};
    document.getElementById('bt-setup-view').style.display = 'none';
    document.getElementById('bt-combat-view').style.display = 'block';
    
    renderBonusPanel();
    renderCombatEnemies();
    
    console.log('⚔️ Combate iniciado');
}

// ============================================
// FUNCIONES DE COMBATE
// ============================================

function renderBonusPanel() {
    const container = document.getElementById('bt-xp-bonus-rows');
    if (!container) return;

    const PC = {1:'#4ade80', 2:'#60a5fa', 3:'#fbbf24', 4:'#c084fc', 5:'#f87171'};

    container.innerHTML = Array.from({length: btState.numPlayers}, (_, idx) => {
        const pName = PLAYER_NAMES[idx + 1];
        const bonus = btState.xpBonus[idx] || 0;
        const col = PC[idx + 1] || '#ffae00';
        const bonusColor = bonus > 0 ? '#4ade80' : bonus < 0 ? '#ef4444' : '#555';
        const bonusText = bonus > 0 ? `+${bonus}` : `${bonus}`;
        return `
        <div style="display:flex; align-items:center; gap:5px; background:rgba(0,0,0,0.4); border:1px solid #2a1a00; padding:5px 8px; min-width:160px; flex:1;">
            <span style="color:${col}; font-size:10px; font-family:'Share Tech Mono',monospace; font-weight:bold; min-width:50px;">${pName}</span>
            <button onclick="ajustarBonusXPCombate(${idx},-100)" style="padding:2px 7px; background:#2a0a0a; border:1px solid #b71c1c; color:#ef4444; font-family:'Share Tech Mono',monospace; font-size:11px; font-weight:bold; cursor:pointer;">−</button>
            <span style="color:${bonusColor}; font-family:'Share Tech Mono',monospace; font-size:12px; font-weight:bold; min-width:38px; text-align:center;">${bonusText} XP</span>
            <button onclick="ajustarBonusXPCombate(${idx},100)" style="padding:2px 7px; background:#0a2a0a; border:1px solid #16a34a; color:#4ade80; font-family:'Share Tech Mono',monospace; font-size:11px; font-weight:bold; cursor:pointer;">+</button>
        </div>`;
    }).join('');
}

function renderCombatEnemies() {
    const container = document.getElementById('bt-combat-enemies');
    
    container.innerHTML = btState.enemies.map(enemy => {
        const isDead = btState.deadEnemies[enemy.id];
        const enemyColor = enemy.color || '#ffae00';
        
        return `
            <div style="background: rgba(26, 26, 26, 0.8); border: 2px solid ${isDead ? '#b71c1c' : '#16a34a'}; margin-bottom: 20px; overflow: hidden; opacity: ${isDead ? '1' : '0.6'}; ${isDead ? '' : 'filter: grayscale(0.7);'} clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 0 100%);">
                <div style="background: rgba(0, 0, 0, 0.5); padding: 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #5c4200; border-left: 4px solid ${enemyColor};">
                    <div>
                        <h3 style="font-weight: bold; font-size: 18px; color: ${enemyColor}; margin: 0 0 4px 0; font-family: 'Share Tech Mono', monospace; text-transform: uppercase; letter-spacing: 2px; text-shadow: 0 0 10px ${enemyColor}50;">${enemy.name}</h3>
                        <p style="font-size: 12px; color: #00ff41; font-family: 'Share Tech Mono', monospace; margin: 0;">VALOR TOTAL: ${enemy.xp} XP</p>
                    </div>
                    <button onclick="toggleDead('${enemy.id}')" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; border: 2px solid ${isDead ? '#b71c1c' : '#16a34a'}; background: ${isDead ? 'rgba(183, 28, 28, 0.3)' : 'rgba(22, 163, 74, 0.3)'}; color: ${isDead ? '#ffae00' : '#00ff41'}; cursor: pointer; font-family: 'Share Tech Mono', monospace; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; transition: all 0.3s; clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);">
                        ${isDead ? '💀 ABATIDO' : '✓ VIVO'}
                    </button>
                </div>
                
                <div style="padding: 15px; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
                    ${Array.from({length: btState.numPlayers}).map((_, idx) => {
                        const hits = btState.hits[enemy.id][idx];
                        const playerName = PLAYER_NAMES[idx + 1];
                        return `
                            <div style="display: flex; flex-direction: column; gap: 6px;">
                                <button onclick="handleHit('${enemy.id}', ${idx}, 1)" style="height: 80px; background: rgba(0, 0, 0, 0.5); border: 2px solid #5c4200; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; position: relative; overflow: hidden; transition: all 0.2s; clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);" onmouseover="this.style.borderColor='#ffae00'; this.style.boxShadow='0 0 15px rgba(255, 174, 0, 0.3)'" onmouseout="this.style.borderColor='#5c4200'; this.style.boxShadow='none'">
                                    <span style="font-size: 11px; font-weight: bold; color: #888; text-transform: uppercase; letter-spacing: 1px; font-family: 'Share Tech Mono', monospace;">${playerName}</span>
                                    <span style="font-size: 32px; font-weight: bold; color: #ffae00; font-family: 'Share Tech Mono', monospace; text-shadow: 0 0 10px rgba(255, 174, 0, 0.5);">${hits}</span>
                                    <span style="font-size: 10px; color: #00ff41; font-family: 'Share Tech Mono', monospace;">IMPACTOS</span>
                                </button>
                                <button onclick="handleHit('${enemy.id}', ${idx}, -1)" ${hits === 0 ? 'disabled' : ''} style="height: 28px; background: rgba(183, 28, 28, 0.3); border: 1px solid #b71c1c; color: #b71c1c; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 14px; font-family: 'Share Tech Mono', monospace; font-weight: bold; ${hits === 0 ? 'opacity: 0.3; cursor: not-allowed;' : ''}">−</button>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function handleHit(enemyId, playerIndex, change) {
    const currentHits = btState.hits[enemyId][playerIndex];
    const newHits = currentHits + change;
    
    if (newHits < 0) return;
    
    btState.hits[enemyId][playerIndex] = newHits;
    renderCombatEnemies();
    
    console.log(`🎯 ${PLAYER_NAMES[playerIndex + 1]} → ${btState.enemies.find(e => e.id === enemyId).name}: ${newHits} impactos`);
}

function toggleDead(enemyId) {
    btState.deadEnemies[enemyId] = !btState.deadEnemies[enemyId];
    renderCombatEnemies();
    
    const enemy = btState.enemies.find(e => e.id === enemyId);
    console.log(`${btState.deadEnemies[enemyId] ? '💀' : '✓'} ${enemy.name}: ${btState.deadEnemies[enemyId] ? 'ABATIDO' : 'VIVO'}`);
}

function finishCombat() {
    btState.step = 'results';
    document.getElementById('bt-combat-view').style.display = 'none';
    document.getElementById('bt-results-view').style.display = 'block';
    
    renderResults();
    
    console.log('🏆 Combate finalizado');
}

// ============================================
// FUNCIONES DE RESULTADOS
// ============================================

function calculateResults() {
    const playerTotals = Array(btState.numPlayers).fill(0);
    
    btState.enemies.forEach(enemy => {
        if (!btState.deadEnemies[enemy.id]) return;
        
        const enemyHits = btState.hits[enemy.id];
        const totalHits = enemyHits.reduce((a, b) => a + b, 0);
        
        if (totalHits > 0) {
            const xpPerHit = enemy.xp / totalHits;
            
            enemyHits.forEach((hits, idx) => {
                playerTotals[idx] += hits * xpPerHit;
            });
        }
    });
    
    return playerTotals.map((val, idx) => {
        const bonus = btState.xpBonus[idx] || 0;
        return Math.max(0, Math.floor(val) + bonus);
    });
}

function renderResults() {
    const results = calculateResults();
    
    // Mostrar aviso si hay invitado (5 jugadores)
    const guestWarning = document.getElementById('bt-guest-warning');
    if (btState.numPlayers === 5) {
        guestWarning.style.display = 'block';
    } else {
        guestWarning.style.display = 'none';
    }
    
    // Tabla de resultados
    const table = document.getElementById('bt-results-table');
    table.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; background: rgba(0, 0, 0, 0.5); padding: 16px; border-bottom: 2px solid #5c4200; font-size: 14px; font-weight: bold; color: #ffae00; text-transform: uppercase; letter-spacing: 2px; font-family: 'Share Tech Mono', monospace;">
            <div>COMBATIENTE</div>
            <div style="text-align: right;">XP GANADA</div>
        </div>
        ${results.map((xp, idx) => {
            const playerName = PLAYER_NAMES[idx + 1];
            return `
                <div style="display: grid; grid-template-columns: 1fr 1fr; padding: 16px; border-bottom: 1px solid rgba(92, 66, 0, 0.5);">
                    <div style="font-weight: bold; font-size: 16px; color: #e0e0e0; display: flex; align-items: center; gap: 12px; font-family: 'Share Tech Mono', monospace;">
                        <div style="min-width: 40px; height: 40px; border: 2px solid #5c4200; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; font-size: 14px; color: #ffae00; font-weight: bold; clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%);">P${idx + 1}</div>
                        ${playerName}
                    </div>
                    <div style="text-align: right; font-family: 'Share Tech Mono', monospace; font-size: 24px; color: #00ff41; font-weight: bold; text-shadow: 0 0 10px rgba(0, 255, 65, 0.5);">+${xp}</div>
                </div>
            `;
        }).join('')}
    `;
    
    // Resumen
    const summary = document.getElementById('bt-results-summary');
    summary.innerHTML = `
        <h3 style="font-weight: bold; color: #ffae00; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 2px;">RESUMEN DE BAJAS:</h3>
        <ul style="list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px;">
            ${btState.enemies.map(e => {
                const totalHits = btState.hits[e.id].reduce((a,b)=>a+b,0);
                const enemyColor = e.color || '#ffae00';
                if (!btState.deadEnemies[e.id]) {
                    return `<li style="color: #5c4200; padding-left: 20px; border-left: 2px solid #5c4200;">• ${e.name}: Escapó (0 XP)</li>`;
                }
                return `
                    <li style="padding-left: 20px; border-left: 2px solid ${enemyColor};">
                        <span style="color: ${enemyColor}; font-weight: bold;">• ${e.name}</span>: 
                        <span style="color: #888;">${e.xp} XP / ${totalHits} impactos = ${totalHits > 0 ? Math.round(e.xp/totalHits) : 0} XP por golpe</span>
                    </li>
                `;
            }).join('')}
        </ul>
    `;
}

// ============================================
// FUNCIONES DE NAVEGACIÓN Y COPY
// ============================================

function goToRegistroAndCopy() {
    console.log('📋 Copiando XP y navegando al Registro de Combate...');
    
    const results = calculateResults();
    console.log('📊 XP calculados:', results);
    
    // IMPORTANTE: Ocultar Battle Tracker primero
    const bt = document.getElementById('battle-tracker');
    if (bt) {
        bt.style.display = 'none';
        console.log('✓ Battle Tracker ocultado');
    } else {
        console.warn('⚠ No se encontró elemento #battle-tracker');
    }
    
    // Pequeño delay para asegurar que el DOM se actualice
    setTimeout(() => {
        // Navegar al Registro de Combate
        goToRegistroCombate();
        
        // Verificar que el Registro está visible
        const registro = document.getElementById('registro-combate');
        if (registro && registro.style.display === 'block') {
            console.log('✓ Registro de Combate está visible');
            
            // Abrir modal automáticamente con los XP
            setTimeout(() => {
                abrirModalRecompensasConXP(results);
            }, 300);
        } else {
            console.error('❌ Registro de Combate NO está visible');
        }
        
        console.log('✅ Navegación completada');
    }, 100);
}

function ajustarXPGanado(inputId, delta) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const actual = parseInt(input.value) || 0;
    input.value = Math.max(0, actual + delta);
}

function ajustarBonusXPCombate(playerIdx, delta) {
    btState.xpBonus[playerIdx] = (btState.xpBonus[playerIdx] || 0) + delta;
    renderBonusPanel();
}

function resetBattleTracker() {
    btState = {
        step: 'setup',
        numPlayers: 4,
        enemies: [],
        hits: {},
        deadEnemies: {},
        xpBonus: {}
    };
    
    document.getElementById('bt-setup-view').style.display = 'block';
    document.getElementById('bt-combat-view').style.display = 'none';
    document.getElementById('bt-results-view').style.display = 'none';
    
    selectPlayers(4);
    renderEnemiesList();
    updateStartButton();
    renderSavedForcesList(); // Mantener fuerzas guardadas visibles
    
    console.log('🔄 Battle Tracker reiniciado');
}

function goToBattleTracker() {
    console.log('🎯 Navegando a Battle Tracker...');
    
    // Ocultar todas las secciones
    ['landing-page', 'pre-generacion', 'ficha-container', 'barracones', 'points-counter', 'registro-combate'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    
    // Mostrar Battle Tracker
    const bt = document.getElementById('battle-tracker');
    if (bt) bt.style.display = 'block';
    
    // Inicializar si es necesario
    if (btState.step === 'setup') {
        selectPlayers(4); // Esto también renderiza la lista de jugadores
        renderEnemiesList();
        updateStartButton();
        renderSavedForcesList(); // Cargar fuerzas guardadas
    }
    
    console.log('✅ Battle Tracker mostrado');
}

function goToTROFromBattleTracker() {
    console.log('📖 Navegando al TRO desde Battle Tracker...');
    
    // Ocultar Battle Tracker
    const bt = document.getElementById('battle-tracker');
    if (bt) bt.style.display = 'none';
    
    // Mostrar TRO
    goToTRO();
}

function goHomeFromBattleTracker() {
    console.log('🏠 Volviendo al menú desde Battle Tracker...');
    
    // Ocultar TODAS las secciones
    const sections = ['battle-tracker', 'pre-generacion', 'ficha-container', 'barracones', 'points-counter', 'registro-combate'];
    sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    });
    
    // Mostrar landing page con display flex (importante para el layout)
    const lp = document.getElementById('landing-page');
    if (lp) {
        lp.style.display = 'flex';
        lp.style.position = '';  // Resetear position
        lp.offsetHeight; // Trigger reflow
    }
    
    console.log('✅ Vuelto al menú principal');
}

// Inicializar al cargar
console.log('✅ Battle Tracker (Integrado) cargado correctamente');

// Inicializar lista de jugadores por defecto
if (document.getElementById('bt-players-list')) {
    renderPlayersList();
}


// ============================================================================
// MENÚ SECRETO - FUNCIONES DE ADMINISTRACIÓN
// ============================================================================

// Variables para tracking de valores originales (antes de mejoras de sesión)
let valoresOriginalesAtributos = { fue: 0, des: 0, int: 0, car: 0 };
let valoresOriginalesHabilidades = {};
let xpOriginal = 0;

// HISTORIAL DE COMPRAS - Array de objetos con cada compra de ESTA SESIÓN
let historialCompras = [];

// HISTORIAL PERSISTENTE - Compras de sesiones anteriores (cargado desde nube)
let historialComprasPersistente = [];

/**
 * Registra una compra en el historial
 * @param {string} jugador - Nombre del jugador
 * @param {string} tipo - 'atributo' o 'habilidad'
 * @param {string} nombre - Nombre del atributo/habilidad
 * @param {number} nivelAnterior - Nivel antes de la mejora
 * @param {number} nivelNuevo - Nivel después de la mejora
 * @param {number} costo - XP gastado
 * @param {HTMLElement} square - Referencia al cuadrado clickeado
 */
function registrarCompra(jugador, tipo, nombre, nivelAnterior, nivelNuevo, costo, square) {
    const compra = {
        id: Date.now(),
        jugador: jugador,
        tipo: tipo,
        nombre: nombre,
        nivelAnterior: nivelAnterior,
        nivelNuevo: nivelNuevo,
        costo: costo,
        timestamp: new Date().toLocaleTimeString(),
        fecha: new Date().toLocaleDateString(),
        square: square
    };
    historialCompras.push(compra);
    actualizarVistaHistorial();
    console.log('📝 Compra registrada:', compra);
}

/**
 * Actualiza la vista del historial en el menú secreto
 */
function actualizarVistaHistorial() {
    const container = document.getElementById('historial-compras-lista');
    if (!container) return;
    
    let html = '';
    
    // === SECCIÓN: COMPRAS DE ESTA SESIÓN (deshacibles) ===
    if (historialCompras.length > 0) {
        html += '<div style="color: #ff6600; font-weight: bold; margin-bottom: 8px; border-bottom: 1px solid #ff6600; padding-bottom: 4px;">📌 ESTA SESIÓN (deshacibles)</div>';
        
        // Mostrar en orden inverso (más reciente primero)
        for (let i = historialCompras.length - 1; i >= 0; i--) {
            const c = historialCompras[i];
            const tipoIcon = c.tipo === 'atributo' ? '💪' : '📚';
            const color = c.tipo === 'atributo' ? '#ff6600' : '#00ff41';
            
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid #333; font-size: 11px;">
                    <div>
                        <span style="color: ${color};">${tipoIcon} ${c.nombre}</span>
                        <span style="color: #888;"> ${c.nivelAnterior}→${c.nivelNuevo}</span>
                        <span style="color: #ffae00;"> (-${c.costo} XP)</span>
                        <br><span style="color: #555; font-size: 10px;">${c.jugador} @ ${c.timestamp}</span>
                    </div>
                    <button onclick="deshacerCompraEspecifica(${c.id})" style="padding: 4px 8px; background: #660000; color: #fff; border: none; cursor: pointer; font-size: 10px;">✖</button>
                </div>
            `;
        }
    }
    
    // === SECCIÓN: HISTORIAL GUARDADO (AHORA TAMBIÉN DESHACIBLES) ===
    if (historialComprasPersistente.length > 0) {
        html += '<div style="color: #888; font-weight: bold; margin: 12px 0 8px 0; border-bottom: 1px solid #444; padding-bottom: 4px;">📜 SESIONES ANTERIORES (click ✖ para revertir)</div>';
        
        // Agrupar por fecha
        const porFecha = {};
        historialComprasPersistente.forEach((c, index) => {
            const fecha = c.fecha || 'Fecha desconocida';
            if (!porFecha[fecha]) porFecha[fecha] = [];
            porFecha[fecha].push({...c, persistenteIndex: index});
        });
        
        // Mostrar agrupado por fecha (más reciente primero)
        const fechas = Object.keys(porFecha).sort().reverse();
        fechas.forEach(fecha => {
            html += `<div style="color: #666; font-size: 10px; margin-top: 8px; margin-bottom: 4px;">📅 ${fecha}</div>`;
            
            porFecha[fecha].forEach(c => {
                const tipoIcon = c.tipo === 'atributo' ? '💪' : '📚';
                const color = c.tipo === 'atributo' ? '#884400' : '#006622';
                
                html += `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 8px; border-bottom: 1px solid #222; font-size: 10px;">
                        <div>
                            <span style="color: ${color};">${tipoIcon} ${c.nombre}</span>
                            <span style="color: #666;"> ${c.nivelAnterior}→${c.nivelNuevo}</span>
                            <span style="color: #886600;"> (-${c.costo} XP)</span>
                            <span style="color: #444;"> - ${c.jugador}</span>
                        </div>
                        <button onclick="deshacerCompraPersistente(${c.persistenteIndex})" style="padding: 3px 6px; background: #442200; color: #ff6600; border: 1px solid #663300; cursor: pointer; font-size: 9px;" title="Revertir esta mejora">✖</button>
                    </div>
                `;
            });
        });
    }
    
    if (html === '') {
        html = '<p style="color: #666; text-align: center; font-size: 12px;">No hay compras registradas</p>';
    }
    
    container.innerHTML = html;
}

/**
 * Deshace una compra específica por ID
 */
function deshacerCompraEspecifica(id) {
    const index = historialCompras.findIndex(c => c.id === id);
    if (index === -1) {
        alert('Compra no encontrada');
        return;
    }
    
    const compra = historialCompras[index];
    
    if (!confirm(`¿Deshacer compra?\n\n${compra.nombre}: ${compra.nivelAnterior}→${compra.nivelNuevo}\nSe devolverán ${compra.costo} XP`)) {
        return;
    }
    
    // Deshacer la compra
    if (compra.tipo === 'atributo') {
        deshacerCompraAtributo(compra);
    } else {
        deshacerCompraHabilidad(compra);
    }
    
    // Eliminar del historial
    historialCompras.splice(index, 1);
    actualizarVistaHistorial();
    
    console.log('⏪ Compra deshecha:', compra);
}

/**
 * Deshace una compra de SESIONES ANTERIORES (ya guardada en la nube)
 * - Desbloquea el cuadrado
 * - Revierte el valor del atributo/habilidad
 * - Devuelve el XP
 * - Registra reversión en el Sheet
 * - Requiere guardar para persistir cambios
 */
function deshacerCompraPersistente(index) {
    if (index < 0 || index >= historialComprasPersistente.length) {
        alert('Compra no encontrada');
        return;
    }
    
    const compra = historialComprasPersistente[index];
    const jugador = document.getElementById('barr-callsign')?.value || compra.jugador;
    
    if (!confirm(`⚠️ REVERTIR MEJORA GUARDADA\n\n${compra.nombre}: ${compra.nivelNuevo}→${compra.nivelAnterior}\nSe devolverán ${compra.costo} XP\n\n¡IMPORTANTE! Deberás GUARDAR para que los cambios se apliquen en la nube.`)) {
        return;
    }
    
    console.log('⏪ Revirtiendo compra persistente:', compra);
    
    if (compra.tipo === 'atributo') {
        // Revertir atributo
        const attrKey = compra.nombre.toLowerCase();
        const attrId = 'barr-' + attrKey;
        const attrInput = document.getElementById(attrId);
        
        if (attrInput) {
            // Buscar y desbloquear el último cuadrado seleccionado
            const container = attrInput.closest('.barracones-attr-row')?.querySelector('.barracones-attr-upgrades');
            if (container) {
                const squares = container.querySelectorAll('.barracones-attr-upgrade.selected.locked');
                if (squares.length > 0) {
                    const lastSquare = squares[squares.length - 1];
                    lastSquare.classList.remove('selected', 'locked');
                }
            }
            
            // Restar al atributo
            attrInput.value = parseInt(attrInput.value) - 1;
            attrInput.dispatchEvent(new Event('change'));
            
            // Si era FUE, regenerar HP
            if (attrKey === 'fue') {
                generarEstadoFisicoBarracones(parseInt(attrInput.value));
            }
        }
    } else {
        // Revertir habilidad
        const skillsTable = document.getElementById('barr-skills-table');
        if (skillsTable) {
            for (let i = 1; i < skillsTable.rows.length; i++) {
                const nombreCell = skillsTable.rows[i].cells[0];
                if (nombreCell?.textContent === compra.nombre) {
                    const nivelInput = document.getElementById('barr-skill-' + (i-1) + '-nv');
                    
                    // Buscar contenedor de upgrades en la fila
                    const upgradesCell = skillsTable.rows[i].cells[2];
                    if (upgradesCell) {
                        const squares = upgradesCell.querySelectorAll('.barracones-skill-upgrade.selected.locked');
                        if (squares.length > 0) {
                            const lastSquare = squares[squares.length - 1];
                            lastSquare.classList.remove('selected', 'locked');
                        }
                    }
                    
                    if (nivelInput) {
                        nivelInput.value = parseInt(nivelInput.value) - 1;
                        nivelInput.dispatchEvent(new Event('change'));
                    }
                    break;
                }
            }
        }
        
        // Recalcular TIR
        calcularTIRBarracones();
    }
    
    // Devolver XP
    devolverXP(compra.costo);
    
    // REGISTRAR REVERSIÓN EN RESPUESTAS DE FORMULARIO 1
    registrarReversionEnFormulario(jugador, compra.costo, compra.tipo, compra.nombre, compra.nivelNuevo, compra.nivelAnterior);
    
    // Eliminar del historial persistente
    historialComprasPersistente.splice(index, 1);
    
    // ACTUALIZAR EL JSON DE MEJORAS (para que al guardar se refleje el cambio)
    if (typeof datosPersonajeBarracones !== 'undefined' && datosPersonajeBarracones) {
        if (compra.tipo === 'atributo') {
            // Actualizar mejorasAtributos
            const attrKey = compra.nombre.toLowerCase();
            if (!datosPersonajeBarracones.mejorasAtributos) {
                datosPersonajeBarracones.mejorasAtributos = { fue: 0, des: 0, int: 0, car: 0 };
            }
            if (datosPersonajeBarracones.mejorasAtributos[attrKey] > 0) {
                datosPersonajeBarracones.mejorasAtributos[attrKey]--;
                console.log(`📝 JSON actualizado: mejorasAtributos.${attrKey} = ${datosPersonajeBarracones.mejorasAtributos[attrKey]}`);
            }
        } else {
            // Actualizar mejorasHabilidades
            if (!datosPersonajeBarracones.mejorasHabilidades) {
                datosPersonajeBarracones.mejorasHabilidades = {};
            }
            if (datosPersonajeBarracones.mejorasHabilidades[compra.nombre] > 0) {
                datosPersonajeBarracones.mejorasHabilidades[compra.nombre]--;
                // Si llega a 0, eliminar la entrada
                if (datosPersonajeBarracones.mejorasHabilidades[compra.nombre] === 0) {
                    delete datosPersonajeBarracones.mejorasHabilidades[compra.nombre];
                }
                console.log(`📝 JSON actualizado: mejorasHabilidades.${compra.nombre} eliminado/decrementado`);
            }
        }
        
        // También actualizar historialCompras en el JSON
        datosPersonajeBarracones.historialCompras = historialComprasPersistente;
    }
    
    // Marcar que hay cambios pendientes
    xpGastadoEstaSesion = true;
    
    actualizarVistaHistorial();
    
    alert('✅ Mejora revertida.\n\nRecuerda GUARDAR EN LA NUBE para que los cambios sean permanentes.');
    
    console.log('✅ Compra persistente revertida:', compra);
}

/**
 * Deshace la última compra registrada
 */
function deshacerUltimaCompra() {
    if (historialCompras.length === 0) {
        alert('No hay compras de ESTA SESIÓN para deshacer.\n\nLas compras de sesiones anteriores ya están guardadas en la nube y no se pueden deshacer desde aquí.');
        return;
    }
    
    const compra = historialCompras[historialCompras.length - 1];
    deshacerCompraEspecifica(compra.id);
}

/**
 * Deshace una compra de atributo
 */
function deshacerCompraAtributo(compra) {
    const attrId = 'barr-' + compra.nombre.toLowerCase();
    const attrInput = document.getElementById(attrId);
    const jugador = document.getElementById('barr-callsign')?.value || compra.jugador;
    
    if (attrInput) {
        // Restaurar valor anterior
        attrInput.value = compra.nivelAnterior;
        attrInput.dispatchEvent(new Event('change'));
    }
    
    // Quitar selección del cuadrado
    if (compra.square && compra.square.classList) {
        compra.square.classList.remove('selected');
    }
    
    // Devolver XP
    devolverXP(compra.costo);
    
    // REGISTRAR REVERSIÓN EN RESPUESTAS DE FORMULARIO 1
    registrarReversionMejoraEnFormulario(jugador, compra.costo, 'atributo', compra.nombre, compra.nivelNuevo, compra.nivelAnterior);
    
    // Regenerar estado físico si era FUE
    if (compra.nombre.toLowerCase() === 'fue') {
        generarEstadoFisicoBarracones(compra.nivelAnterior);
    }
}

/**
 * Deshace una compra de habilidad
 */
function deshacerCompraHabilidad(compra) {
    // Buscar el input de nivel de la habilidad
    const skillsTable = document.getElementById('barr-skills-table');
    if (!skillsTable) return;
    
    const jugador = document.getElementById('barr-callsign')?.value || compra.jugador;
    
    for (let i = 1; i < skillsTable.rows.length; i++) {
        const nombreCell = skillsTable.rows[i].cells[0];
        if (nombreCell?.textContent === compra.nombre) {
            const nivelInput = document.getElementById('barr-skill-' + (i-1) + '-nv');
            if (nivelInput) {
                nivelInput.value = compra.nivelAnterior;
                nivelInput.dispatchEvent(new Event('change'));
            }
            break;
        }
    }
    
    // Quitar selección del cuadrado
    if (compra.square && compra.square.classList) {
        compra.square.classList.remove('selected');
    }
    
    // Devolver XP
    devolverXP(compra.costo);
    
    // REGISTRAR REVERSIÓN EN RESPUESTAS DE FORMULARIO 1
    registrarReversionMejoraEnFormulario(jugador, compra.costo, 'habilidad', compra.nombre, compra.nivelNuevo, compra.nivelAnterior);
    
    // Recalcular TIR
    calcularTIRBarracones();
}

/**
 * Abre el modal del menú secreto
 */
function abrirMenuSecreto() {
    const modal = document.getElementById('secret-menu-modal');
    modal.style.display = 'flex';
    document.getElementById('secret-password-panel').style.display = 'block';
    document.getElementById('secret-admin-panel').style.display = 'none';
    document.getElementById('secret-password-input').value = '';
    document.getElementById('secret-password-input').focus();
    actualizarVistaHistorial();
}

/**
 * Cierra el modal del menú secreto
 */
function cerrarMenuSecreto() {
    document.getElementById('secret-menu-modal').style.display = 'none';
}

/**
 * Verifica la contraseña de administrador
 */
function verificarContraseña() {
    const password = document.getElementById('secret-password-input').value;
    if (password === 'Mark') {
        document.getElementById('secret-password-panel').style.display = 'none';
        document.getElementById('secret-admin-panel').style.display = 'block';
        actualizarVistaHistorial();
        console.log('🔓 Acceso al menú secreto concedido');
    } else {
        alert('❌ Contraseña incorrecta');
        document.getElementById('secret-password-input').value = '';
    }
}

/**
 * Guarda los valores originales al cargar un personaje
 * Se llama automáticamente desde cargarPersonajeEnBarracones
 */
function guardarValoresOriginales() {
    // Guardar atributos
    valoresOriginalesAtributos = {
        fue: parseInt(document.getElementById('barr-fue')?.value) || 0,
        des: parseInt(document.getElementById('barr-des')?.value) || 0,
        int: parseInt(document.getElementById('barr-int')?.value) || 0,
        car: parseInt(document.getElementById('barr-car')?.value) || 0
    };
    
    // Guardar XP disponible
    xpOriginal = parseInt(document.getElementById('barr-xp-disponible')?.value) || 0;
    
    // Guardar niveles de habilidades
    valoresOriginalesHabilidades = {};
    const skillsTable = document.getElementById('barr-skills-table');
    if (skillsTable) {
        for (let i = 1; i < skillsTable.rows.length; i++) {
            const nombreCell = skillsTable.rows[i].cells[0];
            const skillName = nombreCell?.textContent;
            const nivelInput = document.getElementById('barr-skill-' + (i-1) + '-nv');
            if (skillName && nivelInput) {
                valoresOriginalesHabilidades[skillName] = parseInt(nivelInput.value) || 0;
            }
        }
    }
    
    console.log('💾 Valores originales guardados:', {
        atributos: valoresOriginalesAtributos,
        xp: xpOriginal,
        habilidades: valoresOriginalesHabilidades
    });
}

/**
 * Resetea las mejoras de la sesión actual
 * Devuelve atributos y habilidades a sus valores originales
 */
function resetearMejorasSesion() {
    if (!confirm('⚠️ ¿Estás seguro?\n\nEsto revertirá todas las mejoras compradas en esta sesión y devolverá el XP gastado.\n\nEsta acción NO se puede deshacer.')) {
        return;
    }
    
    console.log('⏪ Iniciando reseteo de mejoras...');
    
    // 1. Restaurar atributos a valores originales
    const barrFue = document.getElementById('barr-fue');
    const barrDes = document.getElementById('barr-des');
    const barrInt = document.getElementById('barr-int');
    const barrCar = document.getElementById('barr-car');
    
    if (barrFue) barrFue.value = valoresOriginalesAtributos.fue;
    if (barrDes) barrDes.value = valoresOriginalesAtributos.des;
    if (barrInt) barrInt.value = valoresOriginalesAtributos.int;
    if (barrCar) barrCar.value = valoresOriginalesAtributos.car;
    
    // 2. Quitar selección de cuadrados de atributos NO bloqueados
    document.querySelectorAll('.barracones-attr-upgrade.selected:not(.locked)').forEach(sq => {
        sq.classList.remove('selected');
    });
    
    // 3. Restaurar niveles de habilidades
    const skillsTable = document.getElementById('barr-skills-table');
    if (skillsTable) {
        for (let i = 1; i < skillsTable.rows.length; i++) {
            const nombreCell = skillsTable.rows[i].cells[0];
            const skillName = nombreCell?.textContent;
            const nivelInput = document.getElementById('barr-skill-' + (i-1) + '-nv');
            
            if (skillName && nivelInput && valoresOriginalesHabilidades[skillName] !== undefined) {
                nivelInput.value = valoresOriginalesHabilidades[skillName];
            }
        }
    }
    
    // 4. Quitar selección de cuadrados de habilidades NO bloqueados
    document.querySelectorAll('.barracones-skill-upgrade.selected:not(.locked)').forEach(sq => {
        sq.classList.remove('selected');
    });
    
    // 5. Restaurar XP disponible
    const xpInput = document.getElementById('barr-xp-disponible');
    if (xpInput) {
        xpInput.value = xpOriginal;
        actualizarDisplayXP();
    }
    
    // 6. Resetear tracking
    xpGastadoEstaSesion = false;
    
    // 7. Recalcular TIR
    calcularTIRBarracones();
    
    // 8. Regenerar estado físico si cambió FUE
    const nuevaFue = parseInt(barrFue?.value) || 0;
    if (nuevaFue > 0) {
        generarEstadoFisicoBarracones(nuevaFue);
    }
    
    console.log('✅ Mejoras reseteadas correctamente');
    
    // 9. Limpiar historial de compras
    historialCompras = [];
    actualizarVistaHistorial();
    
    alert('✅ Mejoras reseteadas correctamente.\n\nLos atributos y habilidades han vuelto a sus valores anteriores y el XP ha sido restaurado.');
    
    cerrarMenuSecreto();
}

/**
 * Recarga el personaje desde la nube
 */
function recargarPersonajeDesdeNube() {
    const jugador = document.getElementById('barr-callsign')?.value;
    if (!jugador) {
        alert('No hay personaje cargado para recargar.');
        return;
    }
    
    if (!confirm('⚠️ ¿Recargar personaje desde la nube?\n\nTodos los cambios no guardados se perderán.')) {
        return;
    }
    
    cerrarMenuSecreto();
    cargarPersonajeRapido(jugador);
}

// Permitir Enter para enviar contraseña
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && document.getElementById('secret-menu-modal').style.display === 'flex') {
        const passwordPanel = document.getElementById('secret-password-panel');
        if (passwordPanel.style.display !== 'none') {
            verificarContraseña();
        }
    }
});

console.log('🔐 Menú secreto inicializado');


// Variables globales para el Combat Calculator
window.combatCurrentCharacter = null;
window.combatSelectedWeapon = null;
window.combatWeaponMod = 0;
window.combatLoadedWeapons = [];
window.combatTurnNumber = 1;
window.combatLogEntries = [];
window.datosCombateGuardados = null;

// Configuración por defecto
const COMBAT_CONFIG_DEFAULTS = {
    rangeShort: 0, rangeMedium: 2, rangeLong: 4,
    movStand: 0, movWalk: 1, movRun: 2, movJump: 3
};

/**
 * Abre el calculador de combate
 */
function abrirCalculadorCombate() {
    const modal = document.getElementById('combat-calculator-modal');
    if (!modal) return;
    
    // Ocultar landing page
    document.getElementById('landing-page').style.display = 'none';
    
    // Ocultar paneles internos
    document.getElementById('combat-hp-panel').style.display = 'none';
    document.getElementById('combat-weapons-panel').style.display = 'none';
    
    // Reset
    window.combatCurrentCharacter = null;
    window.combatSelectedWeapon = null;
    window.combatWeaponMod = 0;
    window.combatLoadedWeapons = [];
    window.combatTurnNumber = 1;
    window.combatLogEntries = [];
    
    document.getElementById('combat-loaded-char').textContent = '';
    document.getElementById('combat-turn-counter').textContent = 'Turno 1';
    document.getElementById('combat-log').innerHTML = '<div style="color: #666; font-style: italic;">Sin acciones registradas...</div>';
    
    cargarConfigCombate();
    modal.style.display = 'block';
    resetearSeleccionesCombate();
    actualizarCalculoCombate();
    console.log('⚔️ Calculador abierto');
}

function cerrarCalculadorCombate() {
    document.getElementById('combat-calculator-modal').style.display = 'none';
    document.getElementById('landing-page').style.display = 'flex';
    console.log('⚔️ Calculador cerrado');
}

/**
 * Carga personaje por nombre de jugador desde la nube
 */
function cargarPersonajePorJugador(jugador) {
    console.log('🔍 Buscando personaje de:', jugador);
    
    // Primero verificar si hay un personaje ya cargado en currentCharacterData
    if (window.currentCharacterData && 
        window.currentCharacterData.jugador?.toLowerCase().includes(jugador.toLowerCase())) {
        console.log('✅ Usando personaje actualmente cargado');
        cargarPersonajeEnCalculador(window.currentCharacterData);
        return;
    }
    
    // Si no, buscar en la nube
    if (typeof GOOGLE_SCRIPT_URL === 'undefined' || GOOGLE_SCRIPT_URL.includes("YOUR_GOOGLE_SCRIPT")) {
        agregarAlLog(`⚠️ Configura GOOGLE_SCRIPT_URL primero`, '#ff6b6b');
        return;
    }
    
    agregarAlLog(`🔍 Buscando en nube: ${jugador}...`, '#888');
    
    fetch(`${GOOGLE_SCRIPT_URL}?jugador=${encodeURIComponent(jugador)}`)
        .then(response => response.json())
        .then(data => {
            if (data.result === "success" && data.personajes && data.personajes.length > 0) {
                const personaje = data.personajes[0]; // Tomar el primero
                console.log('✅ Personaje encontrado:', personaje.nombre);
                cargarPersonajeEnCalculador(personaje);
            } else {
                console.log('❌ No se encontró personaje para', jugador);
                agregarAlLog(`⚠️ No se encontró personaje de ${jugador}`, '#ff6b6b');
            }
        })
        .catch(err => {
            console.error('Error buscando personaje:', err);
            agregarAlLog(`❌ Error de conexión`, '#ff6b6b');
        });
}

/**
 * Carga un personaje en el calculador
 */
function cargarPersonajeEnCalculador(character) {
    if (!character) return;
    
    console.log('📥 Cargando personaje en calculador:', character.nombre);
    console.log('   - extraSkills:', character.extraSkills?.length || 0);
    console.log('   - habilidades:', character.habilidades?.length || 0);
    console.log('   - STR/FUE:', character.str);
    console.log('   - DEX/DES:', character.dex);
    console.log('   - armas:', character.armas);
    
    window.combatCurrentCharacter = character;
    
    // Mostrar info
    const numHabs = character.extraSkills?.length || character.habilidades?.length || 0;
    document.getElementById('combat-loaded-char').innerHTML = 
        `<span style="color: #4ade80; font-weight: bold;">${character.nombre}</span> <span style="color: #888;">(${numHabs} habilidades)</span>`;
    
    // Cargar habilidades
    cargarHabilidadesEnCalculador();
    
    // Generar silueta HP
    generarSiluetaHP(character);
    
    // Generar armas
    generarPanelArmas(character);
    
    agregarAlLog(`📥 ${character.nombre} cargado`, '#4ade80');
    console.log('✅ Personaje cargado:', character.nombre);
}

/**
 * Carga habilidades en el selector
 */
function cargarHabilidadesEnCalculador() {
    const select = document.getElementById('combat-skill-select');
    if (!select) return;
    
    select.innerHTML = '<option value="">-- Seleccionar Habilidad --</option>';
    
    const char = window.combatCurrentCharacter;
    if (!char) return;
    
    // Las habilidades pueden venir como 'habilidades' o 'extraSkills' dependiendo del origen
    let habilidades = char.habilidades || [];
    
    // Si viene de la nube, convertir extraSkills al formato esperado
    if ((!habilidades || habilidades.length === 0) && char.extraSkills) {
        console.log('📚 Convirtiendo extraSkills a habilidades...');
        
        // Obtener los 4 atributos
        const fue = parseInt(char.str) || 5;
        const des = parseInt(char.dex) || 5;
        const int = parseInt(char.int) || 5;
        const car = parseInt(char.cha) || 5;
        
        // Media de los 4 atributos
        const mediaAtributos = Math.floor((fue + des + int + car) / 4);
        
        console.log(`📊 Atributos: FUE=${fue} DES=${des} INT=${int} CAR=${car} → Media=${mediaAtributos}`);
        
        habilidades = char.extraSkills.map(skill => {
            const nivel = parseInt(skill.level) || 0;
            // TIR = Media de atributos - Nivel
            const tir = mediaAtributos - nivel;
            
            console.log(`   ${skill.name}: Nivel ${nivel} → TIR ${tir}`);
            
            return {
                nombre: skill.name,
                nivel: nivel,
                tir: tir
            };
        });
        
        // Guardar para uso posterior
        char.habilidades = habilidades;
    }
    
    if (!habilidades || habilidades.length === 0) {
        console.log('⚠️ No se encontraron habilidades');
        return;
    }
    
    console.log(`📚 Cargando ${habilidades.length} habilidades`);
    
    const combatSkills = ['Armas Pequeñas', 'Rifle', 'Armas de Apoyo', 'Arco', 'Pelea', 'Armas Arrojadizas', 'Artilleria'];
    
    habilidades.forEach(hab => {
        const nombre = hab.nombre || hab.name;
        const tir = hab.tir;
        
        if (nombre && tir !== undefined && tir !== null) {
            const isCombat = combatSkills.some(s => nombre.toLowerCase().includes(s.toLowerCase()));
            const option = document.createElement('option');
            option.value = tir;
            option.textContent = `${nombre} (TIR: ${tir})`;
            option.dataset.skillName = nombre;
            if (isCombat) {
                select.insertBefore(option, select.options[1] || null);
            } else {
                select.appendChild(option);
            }
        }
    });
    
    console.log(`✅ ${select.options.length - 1} habilidades cargadas en selector`);
}

/**
 * Genera la silueta humana de HP
 */
function generarSiluetaHP(character) {
    const container = document.getElementById('combat-silueta-container');
    const panel = document.getElementById('combat-hp-panel');
    if (!container || !panel) return;
    
    // Los atributos se guardan como str, dex, int, cha en la nube
    const fue = parseInt(character.str || character.atributos?.FUE || character.fue || 5);
    
    console.log(`🩸 Generando silueta HP para FUE=${fue}`);
    
    // HP por ubicación según FUE
    const hp = {
        cabeza: fue,
        bizq: fue * 2,
        torso: fue * 3,
        bder: fue * 2,
        pizq: fue * 2,
        pder: fue * 2
    };
    
    // Generar cuadrados estilo Barracones para una ubicación
    const generarCuadrados = (cantidad, id, columnas = 3) => {
        let html = '';
        for (let i = 0; i < cantidad; i++) {
            html += `<span class="combat-hp-box" data-location="${id}" onclick="toggleDanoCombate(this)"></span>`;
        }
        return html;
    };
    
    // Crear silueta en forma de cuerpo humano - estilo Barracones
    container.innerHTML = `
        <div style="padding: 15px; border: 1px solid #5c4200; background: rgba(0,0,0,0.8); width: 280px;">
            <!-- CABEZA - Arriba del todo, centrada -->
            <div style="display:flex; justify-content:center; margin-bottom:15px;">
                <div class="combat-loc-box">
                    <span class="combat-loc-name">CABEZA</span>
                    <div id="combat-hp-cabeza" style="display:flex; flex-wrap:wrap; justify-content:center; max-width:80px; margin:5px auto 0; gap:2px;">
                        ${generarCuadrados(hp.cabeza, 'cabeza', 4)}
                    </div>
                </div>
            </div>
            
            <!-- BRAZOS Y TORSO - Fila principal -->
            <div style="display:flex; gap:15px; justify-content:center; align-items:flex-start; margin-bottom:15px;">
                <!-- BRAZO IZQUIERDO -->
                <div class="combat-loc-box">
                    <span class="combat-loc-name">B.IZQ</span>
                    <div id="combat-hp-bizq" style="display:grid; grid-template-columns:repeat(2, 1fr); gap:2px; margin-top:5px; max-width:40px;">
                        ${generarCuadrados(hp.bizq, 'bizq', 2)}
                    </div>
                </div>
                
                <!-- TORSO -->
                <div class="combat-loc-box">
                    <span class="combat-loc-name">TORSO</span>
                    <div id="combat-hp-torso" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:2px; margin-top:5px; max-width:60px; margin-left:auto; margin-right:auto;">
                        ${generarCuadrados(hp.torso, 'torso', 3)}
                    </div>
                </div>
                
                <!-- BRAZO DERECHO -->
                <div class="combat-loc-box">
                    <span class="combat-loc-name">B.DER</span>
                    <div id="combat-hp-bder" style="display:grid; grid-template-columns:repeat(2, 1fr); gap:2px; margin-top:5px; max-width:40px;">
                        ${generarCuadrados(hp.bder, 'bder', 2)}
                    </div>
                </div>
            </div>
            
            <!-- PIERNAS - Fila inferior -->
            <div style="display:flex; gap:25px; justify-content:center;">
                <!-- PIERNA IZQUIERDA -->
                <div class="combat-loc-box">
                    <span class="combat-loc-name">P.IZQ</span>
                    <div id="combat-hp-pizq" style="display:grid; grid-template-columns:repeat(2, 1fr); gap:2px; margin-top:5px; max-width:40px;">
                        ${generarCuadrados(hp.pizq, 'pizq', 2)}
                    </div>
                </div>
                
                <!-- PIERNA DERECHA -->
                <div class="combat-loc-box">
                    <span class="combat-loc-name">P.DER</span>
                    <div id="combat-hp-pder" style="display:grid; grid-template-columns:repeat(2, 1fr); gap:2px; margin-top:5px; max-width:40px;">
                        ${generarCuadrados(hp.pder, 'pder', 2)}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    panel.style.display = 'block';
    console.log(`🩸 Silueta HP generada: Cabeza=${hp.cabeza}, Brazos=${hp.bizq}, Torso=${hp.torso}, Piernas=${hp.pizq}`);
}

/**
 * Toggle daño en cuadrado
 */
function toggleDanoCombate(el) {
    el.classList.toggle('damaged');
    if (el.classList.contains('damaged')) {
        el.style.background = '#7f1d1d';
        el.style.borderColor = '#ef4444';
    } else {
        el.style.background = '#1a4a1a';
        el.style.borderColor = '#4ade80';
    }
}

/**
 * Genera panel de armas
 */
function generarPanelArmas(character) {
    const panel = document.getElementById('combat-weapons-panel');
    const list = document.getElementById('combat-weapons-list');
    if (!panel || !list) return;
    
    // Las armas se guardan como array de {select: "índice", munActual: "valor"}
    const armasData = character.armas || [];
    window.combatLoadedWeapons = [];
    
    // Filtrar armas válidas (que tengan un índice seleccionado)
    const armasValidas = armasData.filter(a => a && a.select && a.select !== '' && a.select !== '0');
    
    if (armasValidas.length === 0) {
        list.innerHTML = '<div style="color: #666; font-style: italic; padding: 10px;">Sin armas equipadas</div>';
        panel.style.display = 'block';
        return;
    }
    
    // Verificar que existe INFANTRY_WEAPON_TABLE
    if (typeof INFANTRY_WEAPON_TABLE === 'undefined') {
        list.innerHTML = '<div style="color: #ff6b6b; padding: 10px;">Error: Base de datos de armas no encontrada</div>';
        panel.style.display = 'block';
        console.error('❌ INFANTRY_WEAPON_TABLE no está definido');
        return;
    }
    
    let html = '';
    armasValidas.forEach((arma, idx) => {
        const weaponIndex = parseInt(arma.select);
        const weaponData = INFANTRY_WEAPON_TABLE[weaponIndex];
        
        if (!weaponData) {
            console.warn(`⚠️ Arma con índice ${weaponIndex} no encontrada`);
            return;
        }
        
        const nombre = weaponData.name || 'Arma desconocida';
        const munMax = weaponData.car || '∞';
        const munActual = arma.munActual || munMax;
        const tipo = weaponData.tipo || '';
        const dmg = weaponData.dmg || '?';
        
        window.combatLoadedWeapons.push({
            nombre: nombre,
            data: weaponData,
            munActual: munActual
        });
        
        const realIdx = window.combatLoadedWeapons.length - 1;
        
        html += `
            <div class="combat-weapon-row" data-index="${realIdx}" onclick="seleccionarArma('${nombre.replace(/'/g, "\\'")}', ${realIdx})" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: rgba(0,0,0,0.4); border: 1px solid #3a2a1a; cursor: pointer; transition: all 0.2s;">
                <div>
                    <span style="color: #e0e0e0; font-size: 12px;">${nombre}</span>
                    <span style="color: #60a5fa; font-size: 10px; margin-left: 8px;">[${tipo}]</span>
                </div>
                <div style="display: flex; gap: 12px; align-items: center; font-size: 10px;">
                    <span style="color: #f59e0b;">DMG: <span class="weapon-dmg">${dmg}</span></span>
                    <span style="color: #4ade80;">MUN: <span class="weapon-mun">${munActual}/${munMax}</span></span>
                    <button onclick="recargarArma('${nombre.replace(/'/g, "\\'")}', event)" style="background: none; border: 1px solid #f59e0b; color: #f59e0b; padding: 2px 6px; font-size: 9px; cursor: pointer;">🔄</button>
                </div>
            </div>
        `;
    });
    
    if (html === '') {
        list.innerHTML = '<div style="color: #666; font-style: italic; padding: 10px;">Sin armas equipadas</div>';
    } else {
        list.innerHTML = html;
    }
    
    panel.style.display = 'block';
    console.log(`🔫 ${window.combatLoadedWeapons.length} armas cargadas`);
}

/**
 * Selecciona un arma
 */
function seleccionarArma(nombre, idx) {
    window.combatSelectedWeapon = nombre;
    window.combatSelectedWeaponIndex = idx;
    
    // Visual - resaltar arma seleccionada
    document.querySelectorAll('.combat-weapon-row').forEach((row, i) => {
        if (i === idx) {
            row.style.background = 'rgba(74, 222, 128, 0.15)';
            row.style.borderColor = '#4ade80';
            row.style.boxShadow = '0 0 10px rgba(74, 222, 128, 0.3)';
        } else {
            row.style.background = 'rgba(0,0,0,0.4)';
            row.style.borderColor = '#3a2a1a';
            row.style.boxShadow = 'none';
        }
    });
    
    // Leer modificador especial del arma (ej: "-2 Impactar")
    const weapon = window.combatLoadedWeapons[idx];
    window.combatWeaponMod = 0; // Reset
    
    if (weapon?.data?.especial) {
        const especial = weapon.data.especial;
        // Buscar patrones como "-2 Impactar", "+1 Impactar", "-3", etc.
        const match = especial.match(/([+-]?\d+)\s*(?:Impactar|a Impactar)?/i);
        if (match) {
            window.combatWeaponMod = parseInt(match[1]);
            console.log(`⚡ Modificador especial: ${especial} → ${window.combatWeaponMod}`);
        }
    }
    
    // Auto-seleccionar habilidad correspondiente basándose en el campo "tipo" del arma
    const skillDisplay = document.getElementById('combat-skill-display');
    const select = document.getElementById('combat-skill-select');
    
    if (weapon?.data?.tipo && select) {
        const tipoArma = weapon.data.tipo; // "Pistola", "Rifle", "Arco", etc.
        
        console.log(`🔫 Arma: ${nombre}, Tipo: ${tipoArma}`);
        console.log(`🔍 Buscando habilidad entre ${select.options.length} opciones...`);
        
        // Mapeo de tipo de arma a posibles nombres de habilidad
        const mapeoTipoHabilidad = {
            'pistola': ['armas pequeñas', 'pistola', 'small arms'],
            'rifle': ['rifle', 'rifles'],
            'arco': ['arco', 'bow'],
            'apoyo': ['armas de apoyo', 'support weapons']
        };
        
        const tipoLower = tipoArma.toLowerCase();
        const posiblesNombres = mapeoTipoHabilidad[tipoLower] || [tipoLower];
        
        let encontrada = false;
        for (let i = 0; i < select.options.length; i++) {
            const skillName = select.options[i].dataset?.skillName || '';
            const skillNameLower = skillName.toLowerCase();
            
            // Buscar coincidencia con cualquiera de los posibles nombres
            for (const posible of posiblesNombres) {
                if (skillNameLower.includes(posible)) {
                    select.selectedIndex = i;
                    encontrada = true;
                    
                    const tirValue = select.options[i].value;
                    
                    // Actualizar display de habilidad
                    if (skillDisplay) {
                        skillDisplay.innerHTML = `<span style="color: #4ade80; font-style: normal;">${skillName}</span>`;
                    }
                    
                    console.log(`✅ Habilidad encontrada: ${skillName} (TIR: ${tirValue})`);
                    break;
                }
            }
            if (encontrada) break;
        }
        
        if (!encontrada) {
            console.log(`⚠️ No se encontró habilidad para tipo: ${tipoArma}`);
            console.log(`   Opciones disponibles:`, Array.from(select.options).map(o => o.dataset?.skillName));
            if (skillDisplay) {
                skillDisplay.innerHTML = `<span style="color: #f59e0b;">⚠️ Sin habilidad de ${tipoArma}</span>`;
            }
        }
    }
    
    // Actualizar display del arma
    document.getElementById('combat-selected-weapon-display').textContent = `🔫 ${nombre}`;
    
    // Actualizar modificador y recalcular TN
    actualizarModificadorArma();
    actualizarCalculoCombate();
}

function actualizarModificadorArma() {
    const display = document.getElementById('combat-weapon-mod-display');
    if (display) {
        const mod = window.combatWeaponMod || 0;
        display.textContent = mod >= 0 ? `+${mod}` : mod;
        display.style.color = mod < 0 ? '#4ade80' : (mod > 0 ? '#ff6b6b' : '#888');
    }
}

/**
 * Selección de opciones radio
 */
function seleccionarOpcionCombate(el, group) {
    const container = el.parentElement;
    
    container.querySelectorAll('.combat-radio-option').forEach(opt => {
        opt.classList.remove('selected');
        opt.style.background = 'rgba(0, 0, 0, 0.3)';
        opt.style.borderColor = '#333';
        const indicator = opt.querySelector('.combat-radio-indicator');
        if (indicator) {
            indicator.style.borderColor = '#666';
            indicator.style.background = 'transparent';
        }
        const valueSpan = opt.querySelector('span:last-of-type');
        if (valueSpan) valueSpan.style.color = '#888';
    });
    
    el.classList.add('selected');
    el.style.background = 'rgba(0, 100, 0, 0.2)';
    el.style.borderColor = '#2d5a2d';
    const indicator = el.querySelector('.combat-radio-indicator');
    if (indicator) {
        indicator.style.borderColor = '#4ade80';
        indicator.style.background = '#4ade80';
    }
    const valueSpan = el.querySelector('span:last-of-type');
    if (valueSpan) valueSpan.style.color = '#4ade80';
    
    const radio = el.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;
    
    actualizarCalculoCombate();
}

function resetearSeleccionesCombate() {
    ['combat-range-group', 'combat-mov-self-group', 'combat-mov-target-group'].forEach(id => {
        const group = document.getElementById(id);
        if (!group) return;
        const opts = group.querySelectorAll('.combat-radio-option');
        opts.forEach((opt, i) => {
            if (i === 0) {
                opt.classList.add('selected');
                opt.style.background = 'rgba(0, 100, 0, 0.2)';
                opt.style.borderColor = '#2d5a2d';
                const ind = opt.querySelector('.combat-radio-indicator');
                if (ind) { ind.style.borderColor = '#4ade80'; ind.style.background = '#4ade80'; }
                const val = opt.querySelector('span:last-of-type');
                if (val) val.style.color = '#4ade80';
                const radio = opt.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;
            } else {
                opt.classList.remove('selected');
                opt.style.background = 'rgba(0, 0, 0, 0.3)';
                opt.style.borderColor = '#333';
                const ind = opt.querySelector('.combat-radio-indicator');
                if (ind) { ind.style.borderColor = '#666'; ind.style.background = 'transparent'; }
                const val = opt.querySelector('span:last-of-type');
                if (val) val.style.color = '#888';
            }
        });
    });
    
    document.getElementById('combat-skill-select').selectedIndex = 0;
    
    // Resetear display de habilidad
    const skillDisplay = document.getElementById('combat-skill-display');
    if (skillDisplay) {
        skillDisplay.innerHTML = '<span style="color: #666; font-style: italic;">Selecciona un arma...</span>';
    }
    
    window.combatSelectedWeapon = null;
    window.combatWeaponMod = 0;
    document.getElementById('combat-selected-weapon-display').textContent = '';
    actualizarCalculoCombate();
}

function resetearMovimientosCombate() {
    ['combat-mov-self-group', 'combat-mov-target-group'].forEach(id => {
        const group = document.getElementById(id);
        if (!group) return;
        const opts = group.querySelectorAll('.combat-radio-option');
        opts.forEach((opt, i) => {
            if (i === 0) {
                opt.classList.add('selected');
                opt.style.background = 'rgba(0, 100, 0, 0.2)';
                opt.style.borderColor = '#2d5a2d';
                const ind = opt.querySelector('.combat-radio-indicator');
                if (ind) { ind.style.borderColor = '#4ade80'; ind.style.background = '#4ade80'; }
                const val = opt.querySelector('span:last-of-type');
                if (val) val.style.color = '#4ade80';
                const radio = opt.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;
            } else {
                opt.classList.remove('selected');
                opt.style.background = 'rgba(0, 0, 0, 0.3)';
                opt.style.borderColor = '#333';
                const ind = opt.querySelector('.combat-radio-indicator');
                if (ind) { ind.style.borderColor = '#666'; ind.style.background = 'transparent'; }
                const val = opt.querySelector('span:last-of-type');
                if (val) val.style.color = '#888';
            }
        });
    });
    actualizarCalculoCombate();
}

/**
 * Calcula TN
 */
/**
 * Calcula TN final
 */
function actualizarCalculoCombate() {
    const select = document.getElementById('combat-skill-select');
    const tirBase = parseInt(select?.value) || 0;
    const range = parseInt(document.querySelector('input[name="combat-range"]:checked')?.value) || 0;
    const movSelf = parseInt(document.querySelector('input[name="combat-mov-self"]:checked')?.value) || 0;
    const movTarget = parseInt(document.querySelector('input[name="combat-mov-target"]:checked')?.value) || 0;
    const weaponMod = window.combatWeaponMod || 0;
    
    // Mostrar TIR base
    const tirDisplay = document.getElementById('result-tir-base');
    if (tirDisplay) {
        tirDisplay.textContent = tirBase || '--';
        tirDisplay.style.color = tirBase > 0 ? '#38bdf8' : '#666';
    }
    
    // Mostrar modificadores
    document.getElementById('result-range').textContent = `+${range}`;
    document.getElementById('result-mov-self').textContent = `+${movSelf}`;
    document.getElementById('result-mov-target').textContent = `+${movTarget}`;
    
    // Mostrar mod arma (puede ser negativo = bonus)
    const modArmaDisplay = document.getElementById('combat-weapon-mod-display');
    if (modArmaDisplay) {
        modArmaDisplay.textContent = weaponMod >= 0 ? `+${weaponMod}` : `${weaponMod}`;
        // Verde si es bonus (negativo), rojo si es penalización (positivo)
        modArmaDisplay.style.color = weaponMod < 0 ? '#4ade80' : (weaponMod > 0 ? '#ff6b6b' : '#888');
    }
    
    // Calcular y mostrar TN final
    const tnFinal = document.getElementById('result-tn-final');
    if (tirBase > 0) {
        const total = tirBase + range + movSelf + movTarget + weaponMod;
        tnFinal.textContent = total;
        tnFinal.style.color = '#ff4444';
        tnFinal.style.textShadow = '0 0 30px rgba(255, 68, 68, 0.6)';
    } else {
        tnFinal.textContent = '--';
        tnFinal.style.color = '#666';
        tnFinal.style.textShadow = 'none';
    }
    
    console.log(`📊 Cálculo: TIR=${tirBase} + Alcance=${range} + MiMov=${movSelf} + MovObj=${movTarget} + ModArma=${weaponMod}`);
}

/**
 * Registra disparo
 */
function registrarDisparo() {
    const select = document.getElementById('combat-skill-select');
    const tn = document.getElementById('result-tn-final').textContent;
    
    if (tn === '--' || !select?.value) {
        agregarAlLog('⚠️ Selecciona habilidad primero', '#ff6b6b');
        return;
    }
    
    const habilidad = select.options[select.selectedIndex]?.dataset?.skillName || 'Habilidad';
    const arma = window.combatSelectedWeapon || 'Sin arma';
    let munMsg = '';
    
    // Restar munición si hay arma seleccionada
    if (window.combatSelectedWeapon && window.combatLoadedWeapons.length > 0) {
        const weapon = window.combatLoadedWeapons.find(w => w.nombre === window.combatSelectedWeapon);
        if (weapon) {
            const mun = parseInt(weapon.munActual) || 0;
            if (mun > 0) {
                weapon.munActual = mun - 1;
                munMsg = ` [${weapon.munActual}/${weapon.data?.car || '?'}]`;
                actualizarMunicionEnPanel();
            } else {
                agregarAlLog(`⚠️ ¡${arma} sin munición! Recarga`, '#ff6b6b');
                return;
            }
        }
    }
    
    // Registrar en log
    agregarAlLog(`🎯 ${arma} (${habilidad}) → TN ${tn}${munMsg}`, '#4ade80');
}

function actualizarMunicionEnPanel() {
    document.querySelectorAll('.combat-weapon-row').forEach((row, i) => {
        if (i < window.combatLoadedWeapons.length) {
            const w = window.combatLoadedWeapons[i];
            const munSpan = row.querySelector('.weapon-mun');
            if (munSpan && w) {
                const maxMun = w.data?.car || '?';
                munSpan.textContent = `${w.munActual}/${maxMun}`;
                munSpan.style.color = parseInt(w.munActual) <= 2 ? '#ef4444' : '#4ade80';
            }
        }
    });
}

function siguienteTurno() {
    window.combatTurnNumber++;
    document.getElementById('combat-turn-counter').textContent = `Turno ${window.combatTurnNumber}`;
    agregarAlLog(`═══ TURNO ${window.combatTurnNumber} ═══`, '#f59e0b');
    resetearMovimientosCombate();
}

function agregarAlLog(msg, color = '#e0e0e0') {
    const log = document.getElementById('combat-log');
    if (!log) return;
    
    const placeholder = log.querySelector('div[style*="italic"]');
    if (placeholder) placeholder.remove();
    
    const time = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const entry = document.createElement('div');
    entry.style.cssText = `color: ${color}; padding: 2px 0; border-bottom: 1px solid #222;`;
    entry.innerHTML = `<span style="color: #666;">[${time}]</span> ${msg}`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
    
    window.combatLogEntries.push({ time, msg, color });
}

function limpiarLogCombate() {
    document.getElementById('combat-log').innerHTML = '<div style="color: #666; font-style: italic;">Sin acciones registradas...</div>';
    window.combatLogEntries = [];
    window.combatTurnNumber = 1;
    document.getElementById('combat-turn-counter').textContent = 'Turno 1';
    
    // Restaurar munición de todas las armas
    window.combatLoadedWeapons.forEach(w => { 
        const maxMun = parseInt(w.data?.car) || 0;
        w.munActual = maxMun; 
    });
    actualizarMunicionEnPanel();
}

function limpiarDanosCombate() {
    let count = 0;
    document.querySelectorAll('#combat-silueta-container .combat-hp-box.damaged').forEach(el => {
        el.classList.remove('damaged');
        el.style.background = '#1a4a1a';
        el.style.borderColor = '#4ade80';
        count++;
    });
    agregarAlLog(count > 0 ? `💚 ${count} daños limpiados` : 'ℹ️ Sin daños', count > 0 ? '#4ade80' : '#888');
}

function recargarArma(nombre, ev) {
    if (ev) ev.stopPropagation();
    const w = window.combatLoadedWeapons.find(x => x.nombre === nombre);
    if (w) {
        const antes = parseInt(w.munActual) || 0;
        const max = parseInt(w.data?.car) || 0;
        if (antes < max) {
            w.munActual = max;
            actualizarMunicionEnPanel();
            agregarAlLog(`🔄 ${nombre} (${antes}→${max})`, '#f59e0b');
        } else {
            agregarAlLog(`⚠️ ${nombre} al máximo`, '#888');
        }
    }
}

function recopilarDatosCombate() {
    const datos = { jugador: window.combatCurrentCharacter?.jugador, personaje: window.combatCurrentCharacter?.nombre, danos: {}, municionGastada: [] };
    ['cabeza', 'bizq', 'torso', 'bder', 'pizq', 'pder'].forEach(ubi => {
        const cont = document.getElementById(`combat-hp-${ubi}`);
        if (cont) {
            datos.danos[ubi] = { total: cont.querySelectorAll('.combat-hp-box').length, danados: cont.querySelectorAll('.combat-hp-box.damaged').length };
        }
    });
    window.combatLoadedWeapons.forEach(w => {
        const max = parseInt(w.data?.car) || 0;
        const act = parseInt(w.munActual) || 0;
        if (max - act > 0) datos.municionGastada.push({ arma: w.nombre, gastada: max - act, restante: act, maximo: max });
    });
    return datos;
}

function ajustarPXCombate(n) {
    const input = document.getElementById('combat-px-ganados');
    let val = parseInt(input.value) || 0;
    val = Math.max(0, val + n);
    input.value = val;
    if (n !== 0) agregarAlLog(`⭐ PX ${n > 0 ? '+' : ''}${n} (Total: ${val})`, '#f59e0b');
}

function irARegistroCombate() {
    const px = parseInt(document.getElementById('combat-px-ganados')?.value) || 0;
    window.datosCombateGuardados = recopilarDatosCombate();
    console.log('💾 Datos guardados:', window.datosCombateGuardados);
    cerrarCalculadorCombate();
    if (typeof abrirModalRecompensas === 'function') abrirModalRecompensas();
    else if (typeof goToRegistroCombate === 'function') goToRegistroCombate();
    
    if (px > 0 && window.combatCurrentCharacter?.jugador) {
        const jug = window.combatCurrentCharacter.jugador.toLowerCase();
        let id = jug.includes('marcos') ? 'xp-marcos' : jug.includes('jaime') ? 'xp-jaime' : jug.includes('joan') ? 'xp-joan' : jug.includes('juan') ? 'xp-juan' : null;
        if (id) setTimeout(() => {
            const inp = document.getElementById(id);
            if (inp) { inp.value = (parseInt(inp.value) || 0) + px; inp.style.boxShadow = '0 0 20px rgba(74, 222, 128, 0.8)'; setTimeout(() => { inp.style.boxShadow = ''; }, 2000); }
        }, 100);
    }
}

function pedirPasswordConfig() {
    const password = prompt('🔐 Contraseña de configuración:');
    if (password === 'Mark') {
        toggleCombatConfig();
    } else if (password !== null) {
        alert('❌ Contraseña incorrecta');
    }
}

function toggleCombatConfig() {
    const p = document.getElementById('combat-config-panel');
    p.style.display = p.style.display === 'none' ? 'block' : 'none';
}

function guardarConfigCombate() {
    const config = {
        // Distancia
        rangeShort: parseInt(document.getElementById('config-range-short')?.value) || 0,
        rangeMedium: parseInt(document.getElementById('config-range-medium')?.value) || 2,
        rangeLong: parseInt(document.getElementById('config-range-long')?.value) || 4,
        // Mi Movimiento
        movStand: parseInt(document.getElementById('config-mov-stand')?.value) || 0,
        movWalk: parseInt(document.getElementById('config-mov-walk')?.value) || 1,
        movRun: parseInt(document.getElementById('config-mov-run')?.value) || 2,
        movJump: parseInt(document.getElementById('config-mov-jump')?.value) || 3,
        // Movimiento Enemigo
        movTargetStand: parseInt(document.getElementById('config-mov-target-stand')?.value) || 0,
        movTargetWalk: parseInt(document.getElementById('config-mov-target-walk')?.value) || 1,
        movTargetRun: parseInt(document.getElementById('config-mov-target-run')?.value) || 2,
        movTargetJump: parseInt(document.getElementById('config-mov-target-jump')?.value) || 3
    };
    localStorage.setItem('combatConfig', JSON.stringify(config));
    
    // Aplicar a los botones de radio
    aplicarConfigARadios(config);
    
    agregarAlLog('💾 Config guardada', '#4ade80');
    toggleCombatConfig();
}

function resetearConfigCombate() {
    const defaultConfig = {
        // Distancia
        rangeShort: 0,
        rangeMedium: 2,
        rangeLong: 4,
        // Mi Movimiento
        movStand: 0,
        movWalk: 1,
        movRun: 2,
        movJump: 3,
        // Movimiento Enemigo
        movTargetStand: 0,
        movTargetWalk: 1,
        movTargetRun: 2,
        movTargetJump: 3
    };
    
    // Distancia
    document.getElementById('config-range-short').value = defaultConfig.rangeShort;
    document.getElementById('config-range-medium').value = defaultConfig.rangeMedium;
    document.getElementById('config-range-long').value = defaultConfig.rangeLong;
    // Mi Movimiento
    document.getElementById('config-mov-stand').value = defaultConfig.movStand;
    document.getElementById('config-mov-walk').value = defaultConfig.movWalk;
    document.getElementById('config-mov-run').value = defaultConfig.movRun;
    document.getElementById('config-mov-jump').value = defaultConfig.movJump;
    // Movimiento Enemigo
    document.getElementById('config-mov-target-stand').value = defaultConfig.movTargetStand;
    document.getElementById('config-mov-target-walk').value = defaultConfig.movTargetWalk;
    document.getElementById('config-mov-target-run').value = defaultConfig.movTargetRun;
    document.getElementById('config-mov-target-jump').value = defaultConfig.movTargetJump;
    
    localStorage.removeItem('combatConfig');
    
    // Aplicar a los botones de radio
    aplicarConfigARadios(defaultConfig);
    
    agregarAlLog('🔄 Config reseteada', '#f59e0b');
}

function cargarConfigCombate() {
    const saved = localStorage.getItem('combatConfig');
    let config = {
        // Distancia
        rangeShort: 0,
        rangeMedium: 2,
        rangeLong: 4,
        // Mi Movimiento
        movStand: 0,
        movWalk: 1,
        movRun: 2,
        movJump: 3,
        // Movimiento Enemigo
        movTargetStand: 0,
        movTargetWalk: 1,
        movTargetRun: 2,
        movTargetJump: 3
    };
    
    if (saved) {
        try {
            const c = JSON.parse(saved);
            config = {
                rangeShort: c.rangeShort ?? 0,
                rangeMedium: c.rangeMedium ?? 2,
                rangeLong: c.rangeLong ?? 4,
                movStand: c.movStand ?? 0,
                movWalk: c.movWalk ?? 1,
                movRun: c.movRun ?? 2,
                movJump: c.movJump ?? 3,
                movTargetStand: c.movTargetStand ?? 0,
                movTargetWalk: c.movTargetWalk ?? 1,
                movTargetRun: c.movTargetRun ?? 2,
                movTargetJump: c.movTargetJump ?? 3
            };
        } catch(e) {}
    }
    
    // Cargar en inputs de config - Distancia
    document.getElementById('config-range-short').value = config.rangeShort;
    document.getElementById('config-range-medium').value = config.rangeMedium;
    document.getElementById('config-range-long').value = config.rangeLong;
    // Mi Movimiento
    document.getElementById('config-mov-stand').value = config.movStand;
    document.getElementById('config-mov-walk').value = config.movWalk;
    document.getElementById('config-mov-run').value = config.movRun;
    document.getElementById('config-mov-jump').value = config.movJump;
    // Movimiento Enemigo
    if (document.getElementById('config-mov-target-stand')) {
        document.getElementById('config-mov-target-stand').value = config.movTargetStand;
        document.getElementById('config-mov-target-walk').value = config.movTargetWalk;
        document.getElementById('config-mov-target-run').value = config.movTargetRun;
        document.getElementById('config-mov-target-jump').value = config.movTargetJump;
    }
    
    // Aplicar a los botones de radio
    aplicarConfigARadios(config);
}

/**
 * Aplica la configuración a los botones de radio del calculador
 */
function aplicarConfigARadios(config) {
    // Función helper para actualizar un radio
    const actualizarRadio = (radio, nuevoValor) => {
        radio.value = nuevoValor;
        const label = radio.closest('label');
        if (label) {
            // El span del modificador es hijo directo del label (no está dentro del div)
            const children = Array.from(label.children);
            const modSpan = children.find(el => el.tagName === 'SPAN');
            if (modSpan) {
                modSpan.textContent = '+' + nuevoValor;
            }
        }
    };
    
    // Alcance
    const rangeRadios = document.querySelectorAll('input[name="combat-range"]');
    const rangeValues = [config.rangeShort, config.rangeMedium, config.rangeLong];
    rangeRadios.forEach((radio, idx) => actualizarRadio(radio, rangeValues[idx]));
    
    // Mi Movimiento
    const movSelfRadios = document.querySelectorAll('input[name="combat-mov-self"]');
    const movSelfValues = [config.movStand, config.movWalk, config.movRun, config.movJump];
    movSelfRadios.forEach((radio, idx) => actualizarRadio(radio, movSelfValues[idx]));
    
    // Movimiento Enemigo (usa valores separados)
    const movTargetRadios = document.querySelectorAll('input[name="combat-mov-target"]');
    const movTargetValues = [
        config.movTargetStand ?? config.movStand, 
        config.movTargetWalk ?? config.movWalk, 
        config.movTargetRun ?? config.movRun, 
        config.movTargetJump ?? config.movJump
    ];
    movTargetRadios.forEach((radio, idx) => actualizarRadio(radio, movTargetValues[idx]));
    
    // Recalcular
    actualizarCalculoCombate();
    console.log('⚙️ Config aplicada a radios:', config);
}

console.log('⚔️ Combat Calculator cargado');


// ============================================================
// MODAL DE QUIRKS
// ============================================================
let quirkModalPlayer = null;
let quirkFiltroActual = 'todos';

function abrirModalQuirk(player) {
    quirkModalPlayer = player;
    document.getElementById('quirk-modal-player').textContent = player.toUpperCase();
    // Prerellenar con el mech del personaje si está disponible
    const mechField = document.getElementById('mech-output');
    if (mechField && mechField.value) {
        document.getElementById('quirk-mech-input').value = mechField.value;
    } else {
        document.getElementById('quirk-mech-input').value = '';
    }
    filtrarQuirks('todos');
    document.getElementById('modal-quirk').style.display = 'block';
}

function cerrarModalQuirk() {
    document.getElementById('modal-quirk').style.display = 'none';
    quirkModalPlayer = null;
}

function filtrarQuirks(tipo) {
    quirkFiltroActual = tipo;
    // Actualizar estilos de botones de filtro
    document.querySelectorAll('.qfilter-btn').forEach(b => {
        b.style.background = 'transparent';
        b.style.borderColor = '#333';
        b.style.color = '#666';
    });
    const activeBtn = document.getElementById('qfilter-' + tipo);
    if (activeBtn) {
        activeBtn.style.background = 'rgba(255,174,0,0.2)';
        activeBtn.style.borderColor = '#ffae00';
        activeBtn.style.color = '#ffae00';
    }

    const lista = document.getElementById('quirk-lista');
    let quirks = [];
    if (tipo === 'todos') {
        quirks = [
            ...QUIRKS_DATABASE.positivos.map(q => ({...q, tipo:'positivo'})),
            ...QUIRKS_DATABASE.negativos.map(q => ({...q, tipo:'negativo'}))
        ];
    } else {
        quirks = QUIRKS_DATABASE[tipo].map(q => ({...q, tipo: tipo === 'positivos' ? 'positivo' : 'negativo'}));
    }

    lista.innerHTML = quirks.map(q => {
        const colorBorde = q.tipo === 'positivo' ? '#00ff41' : '#ff8c42';
        const colorTipo = q.tipo === 'positivo' ? '#00ff41' : '#ff8c42';
        const labelTipo = q.tipo === 'positivo' ? '▲ POS' : '▼ NEG';
        return `
        <div onclick="confirmarQuirk('${q.id}', '${q.nombre.replace(/'/g,"\\'")}', '${q.tipo}')"
            style="display:flex; align-items:center; gap:10px; padding:8px 10px;
            background:rgba(0,0,0,0.5); border:1px solid ${colorBorde}22;
            cursor:pointer; transition:all 0.15s;"
            onmouseover="this.style.background='rgba(0,0,0,0.8)'; this.style.borderColor='${colorBorde}';"
            onmouseout="this.style.background='rgba(0,0,0,0.5)'; this.style.borderColor='${colorBorde}22';">
            <span style="color:${colorTipo}; font-size:0.65em; min-width:38px;">${labelTipo}</span>
            <div style="flex:1;">
                <div style="color:#e0e0e0; font-size:0.85em; font-weight:bold;">${q.nombre}</div>
                <div style="color:#888; font-size:0.7em; margin-top:1px;">${q.efecto}</div>
            </div>
            <span style="color:#ffae00; font-size:0.75em; white-space:nowrap;">1000 XP →</span>
        </div>`;
    }).join('');
}

function confirmarQuirk(id, nombre, tipo) {
    const mech = document.getElementById('quirk-mech-input').value.trim();
    if (!mech) {
        alert('Introduce el modelo del mech antes de seleccionar el quirk.');
        document.getElementById('quirk-mech-input').focus();
        return;
    }
    const player = quirkModalPlayer;
    if (!player) return;

    const esPositivo = tipo === 'positivo';
    const efecto = esPositivo ? 'Coste: 1.000 XP' : 'Defecto: recibes 1.000 XP';
    if (!confirm(`¿Confirmar "${nombre}" para ${player} (${mech})?\n${efecto}`)) return;

    // Registrar el quirk
    if (!quirksComprados[player]) quirksComprados[player] = [];
    quirksComprados[player].push({ id, nombre, mech, tipo });

    // Aplicar efecto XP directamente en barracones si el jugador es el cargado
    const jugadorActual = _obtenerJugadorActual && _obtenerJugadorActual();
    if (jugadorActual && jugadorActual.toLowerCase() === player.toLowerCase()) {
        const inputXP = document.getElementById('barr-xp-disponible');
        if (inputXP) {
            const xpActual = parseInt(inputXP.value) || 0;
            inputXP.value = esPositivo ? Math.max(0, xpActual - 1000) : xpActual + 1000;
            if (typeof actualizarDisplayXP === 'function') actualizarDisplayXP();
        }
    }

    // Actualizar el tracker de gastos (solo para positivos cuenta como gasto)
    if (esPositivo) {
        expenseTracker[player].quirks = (expenseTracker[player].quirks || 0) + 1;
    } else {
        // Negativo: registrar como "ingreso" (cantidad negativa en el tracker)
        expenseTracker[player].quirksNegativos = (expenseTracker[player].quirksNegativos || 0) + 1;
    }
    actualizarTotalGastado(player);

    // Actualizar panel 07 en barracones
    const datosActuales = typeof datosPersonajeBarracones !== 'undefined' ? datosPersonajeBarracones : {};
    if (typeof renderizarRasgosBarracones === 'function') renderizarRasgosBarracones(datosActuales);

    cerrarModalQuirk();
}

// ============================================================
// RENDERIZADO DE RASGOS Y QUIRKS EN BARRACONES
// ============================================================
function renderizarRasgosBarracones(datos) {
    // Méritos
    const meritosEl = document.getElementById('barr-meritos-lista');
    if (meritosEl) {
        const meritsValidos = (datos.merits || []).filter(m => m && m.trim() !== '');
        meritosEl.innerHTML = meritsValidos.length > 0
            ? meritsValidos.map(m =>
                `<span style="background:rgba(0,255,65,0.08); border:1px solid #4ade8066;
                color:#4ade80; font-size:0.7em; padding:2px 7px;
                font-family:'Share Tech Mono',monospace;">✦ ${m}</span>`
              ).join('')
            : '<span style="color:#555; font-size:0.75em; font-style:italic;">Sin méritos registrados</span>';
    }

    // Defectos
    const defectosEl = document.getElementById('barr-defectos-lista');
    if (defectosEl) {
        const demeritsValidos = (datos.demerits || []).filter(d => d && d.trim() !== '');
        defectosEl.innerHTML = demeritsValidos.length > 0
            ? demeritsValidos.map(d =>
                `<span style="background:rgba(255,140,66,0.08); border:1px solid #ff8c4266;
                color:#ff8c42; font-size:0.7em; padding:2px 7px;
                font-family:'Share Tech Mono',monospace;">✦ ${d}</span>`
              ).join('')
            : '<span style="color:#555; font-size:0.75em; font-style:italic;">Sin defectos registrados</span>';
    }

    // Quirks comprados (del historial guardado + los de esta sesión)
    const quirksEl = document.getElementById('barr-quirks-lista');
    if (quirksEl) {
        const jugador = datos.jugador || document.getElementById('barr-callsign')?.value || '';
        const quirksPersonaje = [
            ...(datos.quirksComprados || []),
            ...(quirksComprados[jugador] || [])
        ];
        // Deduplicar por id+mech
        const vistos = new Set();
        const quirksUnicos = quirksPersonaje.filter(q => {
            const key = q.id + '|' + q.mech;
            if (vistos.has(key)) return false;
            vistos.add(key);
            return true;
        });
        if (quirksUnicos.length > 0) {
            quirksEl.innerHTML = quirksUnicos.map(q => {
                const esPosi = q.tipo === 'positivo';
                const borde = esPosi ? '#00ff41' : '#ff8c42';
                const color = esPosi ? '#00ff41' : '#ff8c42';
                const icono = esPosi ? '▲' : '▼';
                return `<div style="display:flex; align-items:flex-start; gap:6px; padding:5px 6px;
                    background:rgba(0,0,0,0.4); border-left:2px solid ${borde}; margin-bottom:4px;">
                    <span style="color:${color}; font-size:0.7em; margin-top:1px;">${icono}</span>
                    <div>
                        <div style="color:${color}; font-size:0.75em; font-weight:bold;">${q.nombre}</div>
                        <div style="color:#555; font-size:0.65em;">${q.mech}</div>
                    </div>
                </div>`;
            }).join('');
        } else {
            quirksEl.innerHTML = '<span style="color:#555; font-size:0.75em; font-style:italic;">Sin quirks adquiridos</span>';
        }
    }
}


// ================================================================
// MECH PARSER — MTF + SSW → MechData unificado
// ================================================================
const MECH_WEAPON_DB = {
  'ISSmallLaser':{'d':'Small Laser','h':1,'dm':'3','r':'1/2/3'},
  'ISMediumLaser':{'d':'Medium Laser','h':3,'dm':'5','r':'3/6/9'},
  'ISLargeLaser':{'d':'Large Laser','h':8,'dm':'8','r':'5/10/15'},
  'ISERSmallLaser':{'d':'ER Small Laser','h':2,'dm':'3','r':'2/4/6'},
  'ISERMediumLaser':{'d':'ER Med Laser','h':5,'dm':'5','r':'4/8/12'},
  'ISERLargeLaser':{'d':'ER Lrg Laser','h':12,'dm':'8','r':'7/14/19'},
  'ISERPPC':{'d':'ER PPC','h':15,'dm':'10','r':'7/14/23'},
  'ISERPPCCanon':{'d':'ER PPC','h':15,'dm':'10','r':'7/14/23'},
  'ISPPC':{'d':'PPC','h':10,'dm':'10','r':'6/12/18'},
  'ISSnPPC':{'d':'Snub PPC','h':10,'dm':'10','r':'3/6/10'},
  'ISMediumPulseLaser':{'d':'Med Pulse Laser','h':4,'dm':'6','r':'2/4/6'},
  'ISLargePulseLaser':{'d':'Lrg Pulse Laser','h':10,'dm':'9','r':'3/7/10'},
  'ISSmallPulseLaser':{'d':'Sm Pulse Laser','h':2,'dm':'3','r':'1/2/3'},
  'ISFlamer':{'d':'Flamer','h':3,'dm':'2','r':'1/2/3'},
  'ISAC2':{'d':'AC/2','h':1,'dm':'2','r':'8/16/24'},'ISAC5':{'d':'AC/5','h':1,'dm':'5','r':'6/12/18'},
  'ISAC10':{'d':'AC/10','h':3,'dm':'10','r':'5/10/15'},'ISAC20':{'d':'AC/20','h':7,'dm':'20','r':'3/6/9'},
  'ISUltraAC2':{'d':'Ultra AC/2','h':1,'dm':'2','r':'9/18/27'},'ISUltraAC5':{'d':'Ultra AC/5','h':1,'dm':'5','r':'7/14/21'},
  'ISUltraAC10':{'d':'Ultra AC/10','h':4,'dm':'10','r':'6/12/18'},'ISUltraAC20':{'d':'Ultra AC/20','h':8,'dm':'20','r':'4/8/12'},
  'ISLBXAC2':{'d':'LBX AC/2','h':1,'dm':'2','r':'9/18/27'},'ISLBXAC5':{'d':'LBX AC/5','h':1,'dm':'5','r':'7/14/21'},
  'ISLBXAC10':{'d':'LBX AC/10','h':2,'dm':'10','r':'6/12/18'},'ISLBXAC20':{'d':'LBX AC/20','h':6,'dm':'20','r':'4/8/12'},
  'ISLightAC2':{'d':'Light AC/2','h':1,'dm':'2','r':'6/12/18'},'ISLightAC5':{'d':'Light AC/5','h':2,'dm':'5','r':'5/10/15'},
  'ISLAC2':{'d':'Light AC/2','h':1,'dm':'2','r':'6/12/18'},'ISLAC5':{'d':'Light AC/5','h':2,'dm':'5','r':'5/10/15'},
  'ISGaussRifle':{'d':'Gauss Rifle','h':1,'dm':'15','r':'7/15/22'},'ISHGaussRifle':{'d':'Heavy Gauss','h':2,'dm':'25','r':'4/8/16'},
  'ISLGaussRifle':{'d':'Light Gauss','h':1,'dm':'8','r':'8/17/25'},'ISMachineGun':{'d':'Machine Gun','h':0,'dm':'2','r':'1/2/3'},
  'ISRotaryAC2':{'d':'RAC/2','h':6,'dm':'2','r':'8/17/25'},'ISRotaryAC5':{'d':'RAC/5','h':6,'dm':'5','r':'5/10/15'},
  'ISLRM5':{'d':'LRM-5','h':2,'dm':'1/m','r':'7/14/21'},'ISLRM10':{'d':'LRM-10','h':4,'dm':'1/m','r':'7/14/21'},
  'ISLRM15':{'d':'LRM-15','h':5,'dm':'1/m','r':'7/14/21'},'ISLRM20':{'d':'LRM-20','h':6,'dm':'1/m','r':'7/14/21'},
  'ISSRM2':{'d':'SRM-2','h':2,'dm':'2/m','r':'3/6/9'},'ISSRM4':{'d':'SRM-4','h':3,'dm':'2/m','r':'3/6/9'},
  'ISSRM6':{'d':'SRM-6','h':4,'dm':'2/m','r':'3/6/9'},
  'ISStreakSRM2':{'d':'Streak SRM-2','h':2,'dm':'2/m','r':'3/6/9'},'ISStreakSRM4':{'d':'Streak SRM-4','h':3,'dm':'2/m','r':'3/6/9'},
  'ISStreakSRM6':{'d':'Streak SRM-6','h':4,'dm':'2/m','r':'3/6/9'},
  'CLERMediumLaser':{'d':'(CL) ER Med Laser','h':5,'dm':'7','r':'5/10/15'},
  'CLERLargeLaser':{'d':'(CL) ER Lrg Laser','h':12,'dm':'10','r':'8/15/25'},
  'CLERPPC':{'d':'(CL) ER PPC','h':15,'dm':'15','r':'7/14/23'},
  'CLGaussRifle':{'d':'(CL) Gauss Rifle','h':1,'dm':'15','r':'7/15/22'},
  'CLUltraAC20':{'d':'(CL) Ultra AC/20','h':7,'dm':'20','r':'4/8/12'},
  'CLSRM6':{'d':'(CL) SRM-6','h':4,'dm':'2/m','r':'3/6/9'},
  'CLStreakSRM6':{'d':'(CL) Streak SRM-6','h':4,'dm':'2/m','r':'3/6/9'},
  'CLLRM20':{'d':'(CL) LRM-20','h':6,'dm':'1/m','r':'7/14/21'},
  'Medium Laser':{'d':'Medium Laser','h':3,'dm':'5','r':'3/6/9'},
  'Large Laser':{'d':'Large Laser','h':8,'dm':'8','r':'5/10/15'},
  'PPC':{'d':'PPC','h':10,'dm':'10','r':'6/12/18'},
  'ER Medium Laser':{'d':'ER Med Laser','h':5,'dm':'5','r':'4/8/12'},
  'ER Large Laser':{'d':'ER Lrg Laser','h':12,'dm':'8','r':'7/14/19'},
  'SRM 2':{'d':'SRM-2','h':2,'dm':'2/m','r':'3/6/9'},'SRM 4':{'d':'SRM-4','h':3,'dm':'2/m','r':'3/6/9'},
  'SRM 6':{'d':'SRM-6','h':4,'dm':'2/m','r':'3/6/9'},
  'LRM 5':{'d':'LRM-5','h':2,'dm':'1/m','r':'7/14/21'},'LRM 10':{'d':'LRM-10','h':4,'dm':'1/m','r':'7/14/21'},
  'LRM 15':{'d':'LRM-15','h':5,'dm':'1/m','r':'7/14/21'},'LRM 20':{'d':'LRM-20','h':6,'dm':'1/m','r':'7/14/21'},
  'Autocannon/2':{'d':'AC/2','h':1,'dm':'2','r':'8/16/24'},'Autocannon/5':{'d':'AC/5','h':1,'dm':'5','r':'6/12/18'},
  'Autocannon/10':{'d':'AC/10','h':3,'dm':'10','r':'5/10/15'},'Autocannon/20':{'d':'AC/20','h':7,'dm':'20','r':'3/6/9'},
  'Gauss Rifle':{'d':'Gauss Rifle','h':1,'dm':'15','r':'7/15/22'},
  'Light AC/2':{'d':'Light AC/2','h':1,'dm':'2','r':'6/12/18'},'Light AC/5':{'d':'Light AC/5','h':2,'dm':'5','r':'5/10/15'},
};
const MECH_IS_TABLE = {
  20:{HD:3,CT:6,LT:5,RT:5,LA:3,RA:3,LL:4,RL:4},25:{HD:3,CT:8,LT:6,RT:6,LA:4,RA:4,LL:6,RL:6},
  30:{HD:3,CT:10,LT:7,RT:7,LA:5,RA:5,LL:7,RL:7},35:{HD:3,CT:11,LT:8,RT:8,LA:6,RA:6,LL:8,RL:8},
  40:{HD:3,CT:12,LT:10,RT:10,LA:6,RA:6,LL:10,RL:10},45:{HD:3,CT:14,LT:11,RT:11,LA:7,RA:7,LL:11,RL:11},
  50:{HD:3,CT:16,LT:12,RT:12,LA:8,RA:8,LL:12,RL:12},55:{HD:3,CT:18,LT:13,RT:13,LA:9,RA:9,LL:13,RL:13},
  60:{HD:3,CT:20,LT:14,RT:14,LA:10,RA:10,LL:14,RL:14},65:{HD:3,CT:21,LT:15,RT:15,LA:10,RA:10,LL:15,RL:15},
  70:{HD:3,CT:22,LT:15,RT:15,LA:11,RA:11,LL:15,RL:15},75:{HD:3,CT:23,LT:16,RT:16,LA:12,RA:12,LL:16,RL:16},
  80:{HD:3,CT:25,LT:17,RT:17,LA:13,RA:13,LL:17,RL:17},85:{HD:3,CT:27,LT:18,RT:18,LA:14,RA:14,LL:18,RL:18},
  90:{HD:3,CT:29,LT:19,RT:19,LA:15,RA:15,LL:19,RL:19},95:{HD:3,CT:30,LT:20,RT:20,LA:16,RA:16,LL:20,RL:20},
  100:{HD:3,CT:31,LT:21,RT:21,LA:17,RA:17,LL:21,RL:21},
};
const HEAT_FX = [
  {at:28,color:'#ff0000',hit:4,mov:-4,label:'SHUTDOWN AUTOMÁTICO'},
  {at:25,color:'#ff2200',hit:3,mov:-3,label:'Riesgo apagado'},
  {at:20,color:'#ff5500',hit:3,mov:-2,label:'+3 disparo'},
  {at:17,color:'#ff8800',hit:2,mov:-2,label:'+2 disparo / −2 mov'},
  {at:14,color:'#ffaa00',hit:2,mov:-1,label:'−1 mov'},
  {at:8,color:'#ffdd00',hit:1,mov:0,label:'+1 disparo'},
  {at:5,color:'#ffff44',hit:0,mov:-1,label:'−1 movimiento'},
  {at:0,color:'#00ff41',hit:0,mov:0,label:'Normal'},
];
function getHFX(h){return HEAT_FX.find(e=>h>=e.at)||HEAT_FX[HEAT_FX.length-1];}

function mwLookup(name){
  if(!name)return null;
  if(MECH_WEAPON_DB[name])return MECH_WEAPON_DB[name];
  const c=name.replace(/^\(IS\)\s*/i,'').replace(/^\(CL\)\s*/i,'').trim();
  if(MECH_WEAPON_DB[c])return MECH_WEAPON_DB[c];
  const n=c.replace(/\s+/g,'').replace(/\//g,'').replace(/-/g,'');
  for(const[k,v]of Object.entries(MECH_WEAPON_DB)){
    if(k.replace(/\s+/g,'').replace(/\//g,'').replace(/-/g,'').toLowerCase()===n.toLowerCase())return v;
  }
  return null;
}
function mwNormLoc(raw){
  const m={'left arm':'LA','right arm':'RA','left torso':'LT','right torso':'RT',
    'center torso':'CT','head':'HD','left leg':'LL','right leg':'RL',
    'la':'LA','ra':'RA','lt':'LT','rt':'RT','ct':'CT','hd':'HD','ll':'LL','rl':'RL'};
  const k=(raw||'').toLowerCase().replace(/\s+/g,'').replace(/\(r\)$/,'');
  return m[k]||m[(raw||'').toLowerCase()]||raw.toUpperCase().slice(0,2);
}

function mechParseMTF(text){
  const lines=text.replace(/\r/g,'').split('\n').map(l=>l.trim());
  let chassis,model;
  if(lines[0].startsWith('Version:')){chassis=lines[1];model=lines[2];}
  else{chassis=kv('chassis');model=kv('model');}
  function kv(key){for(const l of lines)if(l.toLowerCase().startsWith(key.toLowerCase()+':'))return l.split(':',2)[1].trim();return '';}
  const tonnage=parseInt(kv('Mass'))||0,walkMP=parseInt(kv('Walk MP'))||0;
  const runMP=Math.ceil(walkMP*1.5),jumpMP=parseInt(kv('Jump MP'))||0;
  const hsRaw=kv('Heat Sinks'),hsCount=parseInt(hsRaw)||0,hsDouble=/double/i.test(hsRaw),diss=hsDouble?hsCount*2:hsCount;
  function av(loc){return parseInt(kv(loc+' Armor'))||0;}
  const armor={HD:av('HD'),CTf:av('CT'),CTr:av('RTC'),LTf:av('LT'),LTr:av('RTL'),RTf:av('RT'),RTr:av('RTR'),LA:av('LA'),RA:av('RA'),LL:av('LL'),RL:av('RL')};
  const is=MECH_IS_TABLE[tonnage]||MECH_IS_TABLE[100];
  const wIdx=lines.findIndex(l=>/^weapons:\d+/i.test(l));
  const wCount=wIdx>=0?(parseInt(lines[wIdx].split(':')[1])||0):0;
  const wMap={};let wid=1;
  for(let i=wIdx+1;i<wIdx+1+wCount&&i<lines.length;i++){
    const l=lines[i];if(!l)continue;
    const parts=l.split(',');const rawName=parts[0].replace(/^\d+\s+/,'').trim();
    const rawLoc=(parts[1]||'').trim();const ammoM=l.match(/Ammo:(\d+)/i);const ammoMax=ammoM?parseInt(ammoM[1]):null;
    const stats=mwLookup(rawName);const key=rawName+'@'+rawLoc;
    if(wMap[key]){wMap[key].count++;if(ammoMax)wMap[key].ammoMax=(wMap[key].ammoMax||0)+ammoMax;}
    else wMap[key]={id:wid++,name:stats?stats.d:rawName,rawName,loc:mwNormLoc(rawLoc),locRaw:rawLoc,heat:stats?stats.h:0,dmg:stats?stats.dm:'?',r:stats?stats.r:'?',ammo:ammoMax,ammoMax,count:1};
  }
  const LOC_MAP={'Left Arm:':'LA','Right Arm:':'RA','Left Torso:':'LT','Right Torso:':'RT','Center Torso:':'CT','Head:':'HD','Left Leg:':'LL','Right Leg:':'RL'};
  const crits={};let curLoc=null,curS=[];
  for(const l of lines){
    if(LOC_MAP[l]){if(curLoc)crits[curLoc]=curS.slice(0,12);curLoc=LOC_MAP[l];curS=[];}
    else if(curLoc&&l&&!l.startsWith('#')&&curS.length<12)curS.push(l==='-Empty-'?'-':l);
  }
  if(curLoc)crits[curLoc]=curS.slice(0,12);
  return {source:'MTF',chassis:chassis.trim(),model:model.trim(),tonnage,walkMP,runMP,jumpMP,hsCount,hsDouble,diss,armorType:kv('Armor').replace(/\(.*?\)/g,'').trim(),techBase:kv('TechBase'),era:kv('Era'),armor,is,weapons:Object.values(wMap),crits,bv:0};
}

function mechParseSSW(text){
  const doc=new DOMParser().parseFromString(text,'text/xml');
  function xt(sel,def=''){const e=doc.querySelector(sel);return e?e.textContent.trim():def;}
  function xa(sel,attr,def=''){const e=doc.querySelector(sel);return e?(e.getAttribute(attr)||def):def;}
  const root=doc.querySelector('mech');
  const chassis=root.getAttribute('name')||'',model=root.getAttribute('model')||'';
  const tonnage=parseInt(root.getAttribute('tons'))||0,bv=parseInt(xt('battle_value'))||0;
  const engRating=parseInt(xa('engine','rating'))||0;
  const walkMP=Math.floor(engRating/tonnage),runMP=Math.ceil(walkMP*1.5);
  const jumpMP=doc.querySelectorAll('jumpjets location').length;
  const hsCount=parseInt(xa('heatsinks','number'))||0,hsDouble=/double/i.test(xt('heatsinks type')),diss=hsDouble?hsCount*2:hsCount;
  function av(t){return parseInt(xt('armor '+t))||0;}
  const armor={HD:av('hd'),CTf:av('ct'),CTr:av('ctr'),LTf:av('lt'),LTr:av('ltr'),RTf:av('rt'),RTr:av('rtr'),LA:av('la'),RA:av('ra'),LL:av('ll'),RL:av('rl')};
  const is=MECH_IS_TABLE[tonnage]||MECH_IS_TABLE[100];
  const PASSIVE=['case','endo steel','ferro-fibrous','targeting computer','masc','guardian ecm','beagle active probe','angel ecm','null signature','chameleon'];
  const wMap={};let wid=1;
  doc.querySelectorAll('equipment').forEach(eq=>{
    const rawName=(eq.querySelector('name')?.textContent?.trim()||'').replace(/\n/g,'');
    const type=(eq.querySelector('type')?.textContent?.trim()||'').toLowerCase();
    const locEl=eq.querySelector('location');const rawLoc=locEl?.textContent?.trim()||'';
    if(type==='ammunition')return;
    if(PASSIVE.some(p=>rawName.toLowerCase().includes(p)))return;
    if(!['energy','ballistic','missile','physical'].includes(type))return;
    const cleanName=rawName.replace(/^\(IS\)\s*/i,'').replace(/^\(CL\)\s*/i,'').trim();
    const stats=mwLookup(rawName)||mwLookup(cleanName);
    const loc=mwNormLoc(rawLoc),key=cleanName+'@'+rawLoc;
    if(wMap[key])wMap[key].count++;
    else wMap[key]={id:wid++,name:stats?stats.d:cleanName,rawName:cleanName,loc,locRaw:rawLoc,heat:stats?stats.h:0,dmg:stats?stats.dm:'?',r:stats?stats.r:'?',ammo:null,ammoMax:null,count:1};
  });
  const crits={};['HD','CT','LT','RT','LA','RA','LL','RL'].forEach(l=>crits[l]=Array(l==='HD'||l.endsWith('L')?6:12).fill('-'));
  doc.querySelectorAll('equipment').forEach(eq=>{
    const rawName=(eq.querySelector('name')?.textContent?.trim()||'').replace(/\n/g,'');
    const locEl=eq.querySelector('location');if(!locEl)return;
    const loc=mwNormLoc(locEl.textContent.trim()),idx=parseInt(locEl.getAttribute('index')||'0');
    const slots=crits[loc];
    if(slots&&idx>=0&&idx<slots.length)slots[idx]=rawName.replace(/^\(IS\)\s*/i,'').replace(/^\(CL\)\s*/i,'').trim();
  });
  return {source:'SSW',chassis,model,tonnage,walkMP,runMP,jumpMP,hsCount,hsDouble,diss,engineRating:engRating,armorType:xt('armor type'),techBase:xt('techbase'),era:xa('year','')||'',armor,is,weapons:Object.values(wMap),crits,bv};
}

function mechParseMech(text){
  const t=text.trim();
  if(t.startsWith('<?xml')||t.startsWith('<mech'))return mechParseSSW(t);
  return mechParseMTF(t);
}

// ================================================================
// ESTADO DE SESIÓN DEL MECH
// ================================================================
let mechState = null; // datos base parseados
let mechSession = null; // estado mutable: armor actual, calor, munición, heridas

function mechInitSession(data) {
  const armor={};Object.entries(data.armor).forEach(([k,v])=>armor[k]=v);
  const is={};Object.entries(data.is).forEach(([k,v])=>is[k]=v);
  const ammo={};
  data.weapons.forEach(w=>{if(w.ammoMax)ammo[w.id]=w.ammoMax;});
  const crits={};
  Object.entries(data.crits).forEach(([loc,slots])=>{crits[loc]=slots.map(s=>({name:s,hit:false}));});
  return {armor,is,ammo,heat:0,wounds:0,crits};
}

// ================================================================
// CARGA DE ARCHIVO
// ================================================================
function mechParser_loadFile(e){
  const file=e.target.files[0];if(!file)return;
  const r=new FileReader();
  r.onload=ev=>{
    try{
      const text = ev.target.result;
      const data=mechParseMech(text);
      mechState=data;
      mechSession=mechInitSession(data);
      mechRenderAll();
      document.getElementById('mech-file-status').textContent=
        '✅ Cargado: '+data.chassis+' '+data.model+' ('+data.source+')';
      document.getElementById('mech-file-status').style.color='#4ade80';
      
      // Save raw text for Ficha-Mech bridge
      localStorage.setItem('sharedMtfFile', text);
      localStorage.setItem('sharedMtfFileName', file.name);
    }catch(err){
      document.getElementById('mech-file-status').textContent='❌ Error: '+err.message;
      document.getElementById('mech-file-status').style.color='#ff4444';
    }
  };
  r.readAsText(file);
}

function lanzarFichaMech() {
  const mtfData = localStorage.getItem('sharedMtfFile');
  if (!mtfData) {
      alert("⚠️ Primero debes cargar un archivo MTF/SSW usando el icono de la carpeta.");
      return;
  }
  // The generator HTML is in the root, ficha-mech is in ficha-mech/index.html relative to root
  window.open('ficha-mech/index.html', '_blank');
}

// ================================================================
// RENDERIZADO COMPLETO
// ================================================================
const ARMOR_SLOTS = [
  {k:'HD', l:'CABEZA',ik:'HD',rear:false},
  {k:'CTf',l:'CT ▶',  ik:'CT',rear:false},{k:'CTr',l:'CT ◀',ik:'CT',rear:true},
  {k:'LTf',l:'TI ▶',  ik:'LT',rear:false},{k:'LTr',l:'TI ◀',ik:'LT',rear:true},
  {k:'RTf',l:'TD ▶',  ik:'RT',rear:false},{k:'RTr',l:'TD ◀',ik:'RT',rear:true},
  {k:'LA', l:'B.IZQ', ik:'LA',rear:false},{k:'RA', l:'B.DER',ik:'RA',rear:false},
  {k:'LL', l:'P.IZQ', ik:'LL',rear:false},{k:'RL', l:'P.DER',ik:'RL',rear:false},
];

function mechMakeSlot(k,ik,l,rear){
  const d=mechState,s=mechSession;
  const av=s.armor[k]||0,am=d.armor[k]||0;
  const iv=rear?null:(s.is[ik]||0),im=rear?null:(d.is[ik]||0);
  const dead=!rear&&iv===0&&im>0;
  const el=document.getElementById('mslot-'+k);
  if(!el)return;
  el.style.borderColor=dead?'#ff4444':rear?'#5c3200':'#5c4200';
  el.style.background=dead?'rgba(255,0,0,0.08)':'rgba(0,0,0,0.5)';
  const acol=rear?'#ff8c42':'#ffae00',abg=rear?'#110500':'#110800';
  const pipA=Array.from({length:am},(_,i)=>`<div class="mech-pip" style="background:${i<av?acol:abg};border-color:${acol}40;" onclick="mechAdjArmor('${k}',-1)" oncontextmenu="event.preventDefault();mechAdjArmor('${k}',1)"></div>`).join('');
  const pipI=im?Array.from({length:im},(_,i)=>`<div class="mech-pip" style="background:${i<iv?'#ff4444':'#1a0000'};border-color:#ff444440;" onclick="mechAdjIS('${ik}',-1)" oncontextmenu="event.preventDefault();mechAdjIS('${ik}',1)"></div>`).join(''):'';
  el.innerHTML=`
    <div class="mech-loc-title"><span>${l}</span>${dead?'<span style="color:#ff4444;font-size:7px;">✕</span>':''}</div>
    <div style="font-size:8px;color:${acol};margin-bottom:2px;">ARM ${av}/${am}</div>
    <div class="mech-pip-row" style="margin-bottom:${rear?0:3}px;">${pipA}</div>
    ${!rear?`<div style="font-size:7px;color:#555;margin-bottom:1px;">IS ${iv}/${im}</div><div class="mech-pip-row">${pipI}</div>`:''}`;
}

function mechRenderArmor(){
  ARMOR_SLOTS.forEach(({k,ik,l,rear})=>mechMakeSlot(k,ik,l,rear));
}

function mechRenderAll(){
  if(!mechState||!mechSession)return;
  const d=mechState,s=mechSession;
  document.getElementById('mech-full-sheet').style.display='block';
  document.getElementById('mech-topbar-btns').style.display='flex';
  document.getElementById('mech-sheet-name').textContent=d.chassis.toUpperCase()+' '+d.model;
  document.getElementById('mech-sheet-meta').textContent=
    d.tonnage+'T · '+d.techBase+' · Era: '+d.era+(d.bv?' · BV: '+d.bv:'')+'  ['+d.source+']';
  document.getElementById('mech-sheet-stats').innerHTML=[
    ['CAMINAR',d.walkMP],['CORRER',d.runMP],['SALTAR',d.jumpMP],
    ['HS',d.hsCount+(d.hsDouble?' D':' S')],['DISIP.',d.diss],
  ].map(([l,v])=>`<div style="background:rgba(0,0,0,0.6);border:1px solid #5c4200;padding:3px 7px;text-align:center;min-width:48px;"><div style="color:#888;font-size:7px;letter-spacing:1px;">${l}</div><div style="color:#e0e0e0;font-size:12px;font-weight:bold;">${v}</div></div>`).join('');
  mechRenderArmor();mechRenderWeapons();mechRenderHeat();mechRenderCrits();mechRenderPilot();
}

function mechRenderWeapons(){
  const d=mechState,s=mechSession;
  let totalHeat=0;
  const html=d.weapons.map(w=>{
    const al=w.ammoMax?(s.ammo[w.id]||0):null;
    const noAmmo=al===0;totalHeat+=w.heat*w.count;
    const hc=w.heat>=10?'#ff4444':w.heat>=5?'#ff8c42':'#ffae00';
    const ammoTxt=al!=null?`<span style="font-size:9px;color:${al>5?'#4ade80':al>0?'#ffae00':'#ff4444'}">${al}rds</span>`:'';
    const cb=w.count>1?`<span style="background:rgba(255,174,0,0.15);color:#ffae00;font-size:9px;padding:0 4px;">×${w.count}</span>`:'';
    return `<div class="mech-wpn-row" style="${noAmmo?'opacity:0.4;':''}">
      <div style="flex:1;min-width:100px;font-size:11px;font-weight:bold;">${w.name} ${cb}</div>
      <span style="font-size:9px;color:#888;min-width:24px;">${w.loc}</span>
      <span style="font-size:9px;color:${hc};">🌡${w.heat}</span>
      <span style="font-size:9px;color:#aaa;">D:${w.dmg}</span>
      <span style="font-size:8px;color:#666;">${w.r}</span>
      ${ammoTxt}
      <button onclick="mechFireWeapon(${w.id})" ${noAmmo?'disabled':''} style="padding:3px 7px;background:${noAmmo?'#0a0a0a':'rgba(153,27,27,0.4)'};border:1px solid ${noAmmo?'#222':'#ff4444'};color:${noAmmo?'#333':'#ff4444'};font-family:inherit;font-size:9px;cursor:${noAmmo?'not-allowed':'pointer'};font-weight:bold;letter-spacing:1px;clip-path:polygon(0 0,calc(100% - 4px) 0,100% 4px,100% 100%,0 100%);">DISP</button>
    </div>`;
  }).join('')||'<div style="color:#555;font-style:italic;font-size:11px;">Sin armas</div>';
  document.getElementById('mech-weapons-list').innerHTML=html;
  const b=d.diss-totalHeat;
  document.getElementById('mech-heat-summary').innerHTML=`Calor salva completa: <span style="color:#ff8c42">${totalHeat}</span> &nbsp;·&nbsp; Disipación: <span style="color:#4ade80">${d.diss}</span> &nbsp;·&nbsp; Balance: <span style="color:${b>=0?'#4ade80':'#ff4444'}">${b>=0?'+':''}${b}</span>`;
}

function mechRenderHeat(){
  const s=mechSession,d=mechState;if(!s)return;
  const hx=getHFX(s.heat);
  const pct=Math.min(100,(s.heat/30)*100);
  document.getElementById('mech-heat-value').textContent=s.heat;
  document.getElementById('mech-heat-value').style.color=hx.color;
  // Barra horizontal
  const bar=document.getElementById('mech-heat-bar');
  if(bar){bar.style.width=pct+'%';}
  // Label de estado
  const lbl=document.getElementById('mech-heat-label');
  if(lbl){lbl.textContent=hx.label;lbl.style.color=hx.color;}
  // Efectos activos (compacto)
  const fx=HEAT_FX.filter(e=>e.at<=s.heat&&(e.hit>0||e.mov<0||e.at>=28));
  const efEl=document.getElementById('mech-heat-effects');
  if(efEl)efEl.innerHTML=fx.map(e=>`<span style="color:${e.color};font-size:9px;margin-right:6px;">${e.hit>0?'+'+e.hit+' disp ':''} ${e.mov<0?e.mov+' mov':''}</span>`).join('');
}

function mechRenderCrits(){
  const s=mechSession;if(!s)return;
  const html=Object.entries(s.crits).map(([loc,slots])=>`
    <div style="background:rgba(0,0,0,0.4);border:1px solid #2a1a00;padding:4px 6px;">
      <div style="color:#ffae00;font-size:8px;letter-spacing:1px;margin-bottom:2px;">${loc}</div>
      ${slots.map((sl,i)=>`<div onclick="mechToggleCrit('${loc}',${i})" style="font-size:9px;color:${sl.hit?'#ff4444':sl.name==='-'?'#333':'#aaa'};padding:1px 0;cursor:${sl.name!=='-'?'pointer':'default'};text-decoration:${sl.hit?'line-through':'none'};">${i+1}. ${sl.name==='-'?'·':sl.name}</div>`).join('')}
    </div>`).join('');
  document.getElementById('mech-crits-grid').innerHTML=html;
}

function mechRenderPilot(){
  const s=mechSession;if(!s)return;
  const wLbls=['','','','+1 pilotaje','+1 disparo','+2 pilotaje','INCONSCIENTE'];
  const hx=getHFX(s.heat);
  const tnMod=hx.hit+(s.wounds===3?1:s.wounds>=4?1:0);
  document.getElementById('mech-pilot-panel').innerHTML=`
    <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
      <div style="text-align:center;background:rgba(0,0,0,0.5);border:1px solid #5c4200;padding:8px 12px;">
        <div style="color:#888;font-size:8px;letter-spacing:1px;margin-bottom:2px;">ARMA</div>
        <div style="color:#e0e0e0;font-size:20px;font-weight:bold;">4</div>
      </div>
      <div style="text-align:center;background:rgba(0,0,0,0.5);border:1px solid #5c4200;padding:8px 12px;">
        <div style="color:#888;font-size:8px;letter-spacing:1px;margin-bottom:2px;">PILOTAJE</div>
        <div style="color:#e0e0e0;font-size:20px;font-weight:bold;">5</div>
      </div>
      <div>
        <div style="color:#888;font-size:9px;letter-spacing:1px;margin-bottom:4px;">HERIDAS</div>
        <div style="display:flex;gap:3px;">${[1,2,3,4,5,6].map(i=>`<div onclick="mechSetWounds(${i})" style="width:16px;height:16px;cursor:pointer;border-radius:1px;background:${i<=s.wounds?'#ff4444':'#1a0000'};border:1px solid #ff4444;"></div>`).join('')}</div>
        ${s.wounds>=5?'<div style="color:#ff4444;font-size:9px;margin-top:3px;font-weight:bold;">INCONSCIENTE</div>':''}
      </div>
      <div style="font-size:10px;color:#888;">
        TN disparo: <span style="color:#ffae00;font-weight:bold;">4${hx.hit>0?'+'+hx.hit+'(calor)':''}${s.wounds===3?' +1(her)':s.wounds>=4?' +1(her)':''} = ${4+tnMod}+</span>
      </div>
    </div>
  `;
}

// ================================================================
// ACCIONES
// ================================================================
function mechAdjArmor(key,d){
  if(!mechSession)return;const m=mechState.armor[key]||0;
  mechSession.armor[key]=Math.max(0,Math.min(m,(mechSession.armor[key]||0)+d));
  mechRenderArmor();
}
function mechAdjIS(key,d){
  if(!mechSession)return;const m=mechState.is[key]||0;
  mechSession.is[key]=Math.max(0,Math.min(m,(mechSession.is[key]||0)+d));
  mechRenderArmor();
}
function mechFireWeapon(id){
  if(!mechSession||!mechState)return;
  const w=mechState.weapons.find(x=>x.id===id);if(!w)return;
  mechSession.heat=Math.min(30,mechSession.heat+w.heat);
  if(w.ammoMax&&mechSession.ammo[id]>0)mechSession.ammo[id]--;
  mechRenderWeapons();mechRenderHeat();
}
function mechHeatAdj(d){
  if(!mechSession)return;mechSession.heat=Math.max(0,Math.min(30,mechSession.heat+d));mechRenderHeat();
}
function mechNextTurn(){
  if(!mechSession||!mechState)return;mechSession.heat=Math.max(0,mechSession.heat-mechState.diss);mechRenderHeat();
}
function mechSetWounds(n){
  if(!mechSession)return;mechSession.wounds=n===mechSession.wounds?n-1:n;mechRenderPilot();
}
function mechToggleCrit(loc,i){
  if(!mechSession)return;
  const sl=mechSession.crits[loc][i];if(sl.name==='-')return;
  sl.hit=!sl.hit;mechRenderCrits();
}
function mechReset(){
  if(!mechState)return;mechSession=mechInitSession(mechState);mechRenderAll();
}

// ================================================================
// NAVEGACIÓN DE PESTAÑAS (modo infantería / mech)
// ================================================================
function switchCalcTab(tab){
  const isInf=(tab==='infantry');
  document.getElementById('calc-section-infantry').style.display=isInf?'block':'none';
  document.getElementById('calc-section-mech').style.display=isInf?'none':'block';
  const ti=document.getElementById('calc-tab-infantry');
  const tm=document.getElementById('calc-tab-mech');
  ti.style.background=isInf?'rgba(255,174,0,0.15)':'transparent';
  ti.style.color=isInf?'#ffae00':'#555';
  ti.style.borderBottom=isInf?'3px solid #ffae00':'3px solid transparent';
  tm.style.background=isInf?'transparent':'rgba(0,255,65,0.1)';
  tm.style.color=isInf?'#555':'#00ff41';
  tm.style.borderBottom=isInf?'3px solid transparent':'3px solid #00ff41';
}

// switchMechTab removed — single view layout

