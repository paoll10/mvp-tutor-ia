'use client';

export default function StudentCourseChatPage() {
  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 bg-surface-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button className="lg:hidden p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              MentorIA
              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-bold uppercase tracking-wide border border-green-200 dark:border-green-800">Ativo</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              Contexto: Módulo 2 Redes Neurais
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center size-9 rounded-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>
          <button className="flex items-center justify-center size-9 rounded-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors shadow-sm relative">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-0 right-0 size-2.5 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark"></span>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 flex flex-col gap-6">
        <div className="flex items-center justify-center gap-4 py-4">
          <div className="h-px bg-slate-200 dark:bg-slate-700 w-24"></div>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Hoje, 10:23</span>
          <div className="h-px bg-slate-200 dark:bg-slate-700 w-24"></div>
        </div>

        <div className="flex items-end gap-4 max-w-4xl mr-auto group">
          <div className="flex-shrink-0 mb-1">
            <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-[#0e4f57] flex items-center justify-center shadow-lg text-white">
              <span className="material-symbols-outlined">smart_toy</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 ml-1">
              <span className="text-xs font-bold text-primary dark:text-primary-300">IA do Curso</span>
              <span className="text-[10px] text-slate-400">10:23</span>
            </div>
            <div className="p-5 rounded-2xl rounded-tl-sm bg-white dark:bg-surface-dark shadow-soft text-slate-700 dark:text-slate-200 font-body text-[15px] leading-relaxed border border-slate-100 dark:border-slate-700">
              <p>Olá! Posso ajudar você a revisar o <span className="font-bold text-slate-900 dark:text-white">Módulo 2</span>. Recentemente cobrimos o básico de como os neurônios transmitem sinais. Que dúvidas você tem sobre Redes Neurais?</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-1 ml-1">
              <button className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-transparent text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-colors">Explicar Potenciais de Ação</button>
              <button className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-transparent text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-colors">Revisar Sinapses</button>
            </div>
          </div>
        </div>

        <div className="flex items-end gap-3 max-w-3xl ml-auto justify-end group">
          <div className="flex flex-col gap-1.5 items-end">
            <div className="flex items-center gap-2 mr-1">
              <span className="text-[10px] text-slate-400">10:25</span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Você</span>
            </div>
            <div className="p-5 rounded-2xl rounded-tr-sm bg-primary text-white shadow-md font-body text-[15px] leading-relaxed">
              <p>Pode me explicar a diferença entre um neurônio biológico e um perceptron?</p>
            </div>
          </div>
          <div className="flex-shrink-0 mb-1">
            <div className="size-8 rounded-full bg-cover bg-center ring-2 ring-white dark:ring-slate-700 shadow-sm" data-alt="Student profile photo" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC-KyNEVsbP_Xp83rDuNJuFirCP0Py5lH_2W29_xHBcTvszGngQlPtwOmruNalpy7gcsKVUuR2_yFjypvu-XoLCH1r7Vfk5WOSNhoE5mXyemlytbdcbIQc2HLxvXNmH0m_7xwoI2SQ2u8T4CibMY3-xTcvu8b5rLJwZDp1qYZQ6ayi_Oho7vQDXdOp790Lk7ooi8muXkRr7GvMa_CZFtQqZlbtYqnBqSPUGHtRTeTHYEo5A5VV49cHb1_MDD_7A5ws35bbE_1EwfM0")' }}></div>
          </div>
        </div>

        <div className="flex items-start gap-4 max-w-4xl mr-auto group">
          <div className="flex-shrink-0 mt-1">
            <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-[#0e4f57] flex items-center justify-center shadow-lg text-white">
              <span className="material-symbols-outlined">smart_toy</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-2 ml-1">
              <span className="text-xs font-bold text-primary dark:text-primary-300">IA do Curso</span>
              <span className="text-[10px] text-slate-400">10:26</span>
            </div>
            <div className="p-6 rounded-2xl rounded-tl-sm bg-white dark:bg-surface-dark shadow-soft text-slate-700 dark:text-slate-200 font-body text-[15px] leading-relaxed border border-slate-100 dark:border-slate-700 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 to-transparent"></div>
              <p className="mb-4">Ótima pergunta! Aqui está a principal distinção:</p>
              <p className="mb-4">
                Um <span className="font-bold text-slate-900 dark:text-white">neurônio biológico</span> é uma célula complexa que usa sinais eletroquímicos. Ele dispara apenas quando um certo limiar é atingido (princípio do tudo ou nada).
                <button className="inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors align-middle cursor-pointer text-[11px] font-bold tracking-tight">
                  <span className="material-symbols-outlined text-[12px]">menu_book</span>
                  Aula 3, Slide 12
                </button>
              </p>
              <p className="mb-4">
                Um <span className="font-bold text-slate-900 dark:text-white">perceptron</span> é um modelo matemático simplificado de um neurônio usado em aprendizado de máquina. Ele recebe entradas, aplica pesos, soma-os e passa o resultado por uma função de ativação.
                <button className="inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors align-middle cursor-pointer text-[11px] font-bold tracking-tight">
                  <span className="material-symbols-outlined text-[12px]">description</span>
                  Livro Cap. 4
                </button>
              </p>
              <p>Enquanto os neurônios são contínuos e assíncronos, os perceptrons são funções matemáticas discretas e síncronas.</p>
              <div className="mt-5 p-3 bg-background-light dark:bg-neutral-dark rounded-xl border border-slate-200 dark:border-slate-600 flex gap-3 items-start">
                <div className="size-10 rounded-lg bg-white dark:bg-surface-dark flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-500 shadow-sm text-primary">
                  <span className="material-symbols-outlined">picture_as_pdf</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">Introducao_a_Redes_Neurais.pdf</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">"O perceptron é o bloco de construção do aprendizado profundo, modelado após o neurônio biológico, mas removendo a complexidade biológica..."</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300">Página 45</span>
                    <button className="text-[10px] font-bold text-primary hover:underline">Ler Fonte Completa</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-1 mt-1">
              <button className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors" title="Copiar">
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
              </button>
              <button className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors" title="Regenerar">
                <span className="material-symbols-outlined text-[16px]">refresh</span>
              </button>
              <button className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors" title="Boa resposta">
                <span className="material-symbols-outlined text-[16px]">thumb_up</span>
              </button>
            </div>
          </div>
        </div>

        <div className="h-24"></div>
      </div>

      <div className="absolute bottom-0 left-0 w-full px-4 md:px-8 pb-6 pt-4 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark z-10">
        <div className="max-w-4xl mx-auto relative group">
          <div className="flex items-end gap-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-600 rounded-2xl shadow-float p-2 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all">
            <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-neutral-dark text-slate-400 dark:text-slate-400 transition-colors shrink-0" title="Upload de arquivo">
              <span className="material-symbols-outlined">add_circle</span>
            </button>
            <textarea className="flex-1 bg-transparent border-0 focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 py-3 font-body resize-none max-h-32 custom-scrollbar" onInput={(e) => { e.currentTarget.style.height = ''; e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px' }} placeholder="Faça uma pergunta sobre o material do curso..." rows={1}></textarea>
            <div className="flex items-center gap-1 pb-1">
              <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-neutral-dark text-slate-400 dark:text-slate-400 transition-colors shrink-0 hidden sm:flex" title="Entrada de Voz">
                <span className="material-symbols-outlined">mic</span>
              </button>
              <button className="p-2.5 rounded-xl bg-primary text-white shadow-md hover:bg-primary-hover transition-transform active:scale-95 shrink-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
            </div>
          </div>
          <div className="text-center mt-2">
            <p className="text-[10px] text-slate-400 dark:text-slate-500">A IA pode cometer erros. Por favor, verifique informações importantes nos materiais do curso.</p>
          </div>
        </div>
      </div>
    </>
  );
}

