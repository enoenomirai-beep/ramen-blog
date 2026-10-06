const site = new URLSearchParams(location.search).get('site');
document.getElementById('site').textContent =
  site === 'extensions' ? '拡張機能の管理ページ' : site || 'このサイト';
