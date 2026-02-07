'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login, signup } from '@/app/auth/actions';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
  const [role, setRole] = useState<'student' | 'mentor'>('student');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    formData.append('role', role);

    let result: { error?: string; success?: string } | undefined;
    if (mode === 'login') {
      result = await login(formData);
    } else {
      result = await signup(formData);
    }

    if (result?.error) {
      setMessage(result.error);
    } else if (result?.success) {
      setMessage(result.success);
    }
    setIsLoading(false);
  };

  // Função para abrir login com Google em popup
  const handleGoogleLogin = useCallback(async () => {
    setIsLoading(true);
    setMessage(null);

    const supabase = createClient();
    
    // Gera a URL de OAuth
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        skipBrowserRedirect: true, // Não redireciona automaticamente
        queryParams: {
          prompt: 'consent',        // Força a tela de autorização sempre
          access_type: 'offline',   // Solicita refresh token
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
      return;
    }

    if (data.url) {
      // Configurações do popup
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      // Abre o popup
      const popup = window.open(
        data.url,
        'google-oauth-popup',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
      );

      if (!popup) {
        setMessage('Popup bloqueado! Por favor, permita popups para este site.');
        setIsLoading(false);
        return;
      }

      // Monitora o popup
      const checkPopup = setInterval(async () => {
        try {
          // Verifica se o popup foi fechado
          if (popup.closed) {
            clearInterval(checkPopup);
            
            // Verifica se o usuário está autenticado
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session) {
              // Login bem-sucedido! Redireciona para raiz
              // O middleware vai verificar se tem profile e redirecionar corretamente
              router.push('/');
            } else {
              setIsLoading(false);
            }
            return;
          }

          // Tenta verificar a URL do popup (só funciona se for do mesmo domínio)
          if (popup.location.href.includes('/auth/callback')) {
            popup.close();
          }
        } catch {
          // Erro de cross-origin é esperado enquanto estiver no Google
        }
      }, 500);

      // Timeout de segurança (5 minutos)
      setTimeout(() => {
        clearInterval(checkPopup);
        if (!popup.closed) {
          popup.close();
        }
        setIsLoading(false);
      }, 300000);
    }
  }, [router]);

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
          <div className="hidden sm:flex items-center gap-6">
            <Link className="text-text-main dark:text-white/80 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors" href="#">Início</Link>
            <Link className="text-text-main dark:text-white/80 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors" href="#">Central de Ajuda</Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-surface-light dark:bg-surface-dark rounded-2xl shadow-soft p-8 sm:p-10 border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/40 via-primary to-primary/40"></div>
          
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-text-main dark:text-white mb-2">
              {mode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
            </h1>
            <p className="text-text-muted dark:text-gray-400 text-sm">
              {mode === 'login' 
                ? 'Escolha seu perfil para continuar' 
                : 'Preencha os dados para começar'}
            </p>
          </div>

          <div className="mb-8">
            <div className="relative flex w-full bg-[#e8f1f2] dark:bg-gray-700 rounded-lg p-1 h-12">
              <div 
                className="absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] bg-surface-light dark:bg-gray-600 rounded-md shadow-sm transition-transform duration-300 ease-in-out transform"
                style={{ transform: role === 'student' ? 'translateX(0%)' : 'translateX(100%)' }}
              ></div>
              <label className="flex-1 relative z-10 cursor-pointer">
                <input 
                  className="peer sr-only" 
                  name="role" 
                  type="radio" 
                  value="student" 
                  checked={role === 'student'} 
                  onChange={() => setRole('student')}
                />
                <div className={`flex h-full w-full items-center justify-center rounded-md text-sm font-medium transition-colors ${role === 'student' ? 'text-primary font-bold dark:text-white' : 'text-text-muted dark:text-gray-400'}`}>
                  Aluno
                </div>
              </label>
              <label className="flex-1 relative z-10 cursor-pointer">
                <input 
                  className="peer sr-only" 
                  name="role" 
                  type="radio" 
                  value="mentor" 
                  checked={role === 'mentor'}
                  onChange={() => setRole('mentor')}
                />
                <div className={`flex h-full w-full items-center justify-center rounded-md text-sm font-medium transition-colors ${role === 'mentor' ? 'text-primary font-bold dark:text-white' : 'text-text-muted dark:text-gray-400'}`}>
                  Mentor
                </div>
              </label>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-main dark:text-gray-200" htmlFor="email">Endereço de E-mail</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted dark:text-gray-500 group-focus-within/input:text-primary dark:group-focus-within/input:text-primary">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <input className="block w-full pl-10 pr-3 py-3 border border-[#d1e3e6] dark:border-gray-600 rounded-lg bg-background-light dark:bg-gray-800 text-text-main dark:text-white placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm" id="email" name="email" placeholder="nome@exemplo.com" type="email" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-text-main dark:text-gray-200" htmlFor="password">Senha</label>
                {mode === 'login' && (
                  <Link className="text-sm font-medium text-primary hover:text-primary-dark dark:hover:text-cyan-400 transition-colors" href="/forgot-password">Esqueceu a senha?</Link>
                )}
              </div>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted dark:text-gray-500 group-focus-within/input:text-primary dark:group-focus-within/input:text-primary">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input className="block w-full pl-10 pr-10 py-3 border border-[#d1e3e6] dark:border-gray-600 rounded-lg bg-background-light dark:bg-gray-800 text-text-main dark:text-white placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm" id="password" name="password" placeholder="Digite sua senha" type="password" required />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-text-muted hover:text-primary dark:hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[20px]">visibility</span>
                </div>
              </div>
            </div>

            {message && (
              <div className="p-3 bg-red-50 text-red-500 text-sm rounded-md border border-red-100">
                {message}
              </div>
            )}

            <button disabled={isLoading} className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed" type="submit">
              <span>{isLoading ? 'Processando...' : (mode === 'login' ? 'Entrar' : 'Cadastrar')}</span>
              {!isLoading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface-light dark:bg-surface-dark text-text-muted dark:text-gray-400">Ou continue com</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button onClick={handleGoogleLogin} className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm font-medium text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-200" type="button">
              <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M12.0003 20.45c4.6667 0 8.5334-3.2333 9.95-7.75H12.0003v-3.4h13.2836c.1333.5667.2167 1.1667.2167 1.8 0 6.6333-5.3666 12-12 12-6.6333 0-12-5.3667-12-12s5.3667-12 12-12c3.2333 0 6.1333 1.1667 8.4167 3.2833l-2.4334 2.4334c-1.5333-1.4667-3.6666-2.3167-5.9833-2.3167-4.9667 0-9 4.0333-9 9s4.0333 9 9 9Z" fill="currentColor"></path>
              </svg>
              <span>Google</span>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-text-muted dark:text-gray-400">
              {mode === 'login' ? 'Novo por aqui?' : 'Já tem uma conta?'}{' '}
              <button 
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="font-semibold text-primary hover:text-primary-dark dark:hover:text-white transition-colors"
              >
                {mode === 'login' ? 'Criar uma conta' : 'Entrar na conta'}
              </button>
            </p>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-text-muted/60 dark:text-gray-500">
        <p>© 2024 MentorIA. Todos os direitos reservados.</p>
        <div className="flex justify-center gap-4 mt-2">
          <Link className="hover:text-text-main dark:hover:text-gray-300" href="#">Política de Privacidade</Link>
          <Link className="hover:text-text-main dark:hover:text-gray-300" href="#">Termos de Serviço</Link>
        </div>
      </footer>
    </div>
  );
}
