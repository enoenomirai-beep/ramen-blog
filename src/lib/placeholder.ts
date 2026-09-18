/**
 * 写真が無い記事に出すイメージ画像（Unsplash のフリー素材、ラーメン写真）。
 *
 * 実際にその店で撮った一杯ではないので、表示側では必ず「イメージ」と明示すること。
 * Unsplash の CDN（imgix）は w / h / fit / q / auto のクエリでサイズ変換してくれるので、
 * こちらで画像処理はせず、必要なサイズの URL を組み立てるだけ。
 */
const UNSPLASH_PHOTOS = [
	'photo-1569718212165-3a8278d5f624', // 白い丼のラーメンと味玉
	'photo-1623341214825-9f4f963727da', // ラーメンと箸とビール
	'photo-1638866281450-3933540af86a', // 肉・卵・野菜のラーメン
	'photo-1591325418441-ff678baf78ef', // 茶色い陶器の丼
	'photo-1612927601601-6638404737ce', // 半熟卵・唐辛子・ネギ
	'photo-1526318896980-cf78c088247c', // ラーメン俯瞰
	'photo-1711394370771-817a30b06215', // 目玉焼きをのせたラーメン
];

/** 文字列から安定したインデックスを作る（同じ記事にはいつも同じ写真が出る）。FNV-1a */
function hash(seed: string): number {
	let h = 0x811c9dc5;
	for (const ch of seed) {
		h ^= ch.charCodeAt(0);
		h = Math.imul(h, 0x01000193) >>> 0;
	}
	return h;
}

/** 記事 id をシードに、指定サイズ（切り抜き）のイメージ画像 URL を返す */
export function placeholderImage(seed: string, width: number, height: number): string {
	const id = UNSPLASH_PHOTOS[hash(seed) % UNSPLASH_PHOTOS.length];
	return `https://images.unsplash.com/${id}?w=${width}&h=${height}&fit=crop&q=80&auto=format`;
}

/** イメージ画像に付ける代替テキスト */
export const PLACEHOLDER_ALT = 'ラーメンのイメージ画像（実際の一杯とは異なります）';
