const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://krnclnhojwblxzmituvz.supabase.co",
  "sb_publishable_j45zXUff2znI6kBLs8Nl2g_W68QUglk"
);

async function test() {
  const { data, error } = await supabase.from('states').insert([{ id: 999, name: 'Test State', slug: 'test-state' }]).select();
  console.log("Insert Error:", error);
  console.log("Insert Data:", data);
}

test();
