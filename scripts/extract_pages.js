const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Config
const SQL_PATH = path.join(__dirname, '../OLD_SITE_BACKUP/db0swljpyvfvbh.sql');

// IDs to fetch
const TARGET_IDS = new Set([3815, 4388, 356]);
const FOUND_CONTENT = {};

// Parser State
let currentTable = null;
let row = [];
let inString = false;
let escape = false;
let currentVal = '';

// Process Row Logic
function processRow(table, row) {
    if (table === 'cbq_posts') {
        const id = Number(row[0]);
        if (TARGET_IDS.has(id)) {
            FOUND_CONTENT[id] = {
                title: row[5],
                content: row[4]
            };
        }
    }
}

async function run() {
    console.log("Reading SQL dump to find content for IDs:", Array.from(TARGET_IDS));
    const stream = fs.createReadStream(SQL_PATH, { encoding: 'utf8' });
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

    for await (const line of rl) {
        if (line.toUpperCase().startsWith('INSERT INTO')) {
            const match = line.match(/INSERT INTO `([^`]+)`/);
            if (match) currentTable = match[1];
        }
        parseChunk(line);
    }
    
    console.log(JSON.stringify(FOUND_CONTENT, null, 2));
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
            if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
            row.push(val);
            currentVal = '';
            
            if (char === ')') {
                if (currentTable) {
                    try { processRow(currentTable, row); } catch(e) {}
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
