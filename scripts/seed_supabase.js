const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '../.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const SEED_FILE = path.join(__dirname, '../src/data/properties_seed.json');

async function seed() {
    console.log('Reading seed data...');
    const rawData = fs.readFileSync(SEED_FILE, 'utf8');
    const properties = JSON.parse(rawData);

    console.log(`Found ${properties.length} properties to seed.`);

    const formattedData = properties.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        price: p.price,
        city: p.location.city,
        address: p.location.address,
        lat: p.location.lat,
        lng: p.location.lng,
        bedrooms: p.specs.bedrooms,
        bathrooms: p.specs.bathrooms,
        guests: p.specs.guests,
        area: p.specs.area,
        image_url: p.image
    }));

    // Upsert to avoid duplicates
    const { data, error } = await supabase
        .from('properties')
        .upsert(formattedData, { onConflict: 'id' })
        .select();

    if (error) {
        console.error('Error seeding data:', error);
    } else {
        console.log(`Successfully upserted ${data.length} properties.`);
    }
}

seed();
