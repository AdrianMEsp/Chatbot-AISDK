/* import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages: await convertToModelMessages(messages),
  });
 
  return result.toUIMessageStreamResponse();
} */


import { captureLead } from '@/lib/tools/leadTool';
import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages, stepCountIs } from 'ai';


export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: `Eres un asistente de ventas. Tu objetivo es calificar leads.
Recopilá de forma conversacional: nombre, email, presupuesto e interés (bajo/medio/alto).
Cuando tengas los 4 datos confirmados, llamá a captureLead. Nunca inventes información.`,
    messages: await convertToModelMessages(messages),
    tools: { captureLead },
    stopWhen: stepCountIs(5), // permite multi-turn tool calls
  });

  return result.toUIMessageStreamResponse();
}