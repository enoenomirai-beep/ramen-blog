# 作業引き継ぎメモ

最終更新: 2026-09-18（Claude Code セッションからの引き継ぎ）

## プロジェクト概要

ラーメン食べ歩きレビュー専用の静的ブログ「らーめん食べ歩きログ」。
Astro 7.3 + Tailwind CSS 4 + MDX。記事は Content Collections（`src/content/posts/*.md`）で管理。
詳しい使い方は [README.md](../README.md)、構成・規約は [CLAUDE.md](../CLAUDE.md) を参照。

## 完了していること

- [x] プロジェクト初期化、Tailwind / MDX / typography 導入
- [x] Content Collections スキーマ（必須: title / date / shop_name / style / location / rating、任意: image / image_alt / description / menu / price / tags / draft）
- [x] サンプル記事 3 件（熊田家・家系・つくばみらい / 武将家 外伝・家系・秋葉原 / 極太堂（架空）・二郎系・神保町）
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
- [x] **公開済み（2026-09-18）**: https://enoenomirai-beep.github.io/ramen-blog/
  - リポジトリ: https://github.com/enoenomirai-beep/ramen-blog（`main`、Pages の Source = GitHub Actions）
  - 本番で確認済み: トップ / 記事 3 ページ / `rss.xml` / `sitemap-index.xml` / favicon / OGP・canonical の URL / 画像の読み込み。コンソールエラーなし

## 運用

- 記事を追加・修正したら `git add` → `git commit` → `git push`。1〜2 分で本番に反映される（Actions タブで進捗を確認できる）
- git が見つからないターミナルでは先頭で `$env:Path = "C:\Program Files\Git\cmd;" + $env:Path`
- ユーザー名やリポジトリ名を変える場合は `astro.config.mjs` の `site` / `base` と、README・CLAUDE.md 内の URL も合わせて直す

## そのほかの次の候補

- 実際の写真への差し替え（`src/assets/posts/` のファイルを置き換えるだけ）

## 注意事項

- `base: '/ramen-blog'` のため、`href="/..."` の直書きは本番でリンク切れになる。必ず `withBase()` を使う
- Node.js 24 は `C:\Program Files\nodejs`、git は `C:\Program Files\Git\cmd` にある。Claude のツール用シェルでは PATH に入っていないことがあるので、コマンドの先頭で `$env:Path = "C:\Program Files\nodejs;C:\Program Files\Git\cmd;" + $env:Path` を付ける
- dev サーバーは Claude desktop の `preview_start`（`.claude/launch.json` の `astro-dev`）で起動できる（2026-09-18 に確認）。URL は `http://localhost:4321/ramen-blog/`。手動なら `npx astro dev --background` / `npx astro dev stop`
