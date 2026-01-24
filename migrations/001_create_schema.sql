-- =============================================
-- MIGRAÇÃO 001: CRIAR SCHEMA MENTORIA
-- Isola todas as tabelas do sistema MentorIA
-- =============================================

create schema if not exists mentoria;

-- Permissões do schema para usuários do Supabase
grant usage on schema mentoria to anon;
grant usage on schema mentoria to authenticated;
grant usage on schema mentoria to service_role;

-- Permissão para TODAS as tabelas do schema
grant all on all tables in schema mentoria to anon;
grant all on all tables in schema mentoria to authenticated;
grant all on all tables in schema mentoria to service_role;

-- Permissão para tabelas FUTURAS
alter default privileges in schema mentoria
grant all on tables to anon;

alter default privileges in schema mentoria
grant all on tables to authenticated;

alter default privileges in schema mentoria
grant all on tables to service_role;

