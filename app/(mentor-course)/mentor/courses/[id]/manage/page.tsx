'use client';

import Link from 'next/link';

export default function MentorCourseManagePage() {
  return (
    <>
      <header className="sticky top-0 z-20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-sm px-8 pt-8 pb-4">
        <div className="max-w-6xl mx-auto w-full">
          <nav className="flex items-center gap-2 text-sm mb-4 font-body">
            <Link className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors" href="/mentor/dashboard">Painel</Link>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <Link className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors" href="#">Estruturas de Dados Avançadas</Link>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <span className="text-text-main dark:text-white font-medium">Gestão</span>
          </nav>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black tracking-tight text-text-main dark:text-white">Gestão do Curso</h1>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-text-secondary transition-colors">
              <span className="material-symbols-outlined">help</span>
            </button>
          </div>
        </div>
      </header>

      <div className="px-8 pb-12 flex-1">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 lg:order-2 space-y-6">
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 sticky top-32">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <span className="material-symbols-outlined text-primary">person_add</span>
                </div>
                <h2 className="text-lg font-bold">Convidar Alunos</h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-body mb-6 leading-relaxed">
                Compartilhe este código único ou link para permitir que os alunos se inscrevam nesta seção do curso.
              </p>
              <div className="bg-background-light dark:bg-background-dark rounded-lg p-4 text-center mb-6 border border-dashed border-gray-300 dark:border-gray-600">
                <span className="block text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Código da Turma</span>
                <span className="text-3xl font-black text-text-main dark:text-white tracking-wider font-mono">X79-B22</span>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="sr-only">Link de Convite</label>
                  <div className="relative">
                    <input className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-2.5 pl-3 pr-10 text-sm font-mono text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50" readOnly type="text" value="platform.edu/join/X79-B22" />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 p-1">
                      <span className="material-symbols-outlined text-[20px]">content_copy</span>
                    </button>
                  </div>
                </div>
                <button className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-sm shadow-primary/20">
                  <span>Enviar Convites por E-mail</span>
                </button>
                <div className="text-center pt-2">
                  <button className="text-xs text-text-secondary hover:text-primary font-medium underline decoration-dashed underline-offset-4">Gerar Novo Código</button>
                </div>
              </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Uso de Armazenamento</h3>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-2xl font-bold text-text-main dark:text-white">1.2 GB</span>
                <span className="text-sm text-gray-500 mb-1">/ 5.0 GB</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 lg:order-1 flex flex-col gap-6">
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-text-main dark:text-white">Materiais do Curso</h2>
                <button className="text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-lg transition-colors">
                  + Nova Pasta
                </button>
              </div>
              <div className="group relative w-full h-48 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary hover:bg-background-light dark:hover:bg-gray-800 transition-all cursor-pointer flex flex-col items-center justify-center gap-3">
                <div className="size-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-gray-400 group-hover:text-primary text-2xl">cloud_upload</span>
                </div>
                <div className="text-center">
                  <p className="text-text-main dark:text-white font-medium">Solte arquivos PDF aqui ou <span className="text-primary underline">Navegar</span></p>
                  <p className="text-xs text-gray-400 mt-1 font-body">Suporta PDF, DOCX, PPTX (Máx 50MB)</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2">Arquivos Enviados</h3>
                <div className="flex gap-2">
                  <button className="p-1 text-gray-400 hover:text-primary"><span className="material-symbols-outlined text-[20px]">filter_list</span></button>
                  <button className="p-1 text-gray-400 hover:text-primary"><span className="material-symbols-outlined text-[20px]">sort</span></button>
                </div>
              </div>
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                <li className="group flex items-center gap-4 p-4 hover:bg-background-light dark:hover:bg-gray-800 transition-colors">
                  <div className="size-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 flex-shrink-0">
                    <span className="material-symbols-outlined text-[24px]">picture_as_pdf</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-text-main dark:text-white truncate">Syllabus_Fall_2024.pdf</h4>
                    <p className="text-xs text-gray-500 font-body">1.2 MB • Enviado há 2 dias</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#7BC079]/10 text-[#7BC079]">
                      <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                      Pronto
                    </span>
                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                      <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                    </div>
                  </div>
                </li>
                <li className="group flex items-center gap-4 p-4 hover:bg-background-light dark:hover:bg-gray-800 transition-colors">
                  <div className="size-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 flex-shrink-0">
                    <span className="material-symbols-outlined text-[24px]">picture_as_pdf</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-text-main dark:text-white truncate">Week_1_Introduction_to_Arrays.pdf</h4>
                    <p className="text-xs text-gray-500 font-body">4.5 MB • Enviado ontem</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#7BC079]/10 text-[#7BC079]">
                      <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                      Pronto
                    </span>
                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                      <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                    </div>
                  </div>
                </li>
                <li className="group flex items-center gap-4 p-4 bg-yellow-50/30 dark:bg-yellow-900/5 transition-colors">
                  <div className="size-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 flex-shrink-0">
                    <span className="material-symbols-outlined text-[24px] animate-pulse">hourglass_top</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-text-main dark:text-white truncate">Week_2_Readings_Advanced.pdf</h4>
                    <div className="w-full max-w-[200px] h-1 bg-gray-200 dark:bg-gray-600 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-status-processing w-[60%] rounded-full animate-[shimmer_1.5s_infinite] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)]"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                      <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                      Processando
                    </span>
                    <div className="flex w-[72px] justify-end">
                    </div>
                  </div>
                </li>
                <li className="group flex items-center gap-4 p-4 hover:bg-background-light dark:hover:bg-gray-800 transition-colors">
                  <div className="size-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-status-error flex-shrink-0">
                    <span className="material-symbols-outlined text-[24px]">broken_image</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 truncate line-through decoration-status-error">Lecture_Notes_Raw_Scan.pdf</h4>
                    <p className="text-xs text-status-error font-bold mt-0.5">O tamanho do arquivo excede o limite (50MB)</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FF6B6B]/10 text-[#FF6B6B]">
                      <span className="material-symbols-outlined text-[14px]">error</span>
                      Erro
                    </span>
                    <div className="flex gap-1">
                      <button className="px-3 py-1.5 text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-text-main dark:text-gray-200">Tentar Novamente</button>
                      <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><span className="material-symbols-outlined text-[20px]">close</span></button>
                    </div>
                  </div>
                </li>
              </ul>
              <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 flex justify-center">
                <button className="text-xs font-bold text-text-secondary hover:text-primary transition-colors flex items-center gap-1">
                  Ver Todos os Arquivos <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

