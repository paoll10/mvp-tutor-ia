'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCourse } from '@/server/courses';

export default function CourseCreationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);

    try {
      const result = await createCourse(formData);
      
      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      }
      // Se não houver erro, o redirect acontece no server action
    } catch (err) {
      setError('Erro ao criar curso. Tente novamente.');
      setIsLoading(false);
    }
  };

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
            <span className="text-xs font-bold text-text-main dark:text-gray-400 uppercase tracking-wider">02. Materiais</span>
          </div>
          <div className="flex flex-col gap-2 flex-1 group cursor-pointer opacity-40 hover:opacity-70 transition-opacity">
            <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <span className="text-xs font-bold text-text-main dark:text-gray-400 uppercase tracking-wider">03. Conclusão</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 md:p-8 flex flex-col gap-8">
          
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
              <span className="material-symbols-outlined text-red-600">error</span>
              <span className="text-red-700 dark:text-red-300">{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-2">
              <span className="text-text-main dark:text-gray-200 text-base font-bold">
                Título do Curso <span className="text-red-500">*</span>
              </span>
              <div className="relative group">
                <input 
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark h-14 px-4 text-base font-medium text-text-main dark:text-white placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" 
                  placeholder="ex: Curso de Machine Learning com Python" 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={3}
                  maxLength={100}
                  disabled={isLoading}
                />
                {name.length >= 3 && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                    <span className="material-symbols-outlined text-xl">check_circle</span>
                  </div>
                )}
              </div>
              <span className="text-xs text-text-muted">
                Um título claro ajuda os alunos a entender o conteúdo. ({name.length}/100)
              </span>
            </label>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-text-main dark:text-gray-200 text-base font-bold">Descrição</span>
            </div>
            <div className="relative">
              <textarea 
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark p-4 text-base font-normal text-text-main dark:text-white placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none min-h-[180px] resize-y" 
                placeholder="Descreva o que os alunos aprenderão neste curso..." 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                disabled={isLoading}
              ></textarea>
              <div className="absolute bottom-3 right-3 text-xs text-text-muted">
                {description.length}/500
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
            <button 
              type="button"
              onClick={() => router.push('/mentor/dashboard')}
              className="text-text-muted hover:text-text-main dark:hover:text-white font-bold text-sm px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isLoading || name.length < 3}
              className="bg-primary hover:bg-primary-dark text-white font-bold text-sm px-8 py-3 rounded-lg shadow-lg shadow-primary/30 transition-all transform active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                  Criando...
                </>
              ) : (
                <>
                  Continuar
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-text-muted">visibility</span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Pré-visualização</h3>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5 dark:ring-white/10 group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <div className="size-20 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-4xl text-primary">school</span>
            </div>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                Tutor com IA
              </div>
              <h3 className="text-xl font-bold leading-tight text-text-main dark:text-white line-clamp-2">
                {name || 'Nome do seu curso'}
              </h3>
              <p className="text-sm text-text-muted line-clamp-3 leading-relaxed">
                {description || 'A descrição do seu curso aparecerá aqui...'}
              </p>
            </div>
            <hr className="border-gray-100 dark:border-gray-800" />
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-lg">description</span>
                0 materiais
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-lg">group</span>
                0 alunos
              </span>
            </div>
          </div>
        </div>
        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex gap-3 items-start">
          <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 shrink-0">lightbulb</span>
          <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
            <strong>Próximo passo:</strong> Após criar o curso, você fará upload dos materiais (PDFs) que serão usados para treinar o tutor de IA.
          </p>
        </div>
      </div>
    </div>
  );
}
