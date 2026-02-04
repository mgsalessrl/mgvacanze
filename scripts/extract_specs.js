const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '../web/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const SQL_PATH = path.resolve(__dirname, '../OLD_SITE_BACKUP/db0swljpyvfvbh.sql');

// Mapping of Italian/Custom meta keys to our Specs JSON structure
const SPEC_KEY_MAP = {
  'lunghezza-fuori-tutto': 'length',
  'overall-length': 'length', // heuristic fallback
  'larghezza': 'beam', // guessing this one, will verify in logs
  'pescaggio': 'draft',
  'carburante': 'fuel_capacity',
  'acqua': 'water_capacity',
  'motori': 'engine',
  'velocita-di-crociera': 'cruising_speed',
  'consumi-a-velocita-di-crociera': 'consumption',
  'cabine': 'cabins',
  'bagni': 'bathrooms',
  'ospiti': 'guests',
  'anno': 'year',
  // Custom boolean/string flags
  'cabina-marinaio': 'crew_cabin',
  'doppia-timoneria': 'double_helm',
  'dinette-trasformabile': 'convertible_dinette'
};

async function extractSpecs() {
  console.log(`Reading SQL dump from ${SQL_PATH}...`);
  const fileContent = fs.readFileSync(SQL_PATH, 'utf-8');
  
  // 1. Extract Post Metadata (Specs)
  // Format: (meta_id, post_id, key, value)
  // Value might be quoted.
  const metaRegex = /\(\d+,\s*(\d+),\s*'([^']+)',\s*'([^']*)'\)/g;
  
  const propertiesData = {};

  let match;
  while ((match = metaRegex.exec(fileContent)) !== null) {
    const postId = match[1];
    const key = match[2];
    const value = match[3];

    if (!propertiesData[postId]) {
      propertiesData[postId] = { 
        specs: {}, 
        features: new Set() 
      };
    }

    // Check if this is a spec key we care about
    if (SPEC_KEY_MAP[key]) {
        const specName = SPEC_KEY_MAP[key];
        const existing = propertiesData[postId].specs[specName];
        
        // Only update if the new value is not empty, OR if we haven't found a value yet.
        // This prevents empty english keys (like 'overall-length') from overwriting populated italian keys (like 'lunghezza-fuori-tutto')
        if (value && value.trim() !== '') {
             propertiesData[postId].specs[specName] = value;
        } else if (!existing) {
             // If we don't have a value yet, we can set it even if empty (placeholder) 
             // but actually it's better to just leave it undefined or empty string if that's all we have
             propertiesData[postId].specs[specName] = value;
        }
    } else {
        // Log "unknown" keys for our target yacht 3038 to see what we missed
        if (postId === '3038' && !key.startsWith('_') && !key.startsWith('rank_math') && !key.startsWith('mega_details')) {
             // console.log(`[Did Not Map] Key: ${key}, Value: ${value}`); 
        }
    }
  }

  // 2. Extract Terms (Features)
  // We need to build a map of Term ID -> Term Name first
  // Table: cbq_terms (term_id, name, slug, term_group)
  const featuresMap = {}; // term_id -> term_name
  const termRegex = /\((\d+),\s*'([^']+)',\s*'([^']+)',\s*\d+\)/g;
  
  while ((match = termRegex.exec(fileContent)) !== null) {
      const termId = match[1];
      const name = match[2];
      featuresMap[termId] = name;
  }

  // 3. Link Features to Properties via Term Relationships
  // Table: cbq_term_relationships (object_id, term_taxonomy_id, term_order)
  // Assuming term_taxonomy_id maps 1:1 to term_id which is common in WP unless messy.
  const relRegex = /\((\d+),\s*(\d+),\s*\d+\)/g;

  while ((match = relRegex.exec(fileContent)) !== null) {
      const postId = match[1];
      const termId = match[2];

      if (propertiesData[postId] && featuresMap[termId]) {
          propertiesData[postId].features.add(featuresMap[termId]);
      }
  }

  console.log(`Found data for ${Object.keys(propertiesData).length} posts.`);
  
  // 4. Update Supabase
  for (const [wpId, data] of Object.entries(propertiesData)) {
    // Only update if we have meaningful data
    if (Object.keys(data.specs).length === 0 && data.features.size === 0) continue;

    // Convert Set to Array
    const featuresArray = Array.from(data.features);

    // console.log(`Updating Property ${wpId}:`, { specs: data.specs, features: featuresArray });

    const { error } = await supabase
      .from('properties')
      .update({
        specs: data.specs,
        features: featuresArray
      })
      .eq('id', wpId); // Using ID directly as per migration strategy (legacy ID preservation)

    if (error) {
    //   console.error(`Failed to update ${wpId}:`, error.message);
    } else {
    //   console.log(`Updated ${wpId}`);
    }
  }
    
  // Force update for 3038 specifically for debugging log
  if (propertiesData['3038']) {
      console.log("------------------------------------------------");
      console.log("FINAL DATA FOR 3038 (Elyvian Spirit):");
      console.log("SPECS:", propertiesData['3038'].specs);
      console.log("FEATURES:", Array.from(propertiesData['3038'].features));
      
      const { error } = await supabase
      .from('properties')
      .update({
        specs: propertiesData['3038'].specs,
        features: Array.from(propertiesData['3038'].features)
      })
      .eq('id', '3038');
      
      if (error) console.log("Error updating 3038:", error);
      else console.log("Successfully updated 3038 in Supabase.");
      console.log("------------------------------------------------");
  }

}

extractSpecs();
