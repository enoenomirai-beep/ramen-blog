const $ = (id) => document.getElementById(id);
const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];
const WAIT_SEC = 60;
const EDIT_MIN = 5;
const CODE_LEN = 32;

let st;

function fmt(ms) {
  return new Date(ms).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
}

function randomCode() {
  // 紛らわしい文字（0/O, 1/l/I）を除いた英数字
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const buf = crypto.getRandomValues(new Uint32Array(CODE_LEN));
  return Array.from(buf, (n) => chars[n % chars.length]).join('');
}

async function save(patch) {
  await chrome.storage.local.set(patch);
  await render();
}

async function render() {
  st = await getState();
  const now = Date.now();
  const active = isActive(st, now);
  const unlocked = now < st.editUntil; // 解除チャレンジ後の編集可能時間
  const locked = active; // ブロック中は削除・スケジュール変更を禁止
  const canEdit = unlocked || !locked;

  const status = $('status');
  status.className = active ? 'on' : '';
  if (unlocked) status.textContent = `🔓 解除中（${fmt(st.editUntil)} まで）`;
  else if (active) status.textContent = '🚫 ブロック中' + (now < st.sessionUntil ? `（集中モード ${fmt(st.sessionUntil)} まで）` : '');
  else status.textContent = '✅ ブロックしていません';

  $('sites').replaceChildren(
    ...st.sites.map((d) => {
      const li = document.createElement('li');
      const span = document.createElement('span');
      span.textContent = d;
      const btn = document.createElement('button');
      btn.textContent = '削除';
      btn.disabled = !canEdit;
      btn.onclick = () => save({ sites: st.sites.filter((x) => x !== d) });
      li.append(span, btn);
      return li;
    }),
  );

  $('schedEnabled').checked = st.schedule.enabled;
  $('start').value = st.schedule.start;
  $('end').value = st.schedule.end;
  $('days').replaceChildren(
    ...DAY_LABELS.map((label, i) => {
      const l = document.createElement('label');
      const c = document.createElement('input');
      c.type = 'checkbox';
      c.dataset.day = i;
      c.checked = st.schedule.days.includes(i);
      l.append(c, label + ' ');
      return l;
    }),
  );
  for (const el of [$('schedEnabled'), $('start'), $('end'), $('saveSched'), ...document.querySelectorAll('#days input')]) {
    el.disabled = !canEdit;
  }
}

$('startSession').onclick = async () => {
  const until = Date.now() + Number($('mins').value) * 60000;
  if (until > st.sessionUntil) await save({ sessionUntil: until, editUntil: 0 });
};

$('addSite').onclick = async () => {
  const d = normalizeDomain($('newSite').value);
  if (!d) return alert('ドメインの形式が正しくありません（例: youtube.com）');
  $('newSite').value = '';
  if (!st.sites.includes(d)) await save({ sites: [...st.sites, d] });
};

$('saveSched').onclick = async () => {
  const days = [...document.querySelectorAll('#days input:checked')].map((c) => Number(c.dataset.day));
  await save({
    schedule: { enabled: $('schedEnabled').checked, days, start: $('start').value || '09:00', end: $('end').value || '21:00' },
  });
};

// ---- 解除チャレンジ ----
let timer = null;
function startChallenge() {
  const box = $('challenge');
  let left = WAIT_SEC;
  const msg = document.createElement('p');
  box.replaceChildren(msg);
  clearInterval(timer);
  timer = setInterval(() => {
    left -= 1;
    if (left > 0) return (msg.textContent = `あと ${left} 秒待ってください。本当に今、開く必要がありますか？`);
    clearInterval(timer);
    showCode(box);
  }, 1000);
  msg.textContent = `あと ${left} 秒待ってください。本当に今、開く必要がありますか？`;
}

function showCode(box) {
  const code = randomCode();
  const show = document.createElement('code');
  show.textContent = code;
  const input = document.createElement('input');
  input.style.width = '100%';
  input.autocomplete = 'off';
  input.spellcheck = false;
  input.placeholder = '上の文字をそのまま入力';
  for (const ev of ['paste', 'drop']) input.addEventListener(ev, (e) => e.preventDefault());
  const result = document.createElement('p');
  input.addEventListener('input', async () => {
    if (input.value === code) {
      await save({ editUntil: Date.now() + EDIT_MIN * 60000 });
      box.replaceChildren();
    } else {
      result.textContent = `${input.value.length} / ${CODE_LEN} 文字`;
    }
  });
  box.replaceChildren(show, document.createElement('br'), input, result);
  input.focus();
}

function renderChallengeButton() {
  const box = $('challenge');
  const b = document.createElement('button');
  b.textContent = '解除チャレンジを始める';
  b.onclick = startChallenge;
  box.replaceChildren(b);
}

renderChallengeButton();
render();
setInterval(render, 15000);
