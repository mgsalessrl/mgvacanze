const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../web/.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkImages() {
  const { data: properties, error } = await supabase
    .from('properties')
    .select('id, title, description');

  if (error) {
    console.error(error);
    return;
  }

  properties.forEach(p => {
    console.log(`\nProperty: ${p.title} (${p.id})`);
    if (!p.description) return;
    
    // Simple regex to find img src
    const imgRegex = /src=["'](.*?)["']/g;
    let match;
    let found = false;
    while ((match = imgRegex.exec(p.description)) !== null) {
      console.log(` - Found Image Ref: ${match[1]}`);
      found = true;
    }
    if(!found) console.log(" - No images in description.");
  });
}

checkImages();
