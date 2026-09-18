# らーめん食べ歩きログ

ラーメン食べ歩きレビュー専用の静的ブログ（Astro 7 + Tailwind CSS 4 + MDX）。
**作業を始める前に [docs/HANDOFF.md](docs/HANDOFF.md) を読むこと**（進捗・保留事項・次のタスク）。
使い方・記事の追加方法は [README.md](README.md)。

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

Node.js は `C:\Program Files\nodejs`。ツール用シェルの PATH に入っていない場合はコマンド先頭で
`$env:Path = "C:\Program Files\nodejs;" + $env:Path` を付ける。

検証は `npx astro check`（型）→ `npm run build`（4 ページ + rss.xml + sitemap が生成されること）。

## 構成と規約

- 記事: `src/content/posts/*.md`（ファイル名 = URL スラッグ）。スキーマは `src/content.config.ts`
- フロントマターのキーは snake_case（`shop_name`, `image_alt` など）
- zod は `astro/zod` から import（`astro:content` の `z` は Astro 8 で削除予定）
- Tailwind v4: 設定は `src/styles/global.css` の `@theme`。`tailwind.config.js` は無い
- 画像は `src/assets/posts/` に置き、フロントマターの `image` で相対パス指定。`image` があれば `image_alt` 必須
- 一覧の絞り込み・並び替えは `src/components/PostFilters.astro` のクライアントスクリプト。カード側は `index.astro` の `<li data-post ...>` の data 属性を読む
- 公開先は GitHub Pages（`https://enoenomirai-beep.github.io/ramen-blog/`）。`astro.config.mjs` の `site` + `base: '/ramen-blog'` から絶対 URL（RSS / sitemap / OGP / canonical）を生成
- サブパス配信なので、サイト内リンク（`/`, `/posts/...`, `/rss.xml`, favicon）は必ず `src/consts.ts` の `withBase()` を通す。`href="/..."` を直書きしない
- 開発サーバーの URL は `http://localhost:4321/ramen-blog/`（ルート `/` は 404 になる）
- `main` への push で `.github/workflows/deploy.yml`（withastro/action）が自動デプロイ
- サンプル画像は `node scripts/make-placeholders.mjs` で再生成できる

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
