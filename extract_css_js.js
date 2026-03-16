const fs = require('fs');

try {
    const content = fs.readFileSync('src/index.html', 'utf8');
    
    // Extract CSS
    const styleStart = content.indexOf('<style>');
    const styleEnd = content.indexOf('</style>');
    let cssContent = "";
    
    if (styleStart !== -1 && styleEnd !== -1) {
        cssContent = content.substring(styleStart + 7, styleEnd);
        if (!fs.existsSync('src/css')) fs.mkdirSync('src/css');
        fs.writeFileSync('src/css/styles.css', cssContent);
        console.log("Extracted styles.css");
    }
    
    // Extract Scripts
    // There are multiple script tags. One for JS logic and unified database, another for jsPDF.
    // The main script tag should be the largest one.
    // Let's just use regex to find all script tags.
    const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    let scripts = [];
    while ((match = scriptRegex.exec(content)) !== null) {
        // match[1] is the content inside script
        if (match[1].trim().length > 0) {
            scripts.push({
                fullMatch: match[0],
                content: match[1]
            });
        }
    }
    
    let dbContent = "";
    let appContent = "";
    
    // Loop through scripts to find the one with unifying DB
    scripts.forEach((script) => {
        if (script.content.includes('BASE DE DATOS UNIFICADA')) {
            // Found the main script. It contains the DB and the logic.
            // Let's separate DB from logic. DB contains "const SCAN_MECHS", "const mechsLight" etc.
            // Logic contains "function calculatePoints", etc.
            
            // Search for where the DB ends and logic begins.
            // Usually, logic begins with variable declarations for UI or functions.
            const logicStartMarkers = ['function updateAttributes', 'function randomChoice', 'document.addEventListener'];
            let logicStartIdx = -1;
            
            for (const marker of logicStartMarkers) {
                const idx = script.content.indexOf(marker);
                if (idx !== -1) {
                    logicStartIdx = idx;
                    break;
                }
            }
            
            // If we didn't find a clear logic start, let's just dump it all in app.js for now.
            if (logicStartIdx === -1) {
                appContent += script.content + '\n';
            } else {
                dbContent = script.content.substring(0, logicStartIdx);
                appContent += script.content.substring(logicStartIdx);
            }
        } else {
            // Other inline scripts, just append to app logic
            appContent += script.content + '\n';
        }
    });
    
    if (!fs.existsSync('src/js')) fs.mkdirSync('src/js');
    if (!fs.existsSync('src/data')) fs.mkdirSync('src/data');
    
    if (dbContent.length > 0) {
        fs.writeFileSync('src/data/database.js', dbContent);
        console.log("Extracted database.js");
    }
    if (appContent.length > 0) {
        fs.writeFileSync('src/js/app.js', appContent);
        console.log("Extracted app.js");
    }
    
    // Now replace them in the HTML
    let newHtml = content;
    // Replace styles
    if (styleStart !== -1 && styleEnd !== -1) {
        newHtml = newHtml.substring(0, styleStart) + '<link rel="stylesheet" href="css/styles.css">\n' + newHtml.substring(styleEnd + 8);
    }
    
    // Replace scripts
    // We will just remove all inline scripts that we have matched, and insert the external script tags before </body>.
    scripts.forEach((script) => {
        newHtml = newHtml.replace(script.fullMatch, '');
    });
    
    // Insert new tags before </body>
    const bodyEnd = newHtml.indexOf('</body>');
    const newTags = `
    <script src="data/database.js"></script>
    <script src="js/app.js"></script>
`;
    if (bodyEnd !== -1) {
        newHtml = newHtml.substring(0, bodyEnd) + newTags + newHtml.substring(bodyEnd);
    } else {
        newHtml += newTags;
    }
    
    fs.writeFileSync('src/index.html', newHtml);
    console.log("Updated src/index.html");

} catch(e) { console.error(e); }
