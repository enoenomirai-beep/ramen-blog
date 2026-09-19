# 作業引き継ぎメモ

最終更新: 2026-09-19（Claude Code セッションからの引き継ぎ）

## プロジェクト概要

ラーメン食べ歩きレビュー専用の静的ブログ「らーめん食べ歩きログ」。
Astro 7.3 + Tailwind CSS 4 + MDX。記事は Content Collections（`src/content/posts/*.md`）で管理。
詳しい使い方は [README.md](../README.md)、構成・規約は [CLAUDE.md](../CLAUDE.md) を参照。

## 完了していること

- [x] プロジェクト初期化、Tailwind / MDX / typography 導入
- [x] Content Collections スキーマ（必須: title / date / shop_name / style / location / rating、任意: image / image_alt / description / menu / price / tags / draft）
- [x] サンプル記事（熊田家・家系・つくばみらい / 極太堂（架空）・二郎系・神保町）。武将家 外伝のサンプルは 2026-09-19 に本物の記事へ置き換え済み
- [x] トップページ：カード一覧、系統タグ・場所・評価で絞り込み、並び替え、URL クエリ同期
- [x] 記事ページ：店舗情報・写真・Markdown 本文
- [x] 写真対応（`<Image>` で最適化）。サンプル画像は `node scripts/make-placeholders.mjs` で生成したダミー
- [x] RSS（`/rss.xml`）、sitemap、OGP / Twitter カード
- [x] レスポンシブ対応（375px で確認済み）
- [x] `astro check` 0 エラー、`npm run build` 成功（7 ページ、2026-09-18 時点）
- [x] GitHub Pages デプロイ準備（2026-09-18）
  - git 2.55 を winget でインストール、`git init -b main` + 初期コミット済み
  - `.github/workflows/deploy.yml`（`withastro/action@v6` + `actions/deploy-pages@v5`）
  - `astro.config.mjs`: `site: 'https://enoenomirai-beep.github.io'`, `base: '/ramen-blog'`
  - サイト内リンクは `src/consts.ts` の `withBase()` 経由に統一（favicon / ヘッダー・フッター / カード / パンくず / 系統リンク / RSS）。ビルド成果物の HTML・rss.xml・sitemap で `/ramen-blog/` プレフィックスを確認済み
  - 旧コピー `ramen-blog/ramen-blog/`（scratch 時代の残骸）を削除
- [x] 記事ページの前後記事ナビ（2026-09-18）: `src/components/PostNav.astro`。`[id].astro` の `getStaticPaths` で日付順に並べて隣の記事を props で渡す
- [x] 記事本文の目次（2026-09-18）: `src/components/TableOfContents.astro`。`render(post)` の `headings` から h2 / h3 を拾って `<details open>` で表示。見出し 2 つ未満なら非表示。見出しに `scroll-mt-6`、`<html>` に `motion-safe:scroll-smooth`
- [x] 系統別ページ（2026-09-18）: `/styles/`（一覧）と `/styles/[style]/`。`src/lib/posts.ts` に `getPublishedPosts()` / `groupByStyle()` / `stylePath()` を切り出し、トップ・RSS・記事ページもこれを使うように統一。記事ページの系統バッジは `/?style=` から系統別ページへ変更、ヘッダーに「系統別」を追加。URL は系統名をそのまま `encodeURIComponent`（`/styles/%E5%AE%B6%E7%B3%BB/`）
- [x] ダークモード（2026-09-18）: `<html data-theme>` 方式。`global.css` の `@custom-variant dark` + `color-scheme`、`BaseLayout` の inline script（localStorage `theme` → OS 設定の順で初期化、ちらつき防止）、`ThemeToggle.astro`（ヘッダー右端、月／太陽アイコンは CSS で出し分け）。全コンポーネントの色クラスに `dark:` を付与
- [x] 写真取り込みスクリプト（2026-09-18）: `scripts/import-photo.mjs`（`npm run photo -- <写真> <スラッグ>`）。EXIF の向きを反映 → メタデータ（GPS 含む）削除 → 長辺 1600px → JPEG q82 で `src/assets/posts/<スラッグ>.jpg` に保存。HEIC は `heic-decode`（libheif の WASM 版）で展開してから sharp に渡す
- [x] 実際の写真に差し替え（2026-09-18）: 武将家 外伝 ← IMG_4090.HEIC（4284×5712 の HEIC → 1200×1600 JPEG 約 260KB、EXIF/GPS なし）。写真に合わせて menu / トッピングの記述を「海苔増し・味玉」に変更。IMG_4073.HEIC はいったん熊田家に付けたが実際は iekei Tokyo の写真だったので、翌日 iekei Tokyo の記事に付け替え、熊田家はダミー画像に戻した。極太堂は架空の店なのでダミー画像のまま。HEIC 対応のため `heic-decode` を devDependency に追加
- [x] **初の本物の記事**（2026-09-19）: `iekei-tokyo-suehirocho.md`（iekei Tokyo 王道家・家系・末広町・2026-09-10 訪問・★5）。ユーザーのメモから作成、写真は IMG_4073.HEIC
- [x] グルメサイト風 UI 改修（2026-09-19）: 暖色パレット（`global.css` のテーマトークン。`dark:` 個別指定をやめてトークンの値切り替えに統一）、トップを横型リスト（`PostListItem.astro`、スマホは縦積み）に変更、`StarRating.astro`（0.5 刻み・半星。スキーマの `rating` も `multipleOf(0.5)` に）、店名を主役にした記事ヘッダーと店舗情報テーブル、本文見出しの装飾（`.article-body`）、写真が無い記事は Unsplash のイメージ画像（`src/lib/placeholder.ts`、「イメージ」ラベル付き）。`PostCard.astro` / `RatingStars.astro` と記事用ダミー画像は削除、`make-placeholders.mjs` は OGP 画像専用に
- [x] 2 本目の本物の記事（2026-09-19）: `bushoya-gaiden-akihabara.md` をサンプルから実際の訪問記事（武将家外伝・2026-09-16・★4.3）に置き換え。写真は IMG_4090.HEIC のまま（ユーザー確認済み）。評価は 0.1 刻み（`multipleOf(0.1)`、`StarRating` は端数ぶん部分塗り）に変更
- [x] `docs/AI-BRIEF.md`（2026-09-19）: ユーザーが Gemini などに現状を共有してプロンプトを考えてもらうためのブリーフ。機能・記事を変えたら毎回更新する（CLAUDE.md に規約追加）
- [x] エリア別・タグ別ページ（2026-09-19、Gemini 作成の指示）: `/locations/`・`/locations/[location]/`・`/tags/`・`/tags/[tag]/`。`posts.ts` に `groupByLocation()` / `groupByTag()` / `locationPath()` / `tagPath()` を追加し、系統別と共通の `TermPosts.astro`（ページ本体）/ `TermCard.astro`（一覧カード）に切り出して 3 分類で使い回す。導線: ヘッダーナビ（系統別・エリア別・タグ）、フッター、記事の場所バッジとタグ、店舗情報の「場所」。ヘッダーはスマホで 2 段（ロゴ+切替 / ナビ）に
- [x] エリアの都道府県ナビ・近接駅検索（2026-09-19）: `src/lib/location-map.ts` を新設（`location` → `{ prefecture, group }` の辞書。未登録の `location` は自動で `prefecture: 'その他'` / `group: 自身の location名` にフォールバック）。`posts.ts` に `groupByPrefecture()` を追加。`/locations/index.astro` を都道府県ごとの `<details>` アコーディオンの中に駅（location）カードを並べる階層表示に変更（ページ数・ルーティングは変わらず、`/locations/[location]/` はそのまま）。新設 `AreaSearchBox.astro`（インクリメンタルサーチ、Vanilla JS）をページ上部に設置。入力値を location・group（近接駅グループ）・prefecture に部分一致させるので、「秋葉原」で検索すると同じ group の「末広町」の記事もヒットする
- [x] エリア検索の双方向化・東京 23 区の駅を大幅追加（2026-09-19）: `location-map.ts` を「エリアグループ名 → { prefecture, stations: string[] }」の構造に全面リファクタリング（旧: 駅名 → { prefecture, group }）。`AREA_GROUPS` に秋葉原・神田／神保町／新宿・代々木／池袋／高田馬場／渋谷／上野・御徒町／新橋／東京・大手町／銀座／中野／高円寺／荻窪／蒲田（すべて東京都）とつくばみらい（茨城県）を登録。駅名 → グループの逆引き `LOCATION_INDEX`（Map）を起動時に構築し、`getLocationInfo()`（互換維持）と新設 `getGroupStations(location)`（同じグループの駅名一覧を返す）を提供。`AreaSearchBox.astro` は記事ごとに `getGroupStations()` の結果を `data-group-stations`（"\|" 区切り）に埋め込み、クライアント側はその中のどれかに入力値が部分一致すればヒットさせる方式に変更。これにより「末広町」で検索しても「秋葉原」の記事がヒットするようになった（旧実装は group ラベルの文字列一致だけで、非対称になるケースがあった）。`posts.ts` / `locations/index.astro` は `getLocationInfo()` の型・戻り値が同じなので無修正
- [x] 店舗情報の拡充: 地図リンク・営業時間・最寄り駅（2026-09-19）: `content.config.ts` に任意項目 `map_url`（`z.url()`）/ `business_hours` / `nearest_station` を追加。`posts/[id].astro` の店舗情報テーブルの型 `meta` に `mapHref` を追加し、「場所」の行に `map_url` があれば値の横に「📍 地図を見る」の外部リンク（`target="_blank" rel="noopener noreferrer"`）を表示。`nearest_station` / `business_hours` はそれぞれ存在する場合だけ行を追加（「場所」の直後・「訪問日」の前）。動作確認用に極太堂（サンプル記事）へダミーの `map_url` / `business_hours` / `nearest_station` を追加
- [x] 記事本文の複数写真ギャラリー（2026-09-19）: `src/components/PhotoGallery.astro` を新設。`photos: { src: ImageMetadata | string; alt: string; caption?: string }[]` を受け取り、スマホ 1 列／sm 以上 2 列のグリッドでサムネイル表示、クリックで Lightbox（拡大表示・前後移動・Esc／オーバーレイクリック／✕ボタンで閉じる、Vanilla JS）を開く。`src` が文字列（Unsplash などのリモート URL）なら `<img>`、`ImageMetadata`（`src/assets/posts/` から import した画像）なら `astro:assets` の `<Image>` で最適化して表示するので、既存の `npm run photo` の仕組みとは独立していて競合しない。MDX の本文中でしか import できないため、動作確認用に熊田家（`kumadaya-tsukubamirai.md` → `.mdx` にリネーム）へ `import PhotoGallery ...` と 4 枚の Unsplash ダミー画像の使用例を追加
- [x] About ページ追加・サンプル記事削除（2026-09-19）: `src/pages/about/index.astro` を新設（`/about/`）。ブログの趣旨と評価基準（★の目安）のダミーテキスト。見出しは記事ページと同じ `.article-body prose` で装飾を統一。`BaseLayout.astro` のヘッダー・フッターのナビに「About」リンクを追加。サンプル記事 `kumadaya-tsukubamirai.mdx`（熊田家）と `gokubutodo-jimbocho.md`（極太堂）を削除。これにより系統は「家系」のみ（二郎系が消滅）、エリアは東京都のみ（茨城県が消滅、秋葉原・末広町の 2 駅）、タグは 5 個に減少（記事 2 本 + トップ + About = 15 ページ、`CLAUDE.md` の検証コメントを更新）。トップの絞り込み・並び替え、系統／エリア／タグ別ページ、エリア検索の双方向性は削除後も正常動作を確認済み
- [x] 関連記事・パンくず・殿堂入りピックアップ・SNS シェア（2026-09-19、ユーザー外出中に自律実装）: 4 コンポーネントを新設
  - `RelatedPosts.astro`: 記事詳細ページ下部。同じ `style` または `location-map.ts` のエリアグループ（`getGroupStations()`）に属する記事を、自身を除いて評価→日付の降順で最大 4 件表示（該当なしなら非表示）
  - `Breadcrumbs.astro`: 記事詳細ページ上部。トップ／都道府県／エリアグループ／店名の階層リンク＋ BreadcrumbList の JSON-LD（`is:inline`）。既存の「記事一覧／系統／店名」の簡易パンくずと置き換え
  - `PickupPosts.astro`: フロントマターに任意項目 `pickup: z.boolean().default(false)` を追加（`content.config.ts`）。`pickup: true` の記事だけをトップページ最上部に 👑 バッジ付きカードで表示（`index.astro` の `PostFilters` セクションより前）。対象が無ければ非表示。動作確認用に iekei Tokyo 王道家（★5.0）へ `pickup: true` を設定
  - `ShareButtons.astro`: 記事詳細ページ下部。X（旧Twitter）の intent リンク（`hashtags=らーめん食べ歩きログ`）と、クリップボードコピーボタン（Vanilla JS、`navigator.clipboard.writeText()`。コピーできたら 2 秒間「コピーしました」のトースト表示）
  - `[id].astro` の構成: パンくず → header（バッジ・星・写真・店舗情報）→ 本文 → ShareButtons → RelatedPosts → PostNav・戻るリンク
  - 色はすべて既存のテーマトークンのみ使用（`dark:` 不使用）。リンクは `withBase()` 経由。記事取得は `getPublishedPosts()` に統一。ルーティング・ページ数は変わらず（15 ページ）
  - 4 機能ともローカルで動作確認済み。スキップした機能は無し
- [x] **公開済み（2026-09-18）**: https://enoenomirai-beep.github.io/ramen-blog/
  - リポジトリ: https://github.com/enoenomirai-beep/ramen-blog（`main`、Pages の Source = GitHub Actions）
  - 本番で確認済み: トップ / 記事 3 ページ / `rss.xml` / `sitemap-index.xml` / favicon / OGP・canonical の URL / 画像の読み込み。コンソールエラーなし

## 運用

- 記事を追加・修正したら `git add` → `git commit` → `git push`。1〜2 分で本番に反映される（Actions タブで進捗を確認できる）
- git が見つからないターミナルでは先頭で `$env:Path = "C:\Program Files\Git\cmd;" + $env:Path`
- ユーザー名やリポジトリ名を変える場合は `astro.config.mjs` の `site` / `base` と、README・CLAUDE.md 内の URL も合わせて直す

## そのほかの次の候補

- 実際の訪問記事を書き続ける（記事の作り方は README「記事の追加方法」。ユーザーからはメモ＋写真パスを受け取って Claude が下書き → PR にする流れが定着）

## 注意事項

- `base: '/ramen-blog'` のため、`href="/..."` の直書きは本番でリンク切れになる。必ず `withBase()` を使う
- Node.js 24 は `C:\Program Files\nodejs`、git は `C:\Program Files\Git\cmd` にある。Claude のツール用シェルでは PATH に入っていないことがあるので、コマンドの先頭で `$env:Path = "C:\Program Files\nodejs;C:\Program Files\Git\cmd;" + $env:Path` を付ける
- dev サーバーは Claude desktop の `preview_start`（`.claude/launch.json` の `astro-dev`）で起動できる（2026-09-18 に確認）。URL は `http://localhost:4321/ramen-blog/`。手動なら `npx astro dev --background` / `npx astro dev stop`
