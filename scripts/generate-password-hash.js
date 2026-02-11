/**
 * Script para gerar hash de senha usando bcrypt
 * Execute: node scripts/generate-password-hash.js <senha>
 */

const bcrypt = require('bcrypt');

async function generateHash(password) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log('\n' + '='.repeat(60));
  console.log('🔐 HASH DE SENHA GERADO');
  console.log('='.repeat(60));
  console.log('\nSenha:', password);
  console.log('Hash:', hash);
  console.log('\n' + '='.repeat(60));
  console.log('\n📋 Use este hash no SQL:\n');
  console.log(`UPDATE mentoria.users SET password_hash = '${hash}' WHERE email = 'seu-email@exemplo.com';`);
  console.log('\n');
}

const password = process.argv[2];

if (!password) {
  console.error('❌ Erro: Forneça uma senha');
  console.log('\nUso: node scripts/generate-password-hash.js <senha>');
  console.log('Exemplo: node scripts/generate-password-hash.js "Mentor123!@#"');
  process.exit(1);
}

generateHash(password).catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});
