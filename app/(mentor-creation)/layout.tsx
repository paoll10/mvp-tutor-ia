import Link from 'next/link';

export default function MentorCreationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-white font-display antialiased min-h-screen flex flex-col transition-colors duration-200">
      <header className="sticky top-0 z-50 w-full bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-[#e8f1f2] dark:border-gray-800">
        <div className="px-4 md:px-8 xl:px-40 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 text-text-main dark:text-white">
            <div className="size-8 text-primary">
              <span className="material-symbols-outlined text-3xl">school</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">MentorHub</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-sm font-medium text-text-muted">Rascunho salvo há 2m</span>
            <button className="flex items-center justify-center rounded-lg h-9 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-text-main dark:text-white text-sm font-bold transition-colors">
              Salvar Rascunho
            </button>
            <div className="bg-center bg-no-repeat bg-cover rounded-full size-9 border-2 border-white dark:border-gray-600 shadow-sm" data-alt="Mentor profile avatar showing a smiling professional" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBNi0_KWKYN_Nfo9feS3_JLtWDYN8Iqq_K3p75YXzOHUo5woxeYTSPk7Sf4K5hMu6-GZlDwdwITYtMabNtqUwxwXmrkpexWvAqZR_v5sf1BQTKSpjV26hicw5He74J2ta_kjAUeetK-p_JuXu8Pbgq3cc7_KqZFKpyZfqDxrsJ7-7mxJWjCR1iLhlrHUj-_iQMRG0nnAjqdmBZHx3Za3bh4YGMhLylCVPr3iHjxaTA5t3UwGjfCowqA_BYulpQHQTyHbLBFrmYxixo")' }}></div>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-8 xl:px-40 py-8 lg:py-12">
        {children}
      </main>
    </div>
  );
}

