importScripts('lib.js');

async function apply() {
  const st = await getState();
  const active = isActive(st);
  const old = await chrome.declarativeNetRequest.getDynamicRules();
  const addRules = active
    ? st.sites.map((d, i) => ({
        id: i + 1,
        priority: 1,
        action: {
          type: 'redirect',
          redirect: { extensionPath: '/blocked.html?site=' + encodeURIComponent(d) },
        },
        condition: { urlFilter: '||' + d, resourceTypes: ['main_frame', 'sub_frame'] },
      }))
    : [];
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: old.map((r) => r.id),
    addRules,
  });
  await chrome.action.setBadgeText({ text: active ? 'ON' : '' });
  await chrome.action.setBadgeBackgroundColor({ color: '#b91c1c' });
}

// ブロック中は拡張機能の管理ページを開けなくする（無効化・削除の衝動対策）
const EXT_PAGE = /^(chrome|edge|brave):\/\/extensions/;
async function guard(tabId, url) {
  if (!url || !EXT_PAGE.test(url)) return;
  if (isActive(await getState())) {
    chrome.tabs.update(tabId, { url: chrome.runtime.getURL('blocked.html?site=extensions') });
  }
}
chrome.tabs.onUpdated.addListener((id, change, tab) => guard(id, change.url || tab.url));
chrome.tabs.onCreated.addListener((tab) => guard(tab.id, tab.pendingUrl || tab.url));

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('tick', { periodInMinutes: 1 });
  apply();
});
chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create('tick', { periodInMinutes: 1 });
  apply();
});
chrome.alarms.onAlarm.addListener(apply);
chrome.storage.onChanged.addListener(apply);
