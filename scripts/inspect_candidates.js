const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '../web/.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const candidates = [3038, 3714, 3056, 3716, 1927, 3705];

async function inspectCandidates() {
  const { data, error } = await supabase
    .from('properties')
    .select('id, title, specs, features, description')
    .in('id', candidates);

  if (error) console.error(error);
  else {
      data.forEach(p => {
          console.log(`ID: ${p.id} | Title: ${p.title}`);
          console.log(`Specs Keys: ${p.specs ? Object.keys(p.specs).length : 0}`);
          console.log(`Features Count: ${p.features ? p.features.length : 0}`);
          console.log(`Desc Length: ${p.description ? p.description.length : 0}`);
          console.log('---');
      });
  }
}

inspectCandidates();
