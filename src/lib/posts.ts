import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** 公開中（draft でない）の記事を、日付の新しい順で返す。一覧・RSS・記事ページ・系統／エリア／タグ別ページで共通 */
export async function getPublishedPosts(): Promise<Post[]> {
	const posts = await getCollection('posts', ({ data }) => !data.draft);
	return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** キー → 記事（渡した順を保つ）。キーの順序は最初に出現した順。1 記事が複数のキーを持ってもよい */
function groupBy(posts: Post[], keysOf: (post: Post) => string[]): Map<string, Post[]> {
	const map = new Map<string, Post[]>();
	for (const post of posts) {
		for (const key of keysOf(post)) {
			const list = map.get(key);
			if (list) list.push(post);
			else map.set(key, [post]);
		}
	}
	return map;
}

/** 系統名 → その系統の記事 */
export function groupByStyle(posts: Post[]): Map<string, Post[]> {
	return groupBy(posts, (post) => [post.data.style]);
}

/** 場所（エリア）名 → その場所の記事 */
export function groupByLocation(posts: Post[]): Map<string, Post[]> {
	return groupBy(posts, (post) => [post.data.location]);
}

/** タグ → そのタグを持つ記事（1 記事が複数のタグに入る） */
export function groupByTag(posts: Post[]): Map<string, Post[]> {
	return groupBy(posts, (post) => post.data.tags);
}

// 各一覧ページの URL パス（base なし）。`withBase()` を通して使う
export function stylePath(style: string): string {
	return `/styles/${encodeURIComponent(style)}/`;
}
export function locationPath(location: string): string {
	return `/locations/${encodeURIComponent(location)}/`;
}
export function tagPath(tag: string): string {
	return `/tags/${encodeURIComponent(tag)}/`;
}
