'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function OAuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const message = searchParams.get('message');

  useEffect(() => {
    // Verifica se está em um popup
    const isPopup = window.opener !== null;
    
    if (isPopup) {
      // Envia mensagem de erro para a janela pai
      try {
        window.opener.postMessage(
          { 
            type: 'OAUTH_ERROR',
            error: error || 'unknown_error',
            message: message || 'Erro ao fazer login com Google.'
          },
          window.location.origin
        );
      } catch (err) {
        console.error('Erro ao enviar mensagem de erro para janela pai:', err);
      }
      
      // Fecha o popup
      setTimeout(() => {
        window.close();
      }, 100);
    }
  }, [error, message]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
      <div className="text-center p-8 bg-surface-light dark:bg-surface-dark rounded-2xl shadow-soft max-w-md">
        <div className="size-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-3xl">error</span>
        </div>
        <h1 className="text-2xl font-bold text-text-main dark:text-white mb-2">Erro no login</h1>
        <p className="text-text-muted dark:text-gray-400 mb-4">
          {message || 'Ocorreu um erro ao fazer login com Google.'}
        </p>
        <p className="text-sm text-text-muted dark:text-gray-500">
          Esta janela será fechada automaticamente.
        </p>
      </div>
    </div>
  );
}
