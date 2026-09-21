import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { WEEKDAYS } from './lib/business-hours';

/**
 * ラーメンレビュー記事コレクション
 *
 * src/content/posts/ 配下の .md / .mdx ファイルを 1 記事として読み込む。
 * ファイル名（拡張子を除く）が記事の id（URL スラッグ）になる。
 */
const posts = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
	// image() ヘルパーを使うため、スキーマは関数形式で定義する
	schema: ({ image }) =>
		z.object({
			// --- 必須項目 ---
			/** 記事のタイトル */
			title: z.string().min(1),
			/** 訪問日または公開日（YAML の日付リテラル or 文字列を Date に変換） */
			date: z.coerce.date(),
			/** ラーメン店の名前 */
			shop_name: z.string().min(1),
			/** ラーメンの系統（例: "家系"、"二郎系"、"淡麗系"） */
			style: z.string().min(1),
			/** お店の場所（駅名・エリアなど） */
			location: z.string().min(1),
			/** 5段階評価のスコア（1〜5、0.1 刻み。例: 4.3） */
			rating: z.number().min(1).max(5).multipleOf(0.1),

			// --- 任意項目 ---
			/**
			 * 一杯の写真。記事ファイルからの相対パスで指定する（例: ../../assets/posts/xxx.jpg）。
			 * ビルド時に最適化され、カードと記事ページに表示される。
			 */
			image: image().optional(),
			/** 写真の代替テキスト（image を指定した場合は必須） */
			image_alt: z.string().optional(),
			/** 一覧カードに表示する短い説明文 */
			description: z.string().optional(),
			/** 注文したメニュー */
			menu: z.string().optional(),
			/** 支払った金額（円） */
			price: z.number().int().nonnegative().optional(),
			/** 自由なタグ */
			tags: z.array(z.string()).default([]),
			/** GoogleマップなどのURL（記事ページの「場所」に「地図を見る」リンクを表示） */
			map_url: z.url().optional(),
			/** 店舗の正確な緯度。指定するとラーメンマップでエリアの目安座標ではなくこの座標にピン留めする */
			lat: z.number().optional(),
			/** 店舗の正確な経度。lat とセットで指定する */
			lng: z.number().optional(),
			/**
			 * 営業時間。単純な文字列（例: "11:00〜15:00 / 17:00〜21:00"）のほか、
			 * 曜日によって時間が違う場合は `{ days: ["月","火",...], hours: "..." }` の配列で指定できる
			 * （例: [{ days: ["月","火","水","木","金"], hours: "11:00〜21:00" }, { days: ["土","日"], hours: "11:00〜15:00" }]）
			 */
			business_hours: z
				.union([z.string(), z.array(z.object({ days: z.array(z.enum(WEEKDAYS)).min(1), hours: z.string().min(1) })).min(1)])
				.optional(),
			/** 最寄り駅（location とは別に、駅名だけを書きたい場合）。複数ある場合は配列で指定できる */
			nearest_station: z.union([z.string(), z.array(z.string()).min(1)]).optional(),
			/** 殿堂入りピックアップとしてトップページ上部に出す場合 true */
			pickup: z.boolean().default(false),
			/** 訪問回数（再訪した記事で 2 以上を指定すると「訪問回数」バッジが出る） */
			visits: z.number().int().min(1).default(1),
			/** 営業状況などの特徴タグ（例: ["深夜営業", "通し営業", "ライス無料"]） */
			features: z.array(z.string()).default([]),
			/** 下書きの場合 true（一覧・ビルドから除外） */
			draft: z.boolean().default(false),
		})
		.refine((data) => !data.image || !!data.image_alt, {
			message: 'image を指定する場合は image_alt（代替テキスト）も指定してください',
			path: ['image_alt'],
		}),
});

export const collections = { posts };
