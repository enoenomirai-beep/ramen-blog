// background.js（importScripts）と options.js（<script>）で共有する判定ロジック
const DEFAULTS = {
  sites: [
    'youtube.com',
    'x.com',
    'twitter.com',
    'instagram.com',
    'tiktok.com',
    'netflix.com',
    'nicovideo.jp',
    'twitch.tv',
    'reddit.com',
  ],
  schedule: { enabled: true, days: [0, 1, 2, 3, 4, 5, 6], start: '09:00', end: '21:00' },
  sessionUntil: 0, // 集中モードの終了時刻（ms）
  editUntil: 0, // 解除チャレンジ後の「ブロック一時停止＋設定変更OK」の終了時刻（ms）
};

async function getState() {
  const saved = await chrome.storage.local.get(null);
  return { ...DEFAULTS, ...saved };
}

function toMin(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function inSchedule(sc, d) {
  if (!sc.enabled) return false;
  const cur = d.getHours() * 60 + d.getMinutes();
  const s = toMin(sc.start);
  const e = toMin(sc.end);
  if (s === e) return false;
  if (s < e) return sc.days.includes(d.getDay()) && cur >= s && cur < e;
  // 日またぎ（例 22:00〜02:00）。深夜側は「前日に始まった枠」として判定
  if (cur >= s) return sc.days.includes(d.getDay());
  if (cur < e) return sc.days.includes((d.getDay() + 6) % 7);
  return false;
}

function isActive(st, now = Date.now()) {
  if (now < st.editUntil) return false;
  return now < st.sessionUntil || inSchedule(st.schedule, new Date(now));
}

// 入力された URL / ドメインを「example.com」の形に正規化。無効なら null
function normalizeDomain(input) {
  let v = String(input).trim().toLowerCase();
  v = v.replace(/^[a-z]+:\/\//, '').replace(/^www\./, '');
  v = v.split(/[/?#:]/)[0];
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(v) ? v : null;
}

if (typeof module !== 'undefined') module.exports = { DEFAULTS, inSchedule, isActive, normalizeDomain };
