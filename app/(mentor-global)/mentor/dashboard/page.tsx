'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { listMentorCourses, type Course } from '@/server/courses';

export default function MentorDashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      const data = await listMentorCourses();
      setCourses(data);
      setLoading(false);
    }
    loadCourses();
  }, []);

  const publishedCourses = courses.filter(c => c.status === 'published');
  const draftCourses = courses.filter(c => c.status === 'draft');

  return (
    <>
      <header className="h-20 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-[#e8f1f2] dark:border-[#444] px-8 flex items-center justify-between shrink-0 z-10 sticky top-0">
        <div className="flex items-center gap-4">
          <button className="md:hidden p-2 text-text-secondary hover:text-text-main">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold tracking-tight text-text-main dark:text-white">Visão Geral dos Cursos</h2>
            <p className="text-xs text-text-secondary hidden sm:block">Gerencie seus cursos e alunos</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center bg-[#f0f5f6] dark:bg-[#444] rounded-lg px-4 h-10 w-64 border border-transparent focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <span className="material-symbols-outlined text-text-secondary text-[20px]">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-sm w-full text-text-main dark:text-white placeholder-text-secondary h-full" placeholder="Pesquisar cursos..." type="text" />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
        {/* Banner para entrar em curso com código */}
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
                <input className="flex-1 bg-transparent border-none text-white placeholder-white/60 focus:ring-0 text-sm px-4" placeholder="Insira o Código do Curso (ex: A1B2C3D4)" />
                <button className="bg-white text-primary hover:bg-white/90 px-6 rounded font-bold text-sm transition-colors">
                  Entrar
                </button>
              </label>
            </div>
          </div>
        </section>

        {/* Lista de Cursos */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-2xl font-bold text-text-main dark:text-white">Meus Cursos Criados</h3>
            <Link href="/mentor/courses/create" className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 group">
              <span className="material-symbols-outlined group-hover:rotate-90 transition-transform duration-300">add</span>
              <span className="font-bold text-sm">Criar Novo Curso</span>
            </Link>
          </div>

          {/* Filtros */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button className="px-4 py-1.5 rounded-full bg-text-main text-white text-sm font-medium whitespace-nowrap">
              Todos ({courses.length})
            </button>
            <button className="px-4 py-1.5 rounded-full bg-white dark:bg-[#333] border border-[#e8f1f2] dark:border-[#555] text-text-secondary hover:text-text-main text-sm font-medium whitespace-nowrap transition-colors">
              Publicados ({publishedCourses.length})
            </button>
            <button className="px-4 py-1.5 rounded-full bg-white dark:bg-[#333] border border-[#e8f1f2] dark:border-[#555] text-text-secondary hover:text-text-main text-sm font-medium whitespace-nowrap transition-colors">
              Rascunhos ({draftCourses.length})
            </button>
          </div>

          {/* Grid de Cursos */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-surface-light dark:bg-surface-dark border border-[#e8f1f2] dark:border-[#444] rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Cursos existentes */}
              {courses.map((course) => (
                <Link 
                  key={course.id}
                  href={course.status === 'draft' 
                    ? `/mentor/courses/${course.id}/materials` 
                    : `/mentor/courses/${course.id}/manage`
                  } 
                  className="group bg-surface-light dark:bg-surface-dark border border-[#e8f1f2] dark:border-[#444] rounded-2xl overflow-hidden hover:shadow-soft hover:border-primary/30 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden flex items-center justify-center">
                    <div className="size-16 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="material-symbols-outlined text-3xl text-primary">school</span>
                    </div>
                    <div className="absolute top-3 right-3">
                      {course.status === 'published' ? (
                        <span className="bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-green-600 shadow-sm flex items-center gap-1">
                          <span className="size-2 rounded-full bg-green-500"></span> Ativo
                        </span>
                      ) : (
                        <span className="bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-orange-500 shadow-sm flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">edit_document</span> Rascunho
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div className="flex-1">
                      <h4 className="font-display font-bold text-lg leading-tight text-text-main dark:text-white mb-1 group-hover:text-primary transition-colors line-clamp-2">
                        {course.name}
                      </h4>
                      <p className="text-sm text-text-secondary line-clamp-2">
                        {course.description || 'Sem descrição'}
                      </p>
                    </div>
                    <div className="pt-4 mt-auto border-t border-[#f0f5f6] dark:border-[#444] flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs font-medium text-text-secondary">
                        {course.status === 'published' && (
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 rounded-full text-primary">
                            <span className="material-symbols-outlined text-sm">key</span>
                            <span className="font-mono font-bold">{course.invite_code}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-text-muted">
                        {new Date(course.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}

              {/* Card para criar novo curso */}
              <Link href="/mentor/courses/create" className="group bg-[#f8fbfb] dark:bg-[#333] border-2 border-dashed border-[#d1dce0] dark:border-[#555] rounded-2xl flex flex-col items-center justify-center gap-4 p-8 hover:border-primary hover:bg-primary/5 transition-all duration-300 h-full min-h-[340px]">
                <div className="size-16 rounded-full bg-white dark:bg-[#444] shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-3xl text-primary">add</span>
                </div>
                <div className="text-center">
                  <h4 className="font-display font-bold text-lg text-text-main dark:text-white">Novo Curso</h4>
                  <p className="text-sm text-text-secondary mt-1">Crie um curso com tutor de IA</p>
                </div>
              </Link>
            </div>
          )}

          {/* Mensagem quando não há cursos */}
          {!loading && courses.length === 0 && (
            <div className="text-center py-12">
              <div className="size-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-4xl text-gray-400">school</span>
              </div>
              <h3 className="text-lg font-bold text-text-main dark:text-white mb-2">Nenhum curso ainda</h3>
              <p className="text-text-muted mb-6">Crie seu primeiro curso e comece a ensinar com IA</p>
              <Link href="/mentor/courses/create" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg shadow-lg shadow-primary/20 transition-all">
                <span className="material-symbols-outlined">add</span>
                <span className="font-bold">Criar Primeiro Curso</span>
              </Link>
            </div>
          )}
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-[#e8f1f2] dark:border-[#444] flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <span className="material-symbols-outlined">school</span>
            </div>
            <div>
              <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">Total de Cursos</p>
              <p className="text-2xl font-bold font-display">{courses.length}</p>
            </div>
          </div>
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-[#e8f1f2] dark:border-[#444] flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <div>
              <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">Cursos Ativos</p>
              <p className="text-2xl font-bold font-display">{publishedCourses.length}</p>
            </div>
          </div>
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-[#e8f1f2] dark:border-[#444] flex items-center gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
              <span className="material-symbols-outlined">edit_document</span>
            </div>
            <div>
              <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">Em Rascunho</p>
              <p className="text-2xl font-bold font-display">{draftCourses.length}</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
