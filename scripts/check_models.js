const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../web/.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const IDS = [3038, 1927, 3056];

async function checkModels() {
  const { data: properties, error } = await supabase
    .from('properties')
    .select('id, title, description, technical_specs')
    .in('id', IDS);

  if (error) {
      console.error("Supabase Error:", error);
      return;
  }

  if (!properties) {
      console.log("No properties found");
      return;
  }

  properties.forEach(p => {
      console.log(`ID: ${p.id} | Title: ${p.title}`);
      
      let model = "Unknown";
      const txt = (JSON.stringify(p.technical_specs) + (p.description || "")).toLowerCase();
      
      if (txt.includes('excess 11') || txt.includes('excess11')) model = "Excess 11";
      if (txt.includes('excess 14') || txt.includes('excess14')) model = "Excess 14";
      
      console.log(`Detected Model: ${model}`);
      console.log('---');
  });
}

checkModels();
