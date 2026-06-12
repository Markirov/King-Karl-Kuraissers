const fs = require('fs');
const path = require('path');

const srcPath = 'e:/Drive/CBT/ELH/index (3).html';
const destDir = 'D:/GitHub/King-Karl-Kuraissers/assets/mechs/';

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

try {
    const content = fs.readFileSync(srcPath, 'utf8');
    console.log("Original file length:", content.length);
    
    // Find the SVG storage div
    const svgStartStr = 'id="mech-svg-storage"';
    let startIndex = content.indexOf(svgStartStr);
    if (startIndex === -1) {
        console.error("Could not find mech-svg-storage!");
        process.exit(1);
    }
    
    // go backward to the opening angle bracket
    startIndex = content.lastIndexOf('<', startIndex);
    
    let scriptIndex = content.indexOf('<script>', startIndex);
    let closeDivIndex = content.lastIndexOf('</div>', scriptIndex);
    
    const svgSection = content.substring(startIndex, closeDivIndex + 6);
    console.log("SVG section length extracted:", svgSection.length);
    
    // Regex to match <div id="mech-svg-NAME"> ... </div>
    // Note: SVG paths can contain newlines or have child nodes, so we need to capture everything until the closing </div>
    // A simpler way: split by '<div id="mech-svg-'
    
    const parts = svgSection.split('<div id="mech-svg-');
    let count = 0;
    
    for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        const quoteIndex = part.indexOf('">');
        if (quoteIndex === -1) continue;
        
        const mechName = part.substring(0, quoteIndex);
        
        // Find the end of this div (the first closing </div> should match this opening div, 
        // assuming no nested divs inside the SVG, which is true for SVGs)
        const divEndIndex = part.indexOf('</div>', quoteIndex);
        if (divEndIndex === -1) continue;
        
        const svgContent = part.substring(quoteIndex + 2, divEndIndex).trim();
        
        // Write to file
        const fileName = path.join(destDir, mechName + '.svg');
        fs.writeFileSync(fileName, svgContent, 'utf8');
        count++;
    }
    
    console.log(`Successfully extracted ${count} SVGs into assets/mechs/`);
    
} catch (e) {
    console.error("Error processing SVGs:", e);
}
