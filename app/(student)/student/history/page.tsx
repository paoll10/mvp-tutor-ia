'use client';

export default function ConversationHistoryPage() {
  return (
    <>
      <header className="h-16 border-b border-slate-200 dark:border-slate-700 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
        <button className="lg:hidden text-slate-500 mr-4">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">search</span>
            </div>
            <input className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg leading-5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all shadow-sm" placeholder="Buscar conversas, tópicos ou mentores..." type="text" />
          </div>
        </div>
        <div className="flex items-center gap-4 ml-6">
          <button className="relative p-2 text-slate-500 hover:text-primary transition-colors rounded-full hover:bg-primary/5">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-surface-dark"></span>
          </button>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
          <button className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-xl">help</span>
            <span>Ajuda</span>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Histórico de Conversas</h1>
              <p className="text-slate-500 dark:text-slate-400 font-body max-w-xl">
                Gerencie e revise suas sessões de mentoria passadas. Todos os seus registros de chat com mentores de IA e professores estão arquivados aqui.
              </p>
            </div>
            <button className="hidden md:flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-primary/20 active:scale-95">
              <span className="material-symbols-outlined text-[20px]">add_comment</span>
              Nova Conversa
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 sticky top-0 z-0 py-2 bg-background-light dark:bg-background-dark/95 backdrop-blur transition-all">
            <div className="flex gap-2 flex-wrap">
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-medium shadow-sm transition-transform hover:-translate-y-0.5">
                Todos os Cursos
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors hover:border-primary/30">
                Data
                <span className="material-symbols-outlined text-[18px]">sort</span>
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors hover:border-primary/30">
                Não Lidas
              </button>
            </div>
            <span className="text-sm text-slate-400 font-body">Mostrando 5 de 128 sessões</span>
          </div>

          <div className="flex flex-col gap-4">
            <div className="group relative bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/50 cursor-pointer">
              <div className="flex justify-between items-start gap-4">
                <div className="shrink-0 size-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/50">
                  <span className="material-symbols-outlined">code</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">Introdução ao Python</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 uppercase tracking-wider">Programação</span>
                    </div>
                    <span className="text-xs font-medium text-slate-400 whitespace-nowrap font-body">Há 2 horas</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm font-body leading-relaxed line-clamp-2 pr-8">
                    Você pode explicar a diferença entre uma tupla e uma lista novamente? Entendo que tuplas são imutáveis, mas existem implicações de desempenho ao iterar sobre grandes conjuntos de dados?
                  </p>
                </div>
                <div className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/50 cursor-pointer">
              <div className="flex justify-between items-start gap-4">
                <div className="shrink-0 size-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-100 dark:border-purple-900/50">
                  <span className="material-symbols-outlined">design_services</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">Princípios de Design UX</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 uppercase tracking-wider">Design</span>
                    </div>
                    <span className="text-xs font-medium text-slate-400 whitespace-nowrap font-body">Ontem</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm font-body leading-relaxed line-clamp-2 pr-8">
                    Aqui está o feedback sobre seu wireframe. Ótimo uso de espaço em branco, mas considere aumentar o contraste nos botões secundários para melhor conformidade com acessibilidade.
                  </p>
                </div>
                <div className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Other history items could go here */}
          </div>

          <div className="flex justify-center pt-6">
            <button className="px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 font-medium hover:bg-white dark:hover:bg-slate-700 hover:text-primary dark:hover:text-primary-light transition-colors focus:ring-4 focus:ring-primary/10">
              Carregar Mais Conversas
            </button>
          </div>

          <div className="flex justify-center items-center gap-2 text-slate-400 dark:text-slate-500 text-xs mt-8">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span>Todas as conversas são privadas e criptografadas de ponta a ponta.</span>
          </div>
        </div>
      </div>
    </>
  );
}

