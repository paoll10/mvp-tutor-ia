import Link from 'next/link';

export default function MentorCourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-gray-100 font-display antialiased overflow-hidden h-screen flex">
      <aside className="w-72 h-full flex flex-col border-r border-gray-200 dark:border-gray-700 bg-background-light dark:bg-surface-dark transition-colors duration-300 flex-shrink-0">
        <div className="p-6 pb-2">
          <div className="flex gap-4 items-center mb-8">
            <div className="bg-center bg-no-repeat bg-cover rounded-xl size-12 shadow-sm border border-gray-100 dark:border-gray-600" data-alt="Abstract geometric pattern representing data structures" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA6b_lBEEHU6_o_r92dQU22TvJfsodCNjFFXE8jm8npJQmMs1qhjERX--0cyp7yax3HjR6-1dEww_Y48RrrdztYv1nC0ShOhFWAoCsVw1wIW7vcaLYQHSqWuK-BhNnb3GXd0_6QYvGMEupN63oaxjce11bsm261iy0iANhR_DTKEAygK9uIDHoX--ECqZV7LlpyB7FDf_KTSqXLvEFFWHE9Q3VUnW4zUi6nhIU7UoShEIZ7meR8Mz4_yBlQOq1-jtPJ-Sk0M3J4dvc")' }}>
            </div>
            <div className="flex flex-col">
              <h1 className="text-text-main dark:text-white text-base font-bold leading-tight">Estruturas de Dados Av.</h1>
              <p className="text-text-secondary dark:text-gray-400 text-xs font-medium uppercase tracking-wider mt-0.5">Outono 2024</p>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-main dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group" href="#">
              <span className="material-symbols-outlined text-[22px] text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">grid_view</span>
              <span className="text-sm font-medium">Visão Geral</span>
            </Link>
            <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-main dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group" href="#">
              <span className="material-symbols-outlined text-[22px] text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">group</span>
              <span className="text-sm font-medium">Alunos</span>
            </Link>
            <Link className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-300 font-semibold border-l-4 border-primary" href="#">
              <span className="material-symbols-outlined text-[22px] font-variation-settings-'FILL'1">folder_open</span>
              <span className="text-sm">Materiais</span>
            </Link>
            <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-main dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group" href="#">
              <span className="material-symbols-outlined text-[22px] text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">chat_bubble_outline</span>
              <span className="text-sm font-medium">Chat</span>
            </Link>
            <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-main dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group" href="#">
              <span className="material-symbols-outlined text-[22px] text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">settings</span>
              <span className="text-sm font-medium">Configurações</span>
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
              JD
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-text-main dark:text-white">Jane Doe</span>
              <span className="text-xs text-text-secondary dark:text-gray-400">Mentor Líder</span>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-background-light dark:bg-background-dark relative">
        {children}
      </main>
    </div>
  );
}

