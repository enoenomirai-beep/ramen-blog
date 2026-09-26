# らーめん食べ歩きログ — 現状ブリーフ（他の AI に渡す用）

最終更新: 2026-09-26（Google AdSense（Auto ads）を設定・稼働開始。CSPにAdSense関連ドメインを追加。同日、もしもアフィリエイトの「かんたんリンク」（実データ・楽天市場の商品3点）を武将家外伝の記事に実際に埋め込み、AffiliateCardのフロントマター自動表示・汎用広告プレースホルダー AdBanner も追加済み。独自ドメイン `eno-ramen.com` への移行は2026-09-25に完全完了済み。ページ数は変わらず36ページ）

このファイルは、プロジェクトの現状を **別の AI（Gemini など）に共有して次の指示（プロンプト）を考えてもらう**ためのまとめです。
実装は Claude Code が行い、変更のたびにこのファイルも更新します。
最新版はいつでもここ: https://raw.githubusercontent.com/enoenomirai-beep/ramen-blog/main/docs/AI-BRIEF.md

## 1. 何のプロジェクトか

- ラーメン食べ歩きレビュー専用の静的ブログ「らーめん食べ歩きログ」
- 公開 URL: https://eno-ramen.com/（独自ドメイン。ホスティングは GitHub Pages、`public/CNAME` でカスタムドメイン指定。2026-09-23 に旧 URL `https://enoenomirai-beep.github.io/ramen-blog/` から移行）
- リポジトリ: https://github.com/enoenomirai-beep/ramen-blog（公開。リポジトリ名・URL は変更なし）
- 技術: Astro 7（静的出力）+ Tailwind CSS 4 + MDX。GitHub Pages に GitHub Actions で自動デプロイ（`main` に push → 1〜2 分で公開）

## 2. 実装済みの機能

| 領域 | 内容 |
|---|---|
| 記事 | Markdown（`src/content/posts/*.md`）。フロントマター: `title` / `date` / `shop_name` / `style`（系統）/ `location` / `rating`（1〜5、0.1 刻み）/ `image` / `image_alt` / `description` / `menu` / `price` / `tags` / `map_url` / `business_hours` / `nearest_station` / `pickup` / `visits`（訪問回数、既定 1）/ `features`（特徴タグの配列）/ `draft` |
| ラーメン出費ダッシュボード | `/dashboard/`。全記事の `price`（会計額。未記入は 1 杯の目安額 ¥800 でフォールバック）を集計し、「今年の投資総額」「平均単価」「総投資額」の 3 枚のカードと、月別の出費合計を**棒グラフ＋表**で表示。**「ラーメンエンゲル係数」**（当月のラーメン出費 ÷ 月間の目標食費 `MONTHLY_FOOD_BUDGET`＝¥50,000、`src/consts.ts`）を大きな数値＋プログレスバーで表示し、30%以上・50%以上でユーモアのある警告メッセージとバーの色が変わる。**系統別・エリア別の割合**を軽量な円グラフ（`CategoryDonutChart.astro`。CSS の `conic-gradient` のみ、JS/SVG 不要）で表示。色は識別用に固定順で用意した6色（`global.css` の `--chart-series-1`〜`6`。ブランドの暖色だけだと色の区別がつきにくいための別枠）を件数の多い順に割り当て、色だけに頼らず凡例に系統名・件数・割合をテキストで併記する（7件目以降は「その他」にまとめる）。ヘッダー・フッターに「出費ダッシュボード」ナビを追加 |
| PWA 化 | ホーム画面に追加してアプリのように使える。手書きの `public/manifest.webmanifest`（アプリ名「らーめんログ」、テーマカラーはヘッダーと同じ深い赤）と `public/sw.js`（Service Worker。キャッシュ優先＋裏でネットワーク更新、オフラインでキャッシュに無いページはトップページで代替）を `BaseLayout.astro` から読み込む。アイコンは `scripts/make-pwa-icons.mjs` で `public/pwa/` に生成（🍜 絵文字をブランドカラーの背景に乗せた PNG） |
| 沿線検索 | `location-map.ts` の各駅に鉄道路線名（`lines`）を追加（山手線・つくばエクスプレスなど）。エリア別ページの `AreaSearchBox`（インクリメンタルサーチ）が路線名にも部分一致するようになり、「山手線」で検索すると山手線が通るすべての駅の記事がヒットする |
| 免罪符メーター | 記事詳細ページの店舗情報の下に、系統（`style`）に応じた概算カロリー・PFC（タンパク質・脂質・炭水化物）バランスをプログレスバーで表示し、「これを消費するにはスクワット◯時間／ランニング◯km」というユーモアのある運動換算を添える（`CalorieMeter.astro` + `src/lib/nutrition.ts` のハードコードされた目安値） |
| トップ | **今日の一杯ガチャ**（🎲 ボタンを押すと公開済み記事からランダムに 1 件選んで移動。Vanilla JS）→ **殿堂入りピックアップ**（`PickupPosts`。`pickup: true` の記事を 👑 バッジ付きの目立つカードで上部に表示、無ければ非表示）→ **ラーメン草カレンダー**（`ContributionCalendar`。GitHub の Contributions 風に、過去 1 年分の日付マスを描画し記事がある日をアクセントカラーで塗る。マスにホバーすると店名がネイティブ title で出る。JS 不要）→ 左に写真・右に店舗情報の**横型リスト**（スマホは縦積み）。系統タグ・場所・評価（★n 以上）で絞り込み、新しい順／古い順／評価順で並び替え。条件は URL クエリに同期。カードには `visits` が 2 以上のとき「🔥 訪問n回」バッジ、`features` があればバッジを表示 |
| 記事ページ | **パンくずリスト**（`Breadcrumbs`。トップ／都道府県／エリアグループ／店名の階層リンク＋ BreadcrumbList の JSON-LD）、店名を主役にしたヘッダー、星評価（端数ぶん部分塗り）＋ `visits` が 2 以上のとき「🔥 訪問回数：n回」バッジ、**読了時間の目安**（「⏱️ 約◯分で読めます」。本文の Markdown 生ソースから見出し記号・リンク・タグなどを除いたおおよその文字数 ÷ 450字/分で算出。`src/lib/reading-time.ts`）、店舗情報テーブル（`map_url` があれば「場所」の横に「📍 地図を見る」の外部リンク、`nearest_station`（複数駅を配列で指定可。`・`区切りで表示）/ `business_hours`（単純な文字列のほか、曜日ごとに時間が違う場合は `{ days, hours }` の配列で指定可。連続した曜日は「月〜金」のようにまとめて表示。`src/lib/business-hours.ts`）があれば行を追加。どれも任意項目）、**動的 OGP 画像**（`src/pages/og/[slug].png.ts`。店名・評価（★）・系統を暖色グラデーションに重ねてビルド時に生成する 1200x630 の PNG。`og:image` / `twitter:image` が指す）、**Review 構造化データ（JSON-LD）**（`<head>` に schema.org の `Review`/`Restaurant`/`Rating` を出力。店名・評価・訪問日をマッピングし、検索結果に★評価が出るのを狙う。SEO 目的）、写真、本文（h2 は太い左ライン＋下線、h3 はオレンジの下線）、目次（h2/h3 から自動生成・折りたたみ可）。**複数写真ギャラリー**（`PhotoGallery` コンポーネント。MDX 記事の本文中に置ける。スマホ 1 列／PC 2 列、クリックで Lightbox 拡大表示）。本文の下に**SNS シェア＆ URL コピー**（`ShareButtons`。X への投稿リンク＋クリップボードコピー、コピー後は「コピーしました」トースト。トーストの位置はスマホのフローティング CTA と重ならないよう `bottom-24 md:bottom-6`）と**関連記事**（`RelatedPosts`。同じ系統またはエリアグループの記事を評価順に最大 4 件）と**コメント欄**（`Comments`。Giscus/GitHub Discussions。2026-09-20 に本番設定済み・稼働中。カテゴリは「Announcements」）、その下に前後記事ナビ。`features` は系統・場所バッジの並びに追加表示 |
| 内部リンクカード（回遊率向上） | `BlogCard.astro`。MDX 記事の本文中に `<BlogCard slug="iekei-tokyo-suehirocho" />` のように置ける、他の記事へ誘導する横長カード（サムネイル・店名・記事タイトル・星評価）。`slug` に一致する公開済み記事が無ければ何も表示しない（ビルド失敗しない） |
| スマホ用フローティング CTA（回遊率向上） | `FloatingCTA.astro`。`BaseLayout.astro` に常時マウントし、`md` 未満（スマホ）でのみ画面下部に固定表示される「🔍 エリアから探す」「🍜 トップへ戻る」の 2 ボタンバー。`<footer>` に `pb-20 md:pb-0` を付けて、フッターの内容とバーが重ならないようにしている（この 2 つはセットで変更する） |
| GA4（Google アナリティクス） | `GoogleAnalytics.astro`。`BaseLayout.astro` の `<head>` に常時マウント。2026-09-20 に本番設定済み・稼働中。測定 ID は GitHub Actions のリポジトリ変数 `PUBLIC_GA_MEASUREMENT_ID`（`.github/workflows/deploy.yml` でビルドに渡す）から読む。未設定またはプレースホルダーの間は gtag のスクリプトを一切出力しない |
| Google AdSense（Auto ads） | `GoogleAdSense.astro`（2026-09-26 追加）。`BaseLayout.astro` の `<head>` に常時マウント。ユーザーがAdSense管理画面から発行したコード（`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-...">`）をそのまま設置。クライアントIDは秘密情報ではないため直接埋め込み（GA4のような環境変数化はしていない）。**Auto adsは独自にページを解析して広告枠を挿入する仕組みなので、`AdBanner.astro` のダミー枠（記事一覧3記事ごと・目次の下・記事最下部）とは連動しない**。CSPに`pagead2.googlesyndication.com`・`googleads.g.doubleclick.net`・`tpc.googlesyndication.com`等のAdSense関連ドメインを追加済みだが、この一覧は一般的な公開情報に基づくもので実機（本番）で確認したものではない（このクラウド実行環境からは本番サイト・Google広告配信ドメインのどちらにもアクセスできないため） |
| ラーメンマップ | `/map/`。Leaflet（CDN の UMD 版・unpkg、OpenStreetMap タイル）で全記事をピン留め。記事のフロントマターに `lat`/`lng`（店舗の正確な座標）があればそれを使い、無ければ `location-map.ts` の `AREA_GROUPS` の各エリア代表座標（駅の目安）にフォールバック。フォールバックの場合のみ、同じエリアの記事が重ならないよう記事ごとに少しずらす。ピンをタップすると店名・系統・評価のポップアップが出て、記事へのリンクがある。**「📍 現在地から近いお店を探す」**ボタンで `navigator.geolocation` から現在地を取得し、Haversine 距離で近い順に 3 件リスト表示＋地図の中心を現在地に移動 |
| マイベスト・ランキング | `/ranking/`。全記事を評価（`rating`）の降順で並べ、1〜3 位に 👑🥈🥉 のアイコンを表示 |
| 系統別・エリア別・タグ別 | `/styles/`・`/locations/`・`/tags/`（一覧）と `/styles/家系/`・`/locations/秋葉原/`・`/tags/豚骨醤油/` のような項目ごとの一覧。フロントマターの `style` / `location` / `tags` から自動生成。ヘッダー・フッターのナビと記事のバッジ／タグからたどれる |
| About | `/about/`（`src/pages/about/index.astro`、固定ページ）。ブログの趣旨と評価基準（★の目安）のダミーテキスト。ヘッダー・フッターのナビに追加済み |
| エリア別ナビ・近接駅・沿線検索 | `/locations/` は `src/lib/location-map.ts`（**エリアグループ名 → { 都道府県, 徒歩圏内の駅一覧（各駅に鉄道路線名 `lines` 付き） }** の辞書。秋葉原・神田／神保町／新宿・代々木／池袋／高田馬場／渋谷／上野・御徒町／新橋／東京・大手町／銀座／中野／高円寺／荻窪／蒲田など東京 23 区の主要エリアを事前登録）を使って**都道府県ごとに折りたたみ表示**、その下に駅（location）一覧。ページ上部の検索窓（`AreaSearchBox`）は駅名・路線名を入れると同じグループの他の駅やその路線が通る駅の記事もまとめてヒットする**双方向**のインクリメンタルサーチ（「秋葉原」でも「末広町」でも、「山手線」でも、お互いの記事が出る）。辞書に無い location は自動で「その他」県・単独グループにフォールバックするので、新しい記事を追加してビルドするだけで反映される |
| 見た目 | 暖色パレット（暖簾の深い赤のヘッダー、鶏油のオレンジ、琥珀の星、オフホワイト背景、ダークグレー文字）。**ダークモード**（OS 設定に従い、ヘッダーのボタンで切り替え・保存） |
| 写真 | `npm run photo -- <写真> <スラッグ>` で取り込み（iPhone の HEIC 可、縮小・EXIF/GPS 削除）。写真が無い記事には Unsplash のイメージ画像を「イメージ」ラベル付きで表示。`npm run photo` で EXIF が消える前に `npm run exif -- <写真>`（`scripts/extract-exif.mjs`）を実行すると、撮影日時・GPS 座標を `.tmp/latest-exif.json` に読み取れる（`date`/`lat`/`lng` の下書きに使える。店名・系統などは EXIF からは分からないのでユーザーのメモから得る） |
| アフィリエイト・広告カード | `AffiliateCard.astro`。収益化用の商品紹介カード（`url` / `imageUrl`（任意）/ `title` / `description` / `buttonText` を props で渡す）。カード全体が 1 つのリンクで、hover でカード全体がわずかに浮き上がり、CTA ボタン部分はさらに大きく浮き上がる（`group-hover:-translate-y-1`）。景品表示法対策の「PR」ラベル（画像がある場合は画像左上、無い場合はテキスト側）、リンクには `rel="sponsored"` を付与（Google 推奨のアフィリエイトリンクの書き方）。**2種類の使い方**: ① MDX 記事の本文中に画像付きで手動で埋め込む（従来の使い方）、② 記事のフロントマターに `takumen_url` / `amazon_url` を指定すると、`posts/[id].astro` が画像無し1カラムレイアウトで記事末尾（総評の下）に自動表示する（2026-09-26 追加。タイトル・説明・ボタン文言は固定のマイクロコピーで、店舗がその通販で実際に買えるかを断定しない言い回し） |
| 広告プレースホルダー | `AdBanner.astro`。`<div class="ad-container">` でラップしたグレーのダミー表示（将来 Google AdSense 等のタグに差し替える想定）。配置: ①記事一覧（トップ・2ページ目以降）の3記事ごと（`PostListWithAds.astro`。最後の記事の直後には出さない）、②記事詳細ページの目次の直下、③記事詳細ページの最下部。**注意**: `PostFilters.astro` の並び替えは `[data-post]` を毎回 `appendChild` でリストの末尾に付け直す実装のため、広告 `<li>` を固定位置で混ぜると絞り込み操作のたびに広告だけ先頭に固まってしまう。`PostListWithAds.astro` では `MutationObserver` で変化を検知し、「現在表示中の記事の3件ごと」に毎回広告を再配置し直すことでこれを回避している |
| もしもアフィリエイト「かんたんリンク」 | `MoshimoLink.astro`（2026-09-26 追加）。もしもアフィリエイトの管理画面が発行する `<div>...<script>...</script>` を含む HTML を `htmlContent` prop で受け取り、`set:html` でそのまま埋め込む（MDX 記事の本文中で使う）。スマホ・PC のどちらでも中央揃えで表示され、幅がはみ出す場合は横スクロールで対応。景品表示法対策の「PR」表示付き。かんたんリンクは `https://dn.msmstatic.com` からスクリプトを、`https://thumbnail.image.rakuten.co.jp` から商品画像を読み込むため、CSP（`script-src`/`img-src`）にすでに追加済み。武将家外伝の記事で楽天市場の商品3点（実データ）を使用中。旧ダミーの `AffiliateCard`（宅麺のダミーURL）はこの記事からは削除済み |
| 全文検索 | `/search/`。店名・記事タイトル・系統・場所・タグ・特徴タグ・注文・説明文・本文（Markdown 生ソースから記号を除いたプレーンテキスト）を対象にしたキーワード検索。`AreaSearchBox` と同じ方式で、全記事の `PostListItem` をあらかじめ非表示で埋め込み、マッチした記事だけ表示する（API 呼び出し無し）。`?q=キーワード` で直接結果を開ける。ヘッダーに検索アイコン、フッターに「検索」リンク |
| 店舗詳細モーダル | `src/data/shops.ts`（記事の id → 店舗情報の辞書）で営業時間・定休日・訪問時に注文したメニューを一元管理。記事ページの「店舗情報」見出し横に「ℹ️ 店舗詳細・メニュー」ボタン（`ShopDetailsModal.astro`。データが無い記事にはボタンを出さない）。`businessHours`/`regularHoliday` は未確認のため現状すべて空、`orderedMenu` は本文の「注文したもの」の品と価格をそのまま集約したもの（お店の全メニューではない） |
| ギャラリー | `/gallery/`。全記事の一杯の写真だけを CSS 多段組み（`columns-*`、Masonry 風）でタイル状に並べる。ホバー（スマホはタップ直接遷移）で半透明オーバーレイに店名・評価（★）が浮かび上がり、クリックで記事へ |
| Googleマップ経路検索 | 記事ページの店舗情報の下に「📍 現在地からの経路を見る」ボタン。フロントマターの `lat`/`lng` から `https://www.google.com/maps/dir/?api=1&destination={lat},{lng}` を組み立てて別タブで開く（`lat`/`lng` が無い記事には出ない）。実記事 5 本すべてに `lat`/`lng` を設定済みなので、現在は全記事に表示される |
| コマンドパレット | `Ctrl+K` / `Cmd+K` でどのページからでも開ける検索モーダル（`CommandPalette.astro`）。`/search.json`（軽量な記事インデックス API）を fetch して店名・タイトル・系統・場所・タグにインクリメンタルサーチ、Enter でジャンプ。`/dark` `/light` と入力して Enter するとテーマが切り替わるイースターエッグ付き。ヘッダーに `⌘K` ボタンでも開ける |
| ページネーション | トップページは `PAGE_SIZE`（12 件、`src/consts.ts`）ごとに分割。1 ページ目は `/`（`index.astro`）、2 ページ目以降は `/page/2/` など（`src/pages/page/[page].astro`）。2026-09-22 時点は記事 7 本で 12 件以下のため、2 ページ目以降はまだ生成されない（12 件超えたら自動で増える） |
| お気に入り（行きたい） | 記事ページの本文下に「🤍 行きたい」ボタン（`FavoriteButton.astro`）。押すとブラウザの LocalStorage（この端末だけ、サーバーには送らない）に記事 id を保存。一覧は `/favorites/`（`favorites.astro`）で、LocalStorage の id を `/search.json` と突き合わせてクライアント側で表示を組み立てる |
| カスタム 404 | `src/pages/404.astro`。GitHub Pages が自動でエラーページとして使う `dist/404.html` になる |
| CSP（セキュリティヘッダー） | `BaseLayout.astro` の `<head>` に `<meta http-equiv="Content-Security-Policy">`。GitHub Pages はカスタム HTTP ヘッダーを返せないため meta タグでの設定（`frame-ancestors` など meta では効かないディレクティブは未設定）。固定インラインスクリプト（テーマ切替・SW登録・コマンドパレット・GA4）のため script-src/style-src に `unsafe-inline` を含む。外部は実際に使っているドメインだけ許可（unpkg.com・googletagmanager.com・giscus.app・images.unsplash.com・tile.openstreetmap.org・dn.msmstatic.com＝もしもアフィリエイトのかんたんリンク・thumbnail.image.rakuten.co.jp＝かんたんリンクの商品画像・pagead2.googlesyndication.com等＝Google AdSense） |
| CI / Dependabot | `.github/workflows/ci.yml`（PR ごとに `astro check` → `build` を検証、デプロイはしない）と `.github/dependabot.yml`（npm・GitHub Actions の依存を週次チェック）を追加 |
| その他 | RSS（`/rss.xml`）、sitemap、OGP / Twitter カード、レスポンシブ（375px 確認済み） |

## 3. いまの記事

| 種別 | 記事 | 評価 |
|---|---|---|
| 本物 | iekei Tokyo 王道家（末広町・家系・2026-09-10、`.mdx`）— `pickup: true`／`visits: 3`／`features: ["通し営業"]`。本文中に `BlogCard`（→武将家外伝）と `AffiliateCard`（宅麺のダミー） | 4.8 |
| 本物 | 武将家外伝（秋葉原・家系・2026-09-16、`.mdx`）— `features: ["深夜営業"]`。本文中に `BlogCard`（→iekei Tokyo 王道家）と、もしもアフィリエイトの「かんたんリンク」3点（`MoshimoLink`。楽天市場の商品、実データ。2026-09-26 にダミーの `AffiliateCard` から入れ替え） | 4.3 |
| 本物 | ラーメン二郎 めじろ台店（めじろ台・二郎系・2026-09-11）— `tags: ["非乳化","太麺"]`。系統「二郎系」・エリア「めじろ台」は初登場（`location-map.ts` に「めじろ台エリア」を新規追加、京王線）。本文末尾にアクセス（めじろ台駅から徒歩約10分）の Markdown 表を追加 | 3.7 |
| 本物 | 王道家直系 ラーメンがく（研究学園・家系・2026-09-21、`.mdx`）— `tags: ["自家製麺","燻製チャーシュー"]`。エリア「研究学園」は初登場（`location-map.ts` に「研究学園エリア」を新規追加、つくばエクスプレス）。本文中に `PhotoGallery`（2 枚目の写真）と、本文末尾に「アクセス」の Markdown 表 | 4.6 |
| 本物 | 十八代目野中家（神田・家系・2026-09-03、`.mdx`）— `tags: ["豚骨醤油","酒井製麺"]`。エリア「神田」は初登場（既存の「秋葉原・神田エリア」グループに追加登場、銀座線）。本文中に `PhotoGallery`（2 枚目の写真）と、本文末尾に「アクセス」の Markdown 表。総評はスープ・麺の高評価を先に述べ、燻製チャーシューの残念さを評価を下げた主因として明記（メモの通り、チャーシューの出来が実際にこの記事の評価軸そのものだったため） | 3.5 |
| 本物 | 輝道家 水道橋（水道橋・家系・2026-09-02）— `tags: ["豚骨醤油","だるま製麺","燻製チャーシュー"]`（`だるま製麺` が新規タグ）。エリア「水道橋」は初登場（既存の「神保町エリア」グループに追加登場、JR中央・総武線／都営三田線）。本文末尾に「アクセス」（水道橋駅から徒歩約10秒）の Markdown 表を追加。`lat`/`lng` 設定済み | 4.5 |
| 本物 | 輝道家 水道橋（限定・旨辛ラーメン）（水道橋・家系・2026-08-30）— `tags: ["豚骨醤油","期間限定"]`（`期間限定` が新規タグ）。同じ店の 2 本目の記事（別の訪問日・別メニュー）。`lat`/`lng` は 9/2 の記事と同じ座標を設定済み | 4.2 |

サンプル記事（熊田家・極太堂）は 2026-09-19 に削除済み。`PhotoGallery` コンポーネントは「王道家直系 ラーメンがく」「十八代目野中家」で使用中。実記事 7 本すべてに `lat`/`lng`（ユーザーが自分の PC で調べた正確な緯度経度）を設定済み（2026-09-22）。輝道家 水道橋は同じ店舗を 2 回に分けて別記事として掲載（`src/data/shops.ts` も記事ごとに別エントリ）

## 4. 設計上の決まりごと（プロンプトを書くときに知っておくと良いこと）

- **色はテーマトークンで指定**（`bg-surface` / `text-ink` / `border-line` / `text-brand-fg` / バッジ用 `bg-chip-brand` など、`src/styles/global.css`）。ライト／ダークはトークンの値が切り替わる仕組みなので、`dark:` を個別に書かない
- 独自ドメイン配信（`base` は既定値の `/`）だが、サイト内リンクは引き続き `withBase()` を通す（サブパス配信に戻しても追随できるようにするため）
- 記事データの取得は `src/lib/posts.ts` の `getPublishedPosts()` に統一
- 主なコンポーネント: `PostListItem`（一覧の 1 行）/ `StarRating`（星）/ `PostFilters`（絞り込み）/ `TermPosts`・`TermCard`（系統／エリア／タグ別ページ）/ `AreaSearchBox`（エリアの近接駅・沿線検索）/ `PhotoGallery`（記事本文の複数写真・Lightbox）/ `AffiliateCard`（記事本文のアフィリエイト・広告カード）/ `BlogCard`（記事本文の内部リンクカード）/ `Breadcrumbs`（パンくず＋ JSON-LD）/ `RelatedPosts`（関連記事）/ `PickupPosts`（殿堂入りピックアップ）/ `ContributionCalendar`（ラーメン草カレンダー）/ `ShareButtons`（SNS シェア＆ URL コピー）/ `Comments`（Giscus コメント欄）/ `CalorieMeter`（免罪符メーター）/ `FloatingCTA`（スマホ用フローティング CTA）/ `GoogleAnalytics`（GA4 計測タグ）/ `GoogleAdSense`（AdSense Auto ads）/ `ShopDetailsModal`（店舗詳細モーダル。データは `src/data/shops.ts`）/ `CommandPalette`（Ctrl+K コマンドパレット）/ `FavoriteButton`（「行きたい」ボタン）/ `Pagination`（記事一覧のページ送り）/ `CategoryDonutChart`（出費ダッシュボードの系統別・エリア別 円グラフ）/ `AdBanner`（広告プレースホルダー）/ `PostListWithAds`（記事一覧の `<ol>`、広告枠を挟む）/ `MoshimoLink`（もしもアフィリエイトのかんたんリンク埋め込み）/ `TableOfContents` / `PostNav` / `ThemeToggle`。ページ: `map.astro`（ラーメンマップ）/ `ranking.astro`（マイベスト・ランキング）/ `dashboard.astro`（出費ダッシュボード）/ `search.astro`（全文検索）/ `gallery.astro`（画像ギャラリー）/ `favorites.astro`（行きたい一覧）/ `404.astro`（カスタム404）/ `page/[page].astro`（記事一覧2ページ目以降）/ `search.json.ts`（コマンドパレット用の軽量な記事インデックス API）/ `og/[slug].png.ts`（動的 OGP 画像）
- 記事本文（Markdown/MDX 生ソース）からプレーンテキストを取り出す `stripMarkdown()`（`src/lib/markdown.ts`）は、読了時間の計算（`reading-time.ts`）と全文検索（`search.astro`）の両方で共有している
- `AffiliateCard` を本文中に**手動で**埋め込む場合（画像付き）は `BlogCard` / `PhotoGallery` と同じく MDX 記事の本文中でしか使えない（`.md` ではなく `.mdx` にして `import ... from '../../components/AffiliateCard.astro'` のように置く）。2026-09-20 に実記事（`iekei-tokyo-suehirocho.mdx` / `bushoya-gaiden-akihabara.mdx`）へ組み込み済み。この2記事の `AffiliateCard` の `url` は `https://example.com/affiliate` のダミー値のままなので、実際のアフィリエイトプログラムに登録したら差し替える必要がある。一方、フロントマターの `takumen_url` / `amazon_url` から**自動**表示する場合（2026-09-26 追加）は `.md` の記事でも使える（`posts/[id].astro` 側で自動生成するため、本文中に `import` する必要がない）
- 地図のピン座標は `location-map.ts` の `AREA_GROUPS` 各エントリの `lat`/`lng`（エリアの代表座標）。`getCoordinates(location)` で引く。辞書に無い location は座標が無いため地図には出ない（ビルドは失敗しない）
- 動的 OGP 画像は satori（HTML/CSS 風オブジェクト → SVG）+ `@resvg/resvg-js`（SVG → PNG）+ `@fontsource/noto-sans-jp`（日本語フォント、`node_modules` から直接 `fs.readFile`）をビルド時に使う。★ 記号はフォントに字形が無いので `StarRating.astro` と同じ SVG パスで描画し、絵文字は使わない（Noto Sans JP に絵文字グリフが無く tofu 文字化けするため）
- 記事本文に複数の写真を並べたいときは、記事ファイルを `.mdx`（`.md` ではなく）にして `import PhotoGallery from '../../components/PhotoGallery.astro'` → `<PhotoGallery photos={[{ src, alt, caption? }, ...]} />` を本文中に置く。`src` は `src/assets/posts/` からインポートした画像（`npm run photo` で取り込んだもの。最適化される）でも、Unsplash などのリモート URL 文字列でもよい
- エリア（駅）に紐づく都道府県・近接駅グループ・鉄道路線は `src/lib/location-map.ts` の `AREA_GROUPS`（グループ名がキー、値が `{ prefecture, stations: { name, lines }[] }`）で管理。新しい `location` を使う記事を追加したら、該当するグループの `stations` に駅名（と分かれば路線名）を足す（未登録でもビルドは失敗しない）。`getLocationInfo()` / `getGroupStations()` / `getLines()` で駅名から逆引きする
- ラーメンの系統別の概算カロリー・PFC はハードコードした辞書（`src/lib/nutrition.ts` の `STYLE_NUTRITION`）で管理。未登録の系統は `DEFAULT_NUTRITION` にフォールバックする
- PWA の manifest（`public/manifest.webmanifest`）と Service Worker（`public/sw.js`）は `public/` 直下の手書きファイルなので Astro の `withBase()` を通らない。base（`astro.config.mjs`）を変えるときは、この 2 ファイル内の `/ramen-blog` もあわせて直す（`@vite-pwa/astro` は Astro 7 に未対応で HTML への manifest/SW 挿入が効かなかったため、手書き実装にした。詳細は 6 章）
- SEO 用の構造化データ（JSON-LD）は `BaseLayout.astro` に汎用の `structuredData?: Record<string, unknown>` prop を追加し、渡された値を `<head>` にそのまま出力する仕組み。記事ページ（`posts/[id].astro`）はこれで schema.org の `Review`（`itemReviewed: Restaurant` / `reviewRating: Rating` / `author` / `datePublished`）を渡している。新しいページ種別で別の構造化データ（`FAQPage` など）を出したくなったら、同じ prop に別の JSON-LD オブジェクトを渡せばよい。パンくず（`Breadcrumbs.astro`）の `BreadcrumbList` JSON-LD は別枠でコンポーネント内に直書きされている（`<head>` ではなく本文中だが、JSON-LD はページ内のどこにあっても Google に認識される）
- 詳細な規約は `CLAUDE.md`、使い方は `README.md`、作業履歴は `docs/HANDOFF.md`

## 5. 作業の進め方

- ユーザーが Claude Code に指示 → Claude が実装・ローカルで動作確認 → GitHub に PR を作成 → **ユーザーが GitHub 上でマージ**（Claude はマージできない）→ 自動デプロイ → Claude が本番を確認
- 記事は、ユーザーが「店名／場所／訪問日／系統／注文／値段／評価／感想メモ／写真パス」を投げると Claude が下書き → PR にする流れ。Claude はメモに無い味の感想を足さない
- ダミー写真の店（熊田家など）に本物の写真を付けるときは `npm run photo -- <写真> <スラッグ> --force`

## 6. まだやっていないこと・アイデア

- **独自ドメイン化は完全に完了**（2026-09-25）：`eno-ramen.com` に移行済み（コード側は`astro.config.mjs`の`site`、`public/CNAME`、`public/manifest.webmanifest`/`sw.js`のパス変更）。DNS側（お名前.comのネームサーバーを`dnsv.jp`系に切替＋GitHub Pages向けA×4・wwwのCNAME設定）も反映済み、GitHubリポジトリのSettings→PagesのDNSチェックも通過し、Enforce HTTPSもユーザーが有効化済み。本番は`https://eno-ramen.com/`で稼働中
- PWA の `@vite-pwa/astro` 導入は見送り（2026-09-20）: 最新版（1.2.0）でも peer dependency が `astro@^1〜5` までで、この場の Astro 7.3 とは合わない。`--legacy-peer-deps` で強制インストールしてビルド自体は通ったが、`manifest.webmanifest` への `<link rel="manifest">` や Service Worker 登録スクリプトが生成 HTML に一切挿入されず（Astro 7 の静的ビルドパイプラインとの相性問題と判断）、PWA としては機能しなかったため撤去。代わりに `public/manifest.webmanifest` と `public/sw.js` を手書きし、`BaseLayout.astro` からリンク・登録している（キャッシュ優先＋バックグラウンド更新の簡易 Service Worker）。将来 `@vite-pwa/astro` が Astro 7 に対応したら乗り換えを検討してもよい

## 7. Claude への指示の書き方のコツ

- 「どのページの・何を・どう変えたいか」を書けば、ファイルの場所や実装方法は Claude が判断する
- 見た目の変更は「参考にするサイトの雰囲気」や「優先順位（情報密度／読みやすさ）」があると精度が上がる
- 1 回の指示は 1 テーマにまとめると PR が読みやすい（大きな改修でも 1 PR にまとめて動作確認までしてから出す）
- 「承認なしで進めて」と言えば、複数タスクをまとめて PR まで作る（マージだけはユーザーが行う）
