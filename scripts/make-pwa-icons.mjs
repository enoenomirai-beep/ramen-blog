// PWA 用アイコン（public/pwa/）を生成する開発用スクリプト
//   node scripts/make-pwa-icons.mjs
// favicon.svg と同じ🍜の絵文字を、ブランドカラーの背景に乗せて各サイズの PNG として書き出す。
import path from 'node:path';
import sharp from 'sharp';

const OUT_DIR = path.resolve('public/pwa');

/** @param {number} size @param {number} padding 0〜1（maskable アイコンの安全マージン用） */
function bowlIconSvg(size, padding = 0) {
	const emojiSize = Math.round(size * (1 - padding * 2) * 0.72);
	return `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#a52d14"/>
  <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-size="${emojiSize}">🍜</text>
</svg>`;
}

/** @param {string} svg @param {number} size @param {string} outFile */
async function writePng(svg, size, outFile) {
	await sharp(Buffer.from(svg)).resize(size, size).png().toFile(outFile);
	console.log(`wrote ${path.relative(process.cwd(), outFile)}`);
}

await writePng(bowlIconSvg(192), 192, path.join(OUT_DIR, 'icon-192.png'));
await writePng(bowlIconSvg(512), 512, path.join(OUT_DIR, 'icon-512.png'));
// maskable: OS がアイコンを丸くクロップすることがあるので、絵文字を少し小さく余白を持たせる
await writePng(bowlIconSvg(512, 0.12), 512, path.join(OUT_DIR, 'icon-512-maskable.png'));
await writePng(bowlIconSvg(180), 180, path.join(OUT_DIR, 'apple-touch-icon.png'));
