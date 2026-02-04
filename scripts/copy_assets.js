const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, '../OLD_SITE_BACKUP/wp-content/uploads');
const DEST_DIR = path.join(__dirname, '../web/public/uploads');

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    
    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        
        fs.readdirSync(src).forEach(childItemName => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        // Only copy if not exists or newer? 
        if (!fs.existsSync(dest)) {
             fs.copyFileSync(src, dest);
             // console.log(`Copied ${src} -> ${dest}`);
        }
    }
}

console.log(`Copying assets from ${SOURCE_DIR} to ${DEST_DIR}...`);
try {
    copyRecursiveSync(SOURCE_DIR, DEST_DIR);
    console.log('Copy completed.');
} catch (e) {
    console.error('Copy failed:', e);
}
