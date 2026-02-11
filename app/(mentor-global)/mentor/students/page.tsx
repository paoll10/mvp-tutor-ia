'use client';

import { useState, useEffect } from 'react';
import { createStudent, listStudents, deleteStudent, type Student } from '@/server/students';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
  });

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    setLoading(true);
    const data = await listStudents();
    setStudents(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    const form = new FormData();
    form.append('email', formData.email);
    form.append('password', formData.password);
    if (formData.full_name) {
      form.append('full_name', formData.full_name);
    }

    const result = await createStudent(form);

    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: result.success || 'Aluno criado com sucesso!' });
      setFormData({ email: '', password: '', full_name: '' });
      setShowForm(false);
      loadStudents();
    }
  }

  async function handleDelete(userId: string) {
    if (!confirm('Tem certeza que deseja deletar este aluno?')) {
      return;
    }

    const result = await deleteStudent(userId);
    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: result.success || 'Aluno deletado com sucesso!' });
      loadStudents();
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-main dark:text-white mb-2">
              Gerenciar Alunos
            </h1>
            <p className="text-text-muted dark:text-gray-400">
              Crie e gerencie contas de alunos
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            {showForm ? 'Cancelar' : 'Criar Aluno'}
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="mb-8 bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-[#e8f1f2] dark:border-[#444]">
            <h2 className="text-xl font-bold text-text-main dark:text-white mb-4">
              Criar Novo Aluno
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-[#d1e3e6] dark:border-gray-600 rounded-lg bg-background-light dark:bg-gray-800 text-text-main dark:text-white"
                  placeholder="aluno@exemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">
                  Senha *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-[#d1e3e6] dark:border-gray-600 rounded-lg bg-background-light dark:bg-gray-800 text-text-main dark:text-white"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">
                  Nome Completo (opcional)
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-2 border border-[#d1e3e6] dark:border-gray-600 rounded-lg bg-background-light dark:bg-gray-800 text-text-main dark:text-white"
                  placeholder="Nome do aluno"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Criar Aluno
              </button>
            </form>
          </div>
        )}

        {/* Students List */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e8f1f2] dark:border-[#444] overflow-hidden">
          <div className="p-6 border-b border-[#e8f1f2] dark:border-[#444]">
            <h2 className="text-xl font-bold text-text-main dark:text-white">
              Alunos Cadastrados ({students.length})
            </h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-text-muted dark:text-gray-400">
              Carregando...
            </div>
          ) : students.length === 0 ? (
            <div className="p-8 text-center text-text-muted dark:text-gray-400">
              Nenhum aluno cadastrado ainda. Clique em "Criar Aluno" para começar.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#e8f1f2] dark:bg-[#444]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Data de Cadastro
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8f1f2] dark:divide-[#444]">
                  {students.map((student) => (
                    <tr key={student.user_id} className="hover:bg-[#e8f1f2]/50 dark:hover:bg-[#444]/50">
                      <td className="px-6 py-4 whitespace-nowrap text-text-main dark:text-white">
                        {student.full_name || 'Sem nome'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-text-main dark:text-white">
                        {student.email !== 'Ver no Supabase Dashboard' ? student.email : (
                          <span className="text-text-muted dark:text-gray-400 text-sm">
                            Ver no Dashboard
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-text-muted dark:text-gray-400">
                        {new Date(student.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleDelete(student.user_id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
