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
    /* Old Style:
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
    */
    <div className="flex flex-col mb-4 text-zinc-800">
      <div className="font-bold text-sm mb-1">
        {isUser ? 'User:' : 'AI:'}
      </div>
      <div className="text-sm whitespace-pre-wrap">
        {(message.parts ?? []).filter(isTextUIPart).map((part, i) => (
          <span key={i}>{part.text}</span>
        ))}
      </div>
    </div>
  );
}
