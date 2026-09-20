/**
 * 記事本文（Markdown/MDX の生ソース）から「読了時間の目安」を計算する。
 *
 * stripMarkdown() で見出し記号・強調・リンク・コードブロック・HTML/JSX タグを
 * 取り除いたおおよそのプレーンテキストの文字数を、日本語の一般的な読書速度（1 分あたり
 * 400〜500 字）の中央値 450 字/分で割って分数にする。厳密な文字数ではなく「目安」でよい。
 */
import { stripMarkdown } from './markdown';

const CHARS_PER_MINUTE = 450;

export function estimateReadingMinutes(markdown: string): number {
	const charCount = stripMarkdown(markdown).length;
	return Math.max(1, Math.ceil(charCount / CHARS_PER_MINUTE));
}
