import { z } from 'zod/v4';
import { tool } from 'ai';
import { saveLead } from '@/lib/db/leads';
import { triggerEmailWorkflow } from '@/lib/mcp/resend';

export const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  budget: z.number().min(0),
  interest: z.enum(['bajo', 'medio', 'alto']),
});

export type QualifiedLead = z.infer<typeof leadSchema>;

export const captureLead = tool({
  description: `Llama SOLO cuando tengas nombre, email, presupuesto e interés confirmados.`,
  inputSchema: leadSchema, // ✅ pasar zod schema directo, sin zodSchema()
  execute: async (lead) => {  // ✅ sin tipar el argumento, se infiere solo
    const savedLead = await saveLead(lead);
    await triggerEmailWorkflow({ to: lead.email, leadId: savedLead.id });
    return {
      status: 'qualified',
      leadId: savedLead.id,
      nextStep: 'schedule_appointment',
    };
  },
});