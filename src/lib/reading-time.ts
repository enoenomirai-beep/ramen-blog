/**
 * 記事本文（Markdown/MDX の生ソース）から「読了時間の目安」を計算する。
 *
 * 見出し記号・強調・リンク・コードブロック・HTML/JSX タグ（<PhotoGallery ... /> など）を
 * 取り除いたおおよそのプレーンテキストの文字数を、日本語の一般的な読書速度（1 分あたり
 * 400〜500 字）の中央値 450 字/分で割って分数にする。厳密な文字数ではなく「目安」でよい。
 */
const CHARS_PER_MINUTE = 450;

export function estimateReadingMinutes(markdown: string): number {
	const plainText = markdown
		.replace(/```[\s\S]*?```/g, '') // コードブロック
		.replace(/`[^`]*`/g, '') // インラインコード
		.replace(/^---[\s\S]*?---/, '') // 万一残っていたフロントマター
		.replace(/<[^>]+>/g, '') // HTML/JSX タグ（コンポーネント呼び出しを含む）
		.replace(/!\[[^\]]*\]\([^)]*\)/g, '') // 画像
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // リンクはテキスト部分だけ残す
		.replace(/^#{1,6}\s*/gm, '') // 見出し記号
		.replace(/[*_~>`#-]/g, '') // 強調・引用・リストなどの記号
		.trim();

	const charCount = plainText.length;
	return Math.max(1, Math.ceil(charCount / CHARS_PER_MINUTE));
}
