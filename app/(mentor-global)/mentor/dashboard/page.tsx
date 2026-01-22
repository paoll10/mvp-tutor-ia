'use client';

import Link from 'next/link';

export default function MentorDashboardPage() {
  return (
    <>
      <header className="h-20 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-[#e8f1f2] dark:border-[#444] px-8 flex items-center justify-between shrink-0 z-10 sticky top-0">
        <div className="flex items-center gap-4">
          <button className="md:hidden p-2 text-text-secondary hover:text-text-main">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold tracking-tight text-text-main dark:text-white">Visão Geral dos Cursos</h2>
            <p className="text-xs text-text-secondary hidden sm:block">Gerencie seu currículo e alunos</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center bg-[#f0f5f6] dark:bg-[#444] rounded-lg px-4 h-10 w-64 border border-transparent focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <span className="material-symbols-outlined text-text-secondary text-[20px]">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-sm w-full text-text-main dark:text-white placeholder-text-secondary h-full" placeholder="Pesquisar cursos..." type="text" />
          </div>
          <div className="flex items-center gap-2">
            <button className="size-10 flex items-center justify-center rounded-full hover:bg-[#e8f1f2] dark:hover:bg-[#444] text-text-secondary transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-[#333]"></span>
            </button>
            <button className="size-10 flex items-center justify-center rounded-full hover:bg-[#e8f1f2] dark:hover:bg-[#444] text-text-secondary transition-colors">
              <span className="material-symbols-outlined">chat</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
        <section className="bg-gradient-to-r from-[#15737f] to-[#0e4f57] rounded-2xl p-6 md:p-10 shadow-soft relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-10 pointer-events-none">
            <svg className="h-full w-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-46.9C87.4,-34.7,90.1,-20.4,85.8,-7.1C81.5,6.2,70.2,18.5,60.2,28.8C50.2,39.1,41.5,47.4,31.7,53.4C21.9,59.4,11,63.1,-0.8,64.5C-12.6,65.9,-25.2,65,-36.5,59.9C-47.8,54.8,-57.8,45.5,-66.1,34.4C-74.4,23.3,-81,10.4,-79.8,-1.9C-78.6,-14.2,-69.6,-25.9,-59.6,-35.6C-49.6,-45.3,-38.6,-53,-27,-61.7C-15.4,-70.4,-3.2,-80.1,10.1,-81.9L10.1,0L0,0Z" fill="#FFFFFF" transform="translate(100 100)"></path>
            </svg>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-lg text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Expanda sua base de conhecimento</h2>
              <p className="text-white/80 text-sm md:text-base mb-6">Insira um código de curso único fornecido por outro instrutor para se inscrever como aluno ou colaborador.</p>
              <label className="flex w-full max-w-md h-12 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-1 focus-within:bg-white/20 focus-within:border-white/40 transition-all">
                <input className="flex-1 bg-transparent border-none text-white placeholder-white/60 focus:ring-0 text-sm px-4" placeholder="Insira o Código do Curso (ex: A1B2-C3D4)" />
                <button className="bg-white text-primary hover:bg-white/90 px-6 rounded font-bold text-sm transition-colors">
                  Entrar
                </button>
              </label>
            </div>
            <div className="hidden lg:block bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-3 mb-3">
                <div className="size-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <div className="text-white">
                  <div className="font-bold text-sm">Código Válido</div>
                  <div className="text-xs opacity-70">Acesso Concedido</div>
                </div>
              </div>
              <div className="h-2 w-40 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-[#7BC079]"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-2xl font-bold text-text-main dark:text-white">Meus Cursos Criados</h3>
            <Link href="/mentor/courses/create" className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 group">
              <span className="material-symbols-outlined group-hover:rotate-90 transition-transform duration-300">add</span>
              <span className="font-bold text-sm">Criar Novo Curso</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button className="px-4 py-1.5 rounded-full bg-text-main text-white text-sm font-medium whitespace-nowrap">Todos os Cursos</button>
            <button className="px-4 py-1.5 rounded-full bg-white dark:bg-[#333] border border-[#e8f1f2] dark:border-[#555] text-text-secondary hover:text-text-main text-sm font-medium whitespace-nowrap transition-colors">Publicados</button>
            <button className="px-4 py-1.5 rounded-full bg-white dark:bg-[#333] border border-[#e8f1f2] dark:border-[#555] text-text-secondary hover:text-text-main text-sm font-medium whitespace-nowrap transition-colors">Rascunhos</button>
            <button className="px-4 py-1.5 rounded-full bg-white dark:bg-[#333] border border-[#e8f1f2] dark:border-[#555] text-text-secondary hover:text-text-main text-sm font-medium whitespace-nowrap transition-colors">Arquivados</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <Link href="/mentor/courses/1/manage" className="group bg-surface-light dark:bg-surface-dark border border-[#e8f1f2] dark:border-[#444] rounded-2xl overflow-hidden hover:shadow-soft hover:border-primary/30 transition-all duration-300 flex flex-col h-full">
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" data-alt="Abstract geometric shapes in teal and white" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAsY8Vu2tW6wynrwXeumRr0GKhp8t3r9WrGwoXB56ZgKzIaUSAiIxeGLEAeCPeCVbNL9JYeJKnt_o3ZSw8CPQDgBWjY49ZhLo-9W7h8QZLej5ZnzN1wVMeJWB64pQJ8dicf0_IRdBsOYidq8f8i6sTPWRiAKmmz2EsImmj8eBzINlxHHcdXbQZ57ckYU6r37YUJRwi7eUR3vf6e1h2If7nnm3OzIcE0x_AoiERQ0U0klKhws5IFACVYA2kVTPKsGGk4mcCkVChoDj0")' }}></div>
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-primary shadow-sm flex items-center gap-1">
                  <span className="size-2 rounded-full bg-green-500 animate-pulse"></span> Ativo
                </div>
              </div>
              <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex-1">
                  <h4 className="font-display font-bold text-lg leading-tight text-text-main dark:text-white mb-1 group-hover:text-primary transition-colors">Padrões Avançados de Design de UI</h4>
                  <p className="text-sm text-text-secondary line-clamp-2">Domine o design de interfaces modernas com princípios de design atômico e layouts responsivos.</p>
                </div>
                <div className="pt-4 mt-auto border-t border-[#f0f5f6] dark:border-[#444] flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs font-medium text-text-secondary">
                    <div className="flex items-center gap-1.5" title="Alunos Inscritos">
                      <span className="material-symbols-outlined text-lg">group</span>
                      <span>24</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="Módulos">
                      <span className="material-symbols-outlined text-lg">layers</span>
                      <span>8</span>
                    </div>
                  </div>
                  <button className="text-text-secondary hover:text-primary transition-colors p-1 rounded hover:bg-primary/5">
                    <span className="material-symbols-outlined">more_horiz</span>
                  </button>
                </div>
              </div>
            </Link>

            <Link href="#" className="group bg-surface-light dark:bg-surface-dark border border-[#e8f1f2] dark:border-[#444] rounded-2xl overflow-hidden hover:shadow-soft hover:border-primary/30 transition-all duration-300 flex flex-col h-full">
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" data-alt="Minimalist desk setup with laptop and coffee" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDqKEpmYbpR7HSZ8W_iD5gDUHlhkSY0vL3u-f90IRDrKprrjbWxYkx1kWdoRpQEE6ysRRpi-V8Xb2j4jj3CZZJv_Z2eGM0T_WmtVs_gDCRRdSIIM3Mb60Ur0I7mlwF2HBqYPm13sv7mU61Sy73fZtg9FhgyicXKlnF3ScyFjcZHYUZp7hHLNwY-02waQLoTKqUrIyJwcIgakjBv_uGtsw3KAj4IDLtvmKcdRBPpW1TOI0v8o8fhUTZ_5yOzrBaZHQMrG02GLHH65C4")' }}></div>
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-orange-500 shadow-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">edit_document</span> Rascunho
                </div>
              </div>
              <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex-1">
                  <h4 className="font-display font-bold text-lg leading-tight text-text-main dark:text-white mb-1 group-hover:text-primary transition-colors">Essenciais do React 19</h4>
                  <p className="text-sm text-text-secondary line-clamp-2">Mergulhe fundo em Server Components, Actions e na nova arquitetura do compilador.</p>
                </div>
                <div className="pt-4 mt-auto border-t border-[#f0f5f6] dark:border-[#444] flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs font-medium text-text-secondary">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-lg">group</span>
                      <span>-</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-lg">layers</span>
                      <span>12</span>
                    </div>
                  </div>
                  <button className="text-text-secondary hover:text-primary transition-colors p-1 rounded hover:bg-primary/5">
                    <span className="material-symbols-outlined">more_horiz</span>
                  </button>
                </div>
              </div>
            </Link>

            <Link href="#" className="group bg-surface-light dark:bg-surface-dark border border-[#e8f1f2] dark:border-[#444] rounded-2xl overflow-hidden hover:shadow-soft hover:border-primary/30 transition-all duration-300 flex flex-col h-full">
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" data-alt="Blue wireframe structures on dark background" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC_HZ_eKR0OYAJw8taNCMw0i5YvVqd0Til5qLGG2_WGk7HPqBkOSebL0SlteUA3EaahvVEZzcKqd-d9aQ2MYvt1eWgFhhFSZkgO-l8oGITs1siP_IwFJOcxmuAkXFZZ9_p7PY-ymGyMxdoFCNwNyTJar--33OFmg2whbpmjK6GQAlCItVK2iqeETZhycOtcB4ymx4L_7AJ71LSW2oxIi2kEeVLoPTmKJL_05m-Nu3jE6TTNwHdLzlLZqrb2yWey9bfkYFMtpV1LUvE")' }}></div>
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-primary shadow-sm flex items-center gap-1">
                  <span className="size-2 rounded-full bg-green-500"></span> Ativo
                </div>
              </div>
              <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex-1">
                  <h4 className="font-display font-bold text-lg leading-tight text-text-main dark:text-white mb-1 group-hover:text-primary transition-colors">Gestão de Produtos 101</h4>
                  <p className="text-sm text-text-secondary line-clamp-2">Da ideação ao lançamento: gerenciando o ciclo de vida do produto de forma eficaz.</p>
                </div>
                <div className="pt-4 mt-auto border-t border-[#f0f5f6] dark:border-[#444] flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs font-medium text-text-secondary">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-lg">group</span>
                      <span>156</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-lg">star</span>
                      <span>4.8</span>
                    </div>
                  </div>
                  <button className="text-text-secondary hover:text-primary transition-colors p-1 rounded hover:bg-primary/5">
                    <span className="material-symbols-outlined">more_horiz</span>
                  </button>
                </div>
              </div>
            </Link>

            <Link href="/mentor/courses/create" className="group bg-[#f8fbfb] dark:bg-[#333] border-2 border-dashed border-[#d1dce0] dark:border-[#555] rounded-2xl flex flex-col items-center justify-center gap-4 p-8 hover:border-primary hover:bg-primary/5 transition-all duration-300 h-full min-h-[340px]">
              <div className="size-16 rounded-full bg-white dark:bg-[#444] shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-3xl text-primary">add</span>
              </div>
              <div className="text-center">
                <h4 className="font-display font-bold text-lg text-text-main dark:text-white">Novo Curso</h4>
                <p className="text-sm text-text-secondary mt-1">Comece do zero ou use um modelo</p>
              </div>
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-[#e8f1f2] dark:border-[#444] flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <span className="material-symbols-outlined">school</span>
            </div>
            <div>
              <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">Total de Alunos</p>
              <p className="text-2xl font-bold font-display">1,248</p>
            </div>
          </div>
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-[#e8f1f2] dark:border-[#444] flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <span className="material-symbols-outlined">schedule</span>
            </div>
            <div>
              <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">Horas Ensinadas</p>
              <p className="text-2xl font-bold font-display">86.5</p>
            </div>
          </div>
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-[#e8f1f2] dark:border-[#444] flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <span className="material-symbols-outlined">trending_up</span>
            </div>
            <div>
              <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">Taxa de Engajamento</p>
              <p className="text-2xl font-bold font-display">92%</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

