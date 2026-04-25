const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://krnclnhojwblxzmituvz.supabase.co",
  "sb_publishable_j45zXUff2znI6kBLs8Nl2g_W68QUglk"
);

async function test() {
  const searchTerm = '%Kothrud, Pune%';
  
  const { data, error } = await supabase
    .from('areas')
    .select('id, name')
    .or(`name.ilike."${searchTerm}",pincode.ilike."${searchTerm}"`)
    .limit(10);
    
  console.log("Areas Error:", error);
}

test();
