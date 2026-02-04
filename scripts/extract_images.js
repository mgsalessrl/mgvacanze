const fs = require('fs');
const path = require('path');

const SQL_FILE = path.resolve(__dirname, '../OLD_SITE_BACKUP/db0swljpyvfvbh.sql');
const OLD_UPLOADS_DIR = path.resolve(__dirname, '../OLD_SITE_BACKUP/wp-content/uploads');
const TARGET_DIR = path.resolve(__dirname, '../web/public/images/recovered');

if (!fs.existsSync(TARGET_DIR)){
    fs.mkdirSync(TARGET_DIR, { recursive: true });
}

function run() {
    console.log("Reading SQL file...");
    const sqlContent = fs.readFileSync(SQL_FILE, 'utf8');
    
    // Regex to find image URLs in wp-content/uploads
    // Captures: wp-content/uploads/(YYYY/MM/filename.ext)
    const regex = /wp-content\/uploads\/([a-zA-Z0-9_\-\.\/]+?\.(?:jpg|jpeg|png|gif|webp))/gi;
    
    const matches = new Set();
    let match;
    while ((match = regex.exec(sqlContent)) !== null) {
        matches.add(match[1]); // The relative path inside uploads
    }
    
    console.log(`Found ${matches.size} unique image references in SQL.`);
    
    let successCount = 0;
    let failCount = 0;
    const extractedFiles = [];

    matches.forEach(relPath => {
        const sourcePath = path.join(OLD_UPLOADS_DIR, relPath);
        const fileName = path.basename(relPath);
        const destPath = path.join(TARGET_DIR, fileName); 
        
        // Handle logic: The SQL path might check '2025/11/file.png'.
        // We need to check if that file exists on disk.
        
        if (fs.existsSync(sourcePath)) {
            // Check if we already copied a file with this name (but maybe different folder)
            // For simplicity, we just overwrite or suffix if needed? 
            // Let's just copy. Collision risk if '2018/01/a.jpg' and '2019/01/a.jpg' exist.
            // Simple flatten strategy:
            let finalName = fileName;
            if (fs.existsSync(path.join(TARGET_DIR, finalName))) {
                finalName = `${Date.now()}_${fileName}`;
            }
            
            fs.copyFileSync(sourcePath, path.join(TARGET_DIR, finalName));
            extractedFiles.push(finalName);
            successCount++;
        } else {
            // console.log(`Missing file: ${relPath}`);
            failCount++;
        }
    });
    
    console.log(`Extraction Complete.`);
    console.log(`Success: ${successCount}`);
    console.log(`Missing/Failed: ${failCount}`);
    console.log(`Images saved to: ${TARGET_DIR}`);
    
    // Save a manifest of extracted images to help the "Prompt"
    fs.writeFileSync(path.join(__dirname, 'recovered_images.json'), JSON.stringify(extractedFiles, null, 2));
}

run();
