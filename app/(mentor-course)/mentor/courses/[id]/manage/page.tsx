'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { getCourseById, type Course } from '@/server/courses';
import { listCourseMaterials, deleteMaterial, type Material } from '@/server/materials';

export default function MentorCourseManagePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Carrega dados do curso e materiais
  const loadData = useCallback(async () => {
    const [courseData, materialsData] = await Promise.all([
      getCourseById(courseId),
      listCourseMaterials(courseId),
    ]);
    setCourse(courseData);
    setMaterials(materialsData);
    setLoading(false);
  }, [courseId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Polling quando há materiais em processamento
  useEffect(() => {
    const hasProcessing = materials.some(m => m.status === 'processing');
    if (!hasProcessing) return;

    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [materials, loadData]);

  // Copia código de convite
  const handleCopyCode = async () => {
    if (!course) return;
    try {
      await navigator.clipboard.writeText(course.invite_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  // Upload de arquivos
  const handleUpload = async (files: FileList) => {
    setUploading(true);

    for (const file of Array.from(files)) {
      if (file.type !== 'application/pdf') continue;

      const formData = new FormData();
      formData.append('course_id', courseId);
      formData.append('file', file);

      try {
        await fetch('/api/materials/upload', {
          method: 'POST',
          body: formData,
        });
      } catch (err) {
        console.error('Erro no upload:', err);
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

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  };

  // Deleta material
  const handleDelete = async (materialId: string) => {
    if (!confirm('Tem certeza que deseja remover este material?')) return;
    await deleteMaterial(materialId);
    loadData();
  };

  // Formata tamanho do arquivo
  const formatSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  // Formata data
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Enviado hoje';
    if (diffDays === 1) return 'Enviado ontem';
    return `Enviado há ${diffDays} dias`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <span className="material-symbols-outlined text-6xl text-gray-300">error</span>
        <p className="text-text-muted">Curso não encontrado</p>
        <Link href="/mentor/dashboard" className="text-primary hover:underline">
          Voltar ao Dashboard
        </Link>
      </div>
    );
  }

  const readyCount = materials.filter(m => m.status === 'ready').length;
  const processingCount = materials.filter(m => m.status === 'processing').length;

  return (
    <>
      <header className="sticky top-0 z-20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-sm px-8 pt-8 pb-4">
        <div className="max-w-6xl mx-auto w-full">
          <nav className="flex items-center gap-2 text-sm mb-4 font-body">
            <Link className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors" href="/mentor/dashboard">
              Painel
            </Link>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <span className="text-text-main dark:text-white font-medium truncate max-w-[200px]">
              {course.name}
            </span>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <span className="text-text-main dark:text-white font-medium">Gestão</span>
          </nav>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-text-main dark:text-white">
                {course.name}
              </h1>
              {course.description && (
                <p className="text-text-muted mt-1">{course.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {course.status === 'published' ? (
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-bold flex items-center gap-1">
                  <span className="size-2 rounded-full bg-green-500"></span>
                  Publicado
                </span>
              ) : (
                <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-sm font-bold">
                  Rascunho
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="px-8 pb-12 flex-1">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-4 lg:order-2 space-y-6">
            {/* Card de Convite */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 sticky top-32">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <span className="material-symbols-outlined text-primary">person_add</span>
                </div>
                <h2 className="text-lg font-bold">Convidar Alunos</h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-body mb-6 leading-relaxed">
                Compartilhe este código para que os alunos possam entrar no curso.
              </p>
              
              {course.status === 'published' ? (
                <>
                  <div className="bg-background-light dark:bg-background-dark rounded-lg p-4 text-center mb-4 border border-dashed border-gray-300 dark:border-gray-600">
                    <span className="block text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">
                      Código do Curso
                    </span>
                    <span className="text-3xl font-black text-primary tracking-wider font-mono">
                      {course.invite_code}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className={`w-full py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
                      copied
                        ? 'bg-green-500 text-white'
                        : 'bg-primary hover:bg-primary/90 text-white shadow-sm shadow-primary/20'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {copied ? 'check' : 'content_copy'}
                    </span>
                    {copied ? 'Copiado!' : 'Copiar Código'}
                  </button>
                </>
              ) : (
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center">
                  <span className="material-symbols-outlined text-3xl text-orange-500 mb-2">lock</span>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    O código será liberado após publicar o curso.
                  </p>
                  <Link
                    href={`/mentor/courses/${courseId}/materials`}
                    className="inline-block mt-3 text-sm font-bold text-primary hover:underline"
                  >
                    Adicionar materiais →
                  </Link>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Estatísticas</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-2xl font-bold text-text-main dark:text-white">{readyCount}</span>
                  <p className="text-xs text-gray-500">Materiais prontos</p>
                </div>
                <div>
                  <span className="text-2xl font-bold text-text-main dark:text-white">0</span>
                  <p className="text-xs text-gray-500">Alunos inscritos</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 lg:order-1 flex flex-col gap-6">
            {/* Upload Area */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-text-main dark:text-white">Materiais do Curso</h2>
              </div>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !uploading && document.getElementById('file-input-manage')?.click()}
                className={`
                  group relative w-full h-48 rounded-xl border-2 border-dashed 
                  transition-all cursor-pointer flex flex-col items-center justify-center gap-3
                  ${dragOver
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary hover:bg-background-light dark:hover:bg-gray-800'
                  }
                  ${uploading ? 'opacity-50 pointer-events-none' : ''}
                `}
              >
                <input
                  id="file-input-manage"
                  type="file"
                  accept="application/pdf"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && handleUpload(e.target.files)}
                  disabled={uploading}
                />
                <div className="size-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-gray-400 group-hover:text-primary text-2xl">
                    {uploading ? 'hourglass_empty' : 'cloud_upload'}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-text-main dark:text-white font-medium">
                    {uploading ? 'Enviando...' : 'Solte arquivos PDF aqui ou '}
                    {!uploading && <span className="text-primary underline">Navegar</span>}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 font-body">Máx 50MB por arquivo</p>
                </div>
              </div>
            </div>

            {/* Materials List */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2">
                  Arquivos ({materials.length})
                </h3>
                {processingCount > 0 && (
                  <span className="text-xs text-amber-600 flex items-center gap-1">
                    <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                    {processingCount} processando
                  </span>
                )}
              </div>

              {materials.length === 0 ? (
                <div className="p-12 text-center">
                  <span className="material-symbols-outlined text-5xl text-gray-300 mb-3">description</span>
                  <p className="text-text-muted">Nenhum material enviado ainda</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                  {materials.map((material) => (
                    <li key={material.id} className="group flex items-center gap-4 p-4 hover:bg-background-light dark:hover:bg-gray-800 transition-colors">
                      <div className={`size-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        material.status === 'error'
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-500'
                          : 'bg-red-50 dark:bg-red-900/20 text-red-500'
                      }`}>
                        <span className="material-symbols-outlined text-[24px]">
                          {material.status === 'error' ? 'broken_image' : 'picture_as_pdf'}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-bold truncate ${
                          material.status === 'error'
                            ? 'text-gray-400 line-through'
                            : 'text-text-main dark:text-white'
                        }`}>
                          {material.title}
                        </h4>
                        {material.status === 'error' ? (
                          <p className="text-xs text-red-500 font-bold mt-0.5">
                            {material.error_message || 'Erro no processamento'}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-500 font-body">
                            {formatSize(material.file_size_bytes)} • {formatDate(material.created_at)}
                          </p>
                        )}
                        {material.status === 'processing' && (
                          <div className="w-full max-w-[200px] h-1 bg-gray-200 dark:bg-gray-600 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-amber-500 w-[60%] rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        {material.status === 'ready' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                            <span className="material-symbols-outlined text-[14px]">check</span>
                            Pronto
                          </span>
                        )}
                        {material.status === 'processing' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                            <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
                            Processando
                          </span>
                        )}
                        {material.status === 'error' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                            <span className="material-symbols-outlined text-[14px]">error</span>
                            Erro
                          </span>
                        )}

                        <button
                          onClick={() => handleDelete(material.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
