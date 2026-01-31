'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import { listCourseMaterials, type Material } from '@/server/materials';
import { getCourseById, publishCourse, type Course } from '@/server/courses';

export default function MaterialsUploadPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  // Carrega dados do curso e materiais
  const loadData = useCallback(async () => {
    const [courseData, materialsData] = await Promise.all([
      getCourseById(courseId),
      listCourseMaterials(courseId),
    ]);
    setCourse(courseData);
    setMaterials(materialsData);
  }, [courseId]);

  useEffect(() => {
    loadData();
    
    // Polling para atualizar status dos materiais
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Faz upload do arquivo
  const handleUpload = async (files: FileList) => {
    setError(null);
    setUploading(true);

    for (const file of Array.from(files)) {
      if (file.type !== 'application/pdf') {
        setError('Apenas arquivos PDF são aceitos');
        continue;
      }

      const formData = new FormData();
      formData.append('course_id', courseId);
      formData.append('file', file);

      try {
        const response = await fetch('/api/materials/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (!result.success) {
          setError(result.error || 'Erro ao fazer upload');
        }
      } catch (err) {
        setError('Erro ao fazer upload. Tente novamente.');
      }
    }

    setUploading(false);
    loadData();
  };

  // Handlers de drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  };

  // Finaliza o curso
  const handlePublish = async () => {
    const readyCount = materials.filter(m => m.status === 'ready').length;
    
    if (readyCount === 0) {
      setError('Adicione pelo menos 1 material antes de finalizar');
      return;
    }

    setPublishing(true);
    setError(null);

    const result = await publishCourse(courseId);

    if (result.error) {
      setError(result.error);
      setPublishing(false);
      return;
    }

    router.push(`/mentor/courses/${courseId}/complete`);
  };

  const readyCount = materials.filter(m => m.status === 'ready').length;
  const processingCount = materials.filter(m => m.status === 'processing').length;
  const errorCount = materials.filter(m => m.status === 'error').length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-16 items-start">
      <div className="lg:col-span-8 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text-main dark:text-white">
            Adicionar Materiais
          </h1>
          <p className="text-text-muted text-lg">
            Faça upload dos PDFs que serão usados para treinar o tutor de IA.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center w-full gap-4 mb-2">
          <div className="flex flex-col gap-2 flex-1 group cursor-pointer opacity-40">
            <div className="h-1.5 w-full rounded-full bg-primary"></div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">01. Detalhes</span>
          </div>
          <div className="flex flex-col gap-2 flex-1 group cursor-pointer">
            <div className="h-1.5 w-full rounded-full bg-primary relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">02. Materiais</span>
          </div>
          <div className="flex flex-col gap-2 flex-1 group cursor-pointer opacity-40">
            <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <span className="text-xs font-bold text-text-main dark:text-gray-400 uppercase tracking-wider">03. Conclusão</span>
          </div>
        </div>

        {/* Upload Card */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 md:p-8 flex flex-col gap-8">
          
          {/* Curso Info */}
          {course && (
            <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
              <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">school</span>
              </div>
              <div>
                <h3 className="font-bold text-text-main dark:text-white">{course.name}</h3>
                <p className="text-sm text-text-muted">{course.description || 'Sem descrição'}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
              <span className="material-symbols-outlined text-red-600">error</span>
              <span className="text-red-700 dark:text-red-300">{error}</span>
            </div>
          )}

          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center gap-4 transition-all
              ${dragOver 
                ? 'border-primary bg-primary/10' 
                : 'border-gray-300 dark:border-gray-700 hover:border-primary/50'
              }
              ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
            `}
            onClick={() => !uploading && document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept="application/pdf"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleUpload(e.target.files)}
              disabled={uploading}
            />
            
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-primary">
                {uploading ? 'hourglass_empty' : 'cloud_upload'}
              </span>
            </div>
            
            <div className="text-center">
              <p className="font-bold text-text-main dark:text-white">
                {uploading ? 'Enviando...' : 'Arraste arquivos PDF aqui'}
              </p>
              <p className="text-sm text-text-muted">
                ou clique para selecionar (máx. 50MB por arquivo)
              </p>
            </div>
          </div>

          {/* Materials List */}
          {materials.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-text-main dark:text-white">
                  Materiais ({materials.length})
                </h4>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-green-600">
                    <span className="size-2 rounded-full bg-green-500"></span>
                    {readyCount} prontos
                  </span>
                  {processingCount > 0 && (
                    <span className="flex items-center gap-1 text-amber-600">
                      <span className="size-2 rounded-full bg-amber-500 animate-pulse"></span>
                      {processingCount} processando
                    </span>
                  )}
                  {errorCount > 0 && (
                    <span className="flex items-center gap-1 text-red-600">
                      <span className="size-2 rounded-full bg-red-500"></span>
                      {errorCount} com erro
                    </span>
                  )}
                </div>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-gray-800 border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden">
                {materials.map((material) => (
                  <div key={material.id} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900">
                    <div className="size-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-red-600">picture_as_pdf</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text-main dark:text-white truncate">
                        {material.title}
                      </p>
                      <p className="text-xs text-text-muted">
                        {material.file_size_bytes 
                          ? `${(material.file_size_bytes / 1024 / 1024).toFixed(2)} MB`
                          : 'Tamanho desconhecido'
                        }
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {material.status === 'processing' && (
                        <span className="flex items-center gap-2 text-amber-600 text-sm">
                          <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                          Processando...
                        </span>
                      )}
                      {material.status === 'ready' && (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <span className="material-symbols-outlined text-lg">check_circle</span>
                          Pronto
                        </span>
                      )}
                      {material.status === 'error' && (
                        <span className="flex items-center gap-1 text-red-600 text-sm" title={material.error_message || ''}>
                          <span className="material-symbols-outlined text-lg">error</span>
                          Erro
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
            <button 
              onClick={() => router.push('/mentor/dashboard')}
              className="text-text-muted hover:text-text-main dark:hover:text-white font-bold text-sm px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Salvar Rascunho
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push(`/mentor/courses/create`)}
                className="text-text-main dark:text-white font-bold text-sm px-6 py-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handlePublish}
                disabled={readyCount === 0 || processingCount > 0 || publishing}
                className="bg-primary hover:bg-primary-dark text-white font-bold text-sm px-8 py-3 rounded-lg shadow-lg shadow-primary/30 transition-all transform active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {publishing ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                    Publicando...
                  </>
                ) : (
                  <>
                    Finalizar Curso
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-4 sticky top-24">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">tips_and_updates</span>
            <h3 className="font-bold text-blue-800 dark:text-blue-200">Dicas para os materiais</h3>
          </div>
          <ul className="space-y-3 text-sm text-blue-700 dark:text-blue-300">
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-lg shrink-0">check</span>
              <span>Use PDFs com texto selecionável (não apenas imagens)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-lg shrink-0">check</span>
              <span>Quanto mais conteúdo relevante, melhores as respostas do tutor</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-lg shrink-0">check</span>
              <span>Você pode adicionar mais materiais depois de publicar</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-lg shrink-0">warning</span>
              <span>Aguarde todos os materiais serem processados antes de finalizar</span>
            </li>
          </ul>
        </div>

        {readyCount > 0 && processingCount === 0 && (
          <div className="mt-6 bg-green-50 dark:bg-green-900/20 rounded-xl p-6 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
              <h3 className="font-bold text-green-800 dark:text-green-200">Pronto para publicar!</h3>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300">
              Você tem {readyCount} material(is) processado(s). Clique em "Finalizar Curso" para receber o código de convite.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
