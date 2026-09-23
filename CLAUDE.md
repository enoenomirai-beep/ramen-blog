# らーめん食べ歩きログ

ラーメン食べ歩きレビュー専用の静的ブログ（Astro 7 + Tailwind CSS 4 + MDX）。
**作業を始める前に [docs/HANDOFF.md](docs/HANDOFF.md) を読むこと**（進捗・保留事項・次のタスク）。
使い方・記事の追加方法は [README.md](README.md)。
機能や記事を変えたら [docs/AI-BRIEF.md](docs/AI-BRIEF.md)（ユーザーが別の AI に現状を共有するためのブリーフ）も同じ PR で更新する。

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

Node.js は `C:\Program Files\nodejs`。ツール用シェルの PATH に入っていない場合はコマンド先頭で
`$env:Path = "C:\Program Files\nodejs;" + $env:Path` を付ける。

検証は `npx astro check`（型）→ `npm run build`（記事数 + トップ + About + マップ + ランキング + 出費ダッシュボード + 検索 + ギャラリー + 行きたい + 404 + 系統別／エリア別／タグ別（各「一覧 1 + 項目数」）ページと rss.xml / sitemap / search.json / manifest.webmanifest / sw.js が生成されること。`search.json` は API エンドポイントなのでページ数カウントには含まれない。トップページは記事 12 件ごとにページ分割（`src/pages/page/[page].astro`。2026-09-22 時点は 12 件以下なので 2 ページ目以降は生成されない）。2026-09-22 時点で記事 7・系統 2・エリア 6・タグ 9 + トップ + About + マップ + ランキング + 出費ダッシュボード + 検索 + ギャラリー + 行きたい + 404 = 36 ページ）。

## 構成と規約

- 記事: `src/content/posts/*.md`（ファイル名 = URL スラッグ）。スキーマは `src/content.config.ts`
- フロントマターのキーは snake_case（`shop_name`, `image_alt` など）
- zod は `astro/zod` から import（`astro:content` の `z` は Astro 8 で削除予定）
- Tailwind v4: 設定は `src/styles/global.css` の `@theme`。`tailwind.config.js` は無い
- 色は `src/styles/global.css` のテーマトークンで書く：面 `bg-surface` / `bg-surface-raised`（カード）/ `bg-surface-sunken`、文字 `text-ink` / `text-ink-muted` / `text-ink-faint`、線 `border-line` / `border-line-strong`、ブランド `text-brand-fg`（リンク・スコア）、バッジ `bg-chip-brand text-chip-brand-fg` / `bg-chip text-chip-fg`、ヘッダー `bg-header text-header-ink`。固定色は `brand-*`（深い赤）/ `accent-*`（オレンジ）/ `star` / `soy-*`。`stone-*` や `dark:` を直接書かない（ダークモードは `<html data-theme="dark">` でトークンの値が切り替わる。新しい色が必要なら `:root` と `[data-theme="dark"]` の両方にトークンを足す）
- 記事本文の見出し・表・引用の装飾は `global.css` の `.article-body` ルール（`.prose` の上に重ねる。レイヤー外に書いてあるので `prose-*` 修飾子より優先される）
- 画像は `src/assets/posts/` に置き、フロントマターの `image` で相対パス指定。`image` があれば `image_alt` 必須。`image` が無い記事は `src/lib/placeholder.ts` の Unsplash 画像を「イメージ」ラベル付きで出す
- 評価 `rating` は 1〜5 の 0.1 刻み。表示は `StarRating.astro`（端数ぶん星を部分的に塗る）。一覧の 1 行は `PostListItem.astro`
- 記事の取得は `src/lib/posts.ts` の `getPublishedPosts()`（draft 除外・新しい順）を使う。`getCollection` を直接呼ばない。系統／エリア／タグ別の URL は `stylePath()` / `locationPath()` / `tagPath()`、グループ化は `groupByStyle()` / `groupByLocation()` / `groupByTag()`。分類ページの本体は `TermPosts.astro`、一覧カードは `TermCard.astro` を使い回す（新しい分類を足すときも同じ）
- 一覧の絞り込み・並び替えは `src/components/PostFilters.astro` のクライアントスクリプト。カード側は `index.astro` の `<li data-post ...>` の data 属性を読む
- 公開先は GitHub Pages（`https://enoenomirai-beep.github.io/ramen-blog/`）。`astro.config.mjs` の `site` + `base: '/ramen-blog'` から絶対 URL（RSS / sitemap / OGP / canonical）を生成
- サブパス配信なので、サイト内リンク（`/`, `/posts/...`, `/rss.xml`, favicon）は必ず `src/consts.ts` の `withBase()` を通す。`href="/..."` を直書きしない
- 開発サーバーの URL は `http://localhost:4321/ramen-blog/`（ルート `/` は 404 になる）
- `main` への push で `.github/workflows/deploy.yml`（withastro/action）が自動デプロイ
- サンプル画像は `node scripts/make-placeholders.mjs` で再生成できる。実際の写真は `npm run photo -- <写真> <スラッグ>`（`scripts/import-photo.mjs`）で取り込む（縮小・EXIF/GPS 削除、HEIC は `heic-decode` で展開）。元の写真をそのまま `src/assets/posts/` に置かない
- 新規記事を作るとき、ユーザーから元の写真ファイル（`npm run photo` に通す前、EXIF がまだ残っているもの）が渡されたら、先に `npm run exif -- <写真ファイル>`（`scripts/extract-exif.mjs`。`exifr` で EXIF を読む）を実行し、`.tmp/latest-exif.json`（gitignore 済み）の `capturedAt`（撮影日時）を記事の `date` に、`gps.lat` / `gps.lng`（あれば）を `lat` / `lng` に使ってよい。これは写真そのものに埋め込まれた実際のメタデータであり、創作ではない。ただし **`shop_name` / `style` / `location` は GPS 座標や検索結果から推測して埋めない**。これらは必ずユーザーのメモ（店名・系統・場所の記載、または返信での確認）から得る。GPS だけで近隣のラーメン店を検索して「たぶんこの店」と決め打ちすることは、実在店舗のレビューを取り違えるリスクがあるため禁止（迷う場合はユーザーに店名を確認する）
- ラーメンマップ（`/map/`）のピンは、記事のフロントマターに `lat` / `lng`（店舗の正確な緯度経度）があればその座標を使い、無ければ `location-map.ts` のエリア代表座標（駅の目安）にフォールバックする。**ユーザーから新規記事の作成依頼（メモ）を受け取った際は、ウェブ検索等で該当店舗の正確な緯度 (`lat`) と経度 (`lng`) を調べ、フロントマターに記載すること。**確度の高い座標が見つからない場合（ツールの制約で調べられない場合を含む）は、正確な数値を推測で埋めずに `lat` / `lng` を省略し、ユーザーにその旨を伝える（省略時はエリア代表座標にフォールバックされ、ビルドは失敗しない）
- 記事をまたいだ店舗の基本情報（営業時間・定休日・訪問時に注文したメニュー）は `src/data/shops.ts`（記事の id をキーにした辞書）で管理し、`ShopDetailsModal.astro` で記事ページの「店舗情報」見出し横に「ℹ️ 店舗詳細・メニュー」ボタンとして表示する（そのお店のデータが無い記事にはボタンを出さない）。`orderedMenu` は本文の「注文したもの」に書かれている品と価格をそのまま集約したもので、**お店の全メニューではない**。`businessHours` / `regularHoliday` はユーザーが確認して伝えてくれた場合のみ設定する（ウェブ検索などで調べて推測で埋めない。実店舗の営業時間を間違って公開すると来店者に実害が出るため、`lat`/`lng` より一段厳しく扱う）
- ギャラリー（`/gallery/`）は `getPublishedPosts()` の画像を CSS 多段組み（`columns-*` + `break-inside-avoid`）でタイル状に並べる。ヘッダー・フッターのナビに追加済み
- 記事ページの「📍 現在地からの経路を見る」ボタンは、フロントマターに `lat`/`lng` がある記事にのみ表示する。`https://www.google.com/maps/dir/?api=1&destination={lat},{lng}` という外部 URL なので `withBase()` は通さない（サイト内リンクではないため）
- コマンドパレット（`Ctrl+K` / `Cmd+K`、`CommandPalette.astro`。`BaseLayout.astro` に常時マウント）は `/search.json`（`search.json.ts`。店名・タイトル・系統・場所・タグ・評価・URL だけの軽量な記事一覧 API）を開いたときに一度だけ fetch してインクリメンタルサーチする。既存の全文検索（`/search/`、本文まで検索できる）とは役割が違うので使い分ける。入力欄に `/dark` `/light` と打って Enter するとテーマを切り替えるイースターエッグ付き（`ThemeToggle.astro` と同じ方法）
- トップページは `PAGE_SIZE`（`src/consts.ts`、既定 12 件）ごとにページ分割。1 ページ目は `index.astro`（`/`）、2 ページ目以降は `src/pages/page/[page].astro`（`/page/2/` など）が `getStaticPaths()` で生成する。ガチャ・殿堂入りピックアップ・ラーメン草カレンダーは 1 ページ目だけ。`PostFilters` の `styles`/`locations`/`total` はそのページに実際に表示している記事だけを集計する（クライアント側の絞り込みスクリプトが DOM 上の `<li data-post>` しか見ないため、SSR 側の初期表示もそれに合わせる）。ページ送りは `Pagination.astro` を使い回す
- 「行きたい」ボタン（`FavoriteButton.astro`。記事ページの本文下、`ShareButtons` の横）は記事 id を LocalStorage（キー `ramen-blog:favorites`）に保存するだけで、サーバーには送らない。一覧ページ `/favorites/`（`favorites.astro`）はビルド時には中身を決められないので、クライアント側で LocalStorage の id 一覧を読み、`/search.json` から表示用データを引いて組み立てる
- カスタム 404 ページは `src/pages/404.astro`。GitHub Pages は `dist/404.html` を自動でエラーページとして使うので、追加設定は不要
- CSP は `BaseLayout.astro` の `<head>` に `<meta http-equiv="Content-Security-Policy">` として設定している（GitHub Pages はカスタム HTTP レスポンスヘッダーを返せないため、meta タグでの設定が唯一の手段。`frame-ancestors` など meta タグでは効かないディレクティブは書いていない）。テーマ切り替え・Service Worker 登録・コマンドパレット・GA4 設定用の固定インラインスクリプトがあるため `script-src`/`style-src` に `'unsafe-inline'` を含む。外部ドメインは実際に読み込んでいるものだけ許可（`unpkg.com` = Leaflet、`googletagmanager.com` = GA4、`giscus.app` = コメント欄、`images.unsplash.com` = イメージ画像、`tile.openstreetmap.org` = 地図タイル）。新しい外部リソースを追加するときはこのポリシーも更新すること
- `.github/workflows/ci.yml` は PR ごとに `astro check` → `build` を検証する（デプロイはしない。デプロイは `deploy.yml` が `main` への push で担当）。`.github/dependabot.yml` は npm と GitHub Actions の依存を週次でチェック
- 出費ダッシュボード（`/dashboard/`）の「系統別・エリア別の割合」円グラフは `CategoryDonutChart.astro`（CSS の `conic-gradient` のみ・JS/SVG 不要）。色は `bg-surface` 等の暖色テーマトークンとは別枠の、識別用に固定順で用意した6色（`global.css` の `--chart-series-1`〜`6` / `bg-chart-series-1`〜`6`。ブランドの暖色だけでは色同士の区別がつきにくいため）。件数の多い順に割り当て、7件目以降は「その他」にまとめる。色だけに頼らず、必ず凡例にラベル・件数・割合をテキストで併記する。「ラーメンエンゲル係数」（当月のラーメン出費 ÷ `MONTHLY_FOOD_BUDGET`、`src/consts.ts`）は 30%以上・50%以上でメッセージとプログレスバーの色が変わる
- 独自ドメイン化（`astro.config.mjs` の `site`/`base` 変更、`public/CNAME` 追加）は 2026-09-23 に依頼されたが、実際のドメイン名が未定のため保留。着手する際はユーザーに確定したドメイン名を確認してから `site`・`base`・`public/manifest.webmanifest`・`public/sw.js` 内のパス・`public/CNAME` をまとめて変更する（詳細は `docs/HANDOFF.md`）

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
