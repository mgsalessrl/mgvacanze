const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '../web/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select('id, title, city');

  if (error) {
    console.error(error);
    return;
  }

  console.log('--- PROPERTIES IN DB ---');
  data.forEach(p => {
    console.log(`ID: ${p.id} | Title: ${p.title} | City: ${p.city}`);
  });
  console.log('------------------------');
}

listProperties();
