// 写真の EXIF（撮影日時・GPS 座標）を読み取り、.tmp/latest-exif.json に出力するスクリプト
//   node scripts/extract-exif.mjs <写真ファイル>
//
// 記事作成時に「撮影日時」を date、「GPS 座標」を lat/lng の下書きとして使うためのもの。
// npm run photo（scripts/import-photo.mjs）は取り込んだ写真の EXIF を削除してしまうので、
// このスクリプトは npm run photo より前に、まだ EXIF が残っている元の写真に対して実行する。
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import exifr from 'exifr';

const OUTPUT = path.resolve('.tmp/latest-exif.json');

function usage(message) {
	if (message) console.error(`エラー: ${message}\n`);
	console.error('使い方: node scripts/extract-exif.mjs <写真ファイル>');
	process.exit(1);
}

const [input] = process.argv.slice(2);
if (!input) usage();

let buffer;
try {
	buffer = await readFile(input);
} catch {
	usage(`写真ファイルが見つかりません: ${input}`);
}

// exifr は JPEG / HEIC / TIFF などから EXIF・GPS IFD をまとめて読める
const data = await exifr.parse(buffer, { gps: true, exif: true }).catch(() => null);

const capturedAt = data?.DateTimeOriginal ?? data?.CreateDate ?? null;
const gps = typeof data?.latitude === 'number' && typeof data?.longitude === 'number' ? { lat: data.latitude, lng: data.longitude } : null;

const result = {
	sourceFile: path.resolve(input),
	capturedAt: capturedAt instanceof Date ? capturedAt.toISOString() : null,
	gps,
};

await mkdir(path.dirname(OUTPUT), { recursive: true });
await writeFile(OUTPUT, JSON.stringify(result, null, 2) + '\n');

console.log(`書き出しました: ${path.relative(process.cwd(), OUTPUT)}`);
console.log(`  撮影日時: ${result.capturedAt ?? '(見つかりませんでした)'}`);
console.log(`  GPS座標: ${gps ? `${gps.lat}, ${gps.lng}` : '(見つかりませんでした)'}`);
