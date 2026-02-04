const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Config
const SQL_PATH = path.join(__dirname, '../OLD_SITE_BACKUP/db0swljpyvfvbh.sql');

const FOUND_PAGES = [];

// Parser State
let currentTable = null;
let row = [];
let inString = false;
let escape = false;
let currentVal = '';

// Process Row Logic
function processRow(table, row) {
    if (table === 'cbq_posts') {
        const post_type = row[20]; // based on typical WP schema, but index might vary. Let's look for field roughly.
        // Actually, let's just look at the fields we found earlier or standard WP structure.
        // In check_blog_page.js we used row[5] for title, row[4] for content, row[7] for status. 
        // Let's assume post_type is also in there. 
        // Standard WP wp_posts columns: ID, post_author, post_date, post_date_gmt, post_content, post_title, ..., post_status, ..., post_type
        // Let's print the whole row for a few items to identify the post_type index if we are unsure, 
        // OR just look for 'page' in the row.
        
        // Let's infer index from common WP:
        // 0: ID
        // ...
        // 4: post_content
        // 5: post_title
        // 7: post_status
        // 20: post_type (usually)
        
        const type = row[20];
        const status = row[7];
        const title = row[5];
        
        if (type === 'page' && status === 'publish') {
           FOUND_PAGES.push({ id: row[0], title: title });
        }
    }
}

async function run() {
    console.log("Scanning for published PAGES...");
    const stream = fs.createReadStream(SQL_PATH, { encoding: 'utf8' });
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

    for await (const line of rl) {
        if (line.toUpperCase().startsWith('INSERT INTO')) {
            const match = line.match(/INSERT INTO `([^`]+)`/);
            if (match) currentTable = match[1];
        }
        
        // Basic parser reused from previous scripts
        if (currentTable === 'cbq_posts') {
             parseChunk(line);
        }
    }
    
    console.log("Found Pages:", JSON.stringify(FOUND_PAGES, null, 2));
}

function parseChunk(content) {
    for (let i = 0; i < content.length; i++) {
        const char = content[i];
        if (escape) { currentVal += char; escape = false; continue; }
        if (char === '\\') { escape = true; continue; }
        if (char === "'") { inString = !inString; continue; }
        if (inString) { currentVal += char; continue; }
        if (char === ',' || char === ')') {
            let val = currentVal.trim();
            if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
            row.push(val);
            currentVal = '';
            if (char === ')') {
                 try { processRow(currentTable, row); } catch(e) {} 
                row = [];
            }
        } else if (char === '(') { row = []; currentVal = ''; }
        else if (char === ';') { currentTable = null; inString = false; escape = false; currentVal = ''; row = []; }
        else { currentVal += char; }
    }
}

run();
