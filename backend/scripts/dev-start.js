/**
 * Starts nodemon only when PORT is free or the existing listener is not our API.
 */
const path = require('path');
const http = require('http');
const net = require('net');
const { execSync, spawn } = require('child_process');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const port = parseInt(process.env.PORT, 10) || 5000;
const root = path.join(__dirname, '..');

function isPortInUse(p) {
  return new Promise((resolve) => {
    const probe = net.createServer();
    probe.once('error', (err) => resolve(err.code === 'EADDRINUSE'));
    probe.once('listening', () => {
      probe.close(() => resolve(false));
    });
    probe.listen(p);
  });
}

function checkHealth(p) {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${p}/api/health`, { timeout: 3000 }, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve(res.statusCode === 200 && json.success === true);
        } catch {
          resolve(false);
        }
      });
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

function dockerApiRunning() {
  try {
    const out = execSync('docker ps --filter name=happy-feet-api --format "{{.Names}}"', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();
    return out === 'happy-feet-api';
  } catch {
    return false;
  }
}

function listeningPid(p) {
  try {
    const out = execSync(`netstat -ano | findstr :${p}`, { encoding: 'utf8' });
    const line = out.split('\n').find((l) => l.includes('LISTENING'));
    if (!line) return null;
    const parts = line.trim().split(/\s+/);
    return parts[parts.length - 1];
  } catch {
    return null;
  }
}

function startNodemon() {
  const child = spawn('npx', ['nodemon', 'src/server.js'], {
    cwd: root,
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });
  child.on('exit', (code) => process.exit(code ?? 0));
}

async function main() {
  if (!(await isPortInUse(port))) {
    startNodemon();
    return;
  }

  const healthy = await checkHealth(port);
  if (healthy) {
    const docker = dockerApiRunning();
    console.log(`\n[dev] Backend already running at http://localhost:${port}`);
    console.log(`[dev] Health: http://localhost:${port}/api/health`);
    if (docker) {
      console.log('[dev] Source: Docker (happy-feet-api)');
    } else {
      console.log('[dev] Source: existing Node process — no need to start again.');
    }
    console.log('[dev] To restart with hot reload:  npm run dev:restart\n');
    return;
  }

  const docker = dockerApiRunning();
  const pid = listeningPid(port);

  console.error(`\n[dev] Port ${port} is in use but /api/health did not respond.\n`);

  if (docker) {
    console.error('  Docker API (happy-feet-api) may be starting — wait a few seconds and retry.');
    console.error('  Or: npm run dev:local');
  } else {
    console.error('  Free the port (Windows):');
    if (pid) {
      console.error(`    taskkill /PID ${pid} /F`);
    } else {
      console.error(`    netstat -ano | findstr :${port}`);
      console.error('    taskkill /PID <pid> /F');
    }
    console.error('  Then: npm run dev');
    console.error(`  Or use another port in .env: PORT=5001\n`);
  }

  process.exit(1);
}

main().catch((err) => {
  console.error('[dev] Failed:', err.message);
  process.exit(1);
});
