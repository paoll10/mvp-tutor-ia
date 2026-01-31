'use client';

import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { getStudentCourse } from '@/server/student-courses';
import { askQuestion, type ChatMessage } from '@/server/chat';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StudentCourseChatPage({ params }: PageProps) {
  const { id: courseId } = use(params);
  const [course, setCourse] = useState<Awaited<ReturnType<typeof getStudentCourse>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Carrega dados do curso
  useEffect(() => {
    async function loadCourse() {
      const data = await getStudentCourse(courseId);
      setCourse(data);
      setLoading(false);

      // Mensagem de boas-vindas
      if (data) {
        setMessages([
          {
            role: 'assistant',
            content: `Olá! Sou o tutor de IA do curso "${data.name}". Estou aqui para ajudar você a estudar o material do curso. Faça qualquer pergunta sobre o conteúdo!`,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    }
    loadCourse();
  }, [courseId]);

  // Scroll para o final quando novas mensagens chegam
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Envia pergunta
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setSending(true);

    try {
      const response = await askQuestion(courseId, userMessage.content);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.answer,
        timestamp: new Date().toISOString(),
        sources: response.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro ao enviar pergunta:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  // Formata hora
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-slate-500">Carregando curso...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8">
          <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">error</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Curso não encontrado</h2>
          <p className="text-slate-500 mb-4">Você não tem acesso a este curso.</p>
          <Link href="/student/dashboard" className="text-primary hover:underline">
            Voltar ao dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-surface-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link
            href="/student/dashboard"
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {course.name}
              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-bold uppercase tracking-wide border border-green-200 dark:border-green-800">
                Ativo
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              Tutor de IA disponível
            </p>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 flex flex-col gap-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-4 max-w-4xl ${
              message.role === 'user' ? 'ml-auto justify-end' : 'mr-auto'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 mt-1">
                <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-[#0e4f57] flex items-center justify-center shadow-lg text-white">
                  <span className="material-symbols-outlined">smart_toy</span>
                </div>
              </div>
            )}

            <div className={`flex flex-col gap-1.5 ${message.role === 'user' ? 'items-end' : ''}`}>
              <div className="flex items-center gap-2 mx-1">
                {message.role === 'user' && (
                  <span className="text-[10px] text-slate-400">{formatTime(message.timestamp)}</span>
                )}
                <span
                  className={`text-xs font-bold ${
                    message.role === 'assistant'
                      ? 'text-primary dark:text-primary-300'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {message.role === 'assistant' ? 'Tutor IA' : 'Você'}
                </span>
                {message.role === 'assistant' && (
                  <span className="text-[10px] text-slate-400">{formatTime(message.timestamp)}</span>
                )}
              </div>

              <div
                className={`p-5 rounded-2xl shadow-soft font-body text-[15px] leading-relaxed ${
                  message.role === 'assistant'
                    ? 'rounded-tl-sm bg-white dark:bg-surface-dark text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700'
                    : 'rounded-tr-sm bg-primary text-white'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>

                {/* Sources */}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                      Fontes consultadas:
                    </p>
                    <div className="flex flex-col gap-2">
                      {message.sources.map((source, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg"
                        >
                          <span className="material-symbols-outlined text-primary text-sm mt-0.5">
                            description
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                              {source.title}
                            </p>
                            {source.snippet && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                                "{source.snippet}"
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {message.role === 'user' && (
              <div className="flex-shrink-0 mt-1">
                <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">person</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {sending && (
          <div className="flex items-start gap-4 max-w-4xl mr-auto">
            <div className="flex-shrink-0 mt-1">
              <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-[#0e4f57] flex items-center justify-center shadow-lg text-white">
                <span className="material-symbols-outlined">smart_toy</span>
              </div>
            </div>
            <div className="p-5 rounded-2xl rounded-tl-sm bg-white dark:bg-surface-dark shadow-soft border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
                <span className="text-sm text-slate-500">Pensando...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} className="h-24" />
      </div>

      {/* Input */}
      <div className="absolute bottom-0 left-0 w-full px-4 md:px-8 pb-6 pt-4 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark z-10">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto relative">
          <div className="flex items-end gap-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-600 rounded-2xl shadow-float p-2 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              className="flex-1 bg-transparent border-0 focus:ring-0 focus:outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 py-3 px-2 font-body resize-none max-h-32 custom-scrollbar"
              placeholder="Faça uma pergunta sobre o material do curso..."
              rows={1}
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="p-2.5 rounded-xl bg-primary text-white shadow-md hover:bg-primary-hover transition-transform active:scale-95 shrink-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[20px]">
                {sending ? 'sync' : 'send'}
              </span>
            </button>
          </div>
          <div className="text-center mt-2">
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              A IA responde com base nos materiais do curso. Pressione Enter para enviar.
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
