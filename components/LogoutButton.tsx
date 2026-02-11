'use client';

import { logoutCustom } from '@/server/auth-custom';

interface LogoutButtonProps {
  variant?: 'icon' | 'full' | 'menu';
  className?: string;
}

export default function LogoutButton({ variant = 'full', className = '' }: LogoutButtonProps) {
  const handleLogout = async () => {
    await logoutCustom();
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleLogout}
        className={`flex items-center justify-center size-9 rounded-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-red-500 hover:border-red-300 transition-colors shadow-sm ${className}`}
        title="Sair"
      >
        <span className="material-symbols-outlined text-[20px]">logout</span>
      </button>
    );
  }

  if (variant === 'menu') {
    return (
      <button
        onClick={handleLogout}
        className={`flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors group w-full ${className}`}
      >
        <span className="material-symbols-outlined text-slate-400 group-hover:text-red-500 transition-colors">logout</span>
        <span className="text-sm font-medium">Sair</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 transition-colors text-sm font-medium ${className}`}
    >
      <span className="material-symbols-outlined text-[18px]">logout</span>
      <span>Sair</span>
    </button>
  );
}

