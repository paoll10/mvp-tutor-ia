'use client';

import { useState } from 'react';
import { loginCustom } from '@/server/auth-custom';

export default function LoginPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);

    const result = await loginCustom(formData);

    if (result?.error) {
      setMessage(result.error);
      setIsLoading(false);
    }
    // Se não houver erro, o loginCustom já redireciona automaticamente
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-text-main dark:text-white mb-2">MentorIA</h1>
            <p className="text-text-muted dark:text-gray-400">Faça login para continuar</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-main dark:text-gray-200" htmlFor="email">
                Endereço de E-mail
              </label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted dark:text-gray-500 group-focus-within/input:text-primary dark:group-focus-within/input:text-primary">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-3 border border-[#d1e3e6] dark:border-gray-600 rounded-lg bg-background-light dark:bg-gray-800 text-text-main dark:text-white placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
                  id="email"
                  name="email"
                  placeholder="nome@exemplo.com"
                  type="email"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-main dark:text-gray-200" htmlFor="password">
                Senha
              </label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted dark:text-gray-500 group-focus-within/input:text-primary dark:group-focus-within/input:text-primary">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input
                  className="block w-full pl-10 pr-10 py-3 border border-[#d1e3e6] dark:border-gray-600 rounded-lg bg-background-light dark:bg-gray-800 text-text-main dark:text-white placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
                  id="password"
                  name="password"
                  placeholder="Digite sua senha"
                  type="password"
                  required
                />
              </div>
            </div>

            {message && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 text-sm rounded-md border border-red-100 dark:border-red-800">
                {message}
              </div>
            )}

            <button
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
            >
              <span>{isLoading ? 'Processando...' : 'Entrar'}</span>
              {!isLoading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-text-muted dark:text-gray-400">
            <p>
              <strong>Mentor:</strong> mentor@mentoria.com / Mentor123!@#
            </p>
            <p className="mt-1">
              <strong>Aluno:</strong> aluno@mentoria.com / Aluno123!@#
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
