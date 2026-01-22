import Link from 'next/link';

export default function MentorGlobalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-white overflow-hidden h-screen flex">
      <aside className="w-64 h-full bg-surface-light dark:bg-surface-dark border-r border-[#e8f1f2] dark:border-[#444] flex flex-col justify-between p-6 z-20 hidden md:flex shrink-0">
        <div className="flex flex-col gap-8">
          <div className="flex gap-3 items-center">
            <div className="bg-primary/10 rounded-xl size-10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined fill">school</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-text-main dark:text-white text-lg font-bold leading-none tracking-tight">EduPlatform</h1>
              <p className="text-text-secondary text-xs font-medium mt-1">Painel do Mentor</p>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            <Link className="flex items-center gap-3 px-3 py-3 rounded-lg bg-primary/10 text-primary transition-colors group" href="/mentor/dashboard">
              <span className="material-symbols-outlined fill">dashboard</span>
              <span className="text-sm font-bold">Painel</span>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-3 rounded-lg text-text-secondary hover:bg-[#e8f1f2] dark:hover:bg-[#444] hover:text-text-main transition-colors" href="#">
              <span className="material-symbols-outlined">chat_bubble</span>
              <span className="text-sm font-medium">Mensagens</span>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-3 rounded-lg text-text-secondary hover:bg-[#e8f1f2] dark:hover:bg-[#444] hover:text-text-main transition-colors" href="#">
              <span className="material-symbols-outlined">calendar_month</span>
              <span className="text-sm font-medium">Agenda</span>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-3 rounded-lg text-text-secondary hover:bg-[#e8f1f2] dark:hover:bg-[#444] hover:text-text-main transition-colors" href="#">
              <span className="material-symbols-outlined">folder_open</span>
              <span className="text-sm font-medium">Recursos</span>
            </Link>
          </nav>
        </div>
        <div className="flex flex-col gap-4">
          <Link className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:bg-[#e8f1f2] dark:hover:bg-[#444] hover:text-text-main transition-colors" href="#">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm font-medium">Configurações</span>
          </Link>
          <div className="pt-4 border-t border-[#e8f1f2] dark:border-[#444]">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#e8f1f2] dark:hover:bg-[#444] cursor-pointer transition-colors">
              <div className="size-10 rounded-full bg-cover bg-center border border-gray-200" data-alt="Portrait of a user" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBQXRAyfhnnvFUTmzkIRu-VV8benrw5RKQesP1DZggJnEDZY04yDKNn8mnrY42hH90LXYYzPxQM_zHU53jP0q41c_Pl5EZ76npdQpSfupwqIcXczHgDoTImYycMpjFCUd-v7JVwUTVDk31087QuA7CO1mcZlXgichJy6CSKi8ZkgLx2Yc571l8TAFH4CA3HETuOr3X8tBy_YZfvw8sHO222Z_sylF50I-jTtHBOVOsUo45VAJkr_5Rf1urNkcRP90nTyxWIJQm1-yk")' }}></div>
              <div className="flex flex-col overflow-hidden">
                <p className="text-sm font-bold truncate">Alex Morgan</p>
                <p className="text-xs text-text-secondary truncate">Mentor Sênior</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {children}
      </main>
      <div className="fixed bottom-8 right-8 z-50">
        <button className="bg-primary hover:bg-primary-dark text-white rounded-full p-4 shadow-lg shadow-primary/30 transition-transform hover:scale-110 active:scale-95 flex items-center justify-center">
          <span className="material-symbols-outlined text-[28px]">smart_toy</span>
        </button>
      </div>
    </div>
  );
}

