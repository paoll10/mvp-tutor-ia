'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OAuthSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Verifica se está em um popup
    const isPopup = window.opener !== null;
    
    if (isPopup) {
      // Fecha o popup - a janela pai vai detectar e redirecionar
      window.close();
    } else {
      // Se não for popup, redireciona para a raiz
      // O middleware vai verificar se tem profile e redirecionar corretamente
      router.push('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
      <div className="text-center p-8 bg-surface-light dark:bg-surface-dark rounded-2xl shadow-soft max-w-md">
        <div className="size-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-3xl">check_circle</span>
        </div>
        <h1 className="text-2xl font-bold text-text-main dark:text-white mb-2">Login realizado!</h1>
        <p className="text-text-muted dark:text-gray-400 mb-4">
          Você foi autenticado com sucesso.
        </p>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
        <p className="text-sm text-text-muted dark:text-gray-400 mt-4">
          Redirecionando...
        </p>
      </div>
    </div>
  );
}

