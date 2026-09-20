# らーめん食べ歩きログ — 現状ブリーフ（他の AI に渡す用）

最終更新: 2026-09-21（3 本目の実記事「ラーメン二郎 めじろ台店」を追加。二郎系・めじろ台エリアが初登場）

このファイルは、プロジェクトの現状を **別の AI（Gemini など）に共有して次の指示（プロンプト）を考えてもらう**ためのまとめです。
実装は Claude Code が行い、変更のたびにこのファイルも更新します。
最新版はいつでもここ: https://raw.githubusercontent.com/enoenomirai-beep/ramen-blog/main/docs/AI-BRIEF.md

## 1. 何のプロジェクトか

- ラーメン食べ歩きレビュー専用の静的ブログ「らーめん食べ歩きログ」
- 公開 URL: https://enoenomirai-beep.github.io/ramen-blog/
- リポジトリ: https://github.com/enoenomirai-beep/ramen-blog（公開）
- 技術: Astro 7（静的出力）+ Tailwind CSS 4 + MDX。GitHub Pages に GitHub Actions で自動デプロイ（`main` に push → 1〜2 分で公開）

## 2. 実装済みの機能

| 領域 | 内容 |
|---|---|
| 記事 | Markdown（`src/content/posts/*.md`）。フロントマター: `title` / `date` / `shop_name` / `style`（系統）/ `location` / `rating`（1〜5、0.1 刻み）/ `image` / `image_alt` / `description` / `menu` / `price` / `tags` / `map_url` / `business_hours` / `nearest_station` / `pickup` / `visits`（訪問回数、既定 1）/ `features`（特徴タグの配列）/ `draft` |
| ラーメン出費ダッシュボード | `/dashboard/`。全記事の `price`（会計額。未記入は 1 杯の目安額 ¥800 でフォールバック）を集計し、「今年の投資総額」「平均単価」「総投資額」の 3 枚のカードと、月別の出費合計を**棒グラフ＋表**で表示。ヘッダー・フッターに「出費ダッシュボード」ナビを追加 |
| PWA 化 | ホーム画面に追加してアプリのように使える。手書きの `public/manifest.webmanifest`（アプリ名「らーめんログ」、テーマカラーはヘッダーと同じ深い赤）と `public/sw.js`（Service Worker。キャッシュ優先＋裏でネットワーク更新、オフラインでキャッシュに無いページはトップページで代替）を `BaseLayout.astro` から読み込む。アイコンは `scripts/make-pwa-icons.mjs` で `public/pwa/` に生成（🍜 絵文字をブランドカラーの背景に乗せた PNG） |
| 沿線検索 | `location-map.ts` の各駅に鉄道路線名（`lines`）を追加（山手線・つくばエクスプレスなど）。エリア別ページの `AreaSearchBox`（インクリメンタルサーチ）が路線名にも部分一致するようになり、「山手線」で検索すると山手線が通るすべての駅の記事がヒットする |
| 免罪符メーター | 記事詳細ページの店舗情報の下に、系統（`style`）に応じた概算カロリー・PFC（タンパク質・脂質・炭水化物）バランスをプログレスバーで表示し、「これを消費するにはスクワット◯時間／ランニング◯km」というユーモアのある運動換算を添える（`CalorieMeter.astro` + `src/lib/nutrition.ts` のハードコードされた目安値） |
| トップ | **今日の一杯ガチャ**（🎲 ボタンを押すと公開済み記事からランダムに 1 件選んで移動。Vanilla JS）→ **殿堂入りピックアップ**（`PickupPosts`。`pickup: true` の記事を 👑 バッジ付きの目立つカードで上部に表示、無ければ非表示）→ **ラーメン草カレンダー**（`ContributionCalendar`。GitHub の Contributions 風に、過去 1 年分の日付マスを描画し記事がある日をアクセントカラーで塗る。マスにホバーすると店名がネイティブ title で出る。JS 不要）→ 左に写真・右に店舗情報の**横型リスト**（スマホは縦積み）。系統タグ・場所・評価（★n 以上）で絞り込み、新しい順／古い順／評価順で並び替え。条件は URL クエリに同期。カードには `visits` が 2 以上のとき「🔥 訪問n回」バッジ、`features` があればバッジを表示 |
| 記事ページ | **パンくずリスト**（`Breadcrumbs`。トップ／都道府県／エリアグループ／店名の階層リンク＋ BreadcrumbList の JSON-LD）、店名を主役にしたヘッダー、星評価（端数ぶん部分塗り）＋ `visits` が 2 以上のとき「🔥 訪問回数：n回」バッジ、**読了時間の目安**（「⏱️ 約◯分で読めます」。本文の Markdown 生ソースから見出し記号・リンク・タグなどを除いたおおよその文字数 ÷ 450字/分で算出。`src/lib/reading-time.ts`）、店舗情報テーブル（`map_url` があれば「場所」の横に「📍 地図を見る」の外部リンク、`nearest_station`（複数駅を配列で指定可。`・`区切りで表示）/ `business_hours`（単純な文字列のほか、曜日ごとに時間が違う場合は `{ days, hours }` の配列で指定可。連続した曜日は「月〜金」のようにまとめて表示。`src/lib/business-hours.ts`）があれば行を追加。どれも任意項目）、**動的 OGP 画像**（`src/pages/og/[slug].png.ts`。店名・評価（★）・系統を暖色グラデーションに重ねてビルド時に生成する 1200x630 の PNG。`og:image` / `twitter:image` が指す）、**Review 構造化データ（JSON-LD）**（`<head>` に schema.org の `Review`/`Restaurant`/`Rating` を出力。店名・評価・訪問日をマッピングし、検索結果に★評価が出るのを狙う。SEO 目的）、写真、本文（h2 は太い左ライン＋下線、h3 はオレンジの下線）、目次（h2/h3 から自動生成・折りたたみ可）。**複数写真ギャラリー**（`PhotoGallery` コンポーネント。MDX 記事の本文中に置ける。スマホ 1 列／PC 2 列、クリックで Lightbox 拡大表示）。本文の下に**SNS シェア＆ URL コピー**（`ShareButtons`。X への投稿リンク＋クリップボードコピー、コピー後は「コピーしました」トースト。トーストの位置はスマホのフローティング CTA と重ならないよう `bottom-24 md:bottom-6`）と**関連記事**（`RelatedPosts`。同じ系統またはエリアグループの記事を評価順に最大 4 件）と**コメント欄**（`Comments`。Giscus/GitHub Discussions。2026-09-20 に本番設定済み・稼働中。カテゴリは「Announcements」）、その下に前後記事ナビ。`features` は系統・場所バッジの並びに追加表示 |
| 内部リンクカード（回遊率向上） | `BlogCard.astro`。MDX 記事の本文中に `<BlogCard slug="iekei-tokyo-suehirocho" />` のように置ける、他の記事へ誘導する横長カード（サムネイル・店名・記事タイトル・星評価）。`slug` に一致する公開済み記事が無ければ何も表示しない（ビルド失敗しない） |
| スマホ用フローティング CTA（回遊率向上） | `FloatingCTA.astro`。`BaseLayout.astro` に常時マウントし、`md` 未満（スマホ）でのみ画面下部に固定表示される「🔍 エリアから探す」「🍜 トップへ戻る」の 2 ボタンバー。`<footer>` に `pb-20 md:pb-0` を付けて、フッターの内容とバーが重ならないようにしている（この 2 つはセットで変更する） |
| GA4（Google アナリティクス） | `GoogleAnalytics.astro`。`BaseLayout.astro` の `<head>` に常時マウント。2026-09-20 に本番設定済み・稼働中。測定 ID は GitHub Actions のリポジトリ変数 `PUBLIC_GA_MEASUREMENT_ID`（`.github/workflows/deploy.yml` でビルドに渡す）から読む。未設定またはプレースホルダーの間は gtag のスクリプトを一切出力しない |
| ラーメンマップ | `/map/`。Leaflet（CDN の UMD 版・unpkg、OpenStreetMap タイル）で全記事をピン留め。位置は `location-map.ts` の `AREA_GROUPS` に追加した各エリアの代表座標（`lat`/`lng`。駅の目安で店舗の正確な位置ではない）で、同じエリアの記事は重ならないよう記事ごとに少しずらす。ピンをタップすると店名・系統・評価のポップアップが出て、記事へのリンクがある。**「📍 現在地から近いお店を探す」**ボタンで `navigator.geolocation` から現在地を取得し、Haversine 距離で近い順に 3 件リスト表示＋地図の中心を現在地に移動 |
| マイベスト・ランキング | `/ranking/`。全記事を評価（`rating`）の降順で並べ、1〜3 位に 👑🥈🥉 のアイコンを表示 |
| 系統別・エリア別・タグ別 | `/styles/`・`/locations/`・`/tags/`（一覧）と `/styles/家系/`・`/locations/秋葉原/`・`/tags/豚骨醤油/` のような項目ごとの一覧。フロントマターの `style` / `location` / `tags` から自動生成。ヘッダー・フッターのナビと記事のバッジ／タグからたどれる |
| About | `/about/`（`src/pages/about/index.astro`、固定ページ）。ブログの趣旨と評価基準（★の目安）のダミーテキスト。ヘッダー・フッターのナビに追加済み |
| エリア別ナビ・近接駅・沿線検索 | `/locations/` は `src/lib/location-map.ts`（**エリアグループ名 → { 都道府県, 徒歩圏内の駅一覧（各駅に鉄道路線名 `lines` 付き） }** の辞書。秋葉原・神田／神保町／新宿・代々木／池袋／高田馬場／渋谷／上野・御徒町／新橋／東京・大手町／銀座／中野／高円寺／荻窪／蒲田など東京 23 区の主要エリアを事前登録）を使って**都道府県ごとに折りたたみ表示**、その下に駅（location）一覧。ページ上部の検索窓（`AreaSearchBox`）は駅名・路線名を入れると同じグループの他の駅やその路線が通る駅の記事もまとめてヒットする**双方向**のインクリメンタルサーチ（「秋葉原」でも「末広町」でも、「山手線」でも、お互いの記事が出る）。辞書に無い location は自動で「その他」県・単独グループにフォールバックするので、新しい記事を追加してビルドするだけで反映される |
| 見た目 | 暖色パレット（暖簾の深い赤のヘッダー、鶏油のオレンジ、琥珀の星、オフホワイト背景、ダークグレー文字）。**ダークモード**（OS 設定に従い、ヘッダーのボタンで切り替え・保存） |
| 写真 | `npm run photo -- <写真> <スラッグ>` で取り込み（iPhone の HEIC 可、縮小・EXIF/GPS 削除）。写真が無い記事には Unsplash のイメージ画像を「イメージ」ラベル付きで表示 |
| アフィリエイト・広告カード | `AffiliateCard.astro`。MDX 記事の本文中に置ける、収益化用の商品紹介カード（`url` / `imageUrl` / `title` / `description` / `buttonText` を props で渡す）。カード全体が 1 つのリンクで、hover でカード全体がわずかに浮き上がり、CTA ボタン部分はさらに大きく浮き上がる（`group-hover:-translate-y-1`）。画像左上に景品表示法対策の「PR」ラベル、リンクには `rel="sponsored"` を付与（Google 推奨のアフィリエイトリンクの書き方） |
| 全文検索 | `/search/`。店名・記事タイトル・系統・場所・タグ・特徴タグ・注文・説明文・本文（Markdown 生ソースから記号を除いたプレーンテキスト）を対象にしたキーワード検索。`AreaSearchBox` と同じ方式で、全記事の `PostListItem` をあらかじめ非表示で埋め込み、マッチした記事だけ表示する（API 呼び出し無し）。`?q=キーワード` で直接結果を開ける。ヘッダーに検索アイコン、フッターに「検索」リンク |
| その他 | RSS（`/rss.xml`）、sitemap、OGP / Twitter カード、レスポンシブ（375px 確認済み） |

## 3. いまの記事

| 種別 | 記事 | 評価 |
|---|---|---|
| 本物 | iekei Tokyo 王道家（末広町・家系・2026-09-10、`.mdx`）— `pickup: true`／`visits: 3`／`features: ["通し営業"]`。本文中に `BlogCard`（→武将家外伝）と `AffiliateCard`（宅麺のダミー） | 4.8 |
| 本物 | 武将家外伝（秋葉原・家系・2026-09-16、`.mdx`）— `features: ["深夜営業"]`。本文中に `BlogCard`（→iekei Tokyo 王道家）と `AffiliateCard`（宅麺のダミー） | 4.3 |
| 本物 | ラーメン二郎 めじろ台店（めじろ台・二郎系・2026-09-11）— `tags: ["非乳化","太麺"]`。系統「二郎系」・エリア「めじろ台」は初登場（`location-map.ts` に「めじろ台エリア」を新規追加、京王線） | 3.7 |

サンプル記事（熊田家・極太堂）は 2026-09-19 に削除済み。`PhotoGallery` コンポーネントの使用例（`.mdx`、複数写真ギャラリー）も熊田家と一緒に無くなったので、実際に使う記事が増えたら改めて `.mdx` 化して使う

## 4. 設計上の決まりごと（プロンプトを書くときに知っておくと良いこと）

- **色はテーマトークンで指定**（`bg-surface` / `text-ink` / `border-line` / `text-brand-fg` / バッジ用 `bg-chip-brand` など、`src/styles/global.css`）。ライト／ダークはトークンの値が切り替わる仕組みなので、`dark:` を個別に書かない
- サブパス配信（`/ramen-blog/`）なので、サイト内リンクは `withBase()` を通す
- 記事データの取得は `src/lib/posts.ts` の `getPublishedPosts()` に統一
- 主なコンポーネント: `PostListItem`（一覧の 1 行）/ `StarRating`（星）/ `PostFilters`（絞り込み）/ `TermPosts`・`TermCard`（系統／エリア／タグ別ページ）/ `AreaSearchBox`（エリアの近接駅・沿線検索）/ `PhotoGallery`（記事本文の複数写真・Lightbox）/ `AffiliateCard`（記事本文のアフィリエイト・広告カード）/ `BlogCard`（記事本文の内部リンクカード）/ `Breadcrumbs`（パンくず＋ JSON-LD）/ `RelatedPosts`（関連記事）/ `PickupPosts`（殿堂入りピックアップ）/ `ContributionCalendar`（ラーメン草カレンダー）/ `ShareButtons`（SNS シェア＆ URL コピー）/ `Comments`（Giscus コメント欄）/ `CalorieMeter`（免罪符メーター）/ `FloatingCTA`（スマホ用フローティング CTA）/ `GoogleAnalytics`（GA4 計測タグ）/ `TableOfContents` / `PostNav` / `ThemeToggle`。ページ: `map.astro`（ラーメンマップ）/ `ranking.astro`（マイベスト・ランキング）/ `dashboard.astro`（出費ダッシュボード）/ `search.astro`（全文検索）/ `og/[slug].png.ts`（動的 OGP 画像）
- 記事本文（Markdown/MDX 生ソース）からプレーンテキストを取り出す `stripMarkdown()`（`src/lib/markdown.ts`）は、読了時間の計算（`reading-time.ts`）と全文検索（`search.astro`）の両方で共有している
- `AffiliateCard` / `BlogCard` は `PhotoGallery` と同じく MDX 記事の本文中でしか使えない（`.md` ではなく `.mdx` にして `import ... from '../../components/AffiliateCard.astro'` のように置く）。2026-09-20 に実記事（`iekei-tokyo-suehirocho.mdx` / `bushoya-gaiden-akihabara.mdx`）へ組み込み済み。`AffiliateCard` の `url` は `https://example.com/affiliate` のダミー値のままなので、実際のアフィリエイトプログラムに登録したら差し替える必要がある
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

現時点で「予定していたものはすべて完了」。以下は候補（未着手・未決定）:

- 独自ドメイン
- PWA の `@vite-pwa/astro` 導入は見送り（2026-09-20）: 最新版（1.2.0）でも peer dependency が `astro@^1〜5` までで、この場の Astro 7.3 とは合わない。`--legacy-peer-deps` で強制インストールしてビルド自体は通ったが、`manifest.webmanifest` への `<link rel="manifest">` や Service Worker 登録スクリプトが生成 HTML に一切挿入されず（Astro 7 の静的ビルドパイプラインとの相性問題と判断）、PWA としては機能しなかったため撤去。代わりに `public/manifest.webmanifest` と `public/sw.js` を手書きし、`BaseLayout.astro` からリンク・登録している（キャッシュ優先＋バックグラウンド更新の簡易 Service Worker）。将来 `@vite-pwa/astro` が Astro 7 に対応したら乗り換えを検討してもよい

## 7. Claude への指示の書き方のコツ

- 「どのページの・何を・どう変えたいか」を書けば、ファイルの場所や実装方法は Claude が判断する
- 見た目の変更は「参考にするサイトの雰囲気」や「優先順位（情報密度／読みやすさ）」があると精度が上がる
- 1 回の指示は 1 テーマにまとめると PR が読みやすい（大きな改修でも 1 PR にまとめて動作確認までしてから出す）
- 「承認なしで進めて」と言えば、複数タスクをまとめて PR まで作る（マージだけはユーザーが行う）
