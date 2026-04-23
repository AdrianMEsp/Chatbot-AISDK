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

export async function getStaleLeads({ olderThanHours }: { olderThanHours: number }) {
  const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('leads')
    .select('id, email')
    .eq('status', 'qualified_no_appointment')
    .lt('created_at', cutoff);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function markFollowUpSent(leadId: string) {
  const { error } = await supabase
    .from('leads')
    .update({ 
      status: 'follow_up_sent',
      last_follow_up_at: new Date().toISOString()
    })
    .eq('id', leadId);

  if (error) throw new Error(error.message);
}

export async function getLeadByEmail(email: string) {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('email', email)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return data;
}