const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '../web/.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const IMAGE_DIR = path.resolve(__dirname, '../web/public/images/recovered');

// Target IDs
const YACHTS = {
  3038: { name: 'Spirit', keywords: ['spirit', 'excess-14', 'excess14'] }, // Hypothesized mapping based on keywords
  1927: { name: 'Dream', keywords: ['dream', 'excess-11', 'excess11'] },   // Hypothesized mapping
  3056: { name: 'Breeze', keywords: ['breeze', 'elyvian-breeze'] }
};

// Generic terms to distribute or specific assignment
const GENERICS = ['yacht_interior', 'yoga', 'ceramic'];

/**
 * Heuristic:
 * 1. Filter files in recovered folder.
 * 2. Assign to ID based on keyword match.
 * 3. Update Supabase.
 */

async function assignImages() {
  if (!fs.existsSync(IMAGE_DIR)) {
      console.log("Image directory not found.");
      return;
  }

  const files = fs.readdirSync(IMAGE_DIR);
  // Filter out non-images
  const images = files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));

  console.log(`Found ${images.length} images to analyze.`);

  const updates = {
      3038: [],
      1927: [],
      3056: []
  };

  images.forEach(file => {
      const lower = file.toLowerCase();
      
      // Check specific yachts
      for (const [id, config] of Object.entries(YACHTS)) {
          if (config.keywords.some(k => lower.includes(k))) {
              updates[id].push(`/images/recovered/${file}`);
              return; // Assigned
          }
      }
      
      // Handle generics if needed (Optional: add to all? or skip?)
      // For now, let's only assign known matches to keep it clean.
  });

  // Perform Updates
  for (const [id, imgs] of Object.entries(updates)) {
      if (imgs.length === 0) continue;
      
      console.log(`Assigning ${imgs.length} images to Yacht ${id} (${YACHTS[id].name})...`);
      
      // Update logic: Append to existing or Replace?
      // Since we just recovered, let's assume we want to SET these as the gallery.
      // But we need to make sure the column exists.
      
      // First, check if column exists by trying a dummy select?
      // Actually, just try update.
      
      const { error } = await supabase
        .from('properties')
        .update({ images: imgs })
        .eq('id', id);

      if (error) {
          console.error(`Failed to update Yacht ${id}:`, error.message);
          if (error.code === '42703') {
             console.log("!!! ATTENTION: You must add the 'images' column (text[]) to the 'properties' table in Supabase.");
             return; 
          }
      } else {
          console.log(`Success for ${id}.`);
      }
  }
}

assignImages();
