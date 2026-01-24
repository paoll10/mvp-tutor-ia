-- =============================================
-- MIGRAÇÃO 007: ATIVAR RLS (ROW LEVEL SECURITY)
-- Ativa a segurança a nível de linha em todas as tabelas
-- =============================================

alter table mentoria.profiles enable row level security;
alter table mentoria.courses enable row level security;
alter table mentoria.course_members enable row level security;
alter table mentoria.materials enable row level security;
alter table mentoria.conversations enable row level security;
alter table mentoria.messages enable row level security;

