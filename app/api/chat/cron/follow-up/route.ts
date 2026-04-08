import { getStaleLeads, markFollowUpSent } from '@/lib/db/leads';
import { triggerEmailWorkflow } from '@/lib/mcp/resend';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const stale = await getStaleLeads({ olderThanHours: 24 });

  const results = await Promise.allSettled(
    stale.map(async lead => {
      await triggerEmailWorkflow({ to: lead.email, leadId: lead.id, template: 'follow_up' });
      await markFollowUpSent(lead.id);
    })
  );

  const sent = results.filter(r => r.status === 'fulfilled').length;
  return NextResponse.json({ sent, total: stale.length });
}