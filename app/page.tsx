'use client';

import { useChat } from '@ai-sdk/react'
import { ChatMessage } from '@/components/chat-message';
import { Send, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function Chat() {
  const { messages, sendMessage, status } = useChat();
  const isLoading = status === 'streaming' || status === 'submitted';

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({text: input});
    setInput('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold tracking-tight text-xl">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Sparkles size={20} className="text-white" />
            </div>
            <span>AI SDK Chat</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-zinc-400">GPT-4o Online</span>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl mb-6 shadow-2xl">
                <Sparkles size={40} className="text-indigo-400" />
              </div>
              <h1 className="text-3xl font-bold mb-4 bg-linear-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                Asistente de ventas
              </h1>
{/*               <p className="text-zinc-400 max-w-md mx-auto leading-relaxed">
                Connect with GPT-4o using the Vercel AI SDK.
                Experience real-time streaming and high-fidelity responses.
              </p> */}
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/50">
              {messages.map((m) => (
                <ChatMessage key={m.id} message={m} />
              ))}
              {isLoading && messages[messages.length - 1].role === 'user' && (
                <div className="p-6 flex gap-x-4">
                  <div className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-zinc-950 via-zinc-950 to-transparent pt-10 pb-8 px-4">
        <div className="max-w-3xl mx-auto relative group">
          <form
            onSubmit={handleSubmit}
            className="relative flex items-center bg-zinc-900/50 border border-zinc-800 rounded-2xl p-2 pr-3 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/50 transition-all backdrop-blur-md shadow-2xl"
          >
            <input
              className="flex-1 bg-transparent px-4 py-3 focus:outline-none text-zinc-100 placeholder-zinc-500 transition-all font-medium"
              value={input}
              placeholder="Escribe tu datos (mail, nombre, presupuesto e interes en el producto)"
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={!input?.trim() || isLoading}
              className="flex items-center justify-center h-10 w-10 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:grayscale transition-all shadow-lg shadow-indigo-500/20 group-hover:scale-105 active:scale-95"
            >
              <Send size={18} />
            </button>
          </form>
          <p className="text-[10px] text-center mt-3 text-zinc-600 font-medium uppercase tracking-widest">
            Powered by Vercel AI SDK & OpenAI GPT-4o
          </p>
        </div>
      </div>
    </div>
  );
}
