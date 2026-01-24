/**
 * Script para testar a configuração do Login com Google
 * Execute com: node scripts/test-google-login.js
 */

const https = require('https');
const http = require('http');

// Cores para output no terminal
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(type, message) {
  const icons = {
    success: `${colors.green}✓${colors.reset}`,
    error: `${colors.red}✗${colors.reset}`,
    info: `${colors.blue}ℹ${colors.reset}`,
    warning: `${colors.yellow}⚠${colors.reset}`
  };
  console.log(`${icons[type]} ${message}`);
}

function header(text) {
  console.log(`\n${colors.bold}${colors.blue}${'='.repeat(50)}${colors.reset}`);
  console.log(`${colors.bold}  ${text}${colors.reset}`);
  console.log(`${colors.blue}${'='.repeat(50)}${colors.reset}\n`);
}

// Carregar variáveis de ambiente do .env.local
function loadEnv() {
  const fs = require('fs');
  const path = require('path');
  
  const envPath = path.join(__dirname, '..', '.env.local');
  
  if (!fs.existsSync(envPath)) {
    return null;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  return env;
}

// Fazer requisição HTTP/HTTPS
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.get(url, { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function testEnvVariables(env) {
  header('1. Verificando Variáveis de Ambiente');
  
  let allPassed = true;
  
  if (!env) {
    log('error', 'Arquivo .env.local não encontrado!');
    log('info', 'Crie o arquivo .env.local com as seguintes variáveis:');
    console.log(`
    NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
    `);
    return false;
  }
  
  if (env.NEXT_PUBLIC_SUPABASE_URL) {
    log('success', `NEXT_PUBLIC_SUPABASE_URL: ${env.NEXT_PUBLIC_SUPABASE_URL}`);
  } else {
    log('error', 'NEXT_PUBLIC_SUPABASE_URL não configurada');
    allPassed = false;
  }
  
  if (env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const maskedKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...';
    log('success', `NEXT_PUBLIC_SUPABASE_ANON_KEY: ${maskedKey}`);
  } else {
    log('error', 'NEXT_PUBLIC_SUPABASE_ANON_KEY não configurada');
    allPassed = false;
  }
  
  return allPassed;
}

async function testSupabaseConnection(env) {
  header('2. Testando Conexão com Supabase');
  
  if (!env?.NEXT_PUBLIC_SUPABASE_URL) {
    log('error', 'URL do Supabase não configurada');
    return false;
  }
  
  try {
    // Usa o endpoint de settings que é público
    const settingsUrl = `${env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/settings`;
    log('info', `Testando: ${settingsUrl}`);
    
    const response = await makeRequest(settingsUrl);
    
    if (response.statusCode === 200) {
      log('success', 'Conexão com Supabase Auth está funcionando!');
      
      // Verifica se Google está habilitado nas configurações
      try {
        const settings = JSON.parse(response.body);
        if (settings.external?.google) {
          log('success', 'Provider Google está habilitado no Supabase!');
        }
      } catch (e) {
        // Ignora erro de parse
      }
      
      return true;
    } else if (response.statusCode === 401) {
      // 401 significa que o servidor está respondendo, apenas requer auth
      log('success', 'Supabase está acessível (autenticação necessária para detalhes)');
      return true;
    } else {
      log('error', `Supabase retornou status: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    log('error', `Erro ao conectar com Supabase: ${error.message}`);
    return false;
  }
}

async function testGoogleOAuthConfig(env) {
  header('3. Verificando Configuração OAuth do Google');
  
  if (!env?.NEXT_PUBLIC_SUPABASE_URL) {
    log('error', 'URL do Supabase não configurada');
    return false;
  }
  
  try {
    // Tenta iniciar o fluxo OAuth para verificar se o Google está configurado
    const oauthUrl = `${env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=http://localhost:3000/auth/callback`;
    log('info', `Testando endpoint OAuth: ${oauthUrl}`);
    
    const response = await makeRequest(oauthUrl);
    
    // Se o Google OAuth estiver configurado, deve redirecionar para accounts.google.com
    if (response.statusCode === 302 || response.statusCode === 303) {
      const redirectUrl = response.headers.location || '';
      
      if (redirectUrl.includes('accounts.google.com')) {
        log('success', 'Google OAuth está configurado corretamente!');
        log('info', `Redirecionando para: ${redirectUrl.substring(0, 60)}...`);
        return true;
      } else if (redirectUrl.includes('error')) {
        log('error', 'Google OAuth não está configurado no Supabase');
        log('warning', 'Configure o Google Provider no Supabase Dashboard:');
        log('info', '  1. Acesse: Authentication → Providers → Google');
        log('info', '  2. Adicione Client ID e Client Secret do Google');
        return false;
      }
    }
    
    if (response.statusCode === 400 || response.statusCode === 422) {
      log('error', 'Google OAuth não está habilitado no Supabase');
      log('warning', 'Habilite o provedor Google no Supabase Dashboard');
      return false;
    }
    
    log('warning', `Resposta inesperada: ${response.statusCode}`);
    return false;
    
  } catch (error) {
    log('error', `Erro ao testar OAuth: ${error.message}`);
    return false;
  }
}

async function testLocalServer() {
  header('4. Verificando Servidor Local');
  
  try {
    const response = await makeRequest('http://localhost:3000/login');
    
    if (response.statusCode === 200) {
      log('success', 'Servidor local está rodando em http://localhost:3000');
      
      if (response.body.includes('Google')) {
        log('success', 'Botão de login com Google encontrado na página!');
        return true;
      } else {
        log('warning', 'Botão de Google não encontrado na página de login');
        return true;
      }
    } else {
      log('warning', `Servidor retornou status: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    log('warning', 'Servidor local não está rodando');
    log('info', 'Execute: npm run dev');
    return false;
  }
}

async function runTests() {
  console.log(`
${colors.bold}${colors.blue}
  ╔═══════════════════════════════════════════════════╗
  ║     MentorIA - Teste de Login com Google          ║
  ╚═══════════════════════════════════════════════════╝
${colors.reset}`);

  const env = loadEnv();
  
  const results = {
    env: await testEnvVariables(env),
    supabase: await testSupabaseConnection(env),
    oauth: await testGoogleOAuthConfig(env),
    server: await testLocalServer()
  };
  
  header('Resumo dos Testes');
  
  console.log('  Variáveis de Ambiente:', results.env ? `${colors.green}PASSOU${colors.reset}` : `${colors.red}FALHOU${colors.reset}`);
  console.log('  Conexão Supabase:     ', results.supabase ? `${colors.green}PASSOU${colors.reset}` : `${colors.red}FALHOU${colors.reset}`);
  console.log('  Google OAuth:         ', results.oauth ? `${colors.green}PASSOU${colors.reset}` : `${colors.red}FALHOU${colors.reset}`);
  console.log('  Servidor Local:       ', results.server ? `${colors.green}PASSOU${colors.reset}` : `${colors.yellow}AVISO${colors.reset}`);
  
  const allPassed = results.env && results.supabase && results.oauth;
  
  console.log('\n' + '='.repeat(50));
  if (allPassed) {
    console.log(`${colors.green}${colors.bold}✓ Login com Google está pronto para uso!${colors.reset}`);
  } else {
    console.log(`${colors.red}${colors.bold}✗ Alguns testes falharam. Verifique as configurações acima.${colors.reset}`);
  }
  console.log('='.repeat(50) + '\n');
  
  process.exit(allPassed ? 0 : 1);
}

runTests().catch(error => {
  console.error('Erro ao executar testes:', error);
  process.exit(1);
});

