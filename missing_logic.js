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

        