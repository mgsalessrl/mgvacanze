const imageSize = require('image-size');
const fs = require('fs');
const path = require('path');

// Handle different export styles
const sizeOf = typeof imageSize === 'function' ? imageSize : imageSize.imageSize;

const directoryPath = 'public/images/img_sito/breeze lungo';

fs.readdir(directoryPath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    files.forEach(function (file) {
        if(file.endsWith('.jpg') || file.endsWith('.jpeg')) {
            try {
                const buffer = fs.readFileSync(path.join(directoryPath, file));
                const dimensions = sizeOf(buffer);
                const ratio = dimensions.width / dimensions.height;
                console.log(`${file}: ${dimensions.width}x${dimensions.height} (Ratio: ${ratio.toFixed(2)}) ${ratio > 1 ? 'Landscape' : 'Portrait'}`);
            } catch (e) {
                console.error(`Error reading ${file}: ${e.message}`);
            }
        }
    });
});