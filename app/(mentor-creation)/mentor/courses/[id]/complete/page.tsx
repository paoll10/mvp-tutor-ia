'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getCourseById, type Course } from '@/server/courses';
import { countReadyMaterials } from '@/server/materials';

export default function CourseCompletePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [materialCount, setMaterialCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [courseData, count] = await Promise.all([
        getCourseById(courseId),
        countReadyMaterials(courseId),
      ]);
      
      // Se o curso não está publicado, redireciona
      if (courseData && courseData.status !== 'published') {
        router.push(`/mentor/courses/${courseId}/materials`);
        return;
      }
      
      setCourse(courseData);
      setMaterialCount(count);
    }
    loadData();
  }, [courseId, router]);

  const handleCopy = async () => {
    if (!course) return;
    
    try {
      await navigator.clipboard.writeText(course.invite_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center gap-8 py-12">
      {/* Success Icon */}
      <div className="size-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center animate-bounce-slow">
        <span className="material-symbols-outlined text-5xl text-green-600 dark:text-green-400">
          celebration
        </span>
      </div>

      {/* Title */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text-main dark:text-white mb-3">
          Curso Criado com Sucesso! 🎉
        </h1>
        <p className="text-text-muted text-lg max-w-md">
          Seu curso está pronto. Compartilhe o código abaixo com seus alunos.
        </p>
      </div>

      {/* Progress Steps - Completed */}
      <div className="flex items-center w-full gap-4 max-w-lg">
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-1.5 w-full rounded-full bg-green-500"></div>
          <span className="text-xs font-bold text-green-600 uppercase tracking-wider">01. Detalhes ✓</span>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-1.5 w-full rounded-full bg-green-500"></div>
          <span className="text-xs font-bold text-green-600 uppercase tracking-wider">02. Materiais ✓</span>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-1.5 w-full rounded-full bg-green-500"></div>
          <span className="text-xs font-bold text-green-600 uppercase tracking-wider">03. Conclusão ✓</span>
        </div>
      </div>

      {/* Course Card */}
      <div className="w-full bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg overflow-hidden">
        {/* Course Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-start gap-4">
            <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-3xl">school</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-xl text-text-main dark:text-white truncate">
                {course.name}
              </h2>
              <p className="text-text-muted text-sm mt-1 line-clamp-2">
                {course.description || 'Sem descrição'}
              </p>
            </div>
            <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
              <span className="text-xs font-bold text-green-700 dark:text-green-400">Publicado</span>
            </div>
          </div>
        </div>

        {/* Invite Code */}
        <div className="p-6 bg-gradient-to-r from-primary/5 to-primary/10">
          <p className="text-sm font-medium text-text-muted mb-3 text-center">
            Código de Convite para Alunos
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="bg-white dark:bg-gray-900 px-8 py-4 rounded-xl border-2 border-dashed border-primary/30 shadow-inner">
              <span className="font-mono text-3xl font-bold tracking-[0.3em] text-primary">
                {course.invite_code}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className={`
                p-4 rounded-xl transition-all transform active:scale-95
                ${copied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/30'
                }
              `}
            >
              <span className="material-symbols-outlined text-2xl">
                {copied ? 'check' : 'content_copy'}
              </span>
            </button>
          </div>
          {copied && (
            <p className="text-center text-sm text-green-600 mt-3 font-medium">
              Código copiado!
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 divide-x divide-gray-100 dark:divide-gray-800 border-t border-gray-100 dark:border-gray-800">
          <div className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-text-muted mb-1">
              <span className="material-symbols-outlined text-lg">description</span>
              <span className="text-xs font-medium uppercase tracking-wider">Materiais</span>
            </div>
            <span className="text-2xl font-bold text-text-main dark:text-white">{materialCount}</span>
          </div>
          <div className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-text-muted mb-1">
              <span className="material-symbols-outlined text-lg">group</span>
              <span className="text-xs font-medium uppercase tracking-wider">Alunos</span>
            </div>
            <span className="text-2xl font-bold text-text-main dark:text-white">0</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="w-full bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
        <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined">info</span>
          Como seus alunos entram no curso
        </h3>
        <ol className="space-y-3 text-sm text-blue-700 dark:text-blue-300">
          <li className="flex items-start gap-3">
            <span className="size-6 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-xs font-bold shrink-0">1</span>
            <span>O aluno acessa a plataforma e faz login/cadastro</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="size-6 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-xs font-bold shrink-0">2</span>
            <span>No dashboard, clica em "Entrar em um curso" e insere o código <strong>{course.invite_code}</strong></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="size-6 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-xs font-bold shrink-0">3</span>
            <span>Pronto! O aluno pode começar a fazer perguntas ao tutor de IA</span>
          </li>
        </ol>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 w-full justify-center">
        <button
          onClick={() => router.push(`/mentor/courses/${courseId}/manage`)}
          className="px-6 py-3 rounded-lg border border-gray-200 dark:border-gray-700 text-text-main dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Gerenciar Curso
        </button>
        <button
          onClick={() => router.push('/mentor/dashboard')}
          className="px-8 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold shadow-lg shadow-primary/30 transition-all transform active:scale-95"
        >
          Ir para o Dashboard
        </button>
      </div>
    </div>
  );
}
