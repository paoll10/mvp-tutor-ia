import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

export default function StudentCourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display antialiased overflow-hidden h-screen flex">
      <nav className="hidden md:flex flex-col items-center w-20 py-6 bg-surface-light dark:bg-[#1e1e1e] border-r border-slate-200 dark:border-slate-700 z-20 flex-shrink-0">
        <div className="mb-8">
          <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-soft">
            <span className="material-symbols-outlined">school</span>
          </div>
        </div>
        <div className="flex flex-col gap-6 w-full px-2">
          <Link className="flex flex-col items-center gap-1 p-2 rounded-xl text-slate-500 hover:bg-neutral-light dark:text-slate-400 dark:hover:bg-neutral-dark transition-colors group" href="/student/history">
            <span className="material-symbols-outlined text-[28px] group-hover:text-primary transition-colors">dashboard</span>
            <span className="text-[10px] font-medium">Início</span>
          </Link>
          <Link className="flex flex-col items-center gap-1 p-2 rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-300 transition-colors" href="#">
            <span className="material-symbols-outlined text-[28px] fill-1">book_2</span>
            <span className="text-[10px] font-medium">Cursos</span>
          </Link>
          <Link className="flex flex-col items-center gap-1 p-2 rounded-xl text-slate-500 hover:bg-neutral-light dark:text-slate-400 dark:hover:bg-neutral-dark transition-colors group" href="#">
            <span className="material-symbols-outlined text-[28px] group-hover:text-primary transition-colors">calendar_month</span>
            <span className="text-[10px] font-medium">Agenda</span>
          </Link>
          <Link className="flex flex-col items-center gap-1 p-2 rounded-xl text-slate-500 hover:bg-neutral-light dark:text-slate-400 dark:hover:bg-neutral-dark transition-colors group" href="#">
            <span className="material-symbols-outlined text-[28px] group-hover:text-primary transition-colors">forum</span>
            <span className="text-[10px] font-medium">Social</span>
          </Link>
        </div>
        <div className="mt-auto flex flex-col gap-4 items-center">
          <LogoutButton variant="icon" />
          <div className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-white dark:border-slate-600 shadow-sm cursor-pointer" data-alt="User profile picture of a student" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCp54NbzdcjJNox-T2_i5AuLxAnDfk_D_vFalH4RsdkbrBbCvDBDi307CLxXhBxkQIgj1f6SqFjD1mCXUDgpJ7PIP40qPlfpaFYvAKcwRSUoul02Yc1XO3HqxiJ_7pBK7DpIRKQVgtp7V3pu0KUH1wHv7-_qE1S4Rw8yVPEpeFWSnTi7i2zxbIaBUiB4GqR_Z5OjPJpU8s6jEWD-VLjoh1RXYoA7QxMySJBldMFbtSsfcV9bIJ5-PGOYa9VNHKpLN2eXhaFSqE8WvY")' }}></div>
        </div>
      </nav>

      <aside className="hidden lg:flex flex-col w-72 bg-slate-50 dark:bg-[#252526] border-r border-slate-200 dark:border-slate-700 flex-shrink-0 z-10">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-2 mb-1 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Voltar ao Painel
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mt-4">Introdução à Psicologia</h1>
          <p className="text-primary font-medium text-sm">PSI-101 • Semestre de Outono</p>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 flex flex-col gap-1">
          <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase px-3 py-2 mt-2">Material do Curso</div>
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-neutral-dark hover:shadow-sm transition-all" href="#">
            <span className="material-symbols-outlined text-slate-400">home_app_logo</span>
            <span className="text-sm font-medium">Início do Curso</span>
          </Link>
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-neutral-dark hover:shadow-sm transition-all" href="#">
            <span className="material-symbols-outlined text-slate-400">description</span>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Módulo 1</span>
              <span className="text-[11px] text-slate-400 font-normal">Fundamentos &amp; História</span>
            </div>
          </Link>
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-neutral-dark hover:shadow-sm transition-all" href="#">
            <span className="material-symbols-outlined text-slate-400">description</span>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Módulo 2</span>
              <span className="text-[11px] text-slate-400 font-normal">Redes Neurais</span>
            </div>
          </Link>
          <Link className="flex items-center gap-3 px-3 py-3 mt-2 rounded-lg bg-white dark:bg-surface-dark shadow-soft border-l-4 border-primary group transition-all" href="#">
            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary dark:text-primary-300 group-hover:bg-primary group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[18px]">smart_toy</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900 dark:text-white">MentorIA</span>
              <span className="text-[11px] text-primary dark:text-primary-300 font-medium">Online • Contexto: Mód 2</span>
            </div>
          </Link>
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-neutral-dark hover:shadow-sm transition-all mt-1" href="#">
            <span className="material-symbols-outlined text-slate-400">description</span>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Módulo 3</span>
              <span className="text-[11px] text-slate-400 font-normal">Comportamento Cognitivo</span>
            </div>
          </Link>
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-neutral-dark hover:shadow-sm transition-all" href="#">
            <span className="material-symbols-outlined text-slate-400">quiz</span>
            <span className="text-sm font-medium">Quizzes &amp; Notas</span>
          </Link>
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
            <p className="text-xs font-medium text-primary mb-1">Progresso Semanal</p>
            <div className="w-full bg-slate-200 dark:bg-slate-600 h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: '65%' }}></div>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 text-right">65% Concluído</p>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark relative">
        {children}
      </main>
    </div>
  );
}

