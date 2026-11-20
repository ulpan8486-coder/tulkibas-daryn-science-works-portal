(() => {
  'use strict';

  // ---------- state ----------
  const state = {
    lang: safeGet('td_lang') || 'ru',
    user: null,
    currentYear: 2026,
    years: [2025, 2026],
    events: [],
    homeFilter: safeGet('td_home_filter') || 'active',
    archiveYear: null,
    adminTab: 'pending',
  };
  const GRADES = [7, 8, 9, 10, 11];
  const $app = document.getElementById('app');

  function safeGet(k) { try { return localStorage.getItem(k); } catch { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } }

  // ---------- i18n ----------
  function t(key, vars) {
    let s = (I18N[state.lang] && I18N[state.lang][key]) ?? I18N.ru[key] ?? key;
    if (vars) for (const k in vars) s = s.replaceAll('{' + k + '}', vars[k]);
    return s;
  }
  const loc = (obj) => (obj && (obj[state.lang] || obj.ru || obj.kz || obj.en)) || '';
  function applyStaticI18n() {
    document.documentElement.lang = state.lang === 'kz' ? 'kk' : state.lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('#lang button').forEach((b) => b.classList.toggle('active', b.dataset.lang === state.lang));
  }

  // ---------- utils ----------
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function fmtDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d)) return esc(iso);
    const localeMap = { ru: 'ru-RU', kz: 'kk-KZ', en: 'en-GB' };
    return d.toLocaleDateString(localeMap[state.lang], { day: 'numeric', month: 'long', year: 'numeric' });
  }
  const gradesLabel = (g) => (g.length > 1 ? `${Math.min(...g)}–${Math.max(...g)}` : String(g[0]));

  async function api(path, opts = {}) {
    const res = await fetch(path, {
      method: opts.method || 'GET',
      headers: opts.body ? { 'Content-Type': 'application/json' } : {},
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      credentials: 'same-origin',
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || 'generic'); err.code = data.error || 'generic';
      if (res.status === 401 && path !== '/api/login') { state.user = null; }
      throw err;
    }
    return data;
  }
  const errText = (e) => t('err_' + e.code) !== 'err_' + e.code ? t('err_' + e.code) : t('err_generic');

  let toastTimer;
  function toast(msg, kind = 'ok') {
    const el = document.getElementById('toast');
    el.textContent = msg; el.className = 'toast show ' + kind;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => (el.className = 'toast'), 3200);
  }

  async function loadEvents() { state.events = (await api('/api/events')).events; }
  const eventById = (id) => state.events.find((e) => e.id === id);

  // ---------- chrome ----------
  function renderChrome(route) {
    const authed = !!state.user;
    const bare = route === '' || route === 'login' || route === 'register';
    document.body.classList.toggle('bare', bare);
    const nav = document.getElementById('nav');
    const ub = document.getElementById('userbox');
    if (authed && !bare) {
      const links = [['home', 'navHome'], ['submit', 'navSubmit'], ['archive', 'navArchive'], ['rules', 'navRules'], ['tests', 'navTests']];
      if (state.user.role === 'admin') links.push(['admin', 'navAdmin']);
      nav.innerHTML = links.map(([r, k]) =>
        `<a href="#/${r}" class="${route === r ? 'active' : ''} ${r === 'submit' ? 'cta' : ''}">${t(k)}</a>`).join('');
      const initials = (state.user.firstName[0] || '') + (state.user.lastName[0] || '');
      ub.innerHTML = `<span class="avatar" title="${esc(state.user.email)}">${esc(initials)}</span>
        <span class="uname">${esc(state.user.firstName)}${state.user.grade ? ` · ${state.user.grade}` : ''}</span>
        <button class="btn-ghost sm" id="logoutBtn">${t('logout')}</button>`;
      document.getElementById('logoutBtn').onclick = async () => {
        await api('/api/logout', { method: 'POST' }).catch(() => {});
        state.user = null; location.hash = '#/';
      };
    } else if (!bare) {
      // guest on a public page (rules)
      nav.innerHTML = `<a href="#/rules" class="${route === 'rules' ? 'active' : ''}">${t('navRules')}</a>`;
      ub.innerHTML = `<a class="btn-primary sm" href="#/login">${t('loginNav')}</a>`;
    } else { nav.innerHTML = ''; ub.innerHTML = ''; }
    nav.classList.remove('open');
  }

  // ---------- pages ----------
  function pageLanding() {
    $app.innerHTML = `
      <section class="hero">
        <div class="hero-bg" aria-hidden="true"></div>
        <div class="hero-inner">
          <img class="hero-logo" src="img/logo.png" onerror="this.onerror=null;this.src='img/logo.svg'" alt="Tulkibas Daryn">
          <p class="kicker">${t('heroKicker')}</p>
          <h1>${t('heroTitle')}</h1>
          <p class="lead">${t('heroText')}</p>
          <div class="features">
            ${[1, 2, 3].map((i) => `<div class="feature"><span class="fnum">0${i}</span><b>${t('heroF' + i + 't')}</b><span>${t('heroF' + i)}</span></div>`).join('')}
          </div>
          <div class="hero-actions">
            <a class="btn-primary lg" href="${state.user ? '#/home' : '#/login'}">${t('start')} →</a>
            <a class="btn-glass lg" href="#/rules">${t('readRules')}</a>
          </div>
        </div>
      </section>`;
  }

  function authShell(inner) {
    return `<section class="auth">
      <div class="auth-card">
        <a href="#/" class="auth-logo"><img src="img/logo.png" onerror="this.onerror=null;this.src='img/logo.svg'" alt="TD"></a>
        ${inner}
      </div></section>`;
  }

  function pageLogin() {
    $app.innerHTML = authShell(`
      <h2>${t('loginTitle')}</h2><p class="muted">${t('loginSub')}</p>
      <form id="f" class="form" novalidate>
        <label>${t('email')}<input name="email" type="email" autocomplete="email" required></label>
        <label>${t('password')}<input name="password" type="password" autocomplete="current-password" required></label>
        <p class="form-error" id="err"></p>
        <button class="btn-primary block" type="submit">${t('loginBtn')}</button>
      </form>
      <div class="auth-switch"><span class="muted">${t('noAccount')}</span>
        <a class="btn-ghost block" href="#/register">${t('registerBtn')}</a>
        <a class="sm" href="#/rules">${t('readRules')} →</a></div>`);
    document.getElementById('f').onsubmit = async (e) => {
      e.preventDefault();
      const fd = Object.fromEntries(new FormData(e.target));
      try {
        state.user = (await api('/api/login', { method: 'POST', body: fd })).user;
        location.hash = '#/home';
      } catch (err) { document.getElementById('err').textContent = errText(err); }
    };
  }

  function pageRegister() {
    $app.innerHTML = authShell(`
      <h2>${t('registerTitle')}</h2><p class="muted">${t('registerSub')}</p>
      <form id="f" class="form" novalidate>
        <label>${t('email')}<input name="email" type="email" autocomplete="email" required></label>
        <div class="row2">
          <label>${t('firstName')}<input name="firstName" autocomplete="given-name" required></label>
          <label>${t('lastName')}<input name="lastName" autocomplete="family-name" required></label>
        </div>
        <fieldset class="grade-pick"><legend>${t('grade')}</legend>
          ${GRADES.map((g) => `<label class="chip-radio"><input type="radio" name="grade" value="${g}"><span>${g}</span></label>`).join('')}
        </fieldset>
        <label>${t('password')}<input name="password" type="password" autocomplete="new-password" minlength="6" required>
          <small class="muted">${t('passwordHint')}</small></label>
        <p class="form-error" id="err"></p>
        <button class="btn-primary block" type="submit">${t('registerBtn')}</button>
      </form>
      <div class="auth-switch"><span class="muted">${t('haveAccount')}</span> <a href="#/login">${t('loginBtn')}</a></div>`);
    document.getElementById('f').onsubmit = async (e) => {
      e.preventDefault();
      const fd = Object.fromEntries(new FormData(e.target));
      if (!fd.grade) { document.getElementById('err').textContent = t('err_bad_grade'); return; }
      try {
        state.user = (await api('/api/register', { method: 'POST', body: fd })).user;
        location.hash = '#/home';
      } catch (err) { document.getElementById('err').textContent = errText(err); }
    };
  }

  function pageHeader(title, sub, extra = '') {
    return `<div class="page-head"><div><h1>${title}</h1><p class="muted">${sub}</p></div>${extra}</div>`;
  }

  async function pageHome() {
    await loadEvents();
    const f = state.homeFilter;
    const list = state.events
      .filter((e) => f === 'all' || e.status === f)
      .sort((a, b) => (a.status === b.status ? (a.date || '').localeCompare(b.date || '') : a.status === 'active' ? -1 : 1));
    const g = state.user.grade;
    $app.innerHTML = `<div class="container">
      ${pageHeader(t('homeTitle'), t('homeSub'), `<p class="hello">${t('hello', { name: esc(state.user.firstName) })}</p>`)}
      <div class="segmented" id="filter">
        ${['active', 'past', 'all'].map((k) => `<button data-f="${k}" class="${f === k ? 'active' : ''}">${t('filter' + k[0].toUpperCase() + k.slice(1))}</button>`).join('')}
      </div>
      <div class="grid cards">
        ${list.length ? list.map((e) => {
          const allowed = !g || e.grades.includes(g);
          return `<article class="card event ${e.status}">
            <div class="card-top">
              <span class="badge ${e.status}">${t(e.status === 'active' ? 'statusActive' : 'statusPast')}</span>
              <span class="badge soft">${t('forGrades', { g: gradesLabel(e.grades) })}</span>
            </div>
            <h3>${esc(loc(e.title))}</h3>
            <p>${esc(loc(e.description))}</p>
            <div class="card-foot">
              ${e.date ? `<span class="muted sm">${t('deadline', { d: fmtDate(e.date) })}</span>` : '<span></span>'}
              ${e.status === 'active'
                ? (allowed ? `<a class="btn-primary sm" href="#/submit?event=${encodeURIComponent(e.id)}">${t('participate')}</a>`
                  : `<span class="muted sm">${t('notForYourGrade')}</span>`)
                : ''}
            </div>
          </article>`;
        }).join('') : `<p class="empty">${t('noEvents')}</p>`}
      </div></div>`;
    document.querySelectorAll('#filter button').forEach((b) => (b.onclick = () => {
      state.homeFilter = b.dataset.f; safeSet('td_home_filter', b.dataset.f); pageHome();
    }));
  }

  async function pageSubmit(params) {
    await loadEvents();
    const mine = (await api('/api/applications/mine')).items;
    const u = state.user;
    const isAdmin = u.role === 'admin';
    $app.innerHTML = `<div class="container">
      ${pageHeader(t('submitTitle'), t('submitSub'))}
      <div class="split">
        <form id="f" class="card form big" novalidate>
          <label>${t('fullName')}<input name="fullName" required value="${esc(isAdmin ? '' : `${u.firstName} ${u.lastName}`)}"></label>
          <label>${t('grade')}
            <select name="grade" id="gradeSel" required>
              <option value="">${t('chooseGrade')}</option>
              ${GRADES.map((g) => `<option value="${g}" ${u.grade === g ? 'selected' : ''}>${t('gradeN', { n: g })}</option>`).join('')}
            </select></label>
          <label>${t('event')}<select name="eventId" id="eventSel" required></select>
            <small class="muted" id="eventHint"></small></label>
          <label>${t('workTitle')}<input name="title" maxlength="200" required placeholder="${esc(t('workTitlePh'))}"></label>
          <label>${t('workDesc')}<textarea name="description" rows="7" maxlength="4000" required placeholder="${esc(t('workDescPh'))}"></textarea></label>
          <p class="form-error" id="err"></p>
          <button class="btn-primary" type="submit">${t('send')}</button>
        </form>
        <aside class="card">
          <h3>${t('myApps')}</h3>
          ${mine.length ? `<ul class="app-list">${mine.map((a) => `
            <li><div class="row-between"><b>${esc(a.title)}</b><span class="status ${a.status}">${t('st_' + a.status)}</span></div>
              <span class="muted sm">${esc(loc(eventById(a.eventId)?.title))} · ${fmtDate(a.createdAt)}</span>
              ${a.comment ? `<p class="comment">${esc(a.comment)}</p>` : ''}</li>`).join('')}</ul>`
            : `<p class="muted">${t('noApps')}</p>`}
        </aside>
      </div></div>`;

    const gradeSel = document.getElementById('gradeSel');
    const eventSel = document.getElementById('eventSel');
    const hint = document.getElementById('eventHint');
    const fillEvents = (preselect) => {
      const g = Number(gradeSel.value);
      const evs = state.events.filter((e) => e.status === 'active' && (!g || e.grades.includes(g)));
      eventSel.innerHTML = `<option value="">${t('chooseEvent')}</option>` +
        evs.map((e) => `<option value="${esc(e.id)}">${esc(loc(e.title))} (${t('forGrades', { g: gradesLabel(e.grades) })})</option>`).join('');
      if (preselect && evs.some((e) => e.id === preselect)) eventSel.value = preselect;
      hint.textContent = g && !evs.length ? t('noEventsForGrade') : '';
    };
    gradeSel.onchange = () => fillEvents(eventSel.value);
    fillEvents(params.get('event'));

    document.getElementById('f').onsubmit = async (e) => {
      e.preventDefault();
      const fd = Object.fromEntries(new FormData(e.target));
      if (!fd.fullName.trim() || !fd.title.trim() || !fd.description.trim()) { document.getElementById('err').textContent = t('err_missing_fields'); return; }
      try {
        await api('/api/applications', { method: 'POST', body: fd });
        toast(t('sent'));
        if (location.hash !== '#/submit') location.hash = '#/submit'; else pageSubmit(new URLSearchParams());
      } catch (err) { document.getElementById('err').textContent = errText(err); }
    };
  }

  async function pageArchive() {
    await loadEvents();
    const year = state.archiveYear || state.currentYear;
    const items = (await api('/api/archive?year=' + year)).items;
    const isAdmin = state.user.role === 'admin';
    const isCurrent = year === state.currentYear;
    $app.innerHTML = `<div class="container">
      ${pageHeader(t('archiveTitle'), t('archiveSub'))}
      <div class="year-tabs" id="years">
        ${state.years.map((y) => `<button data-y="${y}" class="${y === year ? 'active' : ''}">${y}${y === state.currentYear ? `<small>${t('currentYearTag')}</small>` : ''}</button>`).join('')}
      </div>
      <p class="year-note">${isCurrent ? t('archiveCurrent', { y: year }) : t('archive2025')}</p>
      ${isAdmin ? `<details class="card admin-add"><summary>＋ ${t('addArchive')} (${year})</summary>
        <form id="addF" class="form">
          <div class="row2"><label>${t('author')}<input name="author" required></label>
            <label>${t('grade')}<select name="grade"><option value=""></option>${GRADES.map((g) => `<option>${g}</option>`).join('')}</select></label></div>
          <label>${t('workTitle')}<input name="title" required></label>
          <label>${t('workDesc')}<textarea name="description" rows="3"></textarea></label>
          <label>${t('result')}<input name="result"></label>
          <button class="btn-primary sm">${t('add')}</button>
        </form></details>` : ''}
      <div class="timeline">
        ${items.length ? items.map((a) => `
          <article class="card work" data-id="${a.id}">
            <div class="work-main">
              <div class="card-top">
                ${a.eventId && eventById(a.eventId) ? `<span class="badge soft">${esc(loc(eventById(a.eventId).title))}</span>` : ''}
                ${a.grade ? `<span class="badge soft">${t('gradeN', { n: a.grade })}</span>` : ''}
              </div>
              <h3>${esc(a.title)}</h3>
              <p class="author">${esc(a.author)}</p>
              ${a.description ? `<p class="desc">${esc(a.description)}</p>` : ''}
            </div>
            <div class="work-result ${a.result ? 'has' : 'later'}">
              <span class="label">${t('result')}</span>
              <b>${a.result ? '🏆 ' + esc(a.result) : '⏳ ' + t('resultsLater')}</b>
              ${isAdmin ? `<div class="admin-row"><button class="btn-ghost sm" data-edit>${t('edit')}</button><button class="btn-danger sm" data-del>${t('del')}</button></div>` : ''}
            </div>
          </article>`).join('') : `<p class="empty">${t('noArchive')}</p>`}
      </div></div>`;

    document.querySelectorAll('#years button').forEach((b) => (b.onclick = () => { state.archiveYear = Number(b.dataset.y); pageArchive(); }));
    if (!isAdmin) return;
    const addF = document.getElementById('addF');
    addF.onsubmit = async (e) => {
      e.preventDefault();
      try { await api('/api/admin/archive', { method: 'POST', body: { ...Object.fromEntries(new FormData(addF)), year } }); pageArchive(); }
      catch (err) { toast(errText(err), 'err'); }
    };
    document.querySelectorAll('.work').forEach((card) => {
      const id = card.dataset.id;
      const item = items.find((x) => x.id === id);
      card.querySelector('[data-del]').onclick = async () => {
        if (!confirm(t('confirmDelete'))) return;
        await api('/api/admin/archive/' + id, { method: 'DELETE' }); pageArchive();
      };
      card.querySelector('[data-edit]').onclick = () => {
        card.classList.add('editing');
        card.innerHTML = `<form class="form edit-form">
          <label>${t('workTitle')}<input name="title" required value="${esc(item.title)}"></label>
          <label>${t('author')}<input name="author" required value="${esc(item.author)}"></label>
          <label>${t('workDesc')}<textarea name="description" rows="3">${esc(item.description)}</textarea></label>
          <label>${t('result')}<input name="result" value="${esc(item.result)}" placeholder="${esc(t('resultsLater'))}"></label>
          <div class="admin-row"><button class="btn-primary sm" type="submit">${t('save')}</button><button class="btn-ghost sm" type="button" data-cancel>${t('cancel')}</button></div>
        </form>`;
        const ef = card.querySelector('form');
        ef.querySelector('[data-cancel]').onclick = pageArchive;
        ef.onsubmit = async (e) => {
          e.preventDefault();
          try { await api('/api/admin/archive/' + id, { method: 'PATCH', body: Object.fromEntries(new FormData(ef)) }); pageArchive(); }
          catch (err) { toast(errText(err), 'err'); }
        };
      };
    });
  }

  async function pageAdmin() {
    if (state.user.role !== 'admin') { location.hash = '#/home'; return; }
    await loadEvents();
    const tab = state.adminTab;
    const tabs = [['pending', 'tabPending'], ['accepted', 'tabAccepted'], ['rejected', 'tabRejected'], ['events', 'tabEvents']];
    const pendingCount = (await api('/api/admin/applications?status=pending')).items.length;
    let body = '';
    if (tab !== 'events') {
      const items = (await api('/api/admin/applications?status=' + tab)).items;
      body = items.length ? `<div class="grid apps">${items.map((a) => `
        <article class="card app" data-id="${a.id}">
          <div class="card-top">
            <span class="badge soft">${esc(loc(eventById(a.eventId)?.title))}</span>
            <span class="badge soft">${t('gradeN', { n: a.grade })}</span>
            <span class="status ${a.status}">${t('st_' + a.status)}</span>
          </div>
          <h3>${esc(a.title)}</h3>
          <p class="author">${esc(a.fullName)} · <span class="muted">${esc(a.email)}</span></p>
          <p class="desc">${esc(a.description)}</p>
          <p class="muted sm">${t('submittedAt')}: ${fmtDate(a.createdAt)}</p>
          ${a.comment ? `<p class="comment">${esc(a.comment)}</p>` : ''}
          ${a.status === 'pending' ? `<input class="inline-input" data-comment placeholder="${esc(t('commentPh'))}">
            <div class="admin-row"><button class="btn-primary sm" data-accept>✓ ${t('accept')}</button>
            <button class="btn-danger sm" data-reject>✕ ${t('reject')}</button></div>` : ''}
        </article>`).join('')}</div>` : `<p class="empty">${t('noPending')}</p>`;
    } else {
      body = `<div class="split">
        <div class="grid">${state.events.map((e) => `
          <article class="card event ${e.status}">
            <div class="card-top"><span class="badge ${e.status}">${t(e.status === 'active' ? 'statusActive' : 'statusPast')}</span>
              <span class="badge soft">${t('forGrades', { g: gradesLabel(e.grades) })}</span></div>
            <h3>${esc(loc(e.title))}</h3><p>${esc(loc(e.description))}</p>
            <div class="card-foot"><span class="muted sm">${e.date ? fmtDate(e.date) : ''}</span>
              <button class="btn-ghost sm" data-toggle="${esc(e.id)}" data-to="${e.status === 'active' ? 'past' : 'active'}">${t(e.status === 'active' ? 'markPast' : 'markActive')}</button></div>
          </article>`).join('')}</div>
        <form class="card form" id="evF">
          <h3>${t('newEvent')}</h3>
          <label>${t('titleRu')}<input name="title_ru"></label>
          <label>${t('titleKz')}<input name="title_kz"></label>
          <label>${t('titleEn')}<input name="title_en"></label>
          <label>${t('descRu')}<textarea name="desc_ru" rows="2"></textarea></label>
          <label>${t('descKz')}<textarea name="desc_kz" rows="2"></textarea></label>
          <label>${t('descEn')}<textarea name="desc_en" rows="2"></textarea></label>
          <label>${t('date')}<input type="date" name="date"></label>
          <fieldset class="grade-pick"><legend>${t('grades')}</legend>
            ${GRADES.map((g) => `<label class="chip-radio"><input type="checkbox" name="grades" value="${g}"><span>${g}</span></label>`).join('')}</fieldset>
          <button class="btn-primary">${t('add')}</button>
        </form></div>`;
    }
    $app.innerHTML = `<div class="container">
      ${pageHeader(t('adminTitle'), t('adminSub'))}
      <div class="segmented" id="tabs">${tabs.map(([k, l]) => `<button data-t="${k}" class="${tab === k ? 'active' : ''}">${t(l)}${k === 'pending' && pendingCount ? ` <span class="count">${pendingCount}</span>` : ''}</button>`).join('')}</div>
      ${body}</div>`;

    document.querySelectorAll('#tabs button').forEach((b) => (b.onclick = () => { state.adminTab = b.dataset.t; pageAdmin(); }));
    document.querySelectorAll('.app').forEach((card) => {
      const id = card.dataset.id;
      const act = async (kind) => {
        try {
          await api(`/api/admin/applications/${id}/${kind}`, { method: 'POST', body: { comment: card.querySelector('[data-comment]').value } });
          toast(kind === 'accept' ? t('acceptedToArchive', { y: state.currentYear }) : t('rejected'), kind === 'accept' ? 'ok' : 'warn');
          pageAdmin();
        } catch (err) { toast(errText(err), 'err'); }
      };
      card.querySelector('[data-accept]')?.addEventListener('click', () => act('accept'));
      card.querySelector('[data-reject]')?.addEventListener('click', () => act('reject'));
    });
    document.querySelectorAll('[data-toggle]').forEach((b) => (b.onclick = async () => {
      await api('/api/admin/events/' + b.dataset.toggle, { method: 'PATCH', body: { status: b.dataset.to } }); pageAdmin();
    }));
    const evF = document.getElementById('evF');
    if (evF) evF.onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(evF);
      try {
        await api('/api/admin/events', { method: 'POST', body: {
          title: { ru: fd.get('title_ru'), kz: fd.get('title_kz'), en: fd.get('title_en') },
          description: { ru: fd.get('desc_ru'), kz: fd.get('desc_kz'), en: fd.get('desc_en') },
          date: fd.get('date'), grades: fd.getAll('grades'), status: 'active',
        } });
        pageAdmin();
      } catch (err) { toast(errText(err), 'err'); }
    };
  }

  // ---------- rules (public) ----------
  function pageRules(params) {
    const open = params.get('c');
    $app.innerHTML = `<div class="container">
      ${pageHeader(t('rulesTitle'), t('rulesSub'))}
      <div class="rules-tabs">${RULES.map((r) => `<a href="#rule-${r.id}" class="rules-tab"><b>${esc(loc(r.title))}</b><span>${esc(loc(r.grades))}</span></a>`).join('')}</div>
      ${RULES.map((r) => `
        <section class="card rule" id="rule-${r.id}">
          <div class="rule-head">
            <div>
              <span class="badge soft">${esc(loc(r.grades))}</span>
              <h2>${esc(loc(r.title))}</h2>
              <p class="muted">${esc(loc(r.lead))}</p>
            </div>
            <div class="rule-dl">
              <a class="btn-primary sm" href="${esc(r.file)}" download>⬇ ${t('download')}</a>
              <a class="btn-ghost sm" href="${esc(r.drive)}" target="_blank" rel="noopener">${t('downloadDrive')}</a>
              <small class="muted">${t('docLang')}</small>
            </div>
          </div>
          <div class="rule-blocks">
            ${r.blocks.map((b) => `<div class="rule-block"><h3>${esc(loc(b.h))}</h3>
              <ul>${(b[state.lang] || b.ru).map((li) => `<li>${esc(li)}</li>`).join('')}</ul></div>`).join('')}
          </div>
        </section>`).join('')}
    </div>`;
    $app.querySelectorAll('.rules-tab').forEach((a) => (a.onclick = (e) => {
      e.preventDefault();
      document.querySelector(a.getAttribute('href')).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
    if (open) document.getElementById('rule-' + open)?.scrollIntoView({ block: 'start' });
  }

  // ---------- practice tests ----------
  let testTimer = null;
  let testKeyHandler = null;
  function stopTestTimer() {
    if (testTimer) { clearInterval(testTimer); testTimer = null; }
    if (testKeyHandler) { document.removeEventListener('keydown', testKeyHandler); testKeyHandler = null; }
    document.querySelector('.modal-back')?.remove();
  }
  const sectionTitle = (id, fallback) => (window.TEST_SECTIONS[id] ? loc(window.TEST_SECTIONS[id]) : fallback);
  const testKey = (id) => 'td_test_' + id;
  function readJSON(k) { try { return JSON.parse(safeGet(k) || 'null'); } catch { return null; } }

  async function pageTests() {
    const index = await (await fetch('tests/index.json')).json();
    $app.innerHTML = `<div class="container">
      ${pageHeader(t('testsTitle'), t('testsSub'))}
      <p class="tests-info">${t('testsInfo')}</p>
      <div class="grid test-grid">
        ${index.map((s) => {
          const last = readJSON(testKey(s.id));
          return `<button class="card test-card" data-id="${s.id}">
            <span class="test-num">${String(s.id).padStart(2, '0')}</span>
            <b>${esc(sectionTitle(s.id, s.title))}</b>
            <span class="muted sm">${t('questionsN', { n: s.count })}</span>
            ${last ? `<span class="last ${last.score * 2 >= last.max ? 'ok' : ''}">${t('lastResult', { s: last.score, m: last.max })}</span>` : ''}
          </button>`;
        }).join('')}
      </div></div>`;
    $app.querySelectorAll('.test-card').forEach((b) => (b.onclick = () => chooseMode(Number(b.dataset.id), index)));
  }

  function chooseMode(id, index) {
    const s = index.find((x) => x.id === id);
    const box = document.createElement('div');
    box.className = 'modal-back';
    box.innerHTML = `<div class="modal card" role="dialog" aria-modal="true">
      <span class="test-num">${String(id).padStart(2, '0')}</span>
      <h2>${esc(sectionTitle(id, s.title))}</h2>
      <p class="muted">${t('chooseMode')}</p>
      <button class="mode" data-mode="exam"><b>⏱ ${t('modeExam')}</b><span>${t('modeExamDesc')}</span></button>
      <button class="mode" data-mode="practice"><b>✎ ${t('modePractice')}</b><span>${t('modePracticeDesc')}</span></button>
      <button class="btn-ghost sm" data-close>${t('cancel')}</button>
    </div>`;
    document.body.appendChild(box);
    const close = () => box.remove();
    box.onclick = (e) => { if (e.target === box || e.target.hasAttribute('data-close')) close(); };
    box.querySelectorAll('.mode').forEach((b) => (b.onclick = async () => {
      close();
      const data = await (await fetch(`tests/${s.file}`)).json();
      startTest(data, b.dataset.mode);
    }));
  }

  function startTest(data, mode) {
    stopTestTimer();
    const st = {
      data, mode, idx: 0, answers: new Array(data.questions.length).fill(null),
      endAt: mode === 'exam' ? Date.now() + data.timeMinutes * 60 * 1000 : null,
    };
    const total = data.questions.length;
    const title = sectionTitle(data.id, data.title);

    function render() {
      const q = data.questions[st.idx];
      const chosen = st.answers[st.idx];
      const reveal = mode === 'practice' && chosen !== null;
      const answered = st.answers.filter((a) => a !== null).length;
      $app.innerHTML = `<div class="container test-run">
        <div class="test-bar card">
          <div><b>${esc(title)}</b><span class="muted sm"> · ${t(mode === 'exam' ? 'modeExam' : 'modePractice')}</span></div>
          <div class="test-bar-right">
            ${mode === 'exam' ? `<span class="timer" id="timer" title="${t('timeLeft')}"></span>` : ''}
            <span class="muted sm">${t('answeredN', { n: answered, t: total })}</span>
            <button class="btn-ghost sm" data-exit>${t('exitTest')}</button>
          </div>
        </div>
        <div class="progress"><span style="width:${(answered / total) * 100}%"></span></div>
        <article class="card question">
          <p class="muted sm">${t('questionOf', { n: st.idx + 1, t: total })}</p>
          <h2 class="q-text">${esc(q.q)}</h2>
          <div class="options">
            ${q.options.map((o, i) => {
              let cls = '';
              if (reveal) cls = i === q.answer ? 'correct' : i === chosen ? 'wrong' : 'dim';
              else if (i === chosen) cls = 'chosen';
              return `<button class="option ${cls}" data-i="${i}" ${reveal ? 'disabled' : ''}><span class="letter">${'ABCDE'[i]}</span><span>${esc(o)}</span></button>`;
            }).join('')}
          </div>
          <div class="q-nav">
            <button class="btn-ghost" data-prev ${st.idx === 0 ? 'disabled' : ''}>${t('prev')}</button>
            ${st.idx < total - 1 ? `<button class="btn-primary" data-next>${t('next')}</button>` : `<button class="btn-primary" data-finish>${t('finish')}</button>`}
          </div>
        </article>
        <div class="q-grid">${st.answers.map((a, i) => {
          let cls = a !== null ? 'done' : '';
          if (mode === 'practice' && a !== null) cls = a === data.questions[i].answer ? 'right' : 'bad';
          return `<button class="${cls} ${i === st.idx ? 'cur' : ''}" data-go="${i}">${i + 1}</button>`;
        }).join('')}</div>
        <div class="finish-row"><button class="btn-danger" data-finish>${t('finish')}</button></div>
      </div>`;

      $app.querySelectorAll('.option').forEach((b) => (b.onclick = () => {
        if (reveal) return;
        st.answers[st.idx] = Number(b.dataset.i);
        render();
      }));
      $app.querySelector('[data-prev]').onclick = () => { st.idx--; render(); };
      $app.querySelector('[data-next]')?.addEventListener('click', () => { st.idx++; render(); });
      $app.querySelectorAll('[data-finish]').forEach((b) => (b.onclick = () => {
        const left = st.answers.filter((a) => a === null).length;
        if (left && !confirm(t('confirmFinish', { n: left }))) return;
        finish();
      }));
      $app.querySelectorAll('[data-go]').forEach((b) => (b.onclick = () => { st.idx = Number(b.dataset.go); render(); }));
      $app.querySelector('[data-exit]').onclick = () => {
        if (st.answers.some((a) => a !== null) && !confirm(t('confirmExit'))) return;
        stopTestTimer(); pageTests();
      };
      tick();
    }

    function tick() {
      if (!st.endAt) return;
      const left = Math.max(0, st.endAt - Date.now());
      const el = document.getElementById('timer');
      if (el) {
        const h = Math.floor(left / 3600000); const m = Math.floor((left % 3600000) / 60000); const s = Math.floor((left % 60000) / 1000);
        el.textContent = `⏱ ${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        el.classList.toggle('low', left < 5 * 60 * 1000);
      }
      if (left === 0) { toast(t('timeUp'), 'warn'); finish(); }
    }

    function onKey(e) {
      if (!document.querySelector('.test-run') || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.target instanceof Element && e.target.matches('input, textarea, select')) return;
      const k = e.key.toUpperCase();
      const i = { 1: 0, 2: 1, 3: 2, 4: 3, A: 0, B: 1, C: 2, D: 3 }[k];
      if (i !== undefined) document.querySelector(`.option[data-i="${i}"]`)?.click();
      else if (e.key === 'ArrowRight' && st.idx < total - 1) { st.idx++; render(); }
      else if (e.key === 'ArrowLeft' && st.idx > 0) { st.idx--; render(); }
    }

    function finish() {
      stopTestTimer();
      const correct = data.questions.filter((q, i) => st.answers[i] === q.answer).length;
      const max = total * data.pointsPerQuestion; const score = correct * data.pointsPerQuestion;
      const pct = Math.round((score / max) * 100);
      const level = pct >= 90 ? 'lvl1' : pct >= 70 ? 'lvl2' : pct >= 50 ? 'lvl3' : 'lvl4';
      safeSet(testKey(data.id), JSON.stringify({ score, max, date: new Date().toISOString() }));
      const wrong = data.questions.map((q, i) => ({ q, i, a: st.answers[i] })).filter((x) => x.a !== x.q.answer);
      $app.innerHTML = `<div class="container test-run">
        <div class="card result ${pct >= 50 ? 'pass' : 'fail'}">
          <p class="muted">${esc(title)} · ${t('resultTitle')}</p>
          <div class="result-score">${pct}%</div>
          <h2>${t('scoreOf', { s: score, m: max })}</h2>
          <p>${t('correctN', { n: correct, t: total })}</p>
          <div class="progress big"><span style="width:${pct}%"></span><i style="left:50%"></i></div>
          <p class="verdict">${t(pct >= 50 ? 'passed' : 'notPassed')}</p>
          <p class="muted">${t(level)}</p>
          <div class="admin-row center"><button class="btn-primary" data-retry>${t('retry')}</button><button class="btn-ghost" data-back>${t('backToSections')}</button></div>
        </div>
        <h2 class="review-title">${t('review')} (${wrong.length})</h2>
        ${wrong.length ? wrong.map((x) => `<article class="card review-item">
          <p class="muted sm">${t('questionOf', { n: x.i + 1, t: total })}</p>
          <p class="q-text sm-q">${esc(x.q.q)}</p>
          <p class="ans wrong-ans">${t('yourAnswer')}: <b>${x.a === null ? t('noAnswer') : `${'ABCDE'[x.a]}) ${esc(x.q.options[x.a])}`}</b></p>
          <p class="ans right-ans">${t('correctAnswer')}: <b>${'ABCDE'[x.q.answer]}) ${esc(x.q.options[x.q.answer])}</b></p>
        </article>`).join('') : `<p class="empty">${t('noMistakes')}</p>`}
      </div>`;
      $app.querySelector('[data-retry]').onclick = () => startTest(data, mode);
      $app.querySelector('[data-back]').onclick = pageTests;
      window.scrollTo(0, 0);
    }

    testKeyHandler = onKey;
    document.addEventListener('keydown', onKey);
    if (st.endAt) testTimer = setInterval(tick, 1000);
    render();
    window.scrollTo(0, 0);
  }

  // ---------- router ----------
  const PUBLIC = ['', 'login', 'register', 'rules'];
  async function router() {
    const raw = location.hash.replace(/^#\/?/, '');
    const [route, qs] = raw.split('?');
    const params = new URLSearchParams(qs || '');
    if (!PUBLIC.includes(route) && !state.user) { location.hash = '#/login'; return; }
    if ((route === 'login' || route === 'register') && state.user) { location.hash = '#/home'; return; }
    stopTestTimer();
    renderChrome(route);
    applyStaticI18n();
    window.scrollTo(0, 0);
    try {
      switch (route) {
        case '': pageLanding(); break;
        case 'login': pageLogin(); break;
        case 'register': pageRegister(); break;
        case 'home': await pageHome(); break;
        case 'submit': await pageSubmit(params); break;
        case 'archive': await pageArchive(); break;
        case 'admin': await pageAdmin(); break;
        case 'rules': pageRules(params); break;
        case 'tests': await pageTests(); break;
        default: location.hash = state.user ? '#/home' : '#/';
      }
    } catch (err) {
      if (err.code === 'unauthorized') { location.hash = '#/login'; return; }
      $app.innerHTML = `<div class="container"><p class="empty">${errText(err)}</p></div>`;
    }
  }

  document.querySelectorAll('#lang button').forEach((b) => (b.onclick = () => {
    state.lang = b.dataset.lang; safeSet('td_lang', state.lang); router();
  }));
  document.getElementById('burger').onclick = () => document.getElementById('nav').classList.toggle('open');
  window.addEventListener('hashchange', router);

  (async () => {
    try {
      const me = await api('/api/me');
      state.user = me.user; state.currentYear = me.currentYear; state.years = me.years;
    } catch { /* offline */ }
    router();
  })();
})();
