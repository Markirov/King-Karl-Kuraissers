const fs = require('fs');

try {
    const buffer = fs.readFileSync('index (3).html');
    let encoding = 'utf8';
    if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
        encoding = 'utf16le';
    } else if (buffer[0] === 0xFE && buffer[1] === 0xFF) {
        encoding = 'utf16be';
    }
    console.log(`Detected encoding of index (3).html: ${encoding}`);
    
    // Read with the correct encoding
    const content = fs.readFileSync('index (3).html', encoding);
    console.log(`File length in characters: ${content.length}`);
    
    // Extractor
    // 1. Remove SVG storage
    const svgStartStr = '<div class="mech-svg-storage" id="mech-svg-storage">';
    let startIndex = content.indexOf(svgStartStr);
    let scriptIndex = content.indexOf('<script>', startIndex);
    let closeDivIndex = content.lastIndexOf('</div>', scriptIndex);
    
    let htmlNoSvg = content.substring(0, startIndex) + 
                    '<div class="mech-svg-storage" id="mech-svg-storage">\n        <!-- SVGs referenciados remotamente -->\n    </div>\n' + 
                    content.substring(closeDivIndex + 6);
                    
    console.log(`Length after SVG removal: ${htmlNoSvg.length}`);
    
    // 2. Extract CSS
    const styleStart = htmlNoSvg.indexOf('<style>');
    const styleEnd = htmlNoSvg.indexOf('</style>');
    let cssContent = "";
    if (styleStart !== -1 && styleEnd !== -1) {
        cssContent = htmlNoSvg.substring(styleStart + 7, styleEnd);
        fs.writeFileSync('src/css/styles.css', cssContent, 'utf8');
        htmlNoSvg = htmlNoSvg.substring(0, styleStart) + '<link rel="stylesheet" href="css/styles.css">\n' + htmlNoSvg.substring(styleEnd + 8);
        console.log("Extracted styles.css");
    }
    
    // 3. Extract Scripts
    // We will find all <script>...</script> blocks
    const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    let scripts = [];
    while ((match = scriptRegex.exec(htmlNoSvg)) !== null) {
        if (match[1].trim().length > 0) {
            scripts.push({
                fullMatch: match[0],
                content: match[1]
            });
        }
    }
    
    let dbContent = "";
    let appContent = "";
    
    scripts.forEach((script) => {
        if (script.content.includes('BASE DE DATOS UNIFICADA')) {
            const dbEndMarker = 'document.addEventListener(\'DOMContentLoaded\'';
            const dbEndIdx = script.content.indexOf(dbEndMarker);
            if (dbEndIdx !== -1) {
                dbContent = script.content.substring(0, dbEndIdx);
                appContent += script.content.substring(dbEndIdx);
                console.log("Found DB and Logic boundary!");
            } else {
                appContent += script.content + '\n';
            }
        } else {
            appContent += script.content + '\n';
        }
    });
    
    fs.writeFileSync('src/data/database.js', dbContent, 'utf8');
    fs.writeFileSync('src/js/app.js', appContent, 'utf8');
    console.log("Extracted JavaScripts");
    
    scripts.forEach((script) => {
        htmlNoSvg = htmlNoSvg.replace(script.fullMatch, '');
    });
    
    const newTags = '\n    <script src="data/database.js"></script>\n    <script src="js/app.js"></script>\n';
    htmlNoSvg = htmlNoSvg.replace('</body>', newTags + '</body>');
    
    fs.writeFileSync('src/index.html', htmlNoSvg, 'utf8');
    console.log("Generated clean src/index.html");

} catch(e) { console.error(e); }
