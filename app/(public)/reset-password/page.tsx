'use client';

import { useState } from 'react';
import Link from 'next/link';
import { resetPassword } from '@/app/auth/actions';

export default function ResetPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const result = await resetPassword(formData);

    if (result?.error) {
      setMessage(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <header className="w-full border-b border-[#e8f1f2] dark:border-gray-700 bg-surface-light dark:bg-surface-dark px-6 py-4 lg:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3 text-primary dark:text-white">
            <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 dark:bg-white/10 text-primary dark:text-white">
              <span className="material-symbols-outlined text-[20px]">school</span>
            </div>
            <h2 className="text-xl font-bold leading-tight tracking-tight text-text-main dark:text-white font-display">MentorIA</h2>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-surface-light dark:bg-surface-dark rounded-2xl shadow-soft p-8 sm:p-10 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/40 via-primary to-primary/40"></div>
          
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-text-main dark:text-white mb-2">Redefinir Senha</h1>
            <p className="text-text-muted dark:text-gray-400 text-sm">
              Digite sua nova senha abaixo.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-main dark:text-gray-200" htmlFor="password">Nova Senha</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted dark:text-gray-500 group-focus-within/input:text-primary dark:group-focus-within/input:text-primary">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input className="block w-full pl-10 pr-10 py-3 border border-[#d1e3e6] dark:border-gray-600 rounded-lg bg-background-light dark:bg-gray-800 text-text-main dark:text-white placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm" id="password" name="password" placeholder="Digite sua nova senha" type="password" required />
              </div>
            </div>

            {message && (
              <div className="p-3 bg-red-50 text-red-500 text-sm rounded-md border border-red-100">
                {message}
              </div>
            )}

            <button disabled={isLoading} className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed" type="submit">
              <span>{isLoading ? 'Atualizando...' : 'Atualizar Senha'}</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

