const fs = require('fs');

try {
    console.log("Reading file...");
    const content = fs.readFileSync('index (3).html', 'utf8');
    
    console.log("Finding SVG storage...");
    const startIndex = content.indexOf('<div class="mech-svg-storage" id="mech-svg-storage">');
    if (startIndex === -1) {
        console.log("Could not find start index");
        process.exit(1);
    }
    
    // Find the closing div for this storage array.
    // Since it contains multiple SVGs and divs, simply finding the next </div> won't work.
    // Actually, following the storage div, there are SVG elements, and eventually the script tag for the database starts?
    // Let's just find the next <script> tag which should be right after the SVG storage!
    
    const scriptIndex = content.indexOf('<script>', startIndex);
    if (scriptIndex === -1) {
        console.log("Could not find next script tag");
        process.exit(1);
    }
    
    console.log(`Start: ${startIndex}, End (script): ${scriptIndex}`);
    
    // We need to keep everything before startIndex, and everything from the closing </div> before the script tag.
    // Let's just grab the end of the storage div by looking backwards from the script tag.
    const closeDivIndex = content.lastIndexOf('</div>', scriptIndex);
    
    if (closeDivIndex < startIndex) {
        console.log("Error finding closing div");
        process.exit(1);
    }
    
    // Create new content
    const newContent = content.substring(0, startIndex) + 
                       '<div class="mech-svg-storage" id="mech-svg-storage">\n        <!-- SVGs referenciados remotamente -->\n    </div>\n' + 
                       content.substring(closeDivIndex + 6); // +6 to skip </div>
                       
    console.log(`Original length: ${content.length}, New length: ${newContent.length}`);
    
    if (!fs.existsSync('src')) fs.mkdirSync('src');
    fs.writeFileSync('src/index.html', newContent);
    console.log("Successfully wrote src/index.html");
} catch (e) {
    console.error(e);
}
