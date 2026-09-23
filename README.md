# 🍜 らーめん食べ歩きログ

Astro + Tailwind CSS で作ったラーメン食べ歩きレビュー専用の静的ブログです。
記事は Astro の Content Collections で管理し、Markdown / MDX で書けます。

**公開中**: https://enoenomirai-beep.github.io/ramen-blog/

## 技術的なハイライト

個人開発の中でも判断や工夫が必要だった部分です。

- **ビルド時の動的 OGP 画像生成**（[`src/pages/og/[slug].png.ts`](<src/pages/og/[slug].png.ts>)）
  記事ごとに店名・評価（★）・系統を暖色グラデーションに重ねた 1200×630 の PNG を、外部サービスを使わずビルド時に生成しています。[satori](https://github.com/vercel/satori)（オブジェクトツリー → SVG）と [`@resvg/resvg-js`](https://github.com/yisibl/resvg-js)（SVG → PNG）を組み合わせ、日本語フォントは Google Fonts への実行時フェッチではなく `@fontsource/noto-sans-jp` を `node_modules` から直接 `fs.readFile` して埋め込むことで、ネットワーク無しでも再現可能なビルドにしています。フォントの `japanese` サブセットでないと大半の漢字が欠けること、Noto Sans JP に ★ や絵文字のグリフが無く文字化けする（tofu 化する）ことに気づき、★ は文字ではなく SVG パスで描画するよう変更しました。
- **PWA 対応の再検討**（[`public/sw.js`](public/sw.js) / [`public/manifest.webmanifest`](public/manifest.webmanifest)）
  当初 `@vite-pwa/astro` の導入を試みましたが、ビルドは通るものの生成 HTML に `<link rel="manifest">` や Service Worker 登録スクリプトが一切挿入されず（Astro 7 の静的ビルドパイプラインとの非対応と判断）、動作検証で気づいて撤去しました。代わりに `manifest.webmanifest` と Service Worker を手書きし、キャッシュ優先＋バックグラウンド更新の戦略を自前で実装しています。ライブラリに依存する前に実際の出力を検証する重要性を再確認した箇所です。
- **SEO 構造化データ（JSON-LD）**（[`src/pages/posts/[id].astro`](<src/pages/posts/[id].astro>)）
  schema.org の `Review` / `Restaurant` / `Rating` をマッピングし、検索結果に★評価のリッチリザルトが出ることを狙っています。パンくずリストの `BreadcrumbList` も別途出力し、`BaseLayout.astro` には任意のページから汎用的に構造化データを渡せる仕組みを用意しています。
- **外部ライブラリ無しの全文検索**（[`src/pages/search.astro`](src/pages/search.astro)）
  Algolia や Pagefind のような検索サービス／ライブラリを使わず、ビルド時に全記事をあらかじめ非表示で埋め込み、クライアント側の文字列マッチだけで検索する設計にしています。記事数が数百件規模になるまではこの方式で十分軽量に動作し、依存を増やさずに済みます。
- **Geolocation × Haversine 公式による現在地検索**（[`src/pages/map.astro`](src/pages/map.astro)）
  `navigator.geolocation` で現在地を取得し、Haversine 公式で全店舗との距離を計算、近い順に表示します。地図ライブラリ（Leaflet）は CDN 経由で読み込み、npm 依存を増やさない選択をしています。
- **GitHub Actions による CI/CD**（[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)）
  `main` への push をトリガーに `astro check`（型チェック）を通した上でビルド・GitHub Pages への自動デプロイを行います。

## 技術スタック

- [Astro](https://astro.build) v7（静的出力・Content Collections）
- [Tailwind CSS](https://tailwindcss.com) v4（`@tailwindcss/vite` 経由）+ `@tailwindcss/typography`
- TypeScript（strict）
- `@astrojs/mdx`（MDX 記事対応）
- `@astrojs/rss`（`/rss.xml`）・`@astrojs/sitemap`（`/sitemap-index.xml`）
- [satori](https://github.com/vercel/satori) + [`@resvg/resvg-js`](https://github.com/yisibl/resvg-js) + `@fontsource/noto-sans-jp`（ビルド時の動的 OGP 画像生成）
- [Leaflet](https://leafletjs.com)（CDN 経由。ラーメンマップ）
- [Giscus](https://giscus.app)（GitHub Discussions を使ったコメント欄）
- GitHub Actions（CI/CD）

## 機能

- **記事一覧・絞り込み**：系統タグ・場所・評価（★n 以上）で絞り込み、新しい順／古い順／評価順で並び替え。条件は URL クエリに同期されるので、絞り込んだ状態のままリンクを共有できます。12 件ごとのページネーション（`/page/2/` など）、「今日の一杯ガチャ」ボタン、殿堂入りピックアップ、ラーメン草カレンダー（GitHub Contributions 風）も表示
- **記事ページ**：店名を主役にしたヘッダー、星評価（0.1 刻み）、読了時間の目安、店舗情報の表（地図リンク・営業時間・最寄り駅）、店舗詳細モーダル（営業時間・定休日・訪問時に注文したメニュー）、Googleマップ経路検索ボタン（`lat`/`lng` がある記事のみ）、「行きたい」ボタン（LocalStorage、`/favorites/` で一覧確認）、動的 OGP 画像、Review 構造化データ（JSON-LD）、目次、複数写真ギャラリー（Lightbox）、系統別の概算カロリー・PFC を表示する「免罪符メーター」、SNS シェア、関連記事、前後記事ナビ、Giscus コメント欄
- **分類ページ**：系統別・エリア別・タグ別（`/styles/` `/locations/` `/tags/`）。エリア別ページは近接駅・鉄道路線名でも検索できるインクリメンタルサーチ付き
- **全文検索**（`/search/`）：店名・本文・系統・場所・タグなどのキーワードで検索
- **コマンドパレット**（`Ctrl+K` / `Cmd+K`）：どのページからでも開ける検索モーダル。店名・系統・場所・タグにインクリメンタルサーチしてジャンプ。`/dark` `/light` でテーマ切り替えのイースターエッグ付き
- **ギャラリー**（`/gallery/`）：全記事の一杯の写真だけを Masonry 風にタイル表示。ホバーで店名・評価が浮かび上がる
- **ラーメンマップ**（`/map/`）：Leaflet で全店舗をピン留め。現在地からの距離順検索も可能
- **マイベスト・ランキング**（`/ranking/`）：評価降順のランキング
- **出費ダッシュボード**（`/dashboard/`）：会計額の集計・月別推移グラフ、系統別・エリア別の割合（円グラフ）、当月のラーメン出費が目標食費に占める割合を示す「ラーメンエンゲル係数」
- **PWA 対応**：ホーム画面に追加してアプリのように使える（オフラインキャッシュ対応の Service Worker）
- **カスタム 404 ページ / CSP**：`src/pages/404.astro` と、`<meta http-equiv>` による Content-Security-Policy（GitHub Pages はカスタム HTTP ヘッダーを設定できないため）
- **CI / Dependabot**：PR ごとに型チェック・ビルドを検証する GitHub Actions（`.github/workflows/ci.yml`）と、依存パッケージの週次自動更新（`.github/dependabot.yml`）
- **ダークモード**：初回は OS の設定に従い、ヘッダー右端の月／太陽ボタンで切り替え（選択はブラウザに保存）。色は `src/styles/global.css` のテーマトークンで一元管理
- **アフィリエイト・広告カード / 内部リンクカード**：MDX 記事内に埋め込める `AffiliateCard` / `BlogCard` コンポーネント（収益化・回遊率向上の土台）
- RSS フィード、sitemap、OGP / Twitter カード、GA4 アクセス解析、スマホ用フローティング CTA

## 公開（GitHub Pages）

`main` ブランチに push すると GitHub Actions（[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)）が
ビルドして GitHub Pages に公開します。公開 URL は `https://enoenomirai-beep.github.io/ramen-blog/` です。

初回だけ、GitHub のリポジトリ設定 **Settings → Pages → Build and deployment → Source** を
**GitHub Actions** にしてください。

公開 URL は `astro.config.mjs` の `site` と `base` で決まります。
RSS・sitemap・canonical・OGP の絶対 URL はすべてこの値から生成されるので、
リポジトリ名やアカウントを変えたらここも変更してください。

```js
site: 'https://<ユーザー名>.github.io',
base: '/<リポジトリ名>',
```

サブパス（`base`）で配信しているため、サイト内リンクを書くときは
`src/consts.ts` の `withBase('/posts/foo/')` を通してください（`/ramen-blog/posts/foo/` になります）。
開発サーバーでも同じく `http://localhost:4321/ramen-blog/` で開きます。

`public/manifest.webmanifest` と `public/sw.js` は Astro の処理を通らない手書きの静的ファイルなので、
`base` を変える場合はこの 2 ファイル内の `/ramen-blog` も直接書き換える必要があります。

GA4 アクセス解析を有効にする場合は、GitHub リポジトリの Settings → Secrets and variables → Actions →
Variables に `PUBLIC_GA_MEASUREMENT_ID`（`G-XXXXXXXXXX` 形式）を追加してください（未設定の間は計測タグを出力しません）。

## コマンド

| コマンド | 内容 |
| :--- | :--- |
| `npm install` | 依存パッケージをインストール |
| `npm run dev` | 開発サーバーを起動（`http://localhost:4321/ramen-blog/`） |
| `npm run build` | 本番用ビルドを `./dist/` に出力 |
| `npm run preview` | ビルド結果をローカルでプレビュー |
| `npx astro check` | 型チェック |
| `npm run photo -- <写真> <スラッグ>` | 写真を記事用に取り込み（縮小・EXIF 削除） |

## ディレクトリ構成

```text
/
├── public/
│   ├── manifest.webmanifest    # PWA マニフェスト（手書き。base を直接文字列で持つ）
│   ├── sw.js                   # Service Worker（手書き。base を直接文字列で持つ）
│   └── pwa/                    # PWA アイコン（scripts/make-pwa-icons.mjs で生成）
├── src/
│   ├── assets/
│   │   ├── og-default.jpg      # OGP のデフォルト画像
│   │   └── posts/              # 記事の写真
│   ├── components/
│   │   ├── AffiliateCard.astro     # MDX 用アフィリエイト・広告カード
│   │   ├── AreaSearchBox.astro     # エリアの近接駅・沿線検索
│   │   ├── BlogCard.astro          # MDX 用内部リンクカード
│   │   ├── Breadcrumbs.astro       # パンくず + BreadcrumbList JSON-LD
│   │   ├── CalorieMeter.astro      # 免罪符メーター（系統別カロリー・PFC）
│   │   ├── CategoryDonutChart.astro # 出費ダッシュボードの円グラフ（系統別・エリア別）
│   │   ├── Comments.astro          # Giscus コメント欄
│   │   ├── CommandPalette.astro    # Ctrl+K コマンドパレット
│   │   ├── ContributionCalendar.astro # ラーメン草カレンダー
│   │   ├── FavoriteButton.astro    # 「行きたい」ボタン（LocalStorage）
│   │   ├── FloatingCTA.astro       # スマホ用フローティング CTA
│   │   ├── GoogleAnalytics.astro   # GA4 計測タグ
│   │   ├── Pagination.astro        # 記事一覧のページ送り
│   │   ├── PhotoGallery.astro      # 記事本文の複数写真・Lightbox
│   │   ├── PickupPosts.astro       # 殿堂入りピックアップ
│   │   ├── PostFilters.astro       # 絞り込み・並び替え UI
│   │   ├── PostListItem.astro      # 記事一覧の 1 行
│   │   ├── PostNav.astro           # 記事ページの前後記事ナビ
│   │   ├── RelatedPosts.astro      # 関連記事
│   │   ├── ShareButtons.astro      # SNS シェア + URL コピー
│   │   ├── ShopDetailsModal.astro  # 店舗詳細モーダル（データは src/data/shops.ts）
│   │   ├── StarRating.astro        # 星評価（0.1 刻み）
│   │   ├── TableOfContents.astro   # 記事本文の目次
│   │   ├── TermCard.astro          # 系統／エリア／タグ別一覧のカード
│   │   ├── TermPosts.astro         # 系統／エリア／タグ別ページの本体
│   │   └── ThemeToggle.astro       # ライト／ダーク切り替えボタン
│   ├── content/
│   │   └── posts/              # ★ 記事（.md / .mdx）を置く場所
│   ├── data/
│   │   └── shops.ts            # 店舗の基本情報（営業時間・定休日・注文したメニュー）
│   ├── layouts/
│   │   └── BaseLayout.astro    # 共通レイアウト（ヘッダー／フッター／OGP／PWA／GA4）
│   ├── lib/
│   │   ├── location-map.ts     # エリアグループ・近接駅・鉄道路線・地図座標
│   │   ├── markdown.ts         # Markdown 生ソースからプレーンテキストを取り出す
│   │   ├── nutrition.ts        # 系統別の概算カロリー・PFC
│   │   ├── placeholder.ts      # 写真が無い記事用のイメージ画像（Unsplash）
│   │   ├── posts.ts            # 記事の取得・グループ化（各ページ共通）
│   │   └── reading-time.ts     # 読了時間の目安を計算
│   ├── pages/
│   │   ├── index.astro         # トップページ（記事一覧 + 絞り込み + ガチャ）
│   │   ├── posts/[id].astro    # 記事詳細ページ
│   │   ├── search.astro        # 全文検索
│   │   ├── search.json.ts      # コマンドパレット・行きたい一覧用の軽量な記事インデックス API
│   │   ├── gallery.astro       # 画像だけのギャラリー
│   │   ├── favorites.astro     # 「行きたい」一覧（LocalStorage）
│   │   ├── page/[page].astro   # 記事一覧 2 ページ目以降（/page/2/ など）
│   │   ├── map.astro           # ラーメンマップ
│   │   ├── ranking.astro       # マイベスト・ランキング
│   │   ├── dashboard.astro     # 出費ダッシュボード
│   │   ├── about/              # About ページ
│   │   ├── styles/             # 系統別（index = 一覧、[style] = 系統ごとの記事）
│   │   ├── locations/          # エリア別（index / [location]）
│   │   ├── tags/                # タグ別（index / [tag]）
│   │   ├── og/[slug].png.ts    # 記事ごとの動的 OGP 画像
│   │   ├── rss.xml.ts          # RSS フィード
│   │   └── 404.astro           # カスタム 404 ページ
│   ├── styles/global.css       # Tailwind の読み込み、配色トークン、本文の見出し装飾
│   ├── consts.ts               # サイト名などの定数、withBase()（base 付きリンク）
│   └── content.config.ts       # Content Collections のスキーマ定義
├── .github/
│   ├── workflows/deploy.yml       # GitHub Pages への自動デプロイ（astro check → build → deploy）
│   ├── workflows/ci.yml           # PR ごとの astro check → build 検証（デプロイはしない）
│   └── dependabot.yml             # npm・GitHub Actions の依存を週次チェック
├── scripts/
│   ├── import-photo.mjs           # 写真の取り込み（縮小・EXIF 削除、HEIC 対応）
│   ├── make-placeholders.mjs      # OGP 用デフォルト画像の生成
│   └── make-pwa-icons.mjs         # PWA アイコンの生成
└── astro.config.mjs               # site / base（公開 URL）・統合の設定
```

## 記事の追加方法

`src/content/posts/` に Markdown（`.md`）または MDX（`.mdx`）ファイルを追加するだけです。
ファイル名（拡張子を除く）が URL になります（例: `kumadaya-tsukubamirai.md` → `/posts/kumadaya-tsukubamirai/`）。

```md
---
title: "記事のタイトル"
date: 2026-09-06          # 訪問日または公開日
shop_name: "熊田家"        # ラーメン店の名前
style: "家系"              # 系統（トップページの絞り込みタグに自動で追加されます）
location: "つくばみらい"   # お店の場所
rating: 4.3               # 5段階評価（1〜5、0.1 刻み）
# --- 以下は任意 ---
image: ../../assets/posts/kumadaya-tsukubamirai.jpg   # 一杯の写真（記事ファイルからの相対パス）
image_alt: "写真の説明"                                  # image を指定した場合は必須
description: "一覧カードに表示する短い説明"
menu: "ラーメン（並）・味濃いめ"
price: 950
tags: ["豚骨醤油", "自家製麺"]
pickup: false             # true にするとトップページ上部の殿堂入りピックアップに表示
visits: 1                 # 2 以上にすると「🔥 訪問n回」バッジが出る
features: []              # 特徴タグ（例: ["深夜営業", "通し営業"]）
draft: false              # true にすると一覧・ビルドから除外
---

本文を Markdown で書きます。
```

MDX（`.mdx`）ファイルにすると、本文中に `PhotoGallery` / `AffiliateCard` / `BlogCard` コンポーネントを
`import` して埋め込めます。

### フロントマターの必須項目

| プロパティ  | 型             | 説明                             |
| :---------- | :------------- | :------------------------------- |
| `title`     | string         | 記事のタイトル                   |
| `date`      | date           | 訪問日または公開日               |
| `shop_name` | string         | ラーメン店の名前                 |
| `style`     | string         | ラーメンの系統（例: `"家系"`）   |
| `location`  | string         | お店の場所                       |
| `rating`    | number（1〜5、0.1 刻み） | 5段階評価のスコア。4.3 なら 5 つ目の星が 30% 塗られる |

スキーマは [`src/content.config.ts`](src/content.config.ts) で定義しており、
必須項目が欠けていたり型が違う場合はビルド時にエラーになります。

`nearest_station`（最寄り駅）と `business_hours`（営業時間）は、単純な文字列のほかに、より詳しい書き方にも対応しています。

```yaml
nearest_station: ["秋葉原駅", "末広町駅"]   # 複数の最寄り駅を配列で指定できる（「・」区切りで表示）
business_hours:                              # 曜日によって営業時間が違う場合は配列で指定できる
  - days: ["月", "火", "水", "木", "金"]
    hours: "11:00〜15:00 / 17:00〜21:00"
  - days: ["土", "日"]
    hours: "11:00〜21:00（通し営業）"
```

連続した曜日（`["月","火","水","木","金"]` など）は「月〜金」のようにまとめて表示されます（[`src/lib/business-hours.ts`](src/lib/business-hours.ts)）。

エリア別ページの近接駅検索・沿線検索・地図のピン座標を有効にするには、
`location` に指定した場所を [`src/lib/location-map.ts`](src/lib/location-map.ts) の `AREA_GROUPS` にも登録してください
（未登録でもビルドは失敗しません。「その他」扱いになるだけです）。

### 写真の追加

スマホで撮った写真は取り込みスクリプトを通してから置きます（そのまま置くと数 MB のファイルと GPS 位置情報が
リポジトリに入ってしまいます）。

```bash
npm run photo -- <写真ファイル> <記事のスラッグ>
# 例: npm run photo -- "C:\Users\you\Pictures\IMG_1234.HEIC" kumadaya-tsukubamirai
```

これで `src/assets/posts/<スラッグ>.jpg` が作られます（EXIF の向きを反映したうえで位置情報などのメタデータを削除、
長辺 1600px に縮小、JPEG 品質 82）。上書きは `--force`、サイズ変更は `--width 1200` のように指定します。
iPhone の HEIC もそのまま渡せます（JPEG / PNG / WebP / HEIC 対応）。

そのあと、フロントマターに `image`（記事ファイルからの相対パス）と `image_alt`（写真の説明）を書きます。

`npm run photo` は EXIF を消してしまうので、`date` や `lat` / `lng` を写真の撮影日時・GPS 座標から埋めたい場合は、
先に元の写真（EXIF が残っている状態）に対して `npm run exif -- <写真ファイル>` を実行します（`scripts/extract-exif.mjs`）。
`.tmp/latest-exif.json` に撮影日時と GPS 座標が出力されます（`shop_name` などの店舗情報は EXIF からはわからないので、
別途フロントマターに書いてください）。
推奨は 3:2 前後の横向きですが、縦写真でも中央でトリミングして表示されます。

画像は Astro の `<Image>` でビルド時に WebP へ変換・リサイズされ、一覧カードと記事ページの両方に表示されます。
`image` を省略した記事には Unsplash のラーメン写真がイメージ画像として出ます（一覧・記事ページとも「イメージ」のラベル付き。写真の候補は `src/lib/placeholder.ts`）。
既存の写真を差し替えるには、記事のスラッグを指定して上のコマンドを `--force` 付きで実行するだけです。
