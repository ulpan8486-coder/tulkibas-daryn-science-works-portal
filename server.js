// TD Science Works Portal — Node.js server
// Run: node server.js
// Env: PORT, ADMIN_EMAIL, ADMIN_PASSWORD,
//      DATABASE_URL (Postgres; without it data is kept in data/db.json)
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const CURRENT_YEAR = 2026;
const ARCHIVE_YEARS = [2025, 2026];
const GRADES = [7, 8, 9, 10, 11];

// ---------- storage ----------
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}
function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const test = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(test, Buffer.from(hash, 'hex'));
}
const id = () => crypto.randomBytes(8).toString('hex');

const PROECO_TITLE = { ru: 'ProEco', kz: 'ProEco', en: 'ProEco' };

// Makes sure the admin account exists. When ADMIN_PASSWORD is set, the admin's
// password is synced to it on every start, so changing the variable on the
// hosting and restarting always restores admin access.
function ensureAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@td.kz').trim().toLowerCase();
  const envPass = (process.env.ADMIN_PASSWORD || '').trim();
  let admin = db.users.find((u) => u.email === email);
  if (!admin) {
    const pass = envPass || crypto.randomBytes(6).toString('base64url');
    admin = {
      id: id(), email, firstName: 'Admin', lastName: 'TD', grade: null,
      role: 'admin', password: hashPassword(pass), createdAt: new Date().toISOString(),
    };
    db.users.push(admin);
    console.log('\n=== Создан администратор / Admin account created ===');
    console.log(`  email:    ${email}`);
    console.log(envPass ? '  password: (из переменной ADMIN_PASSWORD)\n'
      : `  password: ${pass}\n  (сохраните пароль — он показывается только один раз)\n`);
    return;
  }
  admin.role = 'admin';
  if (envPass && !verifyPassword(envPass, admin.password)) {
    admin.password = hashPassword(envPass);
    console.log(`Пароль администратора ${email} обновлён из ADMIN_PASSWORD`);
  }
}

// Small fixes for databases created by older versions
function migrate() {
  for (const k of ['users', 'events', 'applications', 'archive']) if (!Array.isArray(db[k])) db[k] = [];
  if (!db.sessions || typeof db.sessions !== 'object') db.sessions = {};
  for (const ev of db.events) {
    if (/^ecopro/.test(ev.id) && /эко\s*про|eco\s*pro/i.test(ev.title.ru || '')) {
      ev.title = ev.id === 'ecopro-2026' ? { ...PROECO_TITLE } : { ru: `${PROECO_TITLE.ru} ${ev.id.slice(-4)}`, kz: `${PROECO_TITLE.kz} ${ev.id.slice(-4)}`, en: `${PROECO_TITLE.en} ${ev.id.slice(-4)}` };
    }
  }
}

function seed() {
  return {
    users: [],
    sessions: {},
    events: [
      {
        id: 'zerde-2026', grades: [7, 8], status: 'active', date: '2027-02-20',
        title: { ru: 'Зерде', kz: 'Зерде', en: 'Zerde' },
        description: {
          ru: 'Республиканский конкурс исследовательских проектов для учащихся 7–8 классов.',
          kz: '7–8 сынып оқушыларына арналған ғылыми жобалардың республикалық байқауы.',
          en: 'National research project competition for grades 7–8.',
        },
      },
      {
        id: 'ecopro-2026', grades: [7, 8], status: 'active', date: '2027-03-15',
        title: { ...PROECO_TITLE },
        description: {
          ru: 'Республиканский конкурс экологических проектов: природа родного края, фото- и видеоработы, экоинициативы, «Чистый город» (7–8 классы).',
          kz: 'Экологиялық жобалардың республикалық конкурсы: туған өлке табиғаты, фото-бейне жұмыстар, экобастамалар, «Таза қала» (7–8 сынып).',
          en: 'National environmental project competition: native nature, photo and video works, eco initiatives, “Clean City” (grades 7–8).',
        },
      },
      {
        id: 'general-2026', grades: [9, 10, 11], status: 'active', date: '2027-01-25',
        title: { ru: 'Общий конкурс научных проектов', kz: 'Ғылыми жобалардың жалпы байқауы', en: 'General Science Project Competition' },
        description: {
          ru: 'Научные проекты по всем направлениям для учащихся 9–11 классов.',
          kz: '9–11 сынып оқушыларына арналған барлық бағыттағы ғылыми жобалар.',
          en: 'Research projects in all fields for grades 9–11.',
        },
      },
      {
        id: 'zerde-2025', grades: [7, 8], status: 'past', date: '2025-03-10',
        title: { ru: 'Зерде 2025', kz: 'Зерде 2025', en: 'Zerde 2025' },
        description: {
          ru: 'Конкурс исследовательских проектов 2025 года для 7–8 классов.',
          kz: '2025 жылғы 7–8 сыныптарға арналған ғылыми жобалар байқауы.',
          en: '2025 research project competition for grades 7–8.',
        },
      },
      {
        id: 'general-2025', grades: [9, 10, 11], status: 'past', date: '2025-02-05',
        title: { ru: 'Общий конкурс 2025', kz: 'Жалпы байқау 2025', en: 'General Competition 2025' },
        description: {
          ru: 'Научные проекты 2025 года для 9–11 классов.',
          kz: '2025 жылғы 9–11 сыныптарға арналған ғылыми жобалар.',
          en: '2025 research projects for grades 9–11.',
        },
      },
    ],
    applications: [],
    // 2025 works (more can be added in the admin panel → Archive)
    archive: [
      {
        id: id(), year: 2025, author: 'Бейсенбай Азамат', grade: 8, eventId: '',
        title: 'Тема работы будет добавлена', description: '',
        result: 'Грамота, республиканский этап', acceptedAt: '2025-01-01T00:00:00.000Z',
      },
    ],
  };
}

// The whole state is one JSON document. With DATABASE_URL it lives in a single
// Postgres row (survives restarts on hosting without a disk); otherwise in a file.
let db;
let pool = null;
const DATABASE_URL = (process.env.DATABASE_URL || '').trim();

async function loadDb() {
  if (DATABASE_URL) {
    const { Pool } = require('pg');
    const local = /@(localhost|127\.0\.0\.1)[:/]/.test(DATABASE_URL);
    const opts = { connectionString: DATABASE_URL, max: 3 };
    if (!local && !/sslmode=/.test(DATABASE_URL)) opts.ssl = true;
    pool = new Pool(opts);
    await pool.query(`CREATE TABLE IF NOT EXISTS app_state (
      id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT now())`);
    const r = await pool.query("SELECT data FROM app_state WHERE id = 'main'");
    db = r.rows.length ? r.rows[0].data : seed();
    console.log(r.rows.length ? 'База данных: Postgres (данные загружены)' : 'База данных: Postgres (новая база)');
  } else {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    db = fs.existsSync(DB_FILE) ? JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) : seed();
    console.log(`База данных: файл ${path.relative(__dirname, DB_FILE)}`);
    if (process.env.RENDER) console.warn('ВНИМАНИЕ: DATABASE_URL не задан — на Render данные сотрутся при перезапуске!');
  }
  migrate();
  ensureAdmin();
  await saveDb();
}

// Writes are serialized; each call resolves once its snapshot is stored.
let saveChain = Promise.resolve();
function saveDb() {
  const snapshot = JSON.stringify(db);
  const job = saveChain.catch(() => {}).then(() => {
    if (pool) {
      return pool.query(`INSERT INTO app_state (id, data, updated_at) VALUES ('main', $1::jsonb, now())
        ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`, [snapshot]);
    }
    const tmp = DB_FILE + '.tmp';
    fs.writeFileSync(tmp, snapshot);
    fs.renameSync(tmp, DB_FILE);
  });
  saveChain = job;
  return job;
}

// ---------- helpers ----------
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.ico': 'image/x-icon',
  '.webp': 'image/webp', '.json': 'application/json; charset=utf-8', '.pdf': 'application/pdf',
};

function send(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(data));
}
const fail = (res, status, code) => send(res, status, { error: code });

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', (c) => { size += c.length; if (size > 1e5) { reject(new Error('too_large')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => { try { resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {}); } catch { reject(new Error('bad_json')); } });
    req.on('error', reject);
  });
}

function getCookie(req, name) {
  const m = (req.headers.cookie || '').match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}
function currentUser(req) {
  const token = getCookie(req, 'td_session');
  if (!token || !db.sessions[token]) return null;
  return db.users.find((u) => u.id === db.sessions[token]) || null;
}
const publicUser = (u) => u && ({ id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName, grade: u.grade, role: u.role });
const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

async function startSession(res, user) {
  const token = crypto.randomBytes(32).toString('hex');
  db.sessions[token] = user.id;
  await saveDb();
  res.setHeader('Set-Cookie', `td_session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`);
}

// ---------- API ----------
async function api(req, res, url) {
  const p = url.pathname; const m = req.method;
  const user = currentUser(req);
  const isAdmin = user && user.role === 'admin';
  let body = {};
  if (m === 'POST' || m === 'PUT' || m === 'PATCH') {
    try { body = await readBody(req); } catch (e) { return fail(res, 400, e.message); }
  }

  // --- auth ---
  if (p === '/api/me' && m === 'GET') return send(res, 200, { user: publicUser(user), currentYear: CURRENT_YEAR, years: ARCHIVE_YEARS });

  if (p === '/api/register' && m === 'POST') {
    const email = str(body.email, 120).toLowerCase();
    const firstName = str(body.firstName, 60); const lastName = str(body.lastName, 60);
    const grade = Number(body.grade); const password = typeof body.password === 'string' ? body.password : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(res, 400, 'bad_email');
    if (!firstName || !lastName) return fail(res, 400, 'missing_fields');
    if (!GRADES.includes(grade)) return fail(res, 400, 'bad_grade');
    if (password.length < 6) return fail(res, 400, 'short_password');
    if (db.users.some((u) => u.email === email)) return fail(res, 409, 'email_taken');
    const u = { id: id(), email, firstName, lastName, grade, role: 'student', password: hashPassword(password), createdAt: new Date().toISOString() };
    db.users.push(u);
    await startSession(res, u);
    return send(res, 201, { user: publicUser(u) });
  }

  if (p === '/api/login' && m === 'POST') {
    const email = str(body.email, 120).toLowerCase();
    const u = db.users.find((x) => x.email === email);
    if (!u || typeof body.password !== 'string' || !verifyPassword(body.password, u.password)) return fail(res, 401, 'bad_credentials');
    await startSession(res, u);
    return send(res, 200, { user: publicUser(u) });
  }

  if (p === '/api/logout' && m === 'POST') {
    const token = getCookie(req, 'td_session');
    if (token) { delete db.sessions[token]; await saveDb(); }
    res.setHeader('Set-Cookie', 'td_session=; HttpOnly; Path=/; Max-Age=0');
    return send(res, 200, { ok: true });
  }

  // --- public-ish data (requires login) ---
  if (!user) return fail(res, 401, 'unauthorized');

  if (p === '/api/events' && m === 'GET') return send(res, 200, { events: db.events });

  if (p === '/api/archive' && m === 'GET') {
    const year = Number(url.searchParams.get('year'));
    const items = db.archive.filter((a) => !year || a.year === year).sort((a, b) => (b.acceptedAt || '').localeCompare(a.acceptedAt || ''));
    return send(res, 200, { items });
  }

  if (p === '/api/applications/mine' && m === 'GET') {
    return send(res, 200, { items: db.applications.filter((a) => a.userId === user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)) });
  }

  if (p === '/api/applications' && m === 'POST') {
    const ev = db.events.find((e) => e.id === body.eventId);
    const title = str(body.title, 200); const description = str(body.description, 4000);
    const fullName = str(body.fullName, 120); const grade = Number(body.grade);
    if (!ev || ev.status !== 'active') return fail(res, 400, 'bad_event');
    if (!GRADES.includes(grade) || !ev.grades.includes(grade)) return fail(res, 400, 'grade_not_allowed');
    if (!title || !description || !fullName) return fail(res, 400, 'missing_fields');
    const a = {
      id: id(), userId: user.id, email: user.email, fullName, grade, eventId: ev.id,
      title, description, status: 'pending', createdAt: new Date().toISOString(),
    };
    db.applications.push(a); await saveDb();
    return send(res, 201, { application: a });
  }

  // --- admin ---
  if (!p.startsWith('/api/admin/')) return fail(res, 404, 'not_found');
  if (!isAdmin) return fail(res, 403, 'forbidden');

  if (p === '/api/admin/applications' && m === 'GET') {
    const status = url.searchParams.get('status');
    const items = db.applications.filter((a) => !status || a.status === status).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return send(res, 200, { items });
  }

  let mm;
  if ((mm = p.match(/^\/api\/admin\/applications\/([a-f0-9]+)\/(accept|reject)$/)) && m === 'POST') {
    const a = db.applications.find((x) => x.id === mm[1]);
    if (!a) return fail(res, 404, 'not_found');
    if (a.status !== 'pending') return fail(res, 409, 'already_reviewed');
    a.status = mm[2] === 'accept' ? 'accepted' : 'rejected';
    a.reviewedAt = new Date().toISOString();
    a.comment = str(body.comment, 500);
    if (a.status === 'accepted') {
      // accepted titles go straight to the current year's archive
      db.archive.push({
        id: id(), applicationId: a.id, year: CURRENT_YEAR, author: a.fullName, grade: a.grade, eventId: a.eventId,
        title: a.title, description: a.description, result: '', acceptedAt: a.reviewedAt,
      });
    }
    await saveDb();
    return send(res, 200, { application: a });
  }

  if (p === '/api/admin/archive' && m === 'POST') {
    const year = Number(body.year);
    if (!ARCHIVE_YEARS.includes(year)) return fail(res, 400, 'bad_year');
    const title = str(body.title, 200); const author = str(body.author, 120);
    if (!title || !author) return fail(res, 400, 'missing_fields');
    const item = {
      id: id(), year, author, grade: GRADES.includes(Number(body.grade)) ? Number(body.grade) : null,
      eventId: str(body.eventId, 60), title, description: str(body.description, 4000), result: str(body.result, 300),
      acceptedAt: new Date().toISOString(),
    };
    db.archive.push(item); await saveDb();
    return send(res, 201, { item });
  }

  if ((mm = p.match(/^\/api\/admin\/archive\/([a-f0-9]+)$/))) {
    const idx = db.archive.findIndex((x) => x.id === mm[1]);
    if (idx < 0) return fail(res, 404, 'not_found');
    if (m === 'PATCH') {
      const it = db.archive[idx];
      if ('result' in body) it.result = str(body.result, 300);
      if ('title' in body && str(body.title, 200)) it.title = str(body.title, 200);
      if ('author' in body && str(body.author, 120)) it.author = str(body.author, 120);
      if ('description' in body) it.description = str(body.description, 4000);
      await saveDb();
      return send(res, 200, { item: it });
    }
    if (m === 'DELETE') { db.archive.splice(idx, 1); await saveDb(); return send(res, 200, { ok: true }); }
  }

  if (p === '/api/admin/events' && m === 'POST') {
    const grades = Array.isArray(body.grades) ? body.grades.map(Number).filter((g) => GRADES.includes(g)) : [];
    const t = body.title || {}; const d = body.description || {};
    const title = { ru: str(t.ru, 120), kz: str(t.kz, 120), en: str(t.en, 120) };
    if (!title.ru && !title.kz && !title.en) return fail(res, 400, 'missing_fields');
    if (!grades.length) return fail(res, 400, 'bad_grade');
    const ev = {
      id: id(), grades, status: body.status === 'past' ? 'past' : 'active', date: str(body.date, 20),
      title, description: { ru: str(d.ru, 1000), kz: str(d.kz, 1000), en: str(d.en, 1000) },
    };
    db.events.push(ev); await saveDb();
    return send(res, 201, { event: ev });
  }

  if ((mm = p.match(/^\/api\/admin\/events\/([\w-]+)$/)) && m === 'PATCH') {
    const ev = db.events.find((e) => e.id === mm[1]);
    if (!ev) return fail(res, 404, 'not_found');
    if (body.status === 'active' || body.status === 'past') ev.status = body.status;
    await saveDb();
    return send(res, 200, { event: ev });
  }

  return fail(res, 404, 'not_found');
}

// ---------- static ----------
function serveStatic(req, res, url) {
  let rel = decodeURIComponent(url.pathname);
  if (rel === '/') rel = '/index.html';
  const file = path.normalize(path.join(PUBLIC_DIR, rel));
  if (!file.startsWith(PUBLIC_DIR)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) {
      if (path.extname(rel)) { res.writeHead(404); return res.end('Not found'); }
      // SPA fallback
      return fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (e2, html) => {
        if (e2) { res.writeHead(404); return res.end('Not found'); }
        res.writeHead(200, { 'Content-Type': MIME['.html'] }); res.end(html);
      });
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  try {
    if (url.pathname.startsWith('/api/')) return await api(req, res, url);
    serveStatic(req, res, url);
  } catch (e) {
    console.error(e);
    if (!res.headersSent) fail(res, 500, 'server_error');
  }
});

loadDb()
  .then(() => server.listen(PORT, () => console.log(`TD Science Works Portal → http://localhost:${PORT}`)))
  .catch((e) => { console.error('Не удалось загрузить базу данных:', e.message); process.exit(1); });
