// 撮った写真を記事用に取り込むスクリプト
//   node scripts/import-photo.mjs <写真ファイル> <記事のスラッグ> [--width 1600] [--force]
//
// やること:
//   - EXIF の回転情報どおりに向きを直したうえで、EXIF（GPS 位置情報や撮影日時など）を全部落とす
//   - 長辺が --width（既定 1600px）に収まるよう縮小（拡大はしない）。縦横比はそのまま
//   - JPEG（品質 82、プログレッシブ）で src/assets/posts/<スラッグ>.jpg に保存
// スマホの写真は 4000px・数 MB あるのが普通なので、そのまま置くと git リポジトリが太る。必ずこれを通す。
import { access, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const POSTS_DIR = path.resolve('src/assets/posts');
const CONTENT_DIR = path.resolve('src/content/posts');

function usage(message) {
	if (message) console.error(`エラー: ${message}\n`);
	console.error('使い方: node scripts/import-photo.mjs <写真ファイル> <記事のスラッグ> [--width 1600] [--force]');
	console.error('  例:  node scripts/import-photo.mjs ~/Pictures/IMG_1234.jpg kumadaya-tsukubamirai');
	process.exit(1);
}

// --- 引数 ---
const args = process.argv.slice(2);
const positional = [];
let width = 1600;
let force = false;
for (let i = 0; i < args.length; i++) {
	const arg = args[i];
	if (arg === '--width') {
		width = Number(args[++i]);
		if (!Number.isInteger(width) || width < 320) usage('--width には 320 以上の整数を指定してください');
	} else if (arg === '--force') {
		force = true;
	} else if (arg.startsWith('--')) {
		usage(`不明なオプション: ${arg}`);
	} else {
		positional.push(arg);
	}
}
const [input, slug] = positional;
if (!input || !slug) usage();
if (!/^[a-z0-9-]+$/.test(slug)) usage('スラッグは英小文字・数字・ハイフンだけにしてください（記事ファイル名と同じ）');

const output = path.join(POSTS_DIR, `${slug}.jpg`);

const exists = async (p) => access(p).then(() => true, () => false);
if (!(await exists(input))) usage(`写真ファイルが見つかりません: ${input}`);
if (!force && (await exists(output))) {
	usage(`${path.relative(process.cwd(), output)} はすでにあります。上書きするなら --force を付けてください`);
}

// --- 変換 ---
let info;
try {
	info = await sharp(input)
		.rotate() // EXIF の Orientation を実際のピクセルに反映（これで回転タグは不要になる）
		.resize({ width, height: width, fit: 'inside', withoutEnlargement: true })
		.jpeg({ quality: 82, progressive: true, mozjpeg: true })
		// .withMetadata() を呼ばないので EXIF / GPS / ICC は出力に含まれない
		.toFile(output);
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	if (/heif|heic|unsupported image format/i.test(message)) {
		console.error('エラー: この形式（HEIC など）は読めません。');
		console.error('  iPhone なら「設定 → カメラ → フォーマット → 互換性優先」にするか、写真アプリから JPEG で書き出してください。');
		process.exit(1);
	}
	throw error;
}

// --- 結果 ---
const before = (await stat(input)).size;
const after = (await stat(output)).size;
const kb = (n) => `${Math.round(n / 1024).toLocaleString('ja-JP')} KB`;
console.log(`保存しました: ${path.relative(process.cwd(), output)}`);
console.log(`  ${info.width} x ${info.height} px, ${kb(before)} → ${kb(after)}`);

const postFile = ['md', 'mdx'].map((ext) => path.join(CONTENT_DIR, `${slug}.${ext}`));
const hasPost = (await Promise.all(postFile.map(exists))).some(Boolean);
if (!hasPost) {
	console.log(`\n注意: 記事 src/content/posts/${slug}.md はまだありません（スラッグの綴りを確認してください）。`);
}
console.log('\n記事のフロントマターに以下を書いてください（image_alt は写真の説明に書き換える）:');
console.log(`  image: ../../assets/posts/${slug}.jpg`);
console.log('  image_alt: "〇〇のラーメン（並）。…"');
