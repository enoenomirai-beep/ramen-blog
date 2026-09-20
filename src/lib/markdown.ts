/**
 * Markdown/MDX の生ソースから、見出し記号・強調・リンク・コードブロック・
 * HTML/JSX タグ（<PhotoGallery ... /> など）を取り除いたおおよそのプレーンテキストを取り出す。
 * 読了時間の概算（reading-time.ts）と全文検索（search.astro）の両方で使う。
 */
export function stripMarkdown(markdown: string): string {
	return markdown
		.replace(/```[\s\S]*?```/g, '') // コードブロック
		.replace(/`[^`]*`/g, '') // インラインコード
		.replace(/^---[\s\S]*?---/, '') // 万一残っていたフロントマター
		.replace(/<[^>]+>/g, '') // HTML/JSX タグ（コンポーネント呼び出しを含む）
		.replace(/!\[[^\]]*\]\([^)]*\)/g, '') // 画像
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // リンクはテキスト部分だけ残す
		.replace(/^#{1,6}\s*/gm, '') // 見出し記号
		.replace(/[*_~>`#-]/g, '') // 強調・引用・リストなどの記号
		.trim();
}
