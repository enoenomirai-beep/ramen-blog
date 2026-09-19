import path from 'node:path';
import fs from 'node:fs/promises';
import type { APIRoute } from 'astro';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { getPublishedPosts } from '../../lib/posts';

/**
 * 記事ごとの OGP 画像（1200x630）をビルド時に静的生成するエンドポイント。
 *
 * 「店舗名」「評価（★）」「系統」を、テーマの暖色パレットを敷いた背景に重ねる。
 * satori（HTML/CSS 風のオブジェクトを SVG に変換）→ resvg（SVG を PNG に変換）の
 * 2 段構成。satori はブラウザの CSS 変数を解決できないため、色は
 * `src/styles/global.css` の :root の値をそのまま数値で書く。
 */
export async function getStaticPaths() {
	const posts = await getPublishedPosts();
	return posts.map((post) => ({ params: { slug: post.id } }));
}

const FONT_DIR = path.join(process.cwd(), 'node_modules/@fontsource/noto-sans-jp/files');
const [fontRegular, fontBold] = await Promise.all([
	fs.readFile(path.join(FONT_DIR, 'noto-sans-jp-japanese-400-normal.woff')),
	fs.readFile(path.join(FONT_DIR, 'noto-sans-jp-japanese-700-normal.woff')),
]);

// global.css の :root トークンと揃えた固定値（satori は CSS 変数を解決できない）
const COLOR = {
	brand700: '#a52d14',
	brand600: '#c8391a',
	accent500: '#f5820d',
	star: '#f5a623',
	white: '#ffffff',
	chipBg: 'rgba(255,255,255,0.16)',
};

// StarRating.astro と同じ星の SVG パス。フォントに star の字形が無いため文字ではなく図形で描く
const STAR_PATH = 'M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L10 14.9l-5.3 2.8 1.1-5.9L1.5 7.7l5.9-.8L10 1.5z';
function starNode(filled: boolean) {
	return {
		type: 'svg',
		props: {
			viewBox: '0 0 20 20',
			width: 46,
			height: 46,
			style: { marginRight: '6px' },
			children: [{ type: 'path', props: { d: STAR_PATH, fill: filled ? COLOR.star : COLOR.chipBg } }],
		},
	};
}

export const GET: APIRoute = async ({ params }) => {
	const posts = await getPublishedPosts();
	const post = posts.find((p) => p.id === params.slug);
	if (!post) return new Response('Not found', { status: 404 });

	const { shop_name, style, rating } = post.data;
	const filledStars = Math.round(rating);

	const node = {
		type: 'div',
		props: {
			style: {
				width: '1200px',
				height: '630px',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				padding: '64px',
				background: `linear-gradient(135deg, ${COLOR.brand700} 0%, ${COLOR.brand600} 55%, ${COLOR.accent500} 100%)`,
				fontFamily: 'Noto Sans JP',
			},
			children: [
				{
					type: 'div',
					props: {
						style: { display: 'flex', alignItems: 'center' },
						children: [
							{
								type: 'span',
								props: {
									style: {
										display: 'flex',
										fontSize: '30px',
										fontWeight: 700,
										color: COLOR.white,
										letterSpacing: '-0.01em',
									},
									children: 'らーめん食べ歩きログ',
								},
							},
						],
					},
				},
				{
					type: 'div',
					props: {
						style: { display: 'flex', flexDirection: 'column', gap: '20px' },
						children: [
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										alignSelf: 'flex-start',
										padding: '8px 28px',
										borderRadius: '999px',
										background: COLOR.chipBg,
										color: COLOR.white,
										fontSize: '28px',
										fontWeight: 700,
									},
									children: style,
								},
							},
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										fontSize: '74px',
										fontWeight: 900,
										color: COLOR.white,
										lineHeight: 1.25,
										letterSpacing: '-0.02em',
										maxWidth: '1000px',
									},
									children: shop_name,
								},
							},
							{
								type: 'div',
								props: {
									style: { display: 'flex', alignItems: 'center', gap: '16px' },
									children: [
										{
											type: 'div',
											props: {
												style: { display: 'flex' },
												children: Array.from({ length: 5 }, (_, i) => starNode(i < filledStars)),
											},
										},
										{
											type: 'span',
											props: {
												style: { display: 'flex', fontSize: '42px', fontWeight: 700, color: COLOR.white },
												children: rating.toFixed(1),
											},
										},
									],
								},
							},
						],
					},
				},
			],
		},
	};

	const svg = await satori(node, {
		width: 1200,
		height: 630,
		fonts: [
			{ name: 'Noto Sans JP', data: fontRegular, weight: 400, style: 'normal' },
			{ name: 'Noto Sans JP', data: fontBold, weight: 700, style: 'normal' },
		],
	});

	const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
	const png = resvg.render().asPng();

	return new Response(new Uint8Array(png), {
		headers: { 'Content-Type': 'image/png' },
	});
};
