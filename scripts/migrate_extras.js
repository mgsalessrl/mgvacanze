const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function migrateExtras() {
  console.log("Starting migration of extras...");
  
  // 1. Fetch existing extras from properties table
  const { data: properties, error } = await supabase
    .from('properties')
    .select('id, title, extra_options');

  if (error) {
    console.error('Error fetching properties:', error);
    return;
  }

  const extrasMap = new Map(); // name -> { name, price, description }

  properties.forEach(prop => {
    if (Array.isArray(prop.extra_options)) {
      prop.extra_options.forEach(opt => {
        if (!opt.name) return;
        
        // Key by name + price to distinguish variants? 
        // Or just by name and we take the max price or first one?
        // User asked to "edit" them. If we merge "Skipper 1890" and "Skipper 1750", which one wins?
        // Let's create distinct ones if prices differ significantly, or just use name.
        // For simplicity and "Global" catalog concept, let's dedup by Name. Note the diffs.
        
        const key = opt.name.trim();
        if (!extrasMap.has(key)) {
            extrasMap.set(key, {
                name: key,
                price: opt.price || 0,
                description: `Imported from ${prop.title}`
            });
        } else {
            // Update description to note multiple usages
            // extrasMap.get(key).description += `, ${prop.title}`;
        }
      });
    }
  });

  const uniqueExtras = Array.from(extrasMap.values());
  console.log(`Found ${uniqueExtras.length} unique extras.`);

  // 2. Insert into 'extras' table (if not exists)
  for (const extra of uniqueExtras) {
    // Check if exists
    const { data: existing } = await supabase
        .from('extras')
        .select('id')
        .eq('name', extra.name)
        .single();
    
    if (!existing) {
        const { error: insertError } = await supabase.from('extras').insert({
            name: extra.name,
            price: extra.price,
            description: extra.description
        });
        if (insertError) console.error(`Failed to insert ${extra.name}:`, insertError);
        else console.log(`Inserted: ${extra.name} (€${extra.price})`);
    } else {
        console.log(`Skipped (already exists): ${extra.name}`);
    }
  }
  
  console.log("Migration complete.");
}

migrateExtras();
