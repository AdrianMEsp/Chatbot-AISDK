import { cavemanSkill } from '@/lib/skills/caverman';
import { onboardingCROSkill } from '@/lib/skills/onboarding-cro';
import { appointmentSetterSkill } from '@/lib/skills/appointment-setter';
import { captureLead } from '@/lib/tools/leadTool';
import { listSlotsTool, scheduleAppointmentTool } from '@/lib/tools/calendarTool';
import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages, stepCountIs } from 'ai';


export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: 
    `${cavemanSkill}\n\n

    ${onboardingCROSkill}\n\n

    ${appointmentSetterSkill}

---

## Rol adicional: Calificación de leads

Cuando el usuario muestre interés en contratar o hablar con ventas, cambiá al modo de calificación:
- Recopilá de forma conversacional: nombre, email, presupuesto e interés (bajo/medio/alto).
- Cuando tengas los 4 datos confirmados, llamá a captureLead.
- Luego de calificar, procede a agendar una cita usando las herramientas de calendario.
- Nunca inventes información.`,
    messages: await convertToModelMessages(messages),
    tools: { captureLead, listSlotsTool, scheduleAppointmentTool },
    stopWhen: stepCountIs(5), // permite multi-turn tool calls
  });

  return result.toUIMessageStreamResponse();
}