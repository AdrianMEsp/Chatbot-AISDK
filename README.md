## ChatWidget: Adaptable a proyectos, usa estados para mensajes, carga de respuesta y boton para chat emergente

## Tecnologias:
 - Resend
 - AI SDK
 - Supabase
 - Framer Motion
 - Crons

# npm i resend ai-sdk/openai ai-sdk/react supabase/supabase-js ai framer-motion


# components/ChatWidget.tsx
```
'use client';

import { useChat } from '@ai-sdk/react';
import { ChatMessage } from '@/components/chat-message';
import { Send, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function ChatWidget() {
  const { messages, sendMessage, status } = useChat();
  const isLoading = status === 'streaming' || status === 'submitted';

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 p-4 bg-indigo-600 rounded-full shadow-lg text-white hover:bg-indigo-500 transition"
        >
          <Sparkles size={24} />
        </button>
      )}

      {isOpen && (
        <div
          className="
            fixed bottom-4 right-4 
            w-[95%] max-w-sm sm:max-w-md md:w-96 
            h-[70vh] sm:h-150 
            bg-zinc-950 text-zinc-50 
            rounded-xl shadow-2xl flex flex-col overflow-hidden
          "
        >
          {/* Header */}
          <header className="flex items-center justify-between px-4 py-2
           border-b border-zinc-800 bg-zinc-900">
            <div className="flex items-center gap-2 font-bold text-lg">
              <Sparkles size={20} className="text-indigo-400" />
              <span>Asistente de ventas</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded hover:bg-zinc-800 transition"
            >
              <X size={18} />
            </button>
          </header>

          {/* Mensajes */}
          <main className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center h-full">
                <Sparkles size={40} className="text-indigo-400 mb-4" />
                <h1 className="text-lg font-bold">Bienvenido</h1>
                <p className="text-zinc-400 text-sm mt-2">
                  Escribe tu nombre, email, presupuesto e interés.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((m) => (
                  <ChatMessage key={m.id} message={m} />
                ))}
                {isLoading && (
                  <div className="p-2 flex gap-x-2">
                    <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center">
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </main>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center bg-zinc-900 border-t border-zinc-800 p-2"
          >
            <input
              className="flex-1 bg-transparent px-3 py-2 focus:outline-none
               text-zinc-100 placeholder-zinc-500 text-sm"
              value={input}
              placeholder="Escribe aquí..."
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={!input?.trim() || isLoading}
              className="ml-2 h-8 w-8 flex items-center justify-center 
              rounded bg-indigo-600 text-white hover:bg-indigo-500 
              disabled:opacity-50 transition"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
```

# components/chatmessage.tsx

```
'use client';

import { UIMessage,isTextUIPart  } from 'ai'
import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  message: UIMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'group flex w-full items-start gap-x-4 px-4 py-6',
        isUser ? 'bg-white/5 border-white/10' : 'bg-transparent'
      )}
    >
      <div className={cn(
        'flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full border shadow-sm',
        isUser ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-300'
      )}>
        {isUser ? <User size={20} /> : <Bot size={20} />}
      </div>
      <div className="flex flex-col gap-1 w-full max-w-3xl overflow-hidden">
        <span className={cn(
          'text-xs font-semibold tracking-wider uppercase',
          isUser ? 'text-indigo-400' : 'text-zinc-500'
        )}>
          {isUser ? 'Usted' : 'Asistante'}
        </span>
        <div className="text-sm md:text-base leading-relaxed text-zinc-200 whitespace-pre-wrap wrap-break-word">
          <div className="text-sm md:text-base leading-relaxed text-zinc-200 whitespace-pre-wrap wrap-break-word">
            {(message.parts ?? []).filter(isTextUIPart).map((part, i) => (
              <span key={i}>{part.text}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
```

# lib/db/leads.ts
```
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
```

# lib/mcp/resend.ts
```
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

/* export async function triggerEmailWorkflow({ to, leadId }: { to: string; leadId: string }) {
 
    const fromEmail = process.env.FROMMAIL // solo para pruebas
    const mailPrimero = process.env.MAILPRIMERO || '';

    await resend.emails.send({

        from: fromEmail,
        to: [mailPrimero],
        subject: '¡Gracias por tu interés!',
        html: `<p>Recibimos tu consulta. Tu ID de seguimiento es <strong>${leadId}</strong>.</p>`,
    });
} */

const templates: Record<string, { subject: string; html: (id: string) => string }> = {
    default: {
        subject: '¡Gracias por tu interés!',
        html: (id) => `<p>Recibimos tu consulta. Tu ID es <strong>${id}</strong>.</p>`,
    },
    follow_up: {
        subject: '¿Seguís interesado?',
        html: (id) => `<p>Notamos que aún no agendaste tu cita. ¿Podemos ayudarte? ID: <strong>${id}</strong>.</p>`,
    },
};

export async function triggerEmailWorkflow({
    to,
    leadId,
    template = 'default',
}: {
    to: string;
    leadId: string;
    template?: string;
}) {
    const t = templates[template] ?? templates.default;
    const fromEmail = 'onboarding@resend.dev' // solo para pruebas
    const mailPrimero = process.env.MAILPRIMERO || '';

    await resend.emails.send({
        from: fromEmail,
        to: [mailPrimero],
        subject: t.subject,
        html: t.html(leadId),
    });
}
```

# lib/tools/leadTool.ts
```
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

/* export async function triggerEmailWorkflow({ to, leadId }: { to: string; leadId: string }) {

    const fromEmail = 'onboarding@resend.dev' // solo para pruebas
    const mailPrimero = process.env.MAILPRIMERO || '';

    await resend.emails.send({

        from: fromEmail,
        to: [mailPrimero],
        subject: '¡Gracias por tu interés!',
        html: `<p>Recibimos tu consulta. Tu ID de seguimiento es <strong>${leadId}</strong>.</p>`,
    });
} */

const templates: Record<string, { subject: string; html: (id: string) => string }> = {
    default: {
        subject: '¡Gracias por tu interés!',
        html: (id) => `<p>Recibimos tu consulta. Tu ID es <strong>${id}</strong>.</p>`,
    },
    follow_up: {
        subject: '¿Seguís interesado?',
        html: (id) => `<p>Notamos que aún no agendaste tu cita. ¿Podemos ayudarte? ID: <strong>${id}</strong>.</p>`,
    },
};

export async function triggerEmailWorkflow({
    to,
    leadId,
    template = 'default',
}: {
    to: string;
    leadId: string;
    template?: string;
}) {
    const t = templates[template] ?? templates.default;
    const fromEmail = 'onboarding@resend.dev' // solo para pruebas
    const mailPrimero = process.env.MAILPRIMERO || '';

    await resend.emails.send({
        from: fromEmail,
        to: [mailPrimero],
        subject: t.subject,
        html: t.html(leadId),
    });
}
```

# lib/utils.ts
```
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

```

# .env.local
```
OPENAI_API_KEY=
RESEND_API_KEY=
MAILPRIMERO=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_URL=
CRON_SECRET=
```

# Una  vez tengas todo esto configurado, debes poner el Chatwidget en tu web 

## Skills
```
Agent Skills: https://skills.sh/

Son habilidades o capacidades que se le agregan al agente
para lograr cierta funcionalidad, como por ejemplo:
	- Caveman: reponde como un cavernicola inteligente, todo el contenido técnico permanece. Solo lo superfluo desaparece.
	- Findskills: Descubra e instale habilidades de agente especializadas del ecosistema abierto cuando los usuarios necesiten capacidades ampliadas.
```