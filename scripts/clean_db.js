const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '../web/.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const KEEP_IDS = [3038, 3056, 1927]; // Spirit, Breeze, Dream

async function cleanDatabase() {
  console.log('Starting DB Cleanup...');

  // 1. Fix Elyvian Breeze (3056) description if missing, using 3716
  const { data: sourceBreeze } = await supabase
    .from('properties')
    .select('description')
    .eq('id', 3716)
    .single();

  const { data: targetBreeze } = await supabase
    .from('properties')
    .select('description')
    .eq('id', 3056)
    .single();

  if (sourceBreeze && targetBreeze && !targetBreeze.description) {
      console.log('Restoring Description for Elyvian Breeze (3056)...');
      await supabase
        .from('properties')
        .update({ description: sourceBreeze.description })
        .eq('id', 3056);
  }

  // 2. Delete everything else
  console.log(`Deleting all properties EXCEPT: ${KEEP_IDS.join(', ')}`);
  
  const { error } = await supabase
    .from('properties')
    .delete()
    .not('id', 'in', `(${KEEP_IDS.join(',')})`); // Syntax for .not with .in might need check, but standard is .not('id', 'in', array) usually
  
    // Supabase JS .not('id', 'in', value) -> value should be array.
    // actually, let's use .filter or .neq? 
    // .not('id', 'in', (ID_LIST))
    
  if (error) {
      // If the above syntax fails, we can do it safer: fetch all IDs, filter js side, delete.
      console.log("Error with direct delete, trying fetch-then-delete...", error);
      const { data: allProps } = await supabase.from('properties').select('id');
      const idsToDelete = allProps
        .map(p => p.id)
        .filter(id => !KEEP_IDS.includes(id));
      
      if (idsToDelete.length > 0) {
          const { error: delError } = await supabase
            .from('properties')
            .delete()
            .in('id', idsToDelete);
            
          if (delError) console.error('Delete failed:', delError);
          else console.log(`Deleted ${idsToDelete.length} items.`);
      } else {
          console.log('Nothing to delete.');
      }
  } else {
      console.log('Cleanup complete.');
  }

  // Double check
  const { data: remaining } = await supabase.from('properties').select('id, title');
  console.log('Remaining Properties:');
  remaining.forEach(p => console.log(`${p.id}: ${p.title}`));
}

cleanDatabase();
