import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 overflow-hidden h-screen flex transition-colors duration-200">
      <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark flex flex-col h-full z-20">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-primary/10 rounded-full p-2">
              <span className="material-symbols-outlined text-primary text-3xl">school</span>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight text-slate-900 dark:text-white">MentorIA</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Portal do Aluno</p>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            <Link className="flex items-center gap-3 px-3 py-3 rounded-lg bg-primary/10 text-primary dark:text-primary-light font-medium" href="/student/dashboard">
              <span className="material-symbols-outlined fill-current">home</span>
              <span className="text-sm">Início</span>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors group" href="/student/history">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">history</span>
              <span className="text-sm font-medium">Histórico</span>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors group" href="#">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">settings</span>
              <span className="text-sm font-medium">Configurações</span>
            </Link>
            <LogoutButton variant="menu" />
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-cover bg-center" data-alt="Foto de perfil do usuário mostrando um homem sorrindo" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuClnA3apB8ve0XyILjfBulO_vPm3iXMPwB63Uf14BNHQIGQwHpC5zgkDlXqVUiP7m2X3JYWqseVn4aJjoZTK3uVNHIyXGJ7zQdVv-2Xlp6zrYfdml604wCcbpxQIyrOIKXjL5lPxRbR3DmgXAzzUNsJwRvaPqs5FdWAa0Oc3bU4f_B1_ONhjLGo9tjTMfGLqn2ejxDZ7TVCzwqi20wT5KTimzq3ZFeODBQ_e6jya-3oqAYfaMK64mEvllLM8pzg-3PezZSDgak-j1k")' }}></div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900 dark:text-white">Alex Morgan</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Aluno Pro</span>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {children}
      </main>
    </div>
  );
}

