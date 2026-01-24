'use client';

import { useState } from 'react';
import { createProfile } from '@/server/profiles';

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<'mentor' | 'aluno' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!selectedRole) {
      setError('Por favor, selecione seu perfil');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('role', selectedRole);

    const result = await createProfile(formData);
    
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
    // Se não houver erro, o redirect acontece no server action
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-display p-4 lg:p-8 transition-colors duration-300 bg-background-light dark:bg-background-dark">
      <div className="w-full max-w-[900px] bg-white dark:bg-surface-dark rounded-2xl shadow-soft overflow-hidden border border-gray-100 dark:border-gray-800">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 p-8 lg:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
              <span className="material-symbols-outlined text-[28px]">school</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">MentorIA</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Tutor 24h com IA</p>
            </div>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-3">
            Bem-vindo ao MentorIA! 👋
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl">
            Para começar, nos conte: como você pretende usar a plataforma?
          </p>
        </div>

        {/* Cards de seleção */}
        <div className="p-8 lg:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            
            {/* Card Mentor */}
            <button
              type="button"
              onClick={() => setSelectedRole('mentor')}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${
                selectedRole === 'mentor'
                  ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-lg shadow-primary/10'
                  : 'border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-white/5'
              }`}
            >
              {selectedRole === 'mentor' && (
                <div className="absolute top-4 right-4 text-primary">
                  <span className="material-symbols-outlined fill-1">check_circle</span>
                </div>
              )}
              
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                selectedRole === 'mentor'
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 group-hover:bg-primary/10 group-hover:text-primary'
              }`}>
                <span className="material-symbols-outlined text-[32px]">person_celebrate</span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Sou Mentor / Professor
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                Quero criar cursos, enviar materiais (PDFs) e ter um tutor IA que responde dúvidas dos meus alunos 24 horas.
              </p>
              
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-xs font-medium text-slate-600 dark:text-slate-300">
                  Criar cursos
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-xs font-medium text-slate-600 dark:text-slate-300">
                  Upload de PDFs
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-xs font-medium text-slate-600 dark:text-slate-300">
                  Tutor IA
                </span>
              </div>
            </button>

            {/* Card Aluno */}
            <button
              type="button"
              onClick={() => setSelectedRole('aluno')}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${
                selectedRole === 'aluno'
                  ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-lg shadow-primary/10'
                  : 'border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-white/5'
              }`}
            >
              {selectedRole === 'aluno' && (
                <div className="absolute top-4 right-4 text-primary">
                  <span className="material-symbols-outlined fill-1">check_circle</span>
                </div>
              )}
              
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                selectedRole === 'aluno'
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 group-hover:bg-primary/10 group-hover:text-primary'
              }`}>
                <span className="material-symbols-outlined text-[32px]">school</span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Sou Aluno
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                Quero entrar em cursos, estudar os materiais e tirar dúvidas com o tutor IA a qualquer hora do dia.
              </p>
              
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-xs font-medium text-slate-600 dark:text-slate-300">
                  Entrar em cursos
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-xs font-medium text-slate-600 dark:text-slate-300">
                  Chat com IA
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-xs font-medium text-slate-600 dark:text-slate-300">
                  24 horas
                </span>
              </div>
            </button>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">error</span>
              {error}
            </div>
          )}

          {/* Botão de continuar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400 dark:text-slate-500 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">info</span>
              Você poderá alterar isso depois nas configurações
            </p>
            
            <button
              onClick={handleSubmit}
              disabled={!selectedRole || isLoading}
              className="w-full sm:w-auto bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold text-base transition-all transform active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Criando perfil...
                </>
              ) : (
                <>
                  Continuar
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
