# らーめん食べ歩きログ — 現状ブリーフ（他の AI に渡す用）

最終更新: 2026-09-19（関連記事・パンくず・殿堂入りピックアップ・SNS シェアを追加。PR 作成中）

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
| 記事 | Markdown（`src/content/posts/*.md`）。フロントマター: `title` / `date` / `shop_name` / `style`（系統）/ `location` / `rating`（1〜5、0.1 刻み）/ `image` / `image_alt` / `description` / `menu` / `price` / `tags` / `map_url` / `business_hours` / `nearest_station` / `pickup` / `draft` |
| トップ | **殿堂入りピックアップ**（`PickupPosts`。`pickup: true` の記事を 👑 バッジ付きの目立つカードで上部に表示、無ければ非表示）→ 左に写真・右に店舗情報の**横型リスト**（スマホは縦積み）。系統タグ・場所・評価（★n 以上）で絞り込み、新しい順／古い順／評価順で並び替え。条件は URL クエリに同期 |
| 記事ページ | **パンくずリスト**（`Breadcrumbs`。トップ／都道府県／エリアグループ／店名の階層リンク＋ BreadcrumbList の JSON-LD）、店名を主役にしたヘッダー、星評価（端数ぶん部分塗り）、店舗情報テーブル（`map_url` があれば「場所」の横に「📍 地図を見る」の外部リンク、`nearest_station` / `business_hours` があれば行を追加。どれも任意項目）、写真、本文（h2 は太い左ライン＋下線、h3 はオレンジの下線）、目次（h2/h3 から自動生成・折りたたみ可）。**複数写真ギャラリー**（`PhotoGallery` コンポーネント。MDX 記事の本文中に置ける。スマホ 1 列／PC 2 列、クリックで Lightbox 拡大表示）。本文の下に**SNS シェア＆ URL コピー**（`ShareButtons`。X への投稿リンク＋クリップボードコピー、コピー後は「コピーしました」トースト）と**関連記事**（`RelatedPosts`。同じ系統またはエリアグループの記事を評価順に最大 4 件）、その下に前後記事ナビ |
| 系統別・エリア別・タグ別 | `/styles/`・`/locations/`・`/tags/`（一覧）と `/styles/家系/`・`/locations/秋葉原/`・`/tags/豚骨醤油/` のような項目ごとの一覧。フロントマターの `style` / `location` / `tags` から自動生成。ヘッダー・フッターのナビと記事のバッジ／タグからたどれる |
| About | `/about/`（`src/pages/about/index.astro`、固定ページ）。ブログの趣旨と評価基準（★の目安）のダミーテキスト。ヘッダー・フッターのナビに追加済み |
| エリア別ナビ・近接駅検索 | `/locations/` は `src/lib/location-map.ts`（**エリアグループ名 → { 都道府県, 徒歩圏内の駅一覧 }** の辞書。秋葉原・神田／神保町／新宿・代々木／池袋／高田馬場／渋谷／上野・御徒町／新橋／東京・大手町／銀座／中野／高円寺／荻窪／蒲田など東京 23 区の主要エリアを事前登録）を使って**都道府県ごとに折りたたみ表示**、その下に駅（location）一覧。ページ上部の検索窓（`AreaSearchBox`）は駅名を入れると同じグループの他の駅の記事もまとめてヒットする**双方向**のインクリメンタルサーチ（「秋葉原」でも「末広町」でも、お互いの記事が出る。記事の無い駅名で検索してもグループの記事が出る）。辞書に無い location は自動で「その他」県・単独グループにフォールバックするので、新しい記事を追加してビルドするだけで反映される |
| 見た目 | 暖色パレット（暖簾の深い赤のヘッダー、鶏油のオレンジ、琥珀の星、オフホワイト背景、ダークグレー文字）。**ダークモード**（OS 設定に従い、ヘッダーのボタンで切り替え・保存） |
| 写真 | `npm run photo -- <写真> <スラッグ>` で取り込み（iPhone の HEIC 可、縮小・EXIF/GPS 削除）。写真が無い記事には Unsplash のイメージ画像を「イメージ」ラベル付きで表示 |
| その他 | RSS（`/rss.xml`）、sitemap、OGP / Twitter カード、レスポンシブ（375px 確認済み） |

## 3. いまの記事

| 種別 | 記事 | 評価 |
|---|---|---|
| 本物 | iekei Tokyo 王道家（末広町・家系・2026-09-10）— `pickup: true`（殿堂入りピックアップ） | 5.0 |
| 本物 | 武将家外伝（秋葉原・家系・2026-09-16） | 4.3 |

サンプル記事（熊田家・極太堂）は 2026-09-19 に削除済み。`PhotoGallery` コンポーネントの使用例（`.mdx`、複数写真ギャラリー）も熊田家と一緒に無くなったので、実際に使う記事が増えたら改めて `.mdx` 化して使う

## 4. 設計上の決まりごと（プロンプトを書くときに知っておくと良いこと）

- **色はテーマトークンで指定**（`bg-surface` / `text-ink` / `border-line` / `text-brand-fg` / バッジ用 `bg-chip-brand` など、`src/styles/global.css`）。ライト／ダークはトークンの値が切り替わる仕組みなので、`dark:` を個別に書かない
- サブパス配信（`/ramen-blog/`）なので、サイト内リンクは `withBase()` を通す
- 記事データの取得は `src/lib/posts.ts` の `getPublishedPosts()` に統一
- 主なコンポーネント: `PostListItem`（一覧の 1 行）/ `StarRating`（星）/ `PostFilters`（絞り込み）/ `TermPosts`・`TermCard`（系統／エリア／タグ別ページ）/ `AreaSearchBox`（エリアの近接駅検索）/ `PhotoGallery`（記事本文の複数写真・Lightbox）/ `Breadcrumbs`（パンくず＋ JSON-LD）/ `RelatedPosts`（関連記事）/ `PickupPosts`（殿堂入りピックアップ）/ `ShareButtons`（SNS シェア＆ URL コピー）/ `TableOfContents` / `PostNav` / `ThemeToggle`
- 記事本文に複数の写真を並べたいときは、記事ファイルを `.mdx`（`.md` ではなく）にして `import PhotoGallery from '../../components/PhotoGallery.astro'` → `<PhotoGallery photos={[{ src, alt, caption? }, ...]} />` を本文中に置く。`src` は `src/assets/posts/` からインポートした画像（`npm run photo` で取り込んだもの。最適化される）でも、Unsplash などのリモート URL 文字列でもよい
- エリア（駅）に紐づく都道府県・近接駅グループは `src/lib/location-map.ts` の `AREA_GROUPS`（グループ名がキー、値が `{ prefecture, stations }`）で管理。新しい `location` を使う記事を追加したら、該当するグループの `stations` に駅名を足す（未登録でもビルドは失敗しない）。`getLocationInfo()` / `getGroupStations()` で駅名から逆引きする
- 詳細な規約は `CLAUDE.md`、使い方は `README.md`、作業履歴は `docs/HANDOFF.md`

## 5. 作業の進め方

- ユーザーが Claude Code に指示 → Claude が実装・ローカルで動作確認 → GitHub に PR を作成 → **ユーザーが GitHub 上でマージ**（Claude はマージできない）→ 自動デプロイ → Claude が本番を確認
- 記事は、ユーザーが「店名／場所／訪問日／系統／注文／値段／評価／感想メモ／写真パス」を投げると Claude が下書き → PR にする流れ。Claude はメモに無い味の感想を足さない
- ダミー写真の店（熊田家など）に本物の写真を付けるときは `npm run photo -- <写真> <スラッグ> --force`

## 6. まだやっていないこと・アイデア

現時点で「予定していたものはすべて完了」。以下は候補（未着手・未決定）:

- 記事の全文検索（店名・本文などのキーワード。エリア〔駅〕検索は実装済み）
- 最寄駅の複数指定、営業時間の曜日別対応など、店舗情報のさらなる拡充（地図リンク・営業時間・最寄り駅は実装済み）
- 訪問回数や「再訪したい度」などの独自指標
- OGP 画像の自動生成（店名・評価入り）
- アクセス解析、独自ドメイン

## 7. Claude への指示の書き方のコツ

- 「どのページの・何を・どう変えたいか」を書けば、ファイルの場所や実装方法は Claude が判断する
- 見た目の変更は「参考にするサイトの雰囲気」や「優先順位（情報密度／読みやすさ）」があると精度が上がる
- 1 回の指示は 1 テーマにまとめると PR が読みやすい（大きな改修でも 1 PR にまとめて動作確認までしてから出す）
- 「承認なしで進めて」と言えば、複数タスクをまとめて PR まで作る（マージだけはユーザーが行う）
