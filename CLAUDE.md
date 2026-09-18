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

検証は `npx astro check`（型）→ `npm run build`（記事数 + トップ + 系統別（一覧 1 + 系統数）ページと rss.xml / sitemap が生成されること。2026-09-19 時点で記事 4・系統 2 = 8 ページ）。

## 構成と規約

- 記事: `src/content/posts/*.md`（ファイル名 = URL スラッグ）。スキーマは `src/content.config.ts`
- フロントマターのキーは snake_case（`shop_name`, `image_alt` など）
- zod は `astro/zod` から import（`astro:content` の `z` は Astro 8 で削除予定）
- Tailwind v4: 設定は `src/styles/global.css` の `@theme`。`tailwind.config.js` は無い
- 色は `src/styles/global.css` のテーマトークンで書く：面 `bg-surface` / `bg-surface-raised`（カード）/ `bg-surface-sunken`、文字 `text-ink` / `text-ink-muted` / `text-ink-faint`、線 `border-line` / `border-line-strong`、ブランド `text-brand-fg`（リンク・スコア）、バッジ `bg-chip-brand text-chip-brand-fg` / `bg-chip text-chip-fg`、ヘッダー `bg-header text-header-ink`。固定色は `brand-*`（深い赤）/ `accent-*`（オレンジ）/ `star` / `soy-*`。`stone-*` や `dark:` を直接書かない（ダークモードは `<html data-theme="dark">` でトークンの値が切り替わる。新しい色が必要なら `:root` と `[data-theme="dark"]` の両方にトークンを足す）
- 記事本文の見出し・表・引用の装飾は `global.css` の `.article-body` ルール（`.prose` の上に重ねる。レイヤー外に書いてあるので `prose-*` 修飾子より優先される）
- 画像は `src/assets/posts/` に置き、フロントマターの `image` で相対パス指定。`image` があれば `image_alt` 必須。`image` が無い記事は `src/lib/placeholder.ts` の Unsplash 画像を「イメージ」ラベル付きで出す
- 評価 `rating` は 1〜5 の 0.1 刻み。表示は `StarRating.astro`（端数ぶん星を部分的に塗る）。一覧の 1 行は `PostListItem.astro`
- 記事の取得は `src/lib/posts.ts` の `getPublishedPosts()`（draft 除外・新しい順）を使う。`getCollection` を直接呼ばない。系統別 URL は `stylePath()`
- 一覧の絞り込み・並び替えは `src/components/PostFilters.astro` のクライアントスクリプト。カード側は `index.astro` の `<li data-post ...>` の data 属性を読む
- 公開先は GitHub Pages（`https://enoenomirai-beep.github.io/ramen-blog/`）。`astro.config.mjs` の `site` + `base: '/ramen-blog'` から絶対 URL（RSS / sitemap / OGP / canonical）を生成
- サブパス配信なので、サイト内リンク（`/`, `/posts/...`, `/rss.xml`, favicon）は必ず `src/consts.ts` の `withBase()` を通す。`href="/..."` を直書きしない
- 開発サーバーの URL は `http://localhost:4321/ramen-blog/`（ルート `/` は 404 になる）
- `main` への push で `.github/workflows/deploy.yml`（withastro/action）が自動デプロイ
- サンプル画像は `node scripts/make-placeholders.mjs` で再生成できる。実際の写真は `npm run photo -- <写真> <スラッグ>`（`scripts/import-photo.mjs`）で取り込む（縮小・EXIF/GPS 削除、HEIC は `heic-decode` で展開）。元の写真をそのまま `src/assets/posts/` に置かない

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
