const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Config
const SQL_PATH = path.join(__dirname, '../OLD_SITE_BACKUP/db0swljpyvfvbh.sql');

// Stats
const stats = {
    pages: [],
    custom_post_types: new Set(),
    taxonomies: new Set(),
    option_pages: [] 
};

// Parser State
let currentTable = null;
let row = [];
let inString = false;
let escape = false;
let currentVal = '';

// Process Row Logic
function processRow(table, row) {
    if (table === 'cbq_posts') {
        // ID is index 0
        // post_date 2
        // post_content 4
        // post_title 5
        // post_status 7 (publish)
        // post_name 11 (slug)
        // post_type 20

        const status = row[7];
        const type = row[20];
        const title = row[5];
        const id = row[0];

        if (status === 'publish') {
            stats.custom_post_types.add(type);
            
            if (type === 'page') {
                stats.pages.push({ id, title, slug: row[11] });
            }
        }
    }
    
    // We can also look for options if needed, but pages are priority 1
    // if (table === 'cbq_options' && row[1] === 'active_plugins') { ... }
}

async function run() {
    console.log("Reading SQL dump...");
    const stream = fs.createReadStream(SQL_PATH, { encoding: 'utf8' });
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

    // Handle Stream
    for await (const line of rl) {
        // Detect INSERT statements
        if (line.toUpperCase().startsWith('INSERT INTO')) {
            const match = line.match(/INSERT INTO `([^`]+)`/);
            if (match) {
                currentTable = match[1];
            }
        }

        // Feed parser
        parseChunk(line);
    }

    console.log("\n--- ANALYSIS COMPLETE ---\n");
    console.log("Post Types Found:", Array.from(stats.custom_post_types));
    console.log("\nPublished Pages Found:");
    stats.pages.forEach(p => console.log(`- [${p.id}] ${p.title} (/page/${p.slug})`));
}

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
            // Basic cleanup
            if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
            
            row.push(val);
            currentVal = '';
            
            if (char === ')') {
                if (currentTable) {
                    // Safety check for array index
                    try {
                        processRow(currentTable, row);
                    } catch(e) {}
                }
                row = [];
            }
        } else if (char === '(') {
            row = [];
            currentVal = '';
        } else if (char === ';') {
            currentTable = null;
            inString = false;
            escape = false;
            currentVal = '';
            row = [];
        } else {
            currentVal += char;
        }
    }
}

run();
