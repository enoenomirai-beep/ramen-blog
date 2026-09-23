/** サイト全体で使う定数 */
export const SITE_TITLE = 'らーめん食べ歩きログ';
export const SITE_DESCRIPTION =
	'関東近郊を中心に食べ歩いたラーメンのレビューを、系統・場所・評価つきで記録するブログです。';

/** トップページ・ページネーションの 1 ページあたりの記事数 */
export const PAGE_SIZE = 12;

/** ラーメンエンゲル係数の算出に使う、月間の目標食費（円）。出費ダッシュボードで使用 */
export const MONTHLY_FOOD_BUDGET = 50000;

/**
 * サイト内リンクに `base`（astro.config.mjs）を付ける。
 * 独自ドメイン配信の現在は base が既定値の `/` なので実質そのまま返すが、
 * GitHub Pages のプロジェクトサイトのようにサブパス配信する構成に戻したときも
 * このヘルパー経由なら追随できる（例: base が `/ramen-blog` なら `withBase('/posts/foo/')` → `/ramen-blog/posts/foo/`）。
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
