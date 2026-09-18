// サンプル記事用のプレースホルダー画像と OGP 用デフォルト画像を生成する開発用スクリプト
//   node scripts/make-placeholders.mjs
// 実際の写真を用意したら src/assets/posts/ のファイルを差し替えるだけでよい。
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const POSTS_DIR = path.resolve('src/assets/posts');
const ASSETS_DIR = path.resolve('src/assets');

/** @typedef {{ label: string; sub?: string; bg: [string, string]; soup: string; bowl: string }} Palette */

/** @type {(Palette & { slug: string })[]} */
const postImages = [
	{
		slug: 'kumadaya-tsukubamirai',
		label: 'KUMADAYA',
		bg: ['#fde68a', '#f59e0b'],
		soup: '#b45309',
		bowl: '#1c1917',
	},
	{
		slug: 'bushoya-gaiden-akihabara',
		label: 'BUSHOYA GAIDEN',
		bg: ['#fecaca', '#dc2626'],
		soup: '#7c2d12',
		bowl: '#292524',
	},
	{
		slug: 'gokubutodo-jimbocho',
		label: 'GOKUBUTODO',
		bg: ['#d9f99d', '#65a30d'],
		soup: '#78350f',
		bowl: '#f5f5f4',
	},
];

/** OGP 用（1200x630）。サイト全体のデフォルト画像 */
/** @type {Palette} */
const ogImage = {
	label: 'RAMEN TABEARUKI LOG',
	sub: 'RAMEN REVIEWS BY STYLE, LOCATION &amp; RATING',
	bg: ['#fed7aa', '#ea580c'],
	soup: '#9a3412',
	bowl: '#1c1917',
};

/**
 * @param {Palette} p
 * @param {number} width
 * @param {number} height
 */
function bowlSvg({ label, sub = 'SAMPLE PHOTO', bg, soup, bowl }, width, height) {
	const cx = width / 2;
	const cy = height / 2 + 40;
	const noodles = Array.from({ length: 7 }, (_, i) => {
		const y = cy - 60 + i * 18;
		return `<path d="M${cx - 200} ${y} q 50 -20 100 0 t 100 0 t 100 0 t 100 0" fill="none" stroke="#fef3c7" stroke-width="9" stroke-linecap="round" opacity="0.9"/>`;
	}).join('');

	return `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg[0]}"/>
      <stop offset="1" stop-color="${bg[1]}"/>
    </linearGradient>
    <radialGradient id="soup" cx="0.5" cy="0.4" r="0.7">
      <stop offset="0" stop-color="${soup}" stop-opacity="0.75"/>
      <stop offset="1" stop-color="${soup}"/>
    </radialGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>

  <!-- 器 -->
  <ellipse cx="${cx}" cy="${cy + 120}" rx="330" ry="60" fill="#000" opacity="0.15"/>
  <path d="M${cx - 320} ${cy} a 320 200 0 0 0 640 0 z" fill="${bowl}"/>
  <ellipse cx="${cx}" cy="${cy}" rx="320" ry="90" fill="${bowl}"/>
  <ellipse cx="${cx}" cy="${cy}" rx="290" ry="72" fill="url(#soup)"/>

  <!-- 麺 -->
  ${noodles}

  <!-- 海苔 -->
  <rect x="${cx - 270}" y="${cy - 110}" width="70" height="120" rx="6" fill="#111827" transform="rotate(-8 ${cx - 235} ${cy - 50})"/>
  <rect x="${cx - 210}" y="${cy - 120}" width="70" height="120" rx="6" fill="#1f2937" transform="rotate(-2 ${cx - 175} ${cy - 60})"/>

  <!-- ほうれん草 -->
  <ellipse cx="${cx + 190}" cy="${cy - 20}" rx="70" ry="34" fill="#166534"/>
  <ellipse cx="${cx + 210}" cy="${cy - 38}" rx="55" ry="26" fill="#15803d"/>

  <!-- チャーシュー -->
  <circle cx="${cx + 60}" cy="${cy - 30}" r="80" fill="#f9a8d4"/>
  <circle cx="${cx + 60}" cy="${cy - 30}" r="62" fill="#fb7185"/>
  <circle cx="${cx + 60}" cy="${cy - 30}" r="18" fill="#fecdd3"/>

  <!-- 味玉 -->
  <ellipse cx="${cx - 90}" cy="${cy + 10}" rx="52" ry="40" fill="#fff7ed"/>
  <ellipse cx="${cx - 90}" cy="${cy + 12}" rx="30" ry="22" fill="#f59e0b"/>

  <!-- ねぎ -->
  <circle cx="${cx - 20}" cy="${cy + 40}" r="7" fill="#4ade80"/>
  <circle cx="${cx + 5}" cy="${cy + 52}" r="6" fill="#22c55e"/>
  <circle cx="${cx + 130}" cy="${cy + 45}" r="7" fill="#4ade80"/>
  <circle cx="${cx - 150}" cy="${cy + 35}" r="6" fill="#22c55e"/>

  <!-- ラベル -->
  <text x="${cx}" y="120" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="700" fill="#ffffff" opacity="0.95" letter-spacing="6">${label}</text>
  <text x="${cx}" y="${height - 50}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#ffffff" opacity="0.8" letter-spacing="3">${sub}</text>
</svg>`;
}

/**
 * @param {string} svg
 * @param {string} outFile
 */
async function writeJpeg(svg, outFile) {
	await sharp(Buffer.from(svg)).jpeg({ quality: 82, mozjpeg: true }).toFile(outFile);
	console.log(`wrote ${path.relative(process.cwd(), outFile)}`);
}

await mkdir(POSTS_DIR, { recursive: true });

for (const img of postImages) {
	await writeJpeg(bowlSvg(img, 1200, 800), path.join(POSTS_DIR, `${img.slug}.jpg`));
}
await writeJpeg(bowlSvg(ogImage, 1200, 630), path.join(ASSETS_DIR, 'og-default.jpg'));
