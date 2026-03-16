const fs = require('fs');

try {
    const dbContent = fs.readFileSync('src/data/database.js', 'utf8');
    
    // Evaluate the DB content to get the variables in script scope.
    // We can just wrap it in a function.
    
    const context = {};
    const codeToEval = `
        const localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
        (function() {
            ${dbContent}
            return {
                MECH_DATABASE: typeof MECH_DATABASE !== 'undefined' ? MECH_DATABASE : null,
                mechsLight: typeof mechsLight !== 'undefined' ? mechsLight : null,
                mechsMedium: typeof mechsMedium !== 'undefined' ? mechsMedium : null,
                mechsHeavy: typeof mechsHeavy !== 'undefined' ? mechsHeavy : null,
                mechsAssault: typeof mechsAssault !== 'undefined' ? mechsAssault : null,
                vehicles: typeof vehicles !== 'undefined' ? vehicles : null,
                SCAN_MECHS: typeof SCAN_MECHS !== 'undefined' ? SCAN_MECHS : null,
                WEAPONS_ENERGY: typeof WEAPONS_ENERGY !== 'undefined' ? WEAPONS_ENERGY : null,
                WEAPONS_BALLISTIC: typeof WEAPONS_BALLISTIC !== 'undefined' ? WEAPONS_BALLISTIC : null,
                WEAPONS_MISSILE: typeof WEAPONS_MISSILE !== 'undefined' ? WEAPONS_MISSILE : null,
                XP_LEVEL_COSTS: typeof XP_LEVEL_COSTS !== 'undefined' ? XP_LEVEL_COSTS : null
            };
        })();
    `;
    
    const dbVars = eval(codeToEval);
    
    const mechsData = {
        light: dbVars.mechsLight,
        medium: dbVars.mechsMedium,
        heavy: dbVars.mechsHeavy,
        assault: dbVars.mechsAssault,
        vehicles: dbVars.vehicles,
        scanMechs: dbVars.SCAN_MECHS
    };
    
    // Wait, the new code has MECH_DATABASE as a giant array instead of mechsLight etc?
    if (dbVars.MECH_DATABASE) {
        mechsData.all = dbVars.MECH_DATABASE;
    }
    
    const weaponsData = {
        energy: dbVars.WEAPONS_ENERGY,
        ballistic: dbVars.WEAPONS_BALLISTIC,
        missile: dbVars.WEAPONS_MISSILE
    };
    
    fs.writeFileSync('src/data/mechs.json', JSON.stringify(mechsData, null, 2), 'utf8');
    fs.writeFileSync('src/data/weapons.json', JSON.stringify(weaponsData, null, 2), 'utf8');
    
    // Also save XP costs if it's there
    if (dbVars.XP_LEVEL_COSTS) {
        fs.writeFileSync('src/data/config.json', JSON.stringify({ XP_LEVEL_COSTS: dbVars.XP_LEVEL_COSTS }, null, 2), 'utf8');
    }
    
    console.log("JSON extraction successful.");
} catch(e) { console.error("Error evaluating:", e); }
