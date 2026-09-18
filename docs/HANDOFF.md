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
- [x] `astro check` 0 エラー、`npm run build` 成功（2026-09-18 時点）
- [x] GitHub Pages デプロイ準備（2026-09-18）
  - git 2.55 を winget でインストール、`git init -b main` + 初期コミット済み
  - `.github/workflows/deploy.yml`（`withastro/action@v6` + `actions/deploy-pages@v5`）
  - `astro.config.mjs`: `site: 'https://enoenomirai-beep.github.io'`, `base: '/ramen-blog'`
  - サイト内リンクは `src/consts.ts` の `withBase()` 経由に統一（favicon / ヘッダー・フッター / カード / パンくず / 系統リンク / RSS）。ビルド成果物の HTML・rss.xml・sitemap で `/ramen-blog/` プレフィックスを確認済み
  - 旧コピー `ramen-blog/ramen-blog/`（scratch 時代の残骸）を削除

## 残り：GitHub へ push して公開

ユーザーが GitHub 側で行う作業（Claude からは代行できない）：

1. GitHub で **空の**リポジトリ `enoenomirai-beep/ramen-blog` を作成（README / .gitignore / license は付けない）
2. ローカルから push：
   ```powershell
   git remote add origin https://github.com/enoenomirai-beep/ramen-blog.git
   git push -u origin main
   ```
   （初回は Git Credential Manager のブラウザ認証が開く）
3. リポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に変更
4. Actions タブで "Deploy to GitHub Pages" が緑になったら `https://enoenomirai-beep.github.io/ramen-blog/` で確認
   - トップ・記事ページ・`/ramen-blog/rss.xml`・OGP 画像の URL（`view-source` で `og:image`）を目視

ユーザー名やリポジトリ名を変える場合は `astro.config.mjs` の `site` / `base` と、README・CLAUDE.md 内の URL も合わせて直す。

代替案（GitHub が使えないとき）：Cloudflare Pages（wrangler で `dist` を直接アップロード）。その場合は `base` を外す。

## そのほかの次の候補

- 記事ページの前後記事ナビ、本文の目次
- 系統別ページ（`/styles/家系/`）
- ダークモード
- 実際の写真への差し替え（`src/assets/posts/` のファイルを置き換えるだけ）

## 注意事項

- `base: '/ramen-blog'` のため、`href="/..."` の直書きは本番でリンク切れになる。必ず `withBase()` を使う
- Node.js 24 は `C:\Program Files\nodejs`、git は `C:\Program Files\Git\cmd` にある。Claude のツール用シェルでは PATH に入っていないことがあるので、コマンドの先頭で `$env:Path = "C:\Program Files\nodejs;C:\Program Files\Git\cmd;" + $env:Path` を付ける
- dev サーバーは Claude desktop の `preview_start`（`.claude/launch.json` の `astro-dev`）で起動できる（2026-09-18 に確認）。URL は `http://localhost:4321/ramen-blog/`。手動なら `npx astro dev --background` / `npx astro dev stop`
