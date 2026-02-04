const fs = require('fs');
const path = require('path');

const TARGET_DIR = path.resolve(__dirname, '../web/public/images/recovered');

if (fs.existsSync(TARGET_DIR)) {
    const files = fs.readdirSync(TARGET_DIR);
    let deleted = 0;
    
    files.forEach(file => {
        // Match patterns like name-100x100.jpg or name-1024x768.jpg or name-scaled-1-100x100.jpg
        // Generic regex for WP thumbnails: -(\d+)x(\d+)\.(jpg|jpeg|png|gif|webp)$
        if (/-\d+x\d+\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
            fs.unlinkSync(path.join(TARGET_DIR, file));
            deleted++;
        }
    });
    
    console.log(`Cleaned up ${deleted} thumbnail files.`);
}
