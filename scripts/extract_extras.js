const fs = require('fs');
const readline = require('readline');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const PHPUnserialize = require('php-serialize');

// Load environment variables
const envPath = path.join(__dirname, '../web/.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const SQL_FILE = path.join(__dirname, '../OLD_SITE_BACKUP/db0swljpyvfvbh.sql');

async function run() {
    console.log('Scanning SQL dump for extra_pay_options (Regex mode)...');

    const fileStream = fs.createReadStream(SQL_FILE, { encoding: 'utf8' });
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const extrasMap = new Map();
    // Regex to match: (meta_id, post_id, 'extra_pay_options', 'value')
    const regexGlobal = /\d+\s*,\s*(\d+)\s*,\s*'extra_pay_options'\s*,\s*'((?:[^'\\]|\\.)*)'/g;

    let matchCount = 0;

    for await (const line of rl) {
        let match;
        // Reset lastIndex because we reuse regexGlobal? 
        // No, `line` is a new string each time, but regexGlobal is stateful if 'g' is used with exec() loop?
        // Actually, with `exec` on DIFFERENT strings, 'g' flag behavior is... strictly speaking, `lastIndex` is on the regex object. 
        // If we reuse the same regex object on different strings, we MUST reset lastIndex = 0.
        regexGlobal.lastIndex = 0;
        
        while ((match = regexGlobal.exec(line)) !== null) {
            matchCount++;
            const postId = match[1];
            let rawVal = match[2];
            
            // Unescape SQL
            rawVal = rawVal
                .replace(/\\'/g, "'")
                .replace(/\\"/g, '"')
                .replace(/\\\\/g, "\\");
            
            try {
                const unserialized = PHPUnserialize.unserialize(rawVal);
                extrasMap.set(postId, unserialized);
            } catch (e) {
                // console.error(`Failed to unserialize post ${postId}: ${e.message}`);
                // console.log('Raw:', rawVal);
            }
        }
    }

    console.log(`Found ${matchCount} extra_pay_options entries.`);
    console.log(`Successfully parsed ${extrasMap.size} properties.`);

    // Transform and Update Supabase
    for (const [postId, rawExtras] of extrasMap) {
        let extrasList = [];
        const items = Array.isArray(rawExtras) ? rawExtras : Object.values(rawExtras);

        for (const item of items) {
             const fields = Array.isArray(item) ? item : Object.values(item);
             if (fields.length >= 2) {
                 extrasList.push({
                     name: fields[0],
                     price: parseFloat(fields[1]),
                     type: parseInt(fields[2] || '0', 10)
                 });
             }
        }

        if (extrasList.length > 0) {
            console.log(`Updating property ${postId} with ${extrasList.length} extras.`);
            const { error } = await supabase
                .from('properties')
                .update({ extra_options: extrasList })
                .eq('id', parseInt(postId));

            if (error) {
                 if (error.code === '42703') {
                     console.error("Column 'extra_options' missing. Please run migration.");
                     return;
                 }
                 console.error(`Error updating ${postId}:`, error.message);
            }
        }
    }
    
    console.log('Done.');
}

run();
