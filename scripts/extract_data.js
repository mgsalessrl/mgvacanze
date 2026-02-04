const fs = require('fs');
const readline = require('readline');
const path = require('path');

const SQL_FILE = path.join(__dirname, '../OLD_SITE_BACKUP/db0swljpyvfvbh.sql');
const OUTPUT_FILE = path.join(__dirname, '../web/src/data/properties_seed.json');

const posts = new Map();
const postMeta = new Map(); 

let currentTable = null;
    
function processRow(table, row) {
    if (table === 'cbq_posts') {
        const id = row[0];
        const description = row[4];
        const title = row[5];
        const status = row[7];
        const parent = row[17];
        const guid = row[18];
        const type = row[20];
        
        if (type === 'estate_property' || type === 'attachment') {
             posts.set(id, { id, title, description, status, parent, guid, type });
        }
    } else if (table === 'cbq_postmeta') {
        const postId = row[1];
        const key = row[2];
        const val = row[3];
        
        if (!postMeta.has(postId)) {
            postMeta.set(postId, {});
        }
        postMeta.get(postId)[key] = val;
    }
}

// Global Parser State
let inString = false;
let escape = false;
let currentVal = '';
let row = [];

function parseChunk(content) {
    for (let i = 0; i < content.length; i++) {
        const char = content[i];

        if (escape) {
            currentVal += char;
            escape = false;
            continue;
        }

        if (char === '\\') {
            escape = true;
            continue; 
        }

        if (char === "'") {
            inString = !inString;
            continue;
        }

        if (inString) {
            currentVal += char;
            continue;
        }

        if (char === ',' || char === ')') {
            let val = currentVal.trim();
            if (val === 'NULL') val = null;
            else if (!isNaN(Number(val)) && val !== '') val = Number(val);
            
            row.push(val);
            currentVal = '';
            
            if (char === ')') {
                if (currentTable) {
                    processRow(currentTable, row);
                }
                row = [];
            }
        } else if (char === '(') {
            row = [];
            currentVal = '';
        } else if (char === ';') {
            // End of statement
            currentTable = null;
            // Reset state
            inString = false;
            escape = false;
            currentVal = '';
            row = [];
        } else {
            currentVal += char;
        }
    }
}

async function run() {
    console.log('Reading SQL file...');
    const fileStream = fs.createReadStream(SQL_FILE);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        const trimmed = line.trim();
        let contentToParse = line;
        
        if (trimmed.startsWith('INSERT INTO `cbq_posts`')) {
            currentTable = 'cbq_posts';
            const idx = line.indexOf('VALUES');
            if (idx !== -1) {
                contentToParse = line.slice(idx + 6);
            } else {
                contentToParse = ''; // VALUES might be on next line? Or we just wait.
            }
        } else if (trimmed.startsWith('INSERT INTO `cbq_postmeta`')) {
            currentTable = 'cbq_postmeta';
            const idx = line.indexOf('VALUES');
            if (idx !== -1) {
                contentToParse = line.slice(idx + 6);
            } else {
                contentToParse = '';
            }
        } else if (currentTable) {
            // Check if we are still inside insert.
            // If line starts with INSERT INTO other table, we missed the ;?
            // Usually valid SQL ends with ;
            if (trimmed.startsWith('INSERT INTO')) {
                // Should have been cleared by ;
                // Force clear
                currentTable = null; 
                // Re-process line as new start
                // But loop continues. We can't rewind.
                // Assuming well-formed SQL, we hit ; before next INSERT.
            }
        }

        if (currentTable) {
            parseChunk(contentToParse);
            // Add newline implies separation? No, strings might span lines?
            // If string spans lines, `inString` is true. `\n` in content?
            // readline strips \n. 
            // If SQL has newline in string, mysqldump escapes it as \n usually.
            // If valid newline in string, mysqldump might put literal newline if internal.
            // We append ' ' or '\n' if inside string?
            // Let's assume readline strips only line breaks.
            // Ideally we pass stream char by char. readline is chunking by line.
            // If we split a string in middle, we need to handle it.
            // My state `inString` persists.
            // But I am missing the newline char itself if I just concat `line` chunks.
            // I should add `\n` if `inString` is true? 
            if (inString) {
                currentVal += '\n';
            }
        }
    }

    console.log(`Processed ${posts.size} posts and ${postMeta.size} meta entries.`);
    const properties = [];
    
    for (const [id, post] of posts) {
        if (post.type === 'estate_property' && post.status === 'publish') {
            const meta = postMeta.get(id) || {};
            let imageUrl = null;
            if (meta['_thumbnail_id']) {
                const thumbId = parseInt(meta['_thumbnail_id']); 
                const attachMeta = postMeta.get(thumbId);
                const attachment = posts.get(thumbId);
                if (attachMeta && attachMeta['_wp_attached_file']) {
                    imageUrl = attachMeta['_wp_attached_file'];
                } else if (attachment) {
                    imageUrl = attachment.guid; 
                }
            }

            const price = meta['property_price'] || meta['price_per_week'] || 0;
            const city = meta['property_city'] || '';
            const address = meta['property_address'] || '';
            const bedrooms = meta['property_bedrooms'] || 0;
            const bathrooms = meta['property_bathrooms'] || 0;
            const guests = meta['guest_no'] || meta['guests'] || 0;
            const area = meta['property_size'] || 0;

            properties.push({
                id: post.id,
                title: post.title,
                description: meta['property_description'] || post.description || '',
                price: price,
                location: {
                    city,
                    address,
                    lat: meta['property_latitude'],
                    lng: meta['property_longitude']
                },
                specs: {
                    bedrooms,
                    bathrooms,
                    guests,
                    area
                },
                image: imageUrl
            });
        }
    }

    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(properties, null, 2));
    console.log(`Generated ${properties.length} properties.`);
}

run();
