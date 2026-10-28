/* ---------- constants ---------- */
const KEY = 'tac-countdown-v1';
const NAMES = {2:['Finals'],4:['Semifinals','Finals'],8:['Quarterfinals','Semifinals','Finals'],16:['Opening round','Quarterfinals','Semifinals','Finals']};
const SING = {'Opening round':'Opening round','Quarterfinals':'Quarterfinal','Semifinals':'Semifinal','Finals':'Finals'};
const DEF_SET = {
  'Opening round':{q:2,secs:30,diff:'easy'},
  'Quarterfinals':{q:2,secs:30,diff:'medium'},
  'Semifinals':{q:3,secs:45,diff:'medium'},
  'Finals':{q:3,secs:60,diff:'hard'}
};
const SAMPLE = [];
const clone = o => JSON.parse(JSON.stringify(o));
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt = n => n < 0 ? '−' + Math.abs(n) : String(n);
const sizeFor = n => { let s = 2; while (s < n) s *= 2; return s; };

/* ---------- state ---------- */
function fresh() {
  return {players: SAMPLE.slice(), settings: clone(DEF_SET), bracket: null,
    ptr: {easy:0, medium:0, hard:0}, mr: null, hist: [], view: 'players', setFrom: 'players'};
}
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s || !Array.isArray(s.players) || !s.settings || !s.ptr) return null;
    s.settings = Object.assign(clone(DEF_SET), s.settings);
    s.hist = s.hist || [];
    return s;
  } catch (e) { return null; }
}
let S = load() || fresh();
function save() {
  try {
    if (S.mr && S.mr.phase === 'live' && !S.mr.paused) S.mr.remMs = remNow();
    localStorage.setItem(KEY, JSON.stringify(S));
  } catch (e) {}
}

/* ---------- bracket logic ---------- */
function seedOrder(size) {
  let cur = [1, 2];
  while (cur.length < size) {
    const n = cur.length * 2, next = [];
    cur.forEach(s => next.push(s, n + 1 - s));
    cur = next;
  }
  return cur;
}
function advance(r, i) {
  const rs = S.bracket.rounds, m = rs[r][i];
  if (r + 1 < rs.length) rs[r + 1][i >> 1][i % 2 === 0 ? 'a' : 'b'] = m[m.winner];
}
function buildBracket() {
  const n = S.players.length, size = sizeFor(n), order = seedOrder(size), rounds = [];
  for (let c = size / 2; c >= 1; c /= 2)
    rounds.push(Array.from({length: c}, () => ({a:null, b:null, sa:null, sb:null, winner:null, bye:false})));
  const pl = s => s <= n ? {seed: s, name: S.players[s - 1]} : null;
  rounds[0].forEach((m, i) => { m.a = pl(order[2 * i]); m.b = pl(order[2 * i + 1]); m.bye = !m.a || !m.b; });
  S.bracket = {size, names: NAMES[size], rounds};
  rounds[0].forEach((m, i) => { if (m.bye) { m.winner = m.a ? 'a' : 'b'; advance(0, i); } });
  S.mr = null; S.hist = [];
}
function playable(r, i) {
  const m = S.bracket.rounds[r][i];
  return !m.bye && m.a && m.b && !m.winner;
}
function nextPlayable() {
  if (!S.bracket) return null;
  for (let r = 0; r < S.bracket.rounds.length; r++)
    for (let i = 0; i < S.bracket.rounds[r].length; i++) if (playable(r, i)) return [r, i];
  return null;
}
function mlabel(r, i) {
  const rs = S.bracket.rounds[r];
  let num = i + 1, count = rs.length;
  if (r === 0) { count = rs.filter(m => !m.bye).length; num = rs.slice(0, i + 1).filter(m => !m.bye).length; }
  return SING[S.bracket.names[r]] + (count > 1 ? ' ' + num : '');
}
function roundsFor(size) { return NAMES[size]; }
function playedCount(size, r) {
  if (r === 0) return S.players.length - size / 2;
  return size / Math.pow(2, r + 1);
}

/* ---------- questions ---------- */
function pickQ(diff) {
  const order = ['easy', 'medium', 'hard'], k = order.indexOf(diff);
  for (let t = 0; t < 3; t++) {
    const d = order[(k + t) % 3];
    if (S.ptr[d] < BANK[d].length) return BANK[d][S.ptr[d]++];
  }
  S.ptr = {easy:0, medium:0, hard:0};
  return pickQ(diff);
}

/* ---------- modal ---------- */
let modalCb = null;
function ask(msg, label, cb) {
  $('mMsg').textContent = msg; $('mOk').textContent = label || 'Confirm';
  modalCb = cb; $('modal').classList.add('on');
}
function closeModal() { $('modal').classList.remove('on'); modalCb = null; }

/* ---------- views ---------- */
function go(v) {
  S.view = v;
  document.querySelectorAll('.view').forEach(e => e.classList.remove('on'));
  $('v-' + v).classList.add('on');
  if (v === 'players') renderPlayers();
  if (v === 'settings') renderSettings();
  if (v === 'bracket') renderBracket();
  if (v === 'match') updateMatch(true);
  save();
}
const ICON = {
  up: '<svg viewBox="0 0 16 16"><path d="M3 10l5-5 5 5"/></svg>',
  down: '<svg viewBox="0 0 16 16"><path d="M3 6l5 5 5-5"/></svg>',
  x: '<svg viewBox="0 0 16 16"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></svg>'
};

function renderPlayers() {
  const n = S.players.length, size = sizeFor(Math.max(n, 2)), byes = size - n, full = n >= 16;
  let info = '';
  if (n < 2) info = 'Add at least 2 players to build a bracket.';
  else {
    const bt = byes === 0 ? 'No byes.' : byes === 1 ? 'Seed 1 gets a bye.' : 'Seeds 1–' + byes + ' get byes.';
    info = size + '-slot bracket. ' + bt;
  }
  const rounds = n >= 2 ? '<p>Rounds: ' + NAMES[size].join(', ') + '.</p>' : '';
  const rows = S.players.map((p, i) => `<div class="seed"><span class="n">${i + 1}</span><span class="nm">${esc(p)}</span>${(n >= 2 && i < byes) ? '<span class="tag">BYE</span>' : ''}
    <button class="ib" data-act="up" data-i="${i}" aria-label="Move ${esc(p)} up" ${i === 0 ? 'disabled' : ''}>${ICON.up}</button>
    <button class="ib" data-act="down" data-i="${i}" aria-label="Move ${esc(p)} down" ${i === n - 1 ? 'disabled' : ''}>${ICON.down}</button>
    <button class="ib" data-act="del" data-i="${i}" aria-label="Remove ${esc(p)}">${ICON.x}</button></div>`).join('');
  $('v-players').innerHTML = `<div class="page">
    <div class="top"><div><h1>Players</h1></div>
      <div class="acts">${S.bracket ? '<button class="btn" data-act="viewbracket">View bracket</button>' : ''}<button class="btn" data-act="gosettings">Round settings</button><button class="btn solid" data-act="build" ${n < 2 ? 'disabled' : ''}>Build bracket</button></div></div>
    <div class="pcols"><div>
      <div class="fld"><label class="lab" for="pname">Player name</label><div class="row"><input type="text" id="pname" maxlength="40" autocomplete="off" ${full ? 'disabled' : ''}><button class="btn solid" data-act="add" ${full ? 'disabled' : ''}>Add</button></div></div>
      <div class="fld"><label class="lab" for="plist">Paste a list</label><textarea id="plist" placeholder="One name per line" ${full ? 'disabled' : ''}></textarea><button class="btn" data-act="addall" ${full ? 'disabled' : ''}>Add all</button></div>
      <div class="sum"><div class="big">${n} of 16 players</div><p>${info}</p>${rounds}</div>
      <div style="margin-top:18px"><button class="link" data-act="reset">Reset tournament</button></div>
    </div><div>
      <div class="seedhd"><span class="lab">Seed order</span><div class="acts"><button class="btn" data-act="shuffle" ${n < 2 ? 'disabled' : ''}>Shuffle seeds</button><button class="btn red" data-act="clear" ${n < 1 ? 'disabled' : ''}>Clear all</button></div></div>
      <div class="seeds">${rows}</div>
    </div></div></div>`;
}

function setRounds() {
  if (S.setFrom === 'bracket' && S.bracket) return {size: S.bracket.size, played: r => S.bracket.rounds[r].filter(m => !m.bye).length};
  const size = sizeFor(Math.max(S.players.length, 2));
  return {size, played: r => playedCount(size, r)};
}
function renderSettings() {
  const info = setRounds(), names = NAMES[info.size];
  const rows = names.map((nm, r) => {
    const c = S.settings[nm];
    return `<div class="st r"><div class="rn">${nm}</div><div class="mc">${info.played(r)}</div>
      <div class="step"><button data-act="qd" data-r="${esc(nm)}" aria-label="Fewer questions" ${c.q <= 1 ? 'disabled' : ''}>−</button><span>${c.q}</span><button data-act="qu" data-r="${esc(nm)}" aria-label="More questions" ${c.q >= 9 ? 'disabled' : ''}>+</button></div>
      <div class="pills">${[30, 45, 60].map(s => `<button class="pill ${c.secs === s ? 'sel' : ''}" data-act="secs" data-r="${esc(nm)}" data-v="${s}">${s} s</button>`).join('')}</div>
      <div class="pills">${['easy', 'medium', 'hard'].map(d => `<button class="pill ${c.diff === d ? 'sel' : ''}" data-act="diff" data-r="${esc(nm)}" data-v="${d}">${d[0].toUpperCase() + d.slice(1)}</button>`).join('')}</div></div>`;
  }).join('');
  const canSave = S.bracket || S.players.length >= 2;
  $('v-settings').innerHTML = `<div class="page"><div class="top"><div><h1>Round settings</h1></div>
    <div class="acts"><button class="btn solid" data-act="savesettings" ${canSave ? '' : 'disabled'}>Save and view bracket</button></div></div>
    <div class="st h"><span class="lab">Round</span><span class="lab">Matches</span><span class="lab">First to (points)</span><span class="lab">Seconds per question</span><span class="lab">Difficulty</span></div>${rows}</div>`;
}

function renderBracket() {
  if (!S.bracket) { $('v-bracket').innerHTML = ''; return; }
  const b = S.bracket, nR = b.rounds.length, np = nextPlayable();
  const W = 1352, GAP = 52, CH = 224, LAB = 30, H = 676;
  const colW = Math.min(300, (W - CH - nR * GAP) / nR);
  const x0 = r => r * (colW + GAP), yc = (r, i) => LAB + (i + 0.5) * H / b.rounds[r].length;
  let html = '', lines = '';
  b.names.forEach((nm, r) => { html += `<div class="colh" style="left:${x0(r)}px">${nm}</div>`; });
  html += `<div class="colh" style="left:${x0(nR)}px">Champion</div>`;
  b.rounds.forEach((rd, r) => rd.forEach((m, i) => {
    const y = yc(r, i), isNext = np && np[0] === r && np[1] === i, can = playable(r, i);
    const row = x => {
      const p = m[x], s = x === 'a' ? m.sa : m.sb;
      if (!p) {
        const t = r === 0 ? 'Bye' : mlabel(r - 1, 2 * i + (x === 'a' ? 0 : 1)) + ' winner';
        return `<div class="mrow ph"><span class="nm">${esc(t)}</span></div>`;
      }
      const cls = m.winner ? (m.winner === x ? 'w' : 'l') : '';
      const sc = s === null ? '' : `<span class="sc ${s < 0 ? 'neg' : ''}">${fmt(s)}</span>`;
      return `<div class="mrow ${cls}"><span class="sd">${p.seed}</span><span class="nm">${esc(p.name)}</span>${sc}</div>`;
    };
    html += `<div class="mbox ${can ? 'click' : ''} ${isNext ? 'next' : ''}" ${can ? `data-act="start" data-r="${r}" data-i="${i}"` : ''} style="left:${x0(r)}px;top:${y - 35}px;width:${colW}px">${row('a')}${row('b')}${isNext ? `<button class="upn" data-act="start" data-r="${r}" data-i="${i}">Up next · Start match</button>` : ''}</div>`;
    const xr = x0(r) + colW;
    if (r < nR - 1) {
      const mid = xr + GAP / 2;
      lines += `<path d="M${xr} ${y}H${mid}"/>`;
      if (i % 2 === 0) {
        const y2 = yc(r, i + 1), ym = (y + y2) / 2;
        lines += `<path d="M${mid} ${y}V${y2}M${mid} ${ym}H${x0(r + 1)}"/>`;
      }
    } else lines += `<path d="M${xr} ${y}H${x0(nR)}"/>`;
  }));
  const fin = b.rounds[nR - 1][0], fy = yc(nR - 1, 0);
  html += fin.winner
    ? `<div class="champ" style="left:${x0(nR)}px;top:${fy - 17}px;width:${CH}px">${esc(fin[fin.winner].name)}</div>`
    : `<div class="champ tbd" style="left:${x0(nR)}px;top:${fy - 14}px;width:${CH}px">To be decided</div>`;
  $('v-bracket').innerHTML = `<div class="page"><div class="top"><h1>Countdown Round</h1><div class="acts"><button class="btn" data-act="editplayers">Edit players and seeds</button><button class="btn" data-act="editrounds">Edit round settings</button></div></div>
    <div id="bk" style="height:${LAB + H}px"><svg width="${W}" height="${LAB + H}" style="position:absolute;left:0;top:0" fill="none" stroke="#b9bfd0" stroke-width="1.5">${lines}</svg>${html}</div></div>`;
}

/* ---------- match ---------- */
const curM = () => S.bracket.rounds[S.mr.r][S.mr.i];
function remNow() {
  const mr = S.mr;
  if (mr.phase === 'live' && !mr.paused) return Math.max(0, mr.endAt - Date.now());
  return mr.remMs;
}
function startQuestion() {
  const mr = S.mr;
  mr.q = pickQ(mr.diff);
  const m = curM();
  mr.sdQ = m.sa >= mr.total && m.sa === m.sb;
  mr.phase = 'ready'; mr.readyAt = Date.now(); mr.paused = false;
  mr.remMs = mr.secs * 1000; mr.lockA = mr.lockB = false; mr.dA = mr.dB = 0;
  mr.flipped = false; mr.correctBy = null;
  lastCd = 3; $('cd').textContent = 3;
  save(); updateMatch();
}
function startMatch(r, i) {
  if (!playable(r, i)) return;
  if (S.mr && (S.mr.r !== r || S.mr.i !== i)) abandon();
  if (!S.mr) {
    const cfg = S.settings[S.bracket.names[r]], m = S.bracket.rounds[r][i];
    m.sa = 0; m.sb = 0;
    S.mr = {r, i, total: cfg.q, secs: cfg.secs, diff: cfg.diff, qDone: 0, sdQ: false, phase: 'ready',
      readyAt: 0, paused: false, remMs: cfg.secs * 1000, q: null, lockA: false, lockB: false, dA: 0, dB: 0,
      flipped: false, winner: null, correctBy: null, shA: 0, shB: 0};
    S.hist = [];
    S.view = 'match';
    go('match');
    startQuestion();
    return;
  }
  go('match');
}
function abandon() {
  if (!S.mr) return;
  const m = curM();
  if (!m.winner) { m.sa = null; m.sb = null; }
  S.mr = null; S.hist = [];
}
function snap() {
  if (S.mr.phase === 'live' && !S.mr.paused) S.mr.remMs = remNow();
  S.hist.push(JSON.stringify({b: S.bracket, p: S.ptr, m: S.mr}));
  if (S.hist.length > 60) S.hist.shift();
}
function undo() {
  if (!S.mr || !S.hist.length) return;
  const o = JSON.parse(S.hist.pop());
  S.bracket = o.b; S.ptr = o.p; S.mr = o.m;
  if (S.mr.phase === 'live') S.mr.paused = true;
  save(); updateMatch();
}
function endQuestion() {
  const mr = S.mr, m = curM();
  mr.remMs = remNow();
  mr.phase = 'ended'; mr.flipped = true; mr.qDone++;
  mr.shA = m.sa; mr.shB = m.sb;
  resolve();
  save(); updateMatch();
}
function resolve() {
  const mr = S.mr, m = curM();
  let w = null;
  if (mr.sdQ) { if (mr.correctBy) w = mr.correctBy; }
  else {
    const ha = m.sa >= mr.total, hb = m.sb >= mr.total;
    if (ha && (!hb || m.sa > m.sb)) w = 'a';
    else if (hb && (!ha || m.sb > m.sa)) w = 'b';
  }
  if (w) { mr.winner = w; m.winner = w; advance(mr.r, mr.i); }
}
function unresolve() {
  const mr = S.mr, m = curM(), rs = S.bracket.rounds;
  if (!mr.winner) return;
  if (mr.r + 1 < rs.length) rs[mr.r + 1][mr.i >> 1][mr.i % 2 === 0 ? 'a' : 'b'] = null;
  mr.winner = null; m.winner = null;
}
// After the answer is revealed the moderator can still award points for that question.
function lateScore(p, d) {
  const mr = S.mr, m = curM();
  snap(); unresolve(); score(p, d);
  if (d > 0) mr.correctBy = p; else mr['lock' + p.toUpperCase()] = true;
  mr.shA = m.sa; mr.shB = m.sb;
  resolve(); save(); updateMatch();
}
function score(p, d) { const m = curM(); if (p === 'a') m.sa += d; else m.sb += d; S.mr['d' + p.toUpperCase()] = d; }
function canScore(p, kind) {
  const mr = S.mr;
  if (!mr || mr['lock' + p.toUpperCase()]) return false;
  if (mr.phase === 'live') return !mr.paused;
  return mr.phase === 'ended' && (kind === 'wrong' || !mr.correctBy);
}
function correct(p) {
  if (!canScore(p, 'correct')) return;
  if (S.mr.phase === 'ended') return lateScore(p, 1);
  snap(); score(p, 1); S.mr.correctBy = p; S.mr.remMs = remNow(); endQuestion();
}
function wrong(p) {
  if (!canScore(p, 'wrong')) return;
  if (S.mr.phase === 'ended') return lateScore(p, -1);
  snap(); score(p, -1); S.mr['lock' + p.toUpperCase()] = true;
  if (S.mr.lockA && S.mr.lockB) { S.mr.remMs = remNow(); endQuestion(); } else { save(); updateMatch(); }
}
function togglePause() {
  const mr = S.mr;
  if (!mr || mr.phase !== 'live') return;
  if (mr.paused) { mr.endAt = Date.now() + mr.remMs; mr.paused = false; }
  else { mr.remMs = remNow(); mr.paused = true; }
  save(); updateMatch();
}
function answerBtn() {
  const mr = S.mr;
  if (!mr) return;
  if (mr.phase === 'live') { snap(); mr.remMs = remNow(); endQuestion(); }
  else if (mr.phase === 'ended') { mr.flipped = !mr.flipped; save(); updateMatch(); }
}
function nextBtn() {
  const mr = S.mr;
  if (!mr || mr.phase !== 'ended') return;
  if (mr.winner) { S.mr = null; S.hist = []; go('bracket'); return; }
  snap(); startQuestion();
}

function fit(el, max, min, over) {
  let f = max;
  el.style.fontSize = f + 'px';
  while (f > min && over()) { f -= 2; el.style.fontSize = f + 'px'; }
}
let shown = {q: null, back: null};
function updateMatch(force) {
  if (!S.mr || !S.bracket) return;
  const mr = S.mr, m = curM(), ready = mr.phase === 'ready', ended = mr.phase === 'ended';
  $('nL').textContent = m.a.name; $('nR').textContent = m.b.name;
  $('sL').textContent = fmt(mr.shA); $('sR').textContent = fmt(mr.shB);
  $('sL').className = 'score' + (ended ? (mr.dA > 0 ? ' g' : mr.dA < 0 ? ' r' : '') : '');
  $('sR').className = 'score' + (ended ? (mr.dB > 0 ? ' g' : mr.dB < 0 ? ' r' : '') : '');
  $('cL').disabled = !canScore('a', 'correct'); $('wL').disabled = !canScore('a', 'wrong');
  $('cR').disabled = !canScore('b', 'correct'); $('wR').disabled = !canScore('b', 'wrong');
  $('bPause').textContent = mr.paused ? 'Resume' : 'Pause';
  $('bPause').disabled = mr.phase !== 'live';
  $('bAns').textContent = ended && mr.flipped ? 'Hide answer' : 'Show answer';
  $('bAns').disabled = !(mr.phase === 'live' || ended);
  $('bNext').textContent = mr.winner ? 'Back to bracket' : 'Next question';
  $('bNext').disabled = !ended;
  $('bUndo').disabled = !S.hist.length;
  $('banner').className = 'banner' + (mr.winner ? ' on' : '');
  $('banner').textContent = mr.winner ? m[mr.winner].name : '';
  $('cd').style.display = ready ? 'block' : 'none';
  $('qt').style.display = ready ? 'none' : 'block';
  if (!ready && (force || shown.q !== mr.q.q)) {
    $('qt').textContent = mr.q.q; shown.q = mr.q.q;
    const face = $('qt').parentNode;
    fit($('qt'), 56, 32, () => $('qt').offsetHeight > face.clientHeight - 60);
  }
  if (ended && (force || shown.back !== mr.q.q)) {
    $('ans').textContent = mr.q.a; $('sol').textContent = mr.q.w; shown.back = mr.q.q;
    fit($('ans'), 120, 56, () => $('ans').scrollWidth > 960);
  }
  $('card').classList.toggle('flip', !!mr.flipped);
  drawClock();
}
function drawClock() {
  const mr = S.mr; if (!mr) return;
  const rem = remNow(), C = 2 * Math.PI * 86, frac = Math.max(0, Math.min(1, rem / (mr.secs * 1000)));
  const arc = $('arc');
  arc.setAttribute('stroke-dasharray', C + ' ' + C);
  arc.setAttribute('stroke-dashoffset', -C * (1 - frac));
  arc.style.display = frac <= 0 ? 'none' : '';
  const sec = Math.ceil(rem / 1000);
  $('clk').textContent = Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
  $('ring').classList.toggle('low', rem <= 10000 && mr.phase !== 'ready');
}
let lastSave = 0, lastCd = 0;
function frame() {
  if (S.view === 'match' && S.mr) {
    const mr = S.mr, now = Date.now();
    if (mr.phase === 'ready') {
      const e = now - mr.readyAt;
      if (e >= 3000) {
        mr.phase = 'live'; mr.endAt = now + mr.remMs; save(); updateMatch();
      } else {
        const d = 3 - Math.floor(e / 1000);
        if (d !== lastCd) { lastCd = d; $('cd').textContent = d; }
      }
    } else if (mr.phase === 'live' && !mr.paused) {
      if (mr.endAt - now <= 0) { mr.remMs = 0; endQuestion(); }
      else { drawClock(); if (now - lastSave > 1000) { lastSave = now; save(); } }
    }
  }
  requestAnimationFrame(frame);
}

/* ---------- actions ---------- */
function addPlayers(names) {
  for (const n of names) { if (S.players.length >= 16) break; if (n) S.players.push(n); }
  save(); renderPlayers();
}
const actions = {
  add() { const v = $('pname').value.trim(); if (v) addPlayers([v]); $('pname').focus(); },
  addall() { addPlayers($('plist').value.split('\n').map(s => s.trim())); },
  up(e) { const i = +e.dataset.i; [S.players[i - 1], S.players[i]] = [S.players[i], S.players[i - 1]]; save(); renderPlayers(); },
  down(e) { const i = +e.dataset.i; [S.players[i + 1], S.players[i]] = [S.players[i], S.players[i + 1]]; save(); renderPlayers(); },
  del(e) { S.players.splice(+e.dataset.i, 1); save(); renderPlayers(); },
  shuffle() {
    for (let i = S.players.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [S.players[i], S.players[j]] = [S.players[j], S.players[i]]; }
    save(); renderPlayers();
  },
  clear() { ask('Remove all players? This cannot be undone.', 'Clear all', () => { S.players = []; save(); renderPlayers(); }); },
  reset() {
    ask('Reset the tournament? The bracket, scores and question progress are erased. Players and round settings are kept.', 'Reset', () => {
      S.bracket = null; S.mr = null; S.hist = []; S.ptr = {easy:0, medium:0, hard:0}; go('players');
    });
  },
  build() {
    const doIt = () => { buildBracket(); go('bracket'); };
    if (S.bracket) ask('Build a new bracket? The current bracket and its results will be replaced.', 'Build new', doIt); else doIt();
  },
  gosettings() { S.setFrom = 'players'; go('settings'); },
  editplayers() { go('players'); },
  viewbracket() { go('bracket'); },
  editrounds() { S.setFrom = 'bracket'; go('settings'); },
  savesettings() { if (!S.bracket) buildBracket(); go('bracket'); },
  qd(e) { const c = S.settings[e.dataset.r]; c.q = Math.max(1, c.q - 1); save(); renderSettings(); },
  qu(e) { const c = S.settings[e.dataset.r]; c.q = Math.min(9, c.q + 1); save(); renderSettings(); },
  secs(e) { S.settings[e.dataset.r].secs = +e.dataset.v; save(); renderSettings(); },
  diff(e) { S.settings[e.dataset.r].diff = e.dataset.v; save(); renderSettings(); },
  start(e) { startMatch(+e.dataset.r, +e.dataset.i); },
  correct(e) { correct(e.dataset.p); },
  wrong(e) { wrong(e.dataset.p); },
  pause: togglePause, answer: answerBtn, next: nextBtn, undo,
  leave() {
    const decided = S.mr && S.mr.winner;
    if (decided) { S.mr = null; S.hist = []; go('bracket'); return; }
    ask('Leave this match? Its score and progress are discarded.', 'Leave match', () => { abandon(); go('bracket'); });
  },
  mcancel: closeModal,
  mok() { const cb = modalCb; closeModal(); if (cb) cb(); }
};
document.addEventListener('click', ev => {
  const t = ev.target.closest('[data-act]');
  if (!t || t.disabled) return;
  if (t.classList.contains('mbox') && ev.target.closest('.upn')) return;
  ev.stopPropagation();
  const f = actions[t.dataset.act];
  if (f) f(t);
});
document.addEventListener('keydown', ev => {
  if (ev.target.matches && ev.target.matches('input,textarea')) {
    if (ev.key === 'Enter' && ev.target.id === 'pname') { ev.preventDefault(); actions.add(); }
    return;
  }
  if (S.view !== 'match' || !S.mr || $('modal').classList.contains('on')) return;
  const k = ev.key.toLowerCase();
  if ((ev.ctrlKey || ev.metaKey) && k === 'z') { ev.preventDefault(); undo(); return; }
  if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
  if (k === '1') correct('a');
  else if (k === '2') wrong('a');
  else if (k === '9') correct('b');
  else if (k === '0') wrong('b');
  else if (k === ' ') { ev.preventDefault(); togglePause(); }
  else if (k === 'a') answerBtn();
  else if (k === 'enter') { ev.preventDefault(); nextBtn(); }
});

/* ---------- scaling & boot ---------- */
function rescale() {
  const s = Math.min(innerWidth / 1440, innerHeight / 900), st = $('stage');
  st.style.transform = `translate(${(innerWidth - 1440 * s) / 2}px,${(innerHeight - 900 * s) / 2}px) scale(${s})`;
}
addEventListener('resize', rescale);
addEventListener('beforeunload', save);
rescale();
(function boot() {
  if (S.view === 'match' && S.mr && S.bracket) {
    const mr = S.mr;
    if (mr.phase === 'ready') { mr.phase = 'live'; mr.remMs = mr.secs * 1000; }
    if (mr.phase === 'live') mr.paused = true;
  } else if (S.view === 'match' || (S.view === 'bracket' && !S.bracket)) S.view = 'players';
  S.mr && !S.bracket && (S.mr = null);
  go(S.view);
  requestAnimationFrame(frame);
})();
