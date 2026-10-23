(() => {
  'use strict';
  const E = window.EXAM;
  const A = window.ANALYSIS;
  const KEY = 'toefl-itp-cmmu:state:v1';         // full mock exam
  const PKEY = 'toefl-itp-cmmu:practice:v1';     // single-part practice
  const HKEY = 'toefl-itp-cmmu:history:v1';
  const PHKEY = 'toefl-itp-cmmu:part-history:v1';
  const LETTERS = ['A', 'B', 'C', 'D'];
  // Rough linear conversion to the ITP scale (section ranges from the official score report).
  const RANGES = [[31, 68], [31, 68], [31, 67]];
  const app = document.getElementById('app');

  // Flatten each section into numbered items.
  const SECS = E.sections.map((sec) => {
    const items = [];
    sec.parts.forEach((part) => part.questions.forEach((q) => items.push({ part, q, n: items.length + 1 })));
    return { sec, items };
  });
  const LISTEN_PARTS = E.sections[0].parts;
  const CUES = E.cues;
  const tagOf = (si, j) => A.tags[A.map[E.sections[si].id][j]];

  // Every part that can be practised on its own.
  const PART_TITLES = { 'reading-0': 'Passage 1: ชนพื้นเมืองอเมริกัน', 'reading-1': 'Passage 2: ความเค็มของน้ำทะเล' };
  const PARTS = [];
  E.sections.forEach((sec, si) => sec.parts.forEach((part, pi) => {
    const idx = SECS[si].items.map((it, j) => (it.part === part ? j : -1)).filter((j) => j >= 0);
    PARTS.push({ key: `${si}-${pi}`, si, pi, part, idx,
      title: PART_TITLES[`${sec.id}-${pi}`] || part.name,
      range: `ข้อ ${SECS[si].items[idx[0]].n}–${SECS[si].items[idx[idx.length - 1]].n}`,
      minutes: si === 0 ? 0 : Math.round((sec.minutes * idx.length / SECS[si].items.length) * 2) / 2 });
  }));
  const partOf = (si, pi) => PARTS.find((p) => p.si === si && p.pi === pi);
  function listenRange(st = S) {
    if (st && st.mode === 'part') {
      const k = LISTEN_PARTS.findIndex((p) => p.id === LISTEN_PARTS[st.pi].id);
      const next = LISTEN_PARTS[k + 1];
      return { start: CUES.parts[LISTEN_PARTS[k].id], end: next ? CUES.parts[next.id] : CUES.outro };
    }
    return { start: 0, end: CUES.duration };
  }

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* storage unavailable */ } },
  };

  // S is the attempt on screen: the mock exam (KEY) or a single-part practice (PKEY, mode 'part').
  let S = store.get(KEY, null);
  const fresh = () => ({ mode: 'exam', phase: 'intro', sec: 0, answers: [[], [], []], flags: [[], [], []], deadline: 0,
    audioPos: 0, used: [0, 0, 0], secStart: 0, startedAt: Date.now(), tab: 0 });
  const isPart = () => !!(S && S.mode === 'part');
  const save = () => { if (S) store.set(isPart() ? PKEY : KEY, S); };
  const examState = () => (S && !isPart() ? S : store.get(KEY, null));
  const practiceState = () => (isPart() ? S : store.get(PKEY, null));
  // Questions of the current section that belong to this attempt.
  const inScope = (j) => !isPart() || SECS[S.sec].items[j].part === SECS[S.sec].sec.parts[S.pi];

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (sec) => { sec = Math.max(0, Math.round(sec)); return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`; };
  // ---------- theme ----------
  const TKEY = 'toefl-itp-cmmu:theme';
  const isDark = () => {
    const t = document.documentElement.dataset.theme;
    return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  };
  const themeBtn = () => `<button class="btn small ghost theme-btn" data-act="theme" title="สลับธีมสว่าง / มืด">${isDark()
    ? '☀️<span class="blabel"> โหมดสว่าง</span>' : '🌙<span class="blabel"> โหมดมืด</span>'}</button>`;
  function toggleTheme() {
    const next = isDark() ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    store.set(TKEY, next);
    // Swap labels in place so a running section (audio, timer) is not re-rendered.
    document.querySelectorAll('.theme-btn').forEach((b) => { b.outerHTML = themeBtn(); });
  }
  const minutesOf = (i) => (i === 0 ? Math.round(CUES.duration / 60) : E.sections[i].minutes);

  // ---------- modal / toast ----------
  const modal = document.getElementById('modal');
  function ask(title, body, yes = 'ยืนยัน') {
    return new Promise((resolve) => {
      modal.querySelector('#modal-title').textContent = title;
      modal.querySelector('#modal-body').textContent = body;
      modal.querySelector('[data-modal="yes"]').textContent = yes;
      modal.hidden = false;
      modal.querySelector('[data-modal="yes"]').focus();
      modal.onclick = (e) => {
        const b = e.target.closest('[data-modal]');
        if (!b && e.target !== modal) return;
        modal.hidden = true;
        resolve(b ? b.dataset.modal === 'yes' : false);
      };
    });
  }
  let toastT;
  function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 3200);
  }

  // ---------- scoring ----------
  function scores(answers) {
    const secs = SECS.map((s, i) => {
      const correct = s.items.filter((it, j) => answers[i][j] === it.q.answer).length;
      const [lo, hi] = RANGES[i];
      return { correct, total: s.items.length, scaled: Math.round(lo + (hi - lo) * (correct / s.items.length)) };
    });
    const total = Math.round(secs.reduce((a, s) => a + s.scaled, 0) * 10 / 3);
    return { secs, total };
  }

  // ---------- render dispatcher ----------
  let tick = null;
  // Opening the site always lands on the home page; nothing continues on its own.
  let showHome = true;
  let resumeByClick = false; // the next listening render comes from a click, so audio may start
  function render() {
    clearInterval(tick); tick = null;
    if (location.hash === '#guide') return renderGuide();
    if (location.hash === '#practice') return renderPractice();
    if (!S || showHome) return renderHome();
    if (S.phase === 'intro') return renderIntro();
    if (S.phase === 'run' && S.sec > 0 && S.remaining != null) {
      S.deadline = Date.now() + S.remaining; S.remaining = null; save();
    }
    if (S.phase === 'run') return S.sec === 0 ? renderListening() : renderTimed();
    if (S.phase === 'results') return isPart() ? renderPartResults() : renderResults();
    return renderHome();
  }
  const clearHash = () => { if (location.hash) history.replaceState(null, '', location.pathname + location.search); };

  // ---------- home ----------
  function renderHome() {
    const hist = store.get(HKEY, []);
    const EX = examState();
    const PR = practiceState();
    const inProgress = EX && (EX.phase === 'intro' || EX.phase === 'run');
    const prRun = PR && PR.phase === 'run' ? partOf(PR.sec, PR.pi) : null;
    const rows = SECS.map((s, i) => `<tr>
      <td><b class="en">${i + 1}. ${esc(s.sec.name)}</b><br><span class="muted">${s.sec.parts.map((p) => esc(p.name)).join(' · ')}</span></td>
      <td class="num">${s.items.length} ข้อ</td>
      <td class="num">${i === 0 ? `~${minutesOf(0)} นาที<br><span class="muted">ตามเสียง</span>` : `${minutesOf(i)} นาที`}</td></tr>`).join('');
    app.innerHTML = `<div class="wrap">
      <header class="hero">
        <div class="topline"><div class="eyebrow">TOEFL ITP · Practice Test</div>${themeBtn()}</div>
        <h1>ข้อสอบจำลอง TOEFL ITP</h1>
        <p>ทำครบ 3 ส่วนตามลำดับแบบสอบจริง หรือเลือกฝึกทีละ Part แล้วดูเฉลยพร้อมวิเคราะห์จุดอ่อนทันที</p>
      </header>
      <div class="cta-row">
        <button class="card guide-cta" data-act="practice">
          <span class="gc-icon">🎯</span>
          <span><b>ฝึกทีละ Part</b><br><span class="muted">ทำจบ 1 Part แล้วดูเฉลย + วิเคราะห์ทันที${prRun ? ` · <b class="warn-text">ค้างอยู่: ${esc(prRun.title)}</b>` : ''}</span></span>
          <span class="gc-go">เลือก Part →</span>
        </button>
        <button class="card guide-cta" data-act="guide">
          <span class="gc-icon">📘</span>
          <span><b>คู่มือเตรียมสอบ (ภาษาไทย)</b><br><span class="muted">เคล็ดลับ · สำนวน · ไวยากรณ์ · ประเภทคำถาม · คำศัพท์</span></span>
          <span class="gc-go">อ่านเลย →</span>
        </button>
      </div>
      <section class="card overview">
        <h3 style="margin:0 0 4px">ข้อสอบจำลองเต็มชุด</h3>
        <table><thead><tr><th>Section</th><th>จำนวน</th><th>เวลา</th></tr></thead><tbody>${rows}</tbody></table>
      </section>
      <section class="card">
        <h3 style="margin-bottom:8px">กติกาเหมือนห้องสอบ</h3>
        <ul class="rules">
          <li>ทำทีละ Section ตามลำดับ เมื่อส่งหรือหมดเวลาแล้วย้อนกลับไปแก้ส่วนก่อนหน้าไม่ได้</li>
          <li>Listening เล่นเสียงต่อเนื่องจนจบ <b>ย้อนหรือฟังซ้ำไม่ได้</b> หลังคำถามแต่ละข้อมีเวลาตอบประมาณ 12 วินาที ใส่หูฟังจะได้ยินชัดที่สุด</li>
          <li>Structure และ Reading ข้ามข้อ ย้อนข้อ และปักธงข้อที่ยังไม่แน่ใจได้ ระบบส่งคำตอบให้อัตโนมัติเมื่อหมดเวลา</li>
          <li>ต้องการพัก กดปุ่ม <b>⏸ พัก</b> ระบบจะหยุดเสียงและเวลาไว้ แล้วกด <b>▶ ทำต่อ</b> เมื่อพร้อม</li>
          <li>คำตอบบันทึกในเครื่องนี้ ถ้าเผลอปิดหน้าเว็บก็กลับมาทำต่อได้</li>
        </ul>
        <div class="actions">
          ${inProgress && EX.phase === 'run' ? `<p class="paused-note">⏸ หยุดไว้ที่ Section ${EX.sec + 1} · ${EX.sec === 0
            ? `เสียงนาทีที่ ${fmt(EX.audioPos)}` : `เหลือเวลา ${fmt((EX.remaining != null ? EX.remaining : EX.deadline - Date.now()) / 1000)}`}</p>` : ''}
          ${inProgress ? `<button class="btn primary" data-act="resume">ทำต่อ (Section ${EX.sec + 1})</button>
            <button class="btn ghost danger" data-act="restart">เริ่มใหม่ทั้งหมด</button>`
            : `<button class="btn primary" data-act="start">เริ่มทำข้อสอบเต็มชุด</button>`}
          ${EX && EX.phase === 'results' ? '<button class="btn ghost" data-act="show-results">ดูผลครั้งล่าสุด</button>' : ''}
        </div>
      </section>
      ${hist.length ? `<section class="card history"><h3>ประวัติการทำเต็มชุด</h3>${hist.slice(0, 8).map((h) => `
        <div class="hist-row"><span>${new Date(h.at).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}</span>
        <span class="muted">L ${h.c[0]}/${SECS[0].items.length} · S ${h.c[1]}/${SECS[1].items.length} · R ${h.c[2]}/${SECS[2].items.length}</span>
        <b>~${h.total}</b></div>`).join('')}</section>` : ''}
      <p class="foot">${esc(E.source)}</p>
    </div>`;
  }

  // ---------- practice picker ----------
  function renderPractice() {
    const PR = practiceState();
    const ph = store.get(PHKEY, {});
    const prRun = PR && PR.phase === 'run' ? partOf(PR.sec, PR.pi) : null;
    const groups = E.sections.map((sec, si) => `<h3 class="pk-sec">Section ${si + 1}: ${esc(sec.name)}</h3>
      <div class="pk-grid">${PARTS.filter((p) => p.si === si).map((p) => {
        const h = ph[p.key] || [];
        const last = h[0];
        const best = h.reduce((m, x) => Math.max(m, x.c), 0);
        const len = si === 0 ? `เสียง ~${Math.round((listenRange({ mode: 'part', pi: p.pi }).end - listenRange({ mode: 'part', pi: p.pi }).start) / 60)} นาที` : `${p.minutes} นาที`;
        return `<div class="card pk">
          <div class="pk-top"><b>${esc(p.title)}</b><span class="muted">${p.range} · ${p.idx.length} ข้อ · ${len}</span></div>
          ${last ? `<div class="pk-score"><div class="meter"><i style="width:${(last.c / last.t) * 100}%"></i></div>
            <span>ล่าสุด <b>${last.c}/${last.t}</b> · ดีที่สุด ${best}/${last.t} · ทำแล้ว ${h.length} ครั้ง</span></div>`
            : '<div class="pk-score muted">ยังไม่เคยทำ</div>'}
          <div class="actions" style="margin-top:10px">
            ${prRun === p ? '<button class="btn primary small" data-act="practice-resume">▶ ทำต่อ</button>' : ''}
            <button class="btn ${prRun === p ? 'ghost' : 'primary'} small" data-act="practice-start" data-si="${p.si}" data-pi="${p.pi}">${last ? 'ทำอีกครั้ง' : 'เริ่ม'}</button>
            <button class="btn ghost small" data-act="guide" data-id="${['listening-tips', 'structure-tips', 'reading-tips'][si]}">📘 เคล็ดลับ</button>
          </div></div>`;
      }).join('')}</div>`).join('');
    app.innerHTML = `<div class="bar"><div class="bar-in">
        <button class="btn small ghost" data-act="home">⌂<span class="blabel"> หน้าแรก</span></button>
        <div class="title"><small>TOEFL ITP</small><b>ฝึกทีละ Part</b></div>
        ${themeBtn()}
      </div></div>
      <div class="wrap">
        <p class="muted" style="margin-top:0">เลือก Part ที่ต้องการฝึก ทำจบแล้วระบบจะแสดงคะแนน เฉลยละเอียด และวิเคราะห์ว่าอ่อนประเภทคำถามไหน พร้อมลิงก์ไปอ่านคู่มือ เวลาของแต่ละ Part คิดตามสัดส่วนข้อสอบจริง</p>
        ${prRun ? `<div class="note" style="margin-bottom:12px">⏸ ทำค้างไว้: <b>${esc(prRun.title)}</b> กด "ทำต่อ" ที่การ์ดของ Part นั้นเพื่อทำต่อ</div>` : ''}
        ${groups}
      </div>`;
    window.scrollTo(0, 0);
  }
  function startPractice(si, pi) {
    if (audio) { segEnd = null; audio.pause(); }
    const p = partOf(si, pi);
    S = { mode: 'part', phase: 'run', sec: si, pi, answers: [[], [], []], flags: [[], [], []], used: [0, 0, 0],
      secStart: Date.now(), startedAt: Date.now(), tab: 0,
      deadline: si > 0 ? Date.now() + p.minutes * 60000 : 0,
      audioPos: si === 0 ? listenRange({ mode: 'part', pi }).start : 0 };
    save();
    clearHash();
    showHome = false; resumeByClick = true;
    render(); window.scrollTo(0, 0);
  }

  // ---------- section intro (mock exam) ----------
  function renderIntro() {
    const i = S.sec;
    const s = SECS[i];
    const parts = s.sec.parts.map((p) => `<li><b>${esc(p.name)}</b> <span class="muted">(${p.questions.length} ข้อ)</span><br>${esc(p.directionsTh)}</li>`).join('');
    app.innerHTML = `<div class="wrap"><div class="intro card">
      <div class="secno">SECTION ${i + 1} of 3</div>
      <h2>${esc(s.sec.name)}</h2>
      <div class="facts"><span class="fact">${s.items.length} ข้อ</span>
        <span class="fact">${i === 0 ? `เสียงยาว ~${minutesOf(0)} นาที` : `เวลา ${minutesOf(i)} นาที`}</span></div>
      <ul class="parts">${parts}</ul>
      ${i === 0 ? `<div class="note">พอกดเริ่ม เสียงจะเล่นต่อเนื่องจนจบ Section ย้อนฟังไม่ได้ (กด ⏸ พัก ได้) ให้กดปุ่มทดสอบเสียงเพื่อตั้งระดับเสียงก่อน</div>`
        : `<div class="note">เวลาเริ่มนับทันทีที่กดเริ่ม และส่งคำตอบให้อัตโนมัติเมื่อหมดเวลา</div>`}
      <div class="actions">
        <button class="btn primary" data-act="begin">เริ่ม Section ${i + 1}</button>
        ${i === 0 ? '<button class="btn ghost" data-act="soundcheck">🔊 ทดสอบเสียง</button>' : ''}
        <button class="btn ghost" data-act="guide" data-id="${['listening-tips', 'structure-tips', 'reading-tips'][i]}">📘 เคล็ดลับ Section นี้</button>
        <button class="btn ghost" data-act="home">⌂ หน้าแรก</button>
        ${themeBtn()}
      </div>
    </div></div>`;
  }

  // ---------- shared question markup ----------
  function errStem(stem, sel, review) {
    return stem.replace(/\[([A-D])\|([^\]]+)\]/g, (m, l, t) => {
      let cls = 'u';
      if (review) { if (l === review.answer) cls += ' right'; else if (l === sel) cls += ' wrong'; }
      else if (l === sel) cls += ' sel';
      return `<span class="${cls}" ${review ? '' : `data-act="ans" data-opt="${l}"`}><span class="ut">${t}</span><span class="ul">${l}</span></span>`;
    });
  }
  function questionCard(secIdx, it, idx, opts = {}) {
    const q = it.q;
    const sel = S.answers[secIdx][idx];
    const flagged = S.flags[secIdx][idx];
    const isErr = it.part.type === 'error';
    const stem = secIdx === 0 ? '' : (isErr ? `<div class="stem err">${errStem(q.stem, sel)}</div>` : `<div class="stem">${q.stem}</div>`);
    const options = isErr
      ? `<div class="opts letters">${LETTERS.map((l) => `<button class="opt ${sel === l ? 'sel' : ''}" data-act="ans" data-opt="${l}" aria-label="ตัวเลือก ${l}"><span class="bub">${l}</span></button>`).join('')}</div>`
      : `<div class="opts">${q.options.map((o, k) => `<button class="opt ${sel === LETTERS[k] ? 'sel' : ''}" data-act="ans" data-opt="${LETTERS[k]}"><span class="bub">${LETTERS[k]}</span><span>${esc(o)}</span></button>`).join('')}</div>`;
    return `<article class="q" id="q-${secIdx}-${idx}" data-sec="${secIdx}" data-i="${idx}">
      <div class="q-top"><span class="qn">${it.n}.</span>${stem || '<span class="stem"></span>'}
        ${opts.noFlag ? '' : `<button class="flagbtn ${flagged ? 'on' : ''}" data-act="flag" title="ปักธงไว้ทบทวน">⚑ ${flagged ? 'ปักธงแล้ว' : 'ปักธง'}</button>`}</div>
      ${options}</article>`;
  }
  function setAnswer(secIdx, idx, opt) {
    S.answers[secIdx][idx] = opt; save();
    const card = document.getElementById(`q-${secIdx}-${idx}`);
    if (card) card.querySelectorAll('[data-opt]').forEach((b) => b.classList.toggle('sel', b.dataset.opt === opt));
    const p = document.querySelector(`.pal [data-go="${idx}"]`);
    if (p) p.classList.add('done');
  }
  function palette(secIdx) {
    const s = SECS[secIdx];
    let html = '';
    let prev = null;
    s.items.forEach((it, i) => {
      if (!inScope(i)) return;
      if (prev !== it.part) html += `${prev ? '<span class="sep"></span>' : ''}<span class="lbl">${esc(it.part.name.split(':')[0])}</span>`;
      prev = it.part;
      html += `<button data-go="${i}" class="${S.answers[secIdx][i] ? 'done' : ''} ${S.flags[secIdx][i] ? 'flag' : ''}">${it.n}</button>`;
    });
    return `<nav class="pal" aria-label="รายการข้อ">${html}</nav>`;
  }
  const pauseBtn = () => '<button class="btn small ghost" data-act="pause" title="หยุดพัก">⏸<span class="blabel"> พัก</span></button>';
  const runTitle = (secLabel) => (isPart()
    ? `<small>ฝึกทีละ Part · Section ${S.sec + 1}</small><b>${esc(partOf(S.sec, S.pi).title)}</b>`
    : `<small>Section ${S.sec + 1} of 3</small><b>${esc(secLabel)}</b>`);

  // ---------- listening ----------
  let audio = null;
  let segEnd = null; // review playback stop point
  let lastSave = 0;
  let shownPart = undefined;
  let pausedByUser = false;
  function getAudio() {
    if (audio) return audio;
    audio = new Audio(E.listeningAudio);
    audio.preload = 'auto';
    audio.addEventListener('timeupdate', onAudioTime);
    audio.addEventListener('ended', () => { if (S && S.phase === 'run' && S.sec === 0) finishSection(); });
    audio.addEventListener('waiting', () => setListenNote('กำลังโหลดเสียง…'));
    audio.addEventListener('playing', () => { setListenNote(''); hideOverlay(); });
    audio.addEventListener('pause', () => {
      if (S && S.phase === 'run' && S.sec === 0 && !audio.ended && !showHome && !pausedByUser && !location.hash
        && document.getElementById('lstat')) showOverlay('เสียงหยุดเล่น', 'กดปุ่มด้านล่างเพื่อเล่นต่อจากจุดเดิม', 'เล่นต่อ');
      document.querySelectorAll('.play.on').forEach((b) => b.classList.remove('on'));
    });
    audio.addEventListener('error', () => {
      if (S && S.phase === 'run' && S.sec === 0) showOverlay('โหลดไฟล์เสียงไม่สำเร็จ', 'ตรวจสอบอินเทอร์เน็ตแล้วลองอีกครั้ง', 'ลองอีกครั้ง');
    });
    return audio;
  }
  const resumeFrom = () => Math.max(listenRange().start, S.audioPos - 2);
  function playListening(from) {
    const a = getAudio();
    segEnd = null; pausedByUser = false;
    if (a.error) a.load();
    const p = seekPlay(a, from);
    if (p) p.catch(() => showOverlay('เบราว์เซอร์ไม่ยอมเล่นเสียงอัตโนมัติ', 'กดปุ่มด้านล่างเพื่อเริ่มเล่นเสียง', 'เล่นเสียง'));
  }
  function showOverlay(title, body, btn, onPlay, cls = '') {
    hideOverlay();
    const o = document.createElement('div');
    o.className = `overlay ${cls}`; o.id = 'overlay';
    o.innerHTML = `<div class="card"><h3>${esc(title)}</h3><p class="muted">${esc(body)}</p><div class="actions" style="justify-content:center">
      <button class="btn primary" data-o="play">▶ ${esc(btn)}</button><button class="btn ghost" data-o="home">⌂ หน้าแรก</button></div></div>`;
    document.body.appendChild(o);
    o.querySelector('[data-o="play"]').addEventListener('click', () => { hideOverlay(); (onPlay || (() => playListening(resumeFrom())))(); });
    o.querySelector('[data-o="home"]').addEventListener('click', () => { hideOverlay(); goHome(); });
    o.querySelector('[data-o="play"]').focus();
  }
  function hideOverlay() { const o = document.getElementById('overlay'); if (o) o.remove(); }
  function setListenNote(t) { const n = document.getElementById('lnote'); if (n) n.textContent = t; }

  function partAt(t) {
    let cur = null;
    LISTEN_PARTS.forEach((p) => { if (t >= CUES.parts[p.id]) cur = p.id; });
    if (t >= CUES.outro) return 'END';
    return cur;
  }
  function renderListening() {
    shownPart = undefined;
    const r = listenRange();
    app.innerHTML = `<div class="bar"><div class="bar-in listen">
        <div class="title">${runTitle('Listening Comprehension')}</div>
        <div class="listen-status"><div class="eq off" id="eq"><i></i><i></i><i></i><i></i></div>
          <div class="txt" id="lstat">พร้อมเริ่ม<small id="lnote"></small></div>
          <span class="countdown" id="lcount" hidden></span></div>
        <span class="prog-time" id="ltime">0:00 / ${fmt(r.end - r.start)}</span>
        ${pauseBtn()}
        <button class="btn small ghost" data-act="exit">⌂<span class="blabel"> หน้าแรก</span></button>
        ${themeBtn()}
      </div><div class="prog"><i id="lprog"></i></div></div>
      <div class="booklet" id="booklet"></div>`;
    updateBooklet(S.audioPos);
    const a = getAudio();
    const byClick = resumeByClick;
    resumeByClick = false;
    if (a.paused) {
      if (byClick) playListening(resumeFrom());
      else if (S.audioPos > r.start + 1) showOverlay('ทำ Listening ต่อ', `เสียงจะเล่นต่อจากนาทีที่ ${fmt(S.audioPos - r.start)}`, 'เล่นต่อ');
      else playListening(r.start);
    }
  }
  function updateBooklet(t) {
    const part = partAt(t);
    if (part === shownPart) return;
    shownPart = part;
    const b = document.getElementById('booklet');
    if (!b) return;
    if (!part) {
      b.innerHTML = `<div class="part-head"><h2>Section 1: Listening Comprehension</h2><p>ฟังคำอธิบายของ Section ข้อสอบ Part A จะแสดงที่นี่เมื่อถึงคิว</p></div>
        <p class="en" style="font-size:18px">${esc(E.sections[0].intro)}</p>`;
      return;
    }
    if (part === 'END') {
      b.innerHTML = `<div class="part-head"><h2>End of Section 1</h2><p>กำลังไปยัง Section 2…</p></div>`;
      return;
    }
    const p = LISTEN_PARTS.find((x) => x.id === part);
    const items = SECS[0].items.map((it, i) => [it, i]).filter(([it]) => it.part === p);
    b.innerHTML = `<div class="part-head"><h2>${esc(p.name)}</h2><p>${esc(p.directionsTh)}</p></div>
      <div class="qgrid">${items.map(([it, i]) => questionCard(0, it, i, { noFlag: true })).join('')}</div>`;
  }
  function onAudioTime() {
    const a = audio;
    if (segEnd !== null) {
      if (a.currentTime >= segEnd) { segEnd = null; a.pause(); }
      return;
    }
    if (!S || S.phase !== 'run' || S.sec !== 0 || !document.getElementById('lstat')) return;
    const t = a.currentTime;
    const r = listenRange();
    if (isPart() && t >= r.end) { finishSection(); return; }
    S.audioPos = t;
    if (Date.now() - lastSave > 2000) { lastSave = Date.now(); save(); }
    updateBooklet(t);
    const cue = CUES.questions.find((c) => t >= c.start && t < c.end);
    const stat = document.getElementById('lstat');
    const count = document.getElementById('lcount');
    document.getElementById('eq')?.classList.toggle('off', a.paused);
    document.getElementById('ltime').textContent = `${fmt(t - r.start)} / ${fmt(r.end - r.start)}`;
    document.getElementById('lprog').style.width = `${((t - r.start) / (r.end - r.start)) * 100}%`;
    document.querySelectorAll('.q.now').forEach((el) => { if (!cue || el.dataset.i !== String(cue.q - 1)) el.classList.remove('now'); });
    if (cue) {
      const card = document.getElementById(`q-0-${cue.q - 1}`);
      if (card && !card.classList.contains('now')) {
        card.classList.add('now');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      const answering = t >= cue.askEnd;
      stat.firstChild.textContent = answering ? `เลือกคำตอบข้อ ${cue.q}` : (t >= cue.ask ? `คำถามข้อ ${cue.q}` : `กำลังฟังข้อ ${cue.q}`);
      count.hidden = !answering;
      if (answering) count.textContent = `${Math.ceil(cue.end - t)} วิ`;
    } else {
      const part = partAt(t);
      const talk = part && CUES.talks[part];
      stat.firstChild.textContent = talk && t >= talk.start && t < talk.end ? 'กำลังฟังบทสนทนา / บรรยาย'
        : part === 'END' ? 'จบ Section 1' : 'คำอธิบายข้อสอบ';
      count.hidden = true;
    }
  }
  function seekPlay(a, from) {
    const seek = () => { if (Math.abs(a.currentTime - from) > 0.5) a.currentTime = from; };
    if (a.readyState >= 1) seek(); else a.addEventListener('loadedmetadata', seek, { once: true });
    return a.play();
  }
  function playSegment(from, to, btn) {
    const a = getAudio();
    const wasOn = btn.classList.contains('on');
    document.querySelectorAll('.play.on').forEach((b) => b.classList.remove('on'));
    if (wasOn && !a.paused) { a.pause(); return; }
    segEnd = to;
    seekPlay(a, from).catch(() => toast('เล่นเสียงไม่ได้'));
    btn.classList.add('on');
  }

  // ---------- pause ----------
  function pauseRun() {
    if (!S || S.phase !== 'run') return;
    if (S.sec === 0) {
      pausedByUser = true;
      if (audio) { S.audioPos = audio.currentTime || S.audioPos; audio.pause(); }
    } else if (S.remaining == null) {
      S.remaining = Math.max(0, S.deadline - Date.now());
      clearInterval(tick); tick = null;
    }
    save();
    const left = S.sec === 0 ? `เสียงหยุดไว้ที่นาที ${fmt(S.audioPos - listenRange().start)}` : `เวลาที่เหลือ ${fmt(S.remaining / 1000)} หยุดนับไว้แล้ว`;
    showOverlay('พักอยู่ ⏸', `${left} กดทำต่อเมื่อพร้อม`, 'ทำต่อ', resumeRun, 'pause');
  }
  function resumeRun() {
    if (S.sec === 0) { playListening(resumeFrom()); return; }
    const y = window.scrollY;
    render(); // recomputes the deadline from the remaining time and restarts the clock
    window.scrollTo(0, y);
  }

  // ---------- timed sections (2 & 3) ----------
  function renderTimed() {
    const i = S.sec;
    const s = SECS[i];
    const isReading = s.sec.id === 'reading';
    const parts = isPart() ? [s.sec.parts[S.pi]] : s.sec.parts;
    let body;
    if (isReading) {
      const tab = Math.min(S.tab || 0, parts.length - 1);
      const part = parts[tab];
      const items = s.items.map((it, j) => [it, j]).filter(([it]) => it.part === part);
      body = `<div class="split">
        <section class="card passage"><div class="tabs">${parts.map((p, k) => `<button class="tab ${k === tab ? 'on' : ''}" data-act="tab" data-tab="${k}">${esc(p.name)}</button>`).join('')}</div>
          ${passageHTML(part)}</section>
        <section class="qlist" style="display:grid;gap:14px">${items.map(([it, j]) => questionCard(i, it, j)).join('')}</section></div>`;
    } else {
      body = `<div class="sec-wrap">${parts.map((p) => {
        const items = s.items.map((it, j) => [it, j]).filter(([it]) => it.part === p);
        return `<div class="part-head"><h2>${esc(p.name)}</h2><p>${esc(p.directionsTh)}</p></div>
          <div class="qlist">${items.map(([it, j]) => questionCard(i, it, j)).join('')}</div>`;
      }).join('')}</div>`;
    }
    app.innerHTML = `<div class="bar"><div class="bar-in">
        <div class="title">${runTitle(s.sec.name)}</div>
        <span class="timer" id="timer">--:--</span>
        ${pauseBtn()}
        <button class="btn small ghost" data-act="exit">⌂<span class="blabel"> หน้าแรก</span></button>
        ${themeBtn()}
        <button class="btn small primary" data-act="submit">ส่ง${isPart() ? '' : `<span class="blabel"> Section ${i + 1}</span>`}</button>
      </div>${palette(i)}</div>${body}`;
    const update = () => {
      const left = (S.deadline - Date.now()) / 1000;
      const el = document.getElementById('timer');
      if (!el) return;
      el.textContent = fmt(left);
      el.classList.toggle('low', left <= 60);
      if (left <= 0) { toast('หมดเวลา ระบบส่งคำตอบให้แล้ว'); finishSection(); }
    };
    update();
    tick = setInterval(update, 500);
  }
  function passageHTML(part) {
    return `<div class="ptext">${part.passage.map((l, k) => {
      const n = k + 1;
      const label = n === 1 ? '' : (n === 4 ? 'Line' : (n % 5 === 0 ? `(${n})` : ''));
      return `<div class="ln ${l.p ? 'p' : ''}"><span class="no" data-n="${n}">${label}</span><span class="t">${esc(l.t)}</span></div>`;
    }).join('')}</div>`;
  }

  // ---------- study guide ----------
  function renderGuide(focus) {
    const G = window.GUIDE || [];
    app.innerHTML = `<div class="bar"><div class="bar-in">
        <button class="btn small ghost" data-act="guide-back">← กลับ</button>
        <div class="title"><small>TOEFL ITP</small><b>คู่มือเตรียมสอบ</b></div>
        <button class="btn small ghost" data-act="home">⌂<span class="blabel"> หน้าแรก</span></button>
        ${themeBtn()}
      </div>
      <nav class="pal toc" aria-label="สารบัญ">${G.map((g) => `<button class="tab" data-act="gscroll" data-id="${g.id}">${esc(g.title)}</button>`).join('')}</nav></div>
      <div class="guide">${G.map((g) => `<section class="card g-sec" id="g-${g.id}"><h2>${esc(g.title)}</h2>${g.body}</section>`).join('')}
        <div class="actions" style="justify-content:center"><button class="btn primary" data-act="guide-back">← กลับ</button></div>
        <p class="foot">ส่วน "เคล็ดลับจากเอกสาร" และประเภทคำถาม Reading แปลจาก ${esc(E.source)} · ส่วนอื่นเป็นเนื้อหาเสริม</p></div>`;
    const el = focus && document.getElementById(`g-${focus}`);
    if (el) el.scrollIntoView({ block: 'start' }); else window.scrollTo(0, 0);
  }
  function stopReviewAudio() { if (audio && !(S && S.phase === 'run' && S.sec === 0)) { segEnd = null; audio.pause(); } }
  function openRoute(hash, focus) {
    stopReviewAudio();
    if (S && S.phase === 'run') { goHome(); }
    history.pushState({ route: 1 }, '', hash);
    if (hash === '#guide') renderGuide(focus); else renderPractice();
  }
  function closeRoute() {
    if (history.state && history.state.route) history.back();
    else { clearHash(); render(); window.scrollTo(0, 0); }
  }
  window.addEventListener('popstate', () => render());
  window.addEventListener('hashchange', () => render());

  function goHome() {
    if (S && S.phase === 'run') {
      if (S.sec === 0 && audio) S.audioPos = audio.currentTime || S.audioPos;
      else if (S.sec > 0 && S.remaining == null) S.remaining = Math.max(0, S.deadline - Date.now());
      save();
    }
    showHome = true;
    if (audio) { segEnd = null; audio.pause(); }
    hideOverlay();
    clearHash();
    render(); window.scrollTo(0, 0);
  }
  // Closing the tab mid-section stops the clock too.
  window.addEventListener('pagehide', () => {
    if (S && S.phase === 'run' && S.sec > 0 && S.remaining == null) { S.remaining = Math.max(0, S.deadline - Date.now()); save(); }
  });

  // ---------- flow ----------
  function finishSection() {
    const i = S.sec;
    S.used[i] = Math.round((Date.now() - S.secStart) / 1000);
    if (i === 0 && audio) { segEnd = null; S.phase = 'finishing'; audio.pause(); hideOverlay(); }
    if (isPart()) {
      S.phase = 'results'; S.finishedAt = Date.now();
      const p = partOf(S.sec, S.pi);
      const ph = store.get(PHKEY, {});
      const c = p.idx.filter((j) => S.answers[i][j] === SECS[i].items[j].q.answer).length;
      ph[p.key] = [{ at: S.finishedAt, c, t: p.idx.length }, ...(ph[p.key] || [])].slice(0, 10);
      store.set(PHKEY, ph);
    } else if (i < 2) { S.sec = i + 1; S.phase = 'intro'; S.tab = 0; }
    else {
      S.phase = 'results'; S.finishedAt = Date.now();
      const sc = scores(S.answers);
      const hist = store.get(HKEY, []);
      hist.unshift({ at: S.finishedAt, c: sc.secs.map((x) => x.correct), total: sc.total });
      store.set(HKEY, hist.slice(0, 30));
    }
    save(); render(); window.scrollTo(0, 0);
  }
  function begin() {
    S.phase = 'run'; S.secStart = Date.now();
    if (S.sec > 0) S.deadline = Date.now() + E.sections[S.sec].minutes * 60000;
    else S.audioPos = 0;
    save(); render(); window.scrollTo(0, 0);
  }

  // ---------- analysis ----------
  // entries: [[sectionIndex, questionIndex], ...] of the questions in this attempt.
  function analysisHTML(entries, opts = {}) {
    const total = entries.length;
    const correct = entries.filter(([si, j]) => S.answers[si][j] === SECS[si].items[j].q.answer).length;
    const blanks = entries.filter(([si, j]) => !S.answers[si][j]);
    const pct = Math.round((correct / total) * 100);
    const verdict = pct >= 85 ? ['ยอดเยี่ยม', 'ok', 'แม่นเกือบทุกข้อ รักษามาตรฐานนี้ไว้ แล้วลองฝึกทำให้เร็วขึ้น']
      : pct >= 70 ? ['ดี', 'ok', 'พื้นฐานแน่น เก็บรายละเอียดจุดที่ยังพลาดอีกนิดคะแนนจะขึ้นชัดเจน']
        : pct >= 50 ? ['พอใช้', 'warn', 'ทำได้ครึ่งหนึ่งขึ้นไป แต่ยังมีประเภทคำถามที่ต้องฝึกเพิ่ม ดูรายการด้านล่าง']
          : ['ต้องฝึกเพิ่ม', 'bad', 'เริ่มจากอ่านคู่มือของประเภทคำถามที่พลาด แล้วกลับมาทำ Part นี้อีกครั้ง'];
    // Group by tag, keeping section order.
    const groups = new Map();
    entries.forEach(([si, j]) => {
      const key = A.map[E.sections[si].id][j];
      if (!groups.has(key)) groups.set(key, { key, si, tag: A.tags[key], total: 0, correct: 0, wrong: [] });
      const g = groups.get(key);
      g.total += 1;
      if (S.answers[si][j] === SECS[si].items[j].q.answer) g.correct += 1;
      else g.wrong.push(SECS[si].items[j].n);
    });
    const rows = [...groups.values()].map((g) => ({ ...g, pct: g.correct / g.total }));
    const weak = rows.filter((g) => g.pct < 0.6).sort((a, b) => a.pct - b.pct);
    const strong = rows.filter((g) => g.pct >= 0.8);
    const notes = [];
    if (blanks.length) {
      notes.push(opts.listening
        ? `ไม่ได้ตอบ ${blanks.length} ข้อ ใน Listening ให้เลือกคำตอบทันทีที่ได้ยินคำถาม ถ้าไม่แน่ใจให้เดาไว้ก่อน เพราะตอบผิดไม่ติดลบ`
        : `ไม่ได้ตอบ ${blanks.length} ข้อ ตอบผิดไม่ติดลบ ก่อนหมดเวลาให้เดาข้อที่เหลือทุกครั้ง`);
    }
    if (opts.limit && opts.used) {
      const per = Math.round(opts.used / total);
      if (blanks.length && opts.used >= opts.limit - 3) notes.push(`หมดเวลาก่อนทำครบ เฉลี่ย ${per} วินาทีต่อข้อ ลองตั้งเป้า ~${Math.round(opts.limit / total)} วินาทีต่อข้อ และข้ามข้อยากไปก่อน`);
      else if (opts.used < opts.limit * 0.5 && pct < 70) notes.push(`ใช้เวลาไปเพียง ${fmt(opts.used)} จาก ${fmt(opts.limit)} ยังมีเวลาเหลือมาก ลองอ่านให้ละเอียดขึ้นและทวนข้อที่ไม่แน่ใจ`);
      else notes.push(`ใช้เวลา ${fmt(opts.used)} จาก ${fmt(opts.limit)} (เฉลี่ย ${per} วินาทีต่อข้อ)`);
    }
    const secNames = ['Listening', 'Structure', 'Reading'];
    const bySec = [0, 1, 2].map((si) => rows.filter((g) => g.si === si)).filter((r) => r.length);
    const table = bySec.map((list) => `${bySec.length > 1 ? `<h4 class="ana-sec">${secNames[list[0].si]}</h4>` : ''}
      ${[...list].sort((a, b) => a.pct - b.pct).map((g) => `<div class="ana-row ${g.pct < 0.6 ? 'bad' : g.pct >= 0.8 ? 'ok' : 'warn'}">
        <span class="ana-name">${esc(g.tag.name)}</span>
        <span class="meter"><i style="width:${g.pct * 100}%"></i></span>
        <span class="ana-n">${g.correct}/${g.total}</span></div>`).join('')}`).join('');
    return `<section class="card analysis">
      <div class="ana-head"><h2>วิเคราะห์ผล</h2><span class="chip ${verdict[1] === 'ok' ? 'ok' : verdict[1] === 'warn' ? 'skip' : 'bad'}">${verdict[0]} · ${pct}%</span></div>
      <p style="margin:6px 0 0">${verdict[2]}</p>
      ${notes.length ? `<ul class="ana-notes">${notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>` : ''}
      <h3>ผลแยกตามประเภทคำถาม</h3>
      <div class="ana-table">${table}</div>
      <div class="ana-cols">
        <div class="ana-box bad"><h3>ควรฝึกเพิ่ม</h3>${weak.length ? weak.map((g) => `<div class="ana-item">
          <b>${esc(g.tag.name)}</b> <span class="muted">(ผิดข้อ ${g.wrong.join(', ')})</span>
          <p>${esc(g.tag.advice)}</p>
          <button class="btn small ghost" data-act="guide" data-id="${g.tag.guide}">📘 อ่านคู่มือส่วนนี้</button></div>`).join('')
          : '<p class="muted">ไม่มีประเภทที่ต่ำกว่า 60% 👍</p>'}</div>
        <div class="ana-box ok"><h3>จุดแข็ง</h3>${strong.length ? `<ul>${strong.map((g) => `<li>${esc(g.tag.name)} <span class="muted">${g.correct}/${g.total}</span></li>`).join('')}</ul>`
          : '<p class="muted">ยังไม่มีประเภทที่ได้ 80% ขึ้นไป ฝึกต่ออีกนิด</p>'}</div>
      </div>
    </section>`;
  }

  // ---------- results ----------
  let filter = 'all';
  const filterBar = () => `<div class="filters">
        <button class="tab ${filter === 'all' ? 'on' : ''}" data-act="filter" data-f="all">ทุกข้อ</button>
        <button class="tab ${filter === 'wrong' ? 'on' : ''}" data-act="filter" data-f="wrong">เฉพาะข้อที่ผิด / ไม่ได้ตอบ</button>
        <button class="tab ${filter === 'flag' ? 'on' : ''}" data-act="filter" data-f="flag">ข้อที่ปักธง</button>
      </div>`;
  function renderResults() {
    const sc = scores(S.answers);
    const cards = sc.secs.map((x, i) => `<div class="sc"><h4>${esc(SECS[i].sec.name)}</h4>
      <div class="n">${x.correct}<small> / ${x.total}</small></div>
      <div class="meter"><i style="width:${(x.correct / x.total) * 100}%"></i></div>
      <div class="est">${Math.round((x.correct / x.total) * 100)}% · ประมาณ ${x.scaled} คะแนน (${RANGES[i][0]}–${RANGES[i][1]})${S.used[i] ? ` · ใช้เวลา ${fmt(S.used[i])}` : ''}</div></div>`).join('');
    const totalCorrect = sc.secs.reduce((a, x) => a + x.correct, 0);
    const totalQ = sc.secs.reduce((a, x) => a + x.total, 0);
    const entries = SECS.flatMap((s, si) => s.items.map((it, j) => [si, j]));
    app.innerHTML = `<div class="wrap">
      <section class="card">
        <div class="score-hero"><div>
          <div class="eyebrow">ผลการสอบ</div>
          <div class="big">${totalCorrect}<small> / ${totalQ} ข้อ</small></div>
          <p class="muted" style="margin:8px 0 0">คะแนนประมาณการแบบ ITP (310–677): <b style="color:var(--ink)">~${sc.total}</b><br>
          <span style="font-size:13px">ประมาณจากสัดส่วนข้อที่ถูกเท่านั้น เพราะชุดนี้มี ${totalQ} ข้อ ส่วนข้อสอบจริงมี 140 ข้อ</span></p></div>
          <div class="actions" style="margin:0;flex-direction:column">
            <button class="btn primary" data-act="restart">ทำใหม่อีกครั้ง</button>
            <button class="btn ghost" data-act="practice">🎯 ฝึกทีละ Part</button>
            <button class="btn ghost" data-act="guide">📘 คู่มือเตรียมสอบ</button>
            <button class="btn ghost" data-act="home">⌂ หน้าแรก</button>
            ${themeBtn()}</div></div>
        <div class="secs">${cards}</div>
      </section>
      ${analysisHTML(entries)}
      ${filterBar()}
      ${SECS.map((s, i) => reviewSection(s, i)).join('')}
      <p class="foot">${esc(E.source)}</p>
    </div>`;
  }
  function renderPartResults() {
    const p = partOf(S.sec, S.pi);
    const si = S.sec;
    const correct = p.idx.filter((j) => S.answers[si][j] === SECS[si].items[j].q.answer).length;
    const k = PARTS.indexOf(p);
    const next = PARTS[k + 1];
    const r = si === 0 ? listenRange() : null;
    const limit = si === 0 ? 0 : p.minutes * 60;
    app.innerHTML = `<div class="bar"><div class="bar-in">
        <button class="btn small ghost" data-act="practice">← เลือก Part</button>
        <div class="title"><small>ผลฝึก · Section ${si + 1}</small><b>${esc(p.title)}</b></div>
        <button class="btn small ghost" data-act="home">⌂<span class="blabel"> หน้าแรก</span></button>
        ${themeBtn()}
      </div></div>
      <div class="wrap">
      <section class="card">
        <div class="score-hero"><div>
          <div class="eyebrow">ผลฝึก ${esc(E.sections[si].name)} · ${p.range}</div>
          <div class="big">${correct}<small> / ${p.idx.length} ข้อ</small></div>
          <div class="meter" style="max-width:360px"><i style="width:${(correct / p.idx.length) * 100}%"></i></div>
          <p class="muted" style="margin:6px 0 0">${si === 0 ? `ความยาวเสียง ${fmt(r.end - r.start)}` : `ใช้เวลา ${fmt(S.used[si])} จาก ${fmt(limit)}`}</p></div>
          <div class="actions" style="margin:0;flex-direction:column">
            <button class="btn primary" data-act="practice-start" data-si="${p.si}" data-pi="${p.pi}">↻ ทำ Part นี้อีกครั้ง</button>
            ${next ? `<button class="btn ghost" data-act="practice-start" data-si="${next.si}" data-pi="${next.pi}">Part ถัดไป: ${esc(next.title)} →</button>` : ''}
            <button class="btn ghost" data-act="practice">เลือก Part อื่น</button></div></div>
      </section>
      ${analysisHTML(p.idx.map((j) => [si, j]), { listening: si === 0, used: S.used[si], limit })}
      ${filterBar()}
      ${reviewSection(SECS[si], si, p.part)}
      </div>`;
  }
  function reviewSection(s, si, onlyPart) {
    let html = `<section class="rv-sec"><h2>${onlyPart ? 'เฉลย' : `Section ${si + 1}: ${esc(s.sec.name)}`}</h2>`;
    let shown = 0;
    s.sec.parts.forEach((p) => {
      if (onlyPart && p !== onlyPart) return;
      const items = s.items.map((it, j) => [it, j]).filter(([it]) => it.part === p).filter(([it, j]) => {
        const a = S.answers[si][j];
        if (filter === 'wrong') return a !== it.q.answer;
        if (filter === 'flag') return S.flags[si][j];
        return true;
      });
      if (!items.length) return;
      shown += items.length;
      html += `<div class="rv-part">${esc(p.name)}</div>`;
      if (p.passage) html += `<details class="box"><summary>เปิดดูบทความ (${esc(p.name)})</summary>${passageHTML(p)}</details>`;
      if (p.script) {
        const talk = CUES.talks[p.id];
        html += `<details class="box"><summary>บทสนทนา / บรรยาย (Transcript)</summary>
          <p><button class="play" data-act="play" data-from="${talk.start}" data-to="${talk.end}">▶ ฟังทั้งชุด</button></p>${scriptHTML(p.script)}</details>`;
      }
      html += items.map(([it, j]) => reviewCard(si, it, j)).join('');
    });
    if (!shown) html += '<p class="muted">ไม่มีข้อในหมวดนี้</p>';
    return html + '</section>';
  }
  function scriptHTML(lines) {
    const who = { W: 'Woman', M: 'Man', N: 'Narrator' };
    return `<div class="script">${lines.map(([w, t]) => `<p><span class="spk">${who[w]}</span>${esc(t)}</p>`).join('')}</div>`;
  }
  function reviewCard(si, it, j) {
    const q = it.q;
    const a = S.answers[si][j];
    const st = !a ? 'skip' : (a === q.answer ? 'ok' : 'bad');
    const chip = { ok: 'ถูก', bad: 'ผิด', skip: 'ไม่ได้ตอบ' }[st];
    const isErr = it.part.type === 'error';
    let stem = '';
    let extra = '';
    if (si === 0) {
      const cue = CUES.questions[j];
      stem = `<div class="stem en">${esc(q.ask)}</div>`;
      extra = `${q.script ? scriptHTML([...q.script, ['N', q.ask]]) : ''}
        <p style="margin:8px 0 0"><button class="play" data-act="play" data-from="${cue.start}" data-to="${cue.askEnd + 0.3}">▶ ฟังข้อนี้อีกครั้ง</button></p>`;
    } else if (isErr) {
      stem = `<div class="stem err">${errStem(q.stem, a, q)}</div>`;
    } else {
      stem = `<div class="stem">${q.stem}</div>`;
    }
    const opts = isErr ? '' : `<div class="opts">${q.options.map((o, k) => {
      const l = LETTERS[k];
      const cls = l === q.answer ? 'correct' : (l === a ? 'yours' : '');
      const tag = l === q.answer ? '<span class="tag">✓ คำตอบที่ถูก</span>' : (l === a ? '<span class="tag">✗ คุณเลือก</span>' : '');
      return `<div class="opt ${cls}"><span class="bub">${l}</span><span>${esc(o)}${tag}</span></div>`;
    }).join('')}</div>`;
    const errLine = isErr ? `<p style="margin:6px 0 0">คุณเลือก <b>${a || '—'}</b> · คำตอบที่ถูก <b>${q.answer}</b> · แก้เป็น <b class="en">${esc(q.fix)}</b></p>` : '';
    return `<article class="rv ${st}">
      <div class="q-top"><span class="qn">${it.n}.</span>${stem}<span class="chip ${st}">${chip}</span></div>
      <div class="qtype">ประเภท: ${esc(tagOf(si, j).name)}</div>
      ${extra}${opts}${errLine}
      <div class="explain"><b>เฉลย ${q.answer}:</b> ${esc(q.explain)}</div></article>`;
  }

  // ---------- events ----------
  app.addEventListener('click', async (e) => {
    const go = e.target.closest('[data-go]');
    if (go) {
      const idx = Number(go.dataset.go);
      const it = SECS[S.sec].items[idx];
      if (SECS[S.sec].sec.id === 'reading' && !isPart()) {
        const k = SECS[S.sec].sec.parts.indexOf(it.part);
        if (k !== S.tab) { S.tab = k; save(); render(); }
      }
      document.getElementById(`q-${S.sec}-${idx}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const act = el.dataset.act;
    const card = el.closest('.q');
    switch (act) {
      case 'start': showHome = false; S = fresh(); save(); render(); break;
      case 'resume': case 'show-results': S = examState(); showHome = false; resumeByClick = true; render(); window.scrollTo(0, 0); break;
      case 'home': stopReviewAudio(); goHome(); break;
      case 'exit':
        if (await ask('กลับหน้าแรก?', S.sec === 0
          ? 'เสียงจะหยุดไว้ตรงนี้ กด "ทำต่อ" เพื่อฟังต่อจากจุดเดิม'
          : 'เวลาจะหยุดไว้ คำตอบที่ทำแล้วยังอยู่ กด "ทำต่อ" เพื่อทำต่อ', 'กลับหน้าแรก')) goHome();
        break;
      case 'pause': pauseRun(); break;
      case 'restart':
        if (await ask('เริ่มทำข้อสอบเต็มชุดใหม่?', 'คำตอบที่ทำค้างไว้จะถูกล้าง (ประวัติคะแนนยังอยู่)', 'เริ่มใหม่')) {
          stopReviewAudio();
          showHome = false; S = fresh(); save(); clearHash(); render(); window.scrollTo(0, 0);
        }
        break;
      case 'begin': begin(); break;
      case 'theme': toggleTheme(); break;
      case 'guide': openRoute('#guide', el.dataset.id); break;
      case 'practice': openRoute('#practice'); break;
      case 'guide-back': closeRoute(); break;
      case 'practice-start': {
        const si = Number(el.dataset.si); const pi = Number(el.dataset.pi);
        const PR = practiceState();
        if (PR && PR.phase === 'run'
          && !(await ask('เริ่ม Part ใหม่?', `มี Part ที่ทำค้างอยู่ (${partOf(PR.sec, PR.pi).title}) ถ้าเริ่มใหม่ คำตอบที่ค้างจะถูกล้าง`, 'เริ่มใหม่'))) break;
        startPractice(si, pi);
        break;
      }
      case 'practice-resume': S = practiceState(); clearHash(); showHome = false; resumeByClick = true; render(); window.scrollTo(0, 0); break;
      case 'gscroll': document.getElementById(`g-${el.dataset.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); break;
      case 'soundcheck': new Audio(E.soundCheck).play().catch(() => toast('เล่นเสียงไม่ได้')); break;
      case 'ans':
        if (card && S.phase === 'run') setAnswer(Number(card.dataset.sec), Number(card.dataset.i), el.dataset.opt);
        break;
      case 'flag': {
        const si = Number(card.dataset.sec); const i = Number(card.dataset.i);
        S.flags[si][i] = !S.flags[si][i]; save();
        el.classList.toggle('on', S.flags[si][i]);
        el.textContent = `⚑ ${S.flags[si][i] ? 'ปักธงแล้ว' : 'ปักธง'}`;
        document.querySelector(`.pal [data-go="${i}"]`)?.classList.toggle('flag', S.flags[si][i]);
        break;
      }
      case 'tab': S.tab = Number(el.dataset.tab); save(); render(); window.scrollTo(0, 0); break;
      case 'submit': {
        const blank = SECS[S.sec].items.filter((it, j) => inScope(j) && !S.answers[S.sec][j]).length;
        const what = isPart() ? 'Part นี้' : `Section ${S.sec + 1}`;
        const ok = await ask(`ส่ง${what}?`, `${blank ? `ยังไม่ได้ตอบ ${blank} ข้อ ` : 'ตอบครบทุกข้อแล้ว '}เมื่อส่งแล้วจะกลับมาแก้ไม่ได้${isPart() ? ' และจะเห็นเฉลยพร้อมวิเคราะห์ทันที' : ''}`, 'ส่งคำตอบ');
        if (ok && S.phase === 'run') finishSection();
        break;
      }
      case 'filter': filter = el.dataset.f; render(); break;
      case 'play': playSegment(Number(el.dataset.from), Number(el.dataset.to), el); break;
      default: break;
    }
  });

  // Keyboard shortcuts while answering: A–D answers the question nearest the top of the viewport.
  document.addEventListener('keydown', (e) => {
    if (!S || S.phase !== 'run' || !modal.hidden || document.getElementById('overlay') || e.metaKey || e.ctrlKey || e.altKey) return;
    const l = e.key.toUpperCase();
    if (!LETTERS.includes(l)) return;
    const cards = [...document.querySelectorAll('.q')];
    const target = document.querySelector('.q.now') || cards.find((c) => c.getBoundingClientRect().bottom > 170);
    if (target) setAnswer(Number(target.dataset.sec), Number(target.dataset.i), l);
  });

  render();
})();
