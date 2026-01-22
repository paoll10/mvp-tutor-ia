'use client';

export default function CourseCreationPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-16 items-start">
      <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text-main dark:text-white">Vamos configurar o seu curso</h1>
          <p className="text-text-muted text-lg">Preencha os detalhes abaixo para iniciar sua jornada como mentor.</p>
        </div>

        <div className="flex items-center w-full gap-4 mb-2">
          <div className="flex flex-col gap-2 flex-1 group cursor-pointer">
            <div className="h-1.5 w-full rounded-full bg-primary relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">01. Detalhes</span>
          </div>
          <div className="flex flex-col gap-2 flex-1 group cursor-pointer opacity-40 hover:opacity-70 transition-opacity">
            <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <span className="text-xs font-bold text-text-main dark:text-gray-400 uppercase tracking-wider">02. Mídia</span>
          </div>
          <div className="flex flex-col gap-2 flex-1 group cursor-pointer opacity-40 hover:opacity-70 transition-opacity">
            <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <span className="text-xs font-bold text-text-main dark:text-gray-400 uppercase tracking-wider">03. Revisão</span>
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 md:p-8 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-2">
              <span className="text-text-main dark:text-gray-200 text-base font-bold">Título do Curso</span>
              <div className="relative group">
                <input className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark h-14 px-4 text-base font-medium text-text-main dark:text-white placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" placeholder="ex: Princípios Avançados de Design UX" type="text" defaultValue="Dominando o Design de UI Minimalista" />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 opacity-0 group-focus-within:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-xl">check_circle</span>
                </div>
              </div>
              <span className="text-xs text-text-muted">Um título atraente ajuda a atrair alunos. Mantenha-o com menos de 60 caracteres.</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-text-main dark:text-gray-200 text-base font-bold">Categoria</span>
              <div className="relative">
                <select className="appearance-none w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark h-14 px-4 text-base font-medium text-text-main dark:text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none cursor-pointer" defaultValue="design">
                  <option disabled value="">Selecione uma categoria</option>
                  <option value="design">Design e Criatividade</option>
                  <option value="dev">Desenvolvimento</option>
                  <option value="business">Negócios e Marketing</option>
                  <option value="lifestyle">Estilo de Vida</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-text-main dark:text-gray-200 text-base font-bold">Nível de Dificuldade</span>
              <div className="relative">
                <select className="appearance-none w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark h-14 px-4 text-base font-medium text-text-main dark:text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none cursor-pointer" defaultValue="intermediate">
                  <option value="beginner">Iniciante</option>
                  <option value="intermediate">Intermediário</option>
                  <option value="advanced">Avançado</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-text-main dark:text-gray-200 text-base font-bold">Descrição</span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                Assistente de IA
              </button>
            </div>
            <div className="relative">
              <textarea className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark p-4 text-base font-normal text-text-main dark:text-white placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none min-h-[180px] resize-y" placeholder="Descreva o que os alunos aprenderão neste curso..." defaultValue="Aprenda os princípios fundamentais do minimalismo no design de interfaces de usuário. Abordaremos espaços em branco, tipografia e teoria das cores para criar produtos digitais limpos e eficazes."></textarea>
              <div className="absolute bottom-3 left-3 flex gap-1">
                <button className="p-1.5 text-text-muted hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><span className="material-symbols-outlined text-xl">format_bold</span></button>
                <button className="p-1.5 text-text-muted hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><span className="material-symbols-outlined text-xl">format_italic</span></button>
                <button className="p-1.5 text-text-muted hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><span className="material-symbols-outlined text-xl">format_list_bulleted</span></button>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 self-center"></div>
                <button className="p-1.5 text-text-muted hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"><span className="material-symbols-outlined text-xl">link</span></button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
            <button className="text-text-muted hover:text-text-main dark:hover:text-white font-bold text-sm px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Cancelar
            </button>
            <div className="flex items-center gap-4">
              <button className="text-text-main dark:text-white font-bold text-sm px-6 py-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Voltar
              </button>
              <button className="bg-primary hover:bg-primary-dark text-white font-bold text-sm px-8 py-3 rounded-lg shadow-lg shadow-primary/30 transition-all transform active:scale-95 flex items-center gap-2">
                Continuar
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-text-muted">visibility</span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Pré-visualização do Aluno</h3>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5 dark:ring-white/10 group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img alt="Abstract geometric shapes in calming teal and white representing minimalist design" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUMbtsJqEkLrx8Txb_TlP0-FpGGdas33-VZB53a75Y5Qnp7mg2azXXakGOJYuNlz_chObJnJ7WwXDp-ydrkRiR7KdOqilAW_zwfDlhZkpuRf2sS2jkH4aw1AOs4aN9lZAVNjg6C6RUprWM-4Lgmi-vMlJB2zvlYvjaZOPjrNvgrLI5RQQDXhI7ocG4_es7GX6Qn8rRs4KE2ncq2aNCRoJf_6dgtl_AtngP0Yae4IwEX5hgFWanXFWdu33ahtaViOjbv2Xa4JYy8gw" />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur text-xs font-bold rounded-full text-text-main dark:text-white shadow-sm">
                Design
              </span>
            </div>
            <div className="absolute top-4 right-4">
              <button className="bg-white/90 dark:bg-black/80 p-2 rounded-full hover:bg-white text-text-main dark:text-white transition-colors shadow-sm">
                <span className="material-symbols-outlined text-lg filled">favorite</span>
              </button>
            </div>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <span className="material-symbols-outlined text-sm">signal_cellular_alt</span>
                Intermediário
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                12 Aulas
              </div>
              <h3 className="text-xl font-bold leading-tight text-text-main dark:text-white line-clamp-2">
                Dominando o Design de UI Minimalista
              </h3>
              <p className="text-sm text-text-muted line-clamp-2 leading-relaxed">
                Aprenda os princípios fundamentais do minimalismo no design de interfaces de usuário. Abordaremos espaços em branco, tipografia e teoria das cores.
              </p>
            </div>
            <div className="flex items-center gap-3 py-2">
              <div className="size-10 rounded-full bg-gray-200 bg-cover bg-center" data-alt="Small avatar of the instructor" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCMt617YrGza_3wv7yBnTfbWarsnpeYU9cBn24LkQ6MIl4rJH2nTp4c8WPfGWzlPDrW0UYpwQJiG6-fc2Jb94k_hP_fvE2ok3MuKWPRxsoZsF2FeO4CN5FJT3ZiY_WTHZxECF4FBvXkmGL87fOgsvh4hzz7ftlW5g5Pk60F2UdLVZ94_PZhcVQbZwHIdkJ-NjEGjz7POzriHNPxOUG1qQbPRxasLPBCdPkYlPODtyRiHJX0tLaYEESmlbCUqd1glOb5lSl4S-4_ziI")' }}></div>
              <div className="flex flex-col">
                <span className="text-xs text-text-muted font-medium">Instrutor</span>
                <span className="text-sm font-bold text-text-main dark:text-white">Alex Morgan</span>
              </div>
              <div className="ml-auto flex items-center gap-1 text-amber-400">
                <span className="material-symbols-outlined text-lg fill-current">star</span>
                <span className="text-sm font-bold text-text-main dark:text-white">5.0</span>
              </div>
            </div>
            <hr className="border-gray-100 dark:border-gray-800" />
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-2xl font-black text-text-main dark:text-white">R$ 89</span>
              </div>
              <button className="flex-1 bg-primary hover:bg-primary-dark text-white h-11 rounded-lg font-bold text-sm shadow-md shadow-primary/20 transition-colors">
                Matricule-se Agora
              </button>
            </div>
          </div>
        </div>
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex gap-3 items-start">
          <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 shrink-0">info</span>
          <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
            <strong>Dica Profissional:</strong> Cursos com títulos claros e focados em benefícios recebem 30% mais cliques. Use o cartão de pré-visualização para verificar a legibilidade.
          </p>
        </div>
      </div>
    </div>
  );
}

