// らーめんログの Service Worker（PWA のオフライン対応）。
//
// public/ 配下の静的ファイルなので Astro のビルド処理（withBase() など）を通らない。
// そのため base（astro.config.mjs）のパスをそのまま文字列で持っている。base を変える場合は
// このファイルの BASE も合わせて変更すること（独自ドメイン配信の現在は base が '/' なので空文字）。
//
// 方針: 表示済みのページ・アセットをキャッシュに溜めていき（stale-while-revalidate に近い
// キャッシュ優先＋バックグラウンド更新）、オフライン時やネットワーク不調時はキャッシュから
// 返す。キャッシュに無い遷移先はトップページで代替する。
const BASE = '';
const CACHE_NAME = 'ramen-blog-cache-v1';
const OFFLINE_FALLBACK = `${BASE}/`;
const PRECACHE_URLS = [`${BASE}/`, `${BASE}/favicon.svg`, `${BASE}/manifest.webmanifest`];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => cache.addAll(PRECACHE_URLS))
			.then(() => self.skipWaiting()),
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
			.then(() => self.clients.claim()),
	);
});

self.addEventListener('fetch', (event) => {
	const { request } = event;
	// GET 以外（フォーム送信など）や外部オリジン（unpkg の Leaflet、giscus など）はそのまま素通しする
	if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

	event.respondWith(
		caches.open(CACHE_NAME).then(async (cache) => {
			const cached = await cache.match(request);
			const network = fetch(request)
				.then((response) => {
					if (response.ok) cache.put(request, response.clone());
					return response;
				})
				.catch(() => undefined);

			// キャッシュがあれば即返し、裏でネットワークから更新（無ければネットワークを待つ）
			if (cached) {
				network.catch(() => {});
				return cached;
			}
			const response = await network;
			if (response) return response;

			// オフラインでキャッシュにも無いページ遷移は、トップページで代替する
			if (request.mode === 'navigate') {
				const fallback = await cache.match(OFFLINE_FALLBACK);
				if (fallback) return fallback;
			}
			return Response.error();
		}),
	);
});
