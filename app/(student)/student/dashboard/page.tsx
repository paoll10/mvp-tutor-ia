'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { listStudentCourses, joinCourseByCode, type StudentCourse } from '@/server/student-courses';

export default function StudentDashboardPage() {
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Carrega cursos do aluno
  useEffect(() => {
    async function loadCourses() {
      const data = await listStudentCourses();
      setCourses(data);
      setLoading(false);
    }
    loadCourses();
  }, []);

  // Entra em um curso
  const handleJoinCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setJoining(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('code', code);

    const result = await joinCourseByCode(formData);

    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else if (result.success) {
      setMessage({ type: 'success', text: `Você entrou no curso "${result.courseName}"!` });
      setCode('');
      // Recarrega a lista de cursos
      const data = await listStudentCourses();
      setCourses(data);
    }

    setJoining(false);
  };

  // Formata a data
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <>
      {/* Header */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-700 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Meus Cursos</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-500 hover:text-primary transition-colors rounded-full hover:bg-primary/5">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          
          {/* Card para entrar em curso */}
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none">
              <svg className="h-full w-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="80" fill="#FFFFFF" />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-white text-3xl">school</span>
                <h2 className="text-xl md:text-2xl font-bold text-white">Entrar em um Curso</h2>
              </div>
              <p className="text-white/80 text-sm mb-6 max-w-md">
                Insira o código de convite fornecido pelo seu mentor para acessar o curso e começar a aprender.
              </p>
              
              <form onSubmit={handleJoinCourse} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Ex: AB12CD34"
                    maxLength={10}
                    className="w-full h-12 px-4 rounded-lg bg-white/10 backdrop-blur border border-white/20 text-white placeholder-white/60 font-mono text-lg tracking-wider focus:outline-none focus:ring-2 focus:ring-white/50"
                    disabled={joining}
                  />
                </div>
                <button
                  type="submit"
                  disabled={joining || !code.trim()}
                  className="h-12 px-8 bg-white text-primary font-bold rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {joining ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                      Entrando...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">login</span>
                      Entrar
                    </>
                  )}
                </button>
              </form>

              {/* Mensagem de feedback */}
              {message && (
                <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
                  message.type === 'success' 
                    ? 'bg-green-500/20 text-green-100' 
                    : 'bg-red-500/20 text-red-100'
                }`}>
                  <span className="material-symbols-outlined text-lg">
                    {message.type === 'success' ? 'check_circle' : 'error'}
                  </span>
                  {message.text}
                </div>
              )}
            </div>
          </div>

          {/* Lista de Cursos */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Cursos Inscritos ({courses.length})
            </h3>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 border border-slate-200 dark:border-slate-700 animate-pulse">
                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-12 border border-slate-200 dark:border-slate-700 text-center">
                <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4">
                  school
                </span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Nenhum curso ainda
                </h4>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Use o código de convite fornecido pelo seu mentor para entrar em um curso.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/student-course/course/${course.id}`}
                    className="group bg-surface-light dark:bg-surface-dark rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-primary text-2xl">school</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 truncate group-hover:text-primary transition-colors">
                          {course.name}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                          {course.description || 'Sem descrição'}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="material-symbols-outlined text-sm">calendar_today</span>
                          Inscrito em {formatDate(course.joined_at)}
                        </div>
                      </div>
                      <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-primary">arrow_forward</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Dica */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 shrink-0">lightbulb</span>
            <div>
              <h4 className="font-bold text-blue-800 dark:text-blue-200 text-sm mb-1">Dica</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Ao entrar em um curso, você terá acesso ao tutor de IA que responde dúvidas baseado no material do mentor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
