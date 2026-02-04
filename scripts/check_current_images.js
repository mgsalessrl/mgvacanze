const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../web/.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const IDS = [3038, 1927, 3056];

async function checkImages() {
  const { data: properties, error } = await supabase
    .from('properties')
    .select('id, title, images')
    .in('id', IDS);

  if (error) { console.error(error); return; }

  properties.forEach(p => {
    console.log(`${p.title} (${p.id}) images:`, p.images);
  });
}

checkImages();
