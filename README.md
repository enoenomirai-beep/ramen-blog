# 🍜 らーめん食べ歩きログ

Astro + Tailwind CSS で作ったラーメン食べ歩きレビュー専用の静的ブログです。
記事は Astro の Content Collections で管理し、Markdown / MDX で書けます。

## 技術スタック

- [Astro](https://astro.build) v7（静的出力）
- [Tailwind CSS](https://tailwindcss.com) v4（`@tailwindcss/vite` 経由）+ `@tailwindcss/typography`
- `@astrojs/mdx`（MDX 記事対応）
- `@astrojs/rss`（`/rss.xml`）・`@astrojs/sitemap`（`/sitemap-index.xml`）

## 機能

- 記事一覧：系統タグ・場所・評価（★n 以上）で絞り込み、新しい順／古い順／評価順で並び替え。条件は URL クエリ（`?style=家系&location=秋葉原&rating=4&sort=rating`）に同期されるので、絞り込んだ状態のままリンクを共有できます
- 記事ページ：店舗情報・評価・写真・Markdown 本文、本文の目次（`##` / `###` から自動生成、見出しが 2 つ以上のときだけ表示、折りたたみ可）、前後の記事へのナビ（日付順で「前の記事」= 古い記事、「次の記事」= 新しい記事）
- 系統別ページ：`/styles/`（系統の一覧）と `/styles/家系/` のように系統ごとの記事一覧。記事ページの系統バッジとヘッダーの「系統別」からたどれます。新しい系統はフロントマターの `style` に書くだけで自動的にページが増えます
- ダークモード：初回は OS の設定に従い、ヘッダー右端の月／太陽ボタンで切り替え（選択はブラウザに保存）
- RSS フィード、sitemap、OGP / Twitter カード（記事ページは写真を OGP 画像として使用）

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

## コマンド

| コマンド          | 内容                                          |
| :---------------- | :-------------------------------------------- |
| `npm install`     | 依存パッケージをインストール                  |
| `npm run dev`     | 開発サーバーを起動（`http://localhost:4321/ramen-blog/`） |
| `npm run build`   | 本番用ビルドを `./dist/` に出力               |
| `npm run preview` | ビルド結果をローカルでプレビュー              |
| `npx astro check` | 型チェック                                    |
| `npm run photo -- <写真> <スラッグ>` | 写真を記事用に取り込み（縮小・EXIF 削除） |

## ディレクトリ構成

```text
/
├── public/                 # 静的アセット（favicon など）
├── src/
│   ├── assets/
│   │   ├── og-default.jpg      # OGP のデフォルト画像
│   │   └── posts/              # 記事の写真
│   ├── components/
│   │   ├── PostCard.astro      # 記事一覧のカード
│   │   ├── PostFilters.astro   # 絞り込み・並び替え UI
│   │   ├── PostNav.astro       # 記事ページの前後記事ナビ
│   │   ├── RatingStars.astro   # 5段階評価の星表示
│   │   ├── TableOfContents.astro # 記事本文の目次
│   │   └── ThemeToggle.astro   # ライト／ダーク切り替えボタン
│   ├── content/
│   │   └── posts/              # ★ 記事（.md / .mdx）を置く場所
│   ├── layouts/
│   │   └── BaseLayout.astro    # 共通レイアウト（ヘッダー／フッター／OGP）
│   ├── lib/posts.ts            # 記事の取得・系統ごとのグループ化（各ページ共通）
│   ├── pages/
│   │   ├── index.astro         # トップページ（記事一覧 + 絞り込み）
│   │   ├── posts/[id].astro    # 記事詳細ページ
│   │   ├── styles/index.astro  # 系統の一覧
│   │   ├── styles/[style].astro # 系統ごとの記事一覧
│   │   └── rss.xml.ts          # RSS フィード
│   ├── styles/global.css       # Tailwind の読み込みとテーマ設定
│   ├── consts.ts               # サイト名などの定数、withBase()（base 付きリンク）
│   └── content.config.ts       # Content Collections のスキーマ定義
├── .github/workflows/deploy.yml   # GitHub Pages への自動デプロイ
├── scripts/
│   ├── import-photo.mjs           # 写真の取り込み（縮小・EXIF 削除）
│   └── make-placeholders.mjs      # サンプル画像の生成
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
rating: 5                 # 5段階評価（1〜5 の整数）
# --- 以下は任意 ---
image: ../../assets/posts/kumadaya-tsukubamirai.jpg   # 一杯の写真（記事ファイルからの相対パス）
image_alt: "写真の説明"                                  # image を指定した場合は必須
description: "一覧カードに表示する短い説明"
menu: "ラーメン（並）・味濃いめ"
price: 950
tags: ["豚骨醤油", "ライス無料"]
draft: false              # true にすると一覧・ビルドから除外
---

本文を Markdown で書きます。
```

### フロントマターの必須項目

| プロパティ  | 型             | 説明                             |
| :---------- | :------------- | :------------------------------- |
| `title`     | string         | 記事のタイトル                   |
| `date`      | date           | 訪問日または公開日               |
| `shop_name` | string         | ラーメン店の名前                 |
| `style`     | string         | ラーメンの系統（例: `"家系"`）   |
| `location`  | string         | お店の場所                       |
| `rating`    | number（1〜5） | 5段階評価のスコア                |

スキーマは [`src/content.config.ts`](src/content.config.ts) で定義しており、
必須項目が欠けていたり型が違う場合はビルド時にエラーになります。

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
推奨は 3:2 前後の横向きですが、縦写真でも中央でトリミングして表示されます。

画像は Astro の `<Image>` でビルド時に WebP へ変換・リサイズされ、一覧カードと記事ページの両方に表示されます。
`image` を省略した記事はカードに 🍜 のプレースホルダーが出ます。
熊田家・武将家 外伝の写真は実際に撮ったもの、極太堂（架空の店）はダミー画像です。ダミーは `node scripts/make-placeholders.mjs` で生成できます。
既存の写真を差し替えるには、記事のスラッグを指定して上のコマンドを `--force` 付きで実行するだけです。
