import { createClient } from '@supabase/supabase-js';
import { QualifiedLead } from '../tools/leadTool';


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function saveLead(lead: QualifiedLead) {
  const { data, error } = await supabase
    .from('leads')
    .insert(lead)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}