/** サイト全体で使う定数 */
export const SITE_TITLE = 'らーめん食べ歩きログ';
export const SITE_DESCRIPTION =
	'関東近郊を中心に食べ歩いたラーメンのレビューを、系統・場所・評価つきで記録するブログです。';

/**
 * サイト内リンクに `base`（astro.config.mjs）を付ける。
 * GitHub Pages のプロジェクトサイトのようにサブパス配信するときに必要。
 * 例: base が `/ramen-blog` なら `withBase('/posts/foo/')` → `/ramen-blog/posts/foo/`
 */
export function withBase(path: string): string {
	const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
	return `${base}/${path.replace(/^\/+/, '')}`;
}

/** 日付を「2026年9月6日」形式に整形する */
export function formatDate(date: Date): string {
	return date.toLocaleDateString('ja-JP', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}
