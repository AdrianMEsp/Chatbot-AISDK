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
        /* Old Style: 
        className="fixed bottom-4 right-4 p-4 bg-indigo-600 rounded-full shadow-lg text-white hover:bg-indigo-500 transition" 
        */
        <button
          className="fixed bottom-4 right-4 p-4 bg-black rounded-full shadow-lg text-white hover:bg-zinc-800 transition"
          onClick={() => setIsOpen(true)}
        >
          <Sparkles size={24} />
        </button>
      )}

      {isOpen && (
        <div
          /* Old Style:
          className="
            fixed bottom-4 right-4 
            w-[95%] max-w-sm sm:max-w-md md:w-96 
            h-[70vh] sm:h-150 
            bg-zinc-950 text-zinc-50 
            rounded-xl shadow-2xl flex flex-col overflow-hidden
          "
          */

          /* Pre mobile
          className="
            fixed bottom-4 right-4 
            w-[90%] max-w-sm sm:max-w-md md:w-96 
            h-[50vh] sm:h-50 
            bg-white text-zinc-900 
            border border-zinc-200
            rounded-xl shadow-2xl flex flex-col overflow-hidden
          " */

          className="
    fixed bottom-0 left-1/2 -translate-x-1/2 
    sm:bottom-4 sm:right-4 sm:left-auto sm:translate-x-0
    w-[90%] max-w-sm sm:max-w-md md:w-96 
    h-[50vh] sm:h-70 mb-4
    bg-white text-zinc-900 
    border border-zinc-200
    rounded-t-xl sm:rounded-xl shadow-2xl flex flex-col overflow-hidden
  "
        >
          {/* Header */}
          {/* <header className="
            flex items-center justify-between px-4 py-3
            border-b border-zinc-100 bg-white
            /* Old Style: border-zinc-800 bg-zinc-900 */
          /*">
            <div className="flex items-center gap-2 font-bold text-lg">
              <Sparkles size={20} 
              className="text-zinc-800" 
              /* Old Style: text-indigo-400 */ /* />
              <span>Asistente de ventas</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded hover:bg-zinc-100 transition"
              /* Old Style: hover:bg-zinc-800 */
            /* >
              <X size={18} />
            </button>
          </header> */}

          {/* Mensajes */}
          <main className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              /*<div className="flex flex-col items-center justify-center text-center h-full">
                <Sparkles size={40} className="text-zinc-300 mb-4" /* Old: text-indigo-400 */ /*/>
            <h1 className="text-lg font-bold">Bienvenido</h1>
            <p className="text-zinc-500 text-sm mt-2">
              Escribe tu nombre, email, presupuesto e interés.
            </p>
          </div>*/
              <div></div>
            ) : (
              <div className="space-y-4">
                {messages.map((m) => (
                  <ChatMessage key={m.id} message={m} />
                ))}
                {isLoading && (
                  <div className="p-2 flex gap-x-2">
                    <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center">
                      <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" />
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
            className="flex items-center bg-white border-t border-zinc-100 p-4"
          /* Old Style: bg-zinc-900 border-zinc-800 p-2 */
          >
            <input
              className="
                flex-1 border border-zinc-300 rounded-md px-3 py-2 
                shadow-lg focus:outline-none focus:ring-2 focus:ring-zinc-100
                text-zinc-900 placeholder-zinc-400 text-sm
                /* Old Style: bg-transparent px-3 py-2 text-zinc-100 placeholder-zinc-500 */
              "
              value={input}
              placeholder="Say something..."
              onChange={(e) => setInput(e.target.value)}
            />
            {/* <button
              type="submit"
              disabled={!input?.trim() || isLoading}
              className="
                ml-2 h-9 px-3 flex items-center justify-center 
                rounded-md bg-black text-white hover:bg-zinc-800 
                disabled:opacity-50 transition
                /* Old Style: bg-indigo-600 hover:bg-indigo-500 */
                /*
              "
            >
              <Send size={16} />
            </button>  */}
          </form>
        </div>
      )}
    </>
  );
}
