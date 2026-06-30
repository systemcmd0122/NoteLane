# NoteLane

**Markdown 対応カンバンボード | Markdown Kanban Board | Markdown 看板工具 | Markdown 칸반 보드**

> 完全無料・サーバー不要・ブラウザだけで完結するタスク管理ツール
> Free, local-first Kanban board — no sign-up, no servers, just your browser.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Kanban Board** | Todo / In Progress / Done の3列管理 |
| **Markdown Preview** | タスクの詳細をMarkdownで記述、リアルタイムプレビュー |
| **Drag & Drop** | カードをドラッグして列間移動・列内並び替え |
| **Priority Labels** | High / Medium / Low の優先度設定と色分け表示 |
| **Search & Filter** | タスクをタイトル・内容でリアルタイム検索 |
| **Edit Tasks** | カードをクリックしてタイトル・内容・優先度を編集 |
| **Dark Mode** | OS設定に連動、手動切り替えも可能 |
| **Multi-language** | 日本語 / English / 中文 / 한국어 |
| **Export / Import** | JSONファイルでデータの書き出し・読み込み |
| **100% Local** | すべてブラウザの LocalStorage に保存。サーバー不要、データ収集なし |
| **No Sign-up** | インストールもアカウント登録も一切不要 |

---

## 🚀 Getting Started

```bash
# 1. クローン / Download
git clone https://github.com/systemcmd0122/NoteLane.git
cd NoteLane

# 2. 依存関係をインストール / Install dependencies
npm install

# 3. 開発サーバー起動 / Start dev server
npm run dev
```

ブラウザで `http://localhost:5173` にアクセス。

---

## 🛠️ Build

```bash
npm run build    # → dist/ に出力
npm run preview  # ビルド結果をプレビュー
```

---

## 📁 Project Structure

```
NoteLane/
├── index.html              # エントリーHTML (SEO meta, JSON-LD, hreflang)
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── public/
│   ├── robots.txt
│   └── sitemap.xml
└── src/
    ├── main.jsx             # React エントリーポイント
    ├── App.jsx
    ├── index.css            # Tailwind + Markdown プレビュースタイル
    ├── hooks/
    │   ├── useLocalStorage.js
    │   └── useDarkMode.js
    ├── i18n/
    │   ├── translations.js       # 4言語対応翻訳データ
    │   └── LanguageContext.jsx    # i18n Context + Provider
    └── components/
        ├── KanbanBoard.jsx       # メインボード (DnD, 検索, Export/Import)
        ├── Column.jsx            # 各列 (SortableContext)
        ├── TaskCard.jsx          # タスクカード (useSortable)
        ├── AddTaskForm.jsx       # タスク追加フォーム
        ├── SearchBar.jsx         # 検索バー
        ├── TaskEditModal.jsx     # タスク編集モーダル
        └── MarkdownPreview.jsx   # Markdown レンダリング
```

---

## 🧩 Tech Stack

- **[Vite](https://vitejs.dev/)** — ビルドツール
- **[React 18](https://react.dev/)** — UI フレームワーク
- **[Tailwind CSS 3](https://tailwindcss.com/)** — スタイリング
- **[@dnd-kit](https://dndkit.com/)** — ドラッグ＆ドロップ
- **[react-markdown](https://remark.js.org/)** — Markdown レンダリング
- **[remark-gfm](https://github.com/remarkjs/remark-gfm)** — GFM (テーブル・打ち消し線 等)

---

## 🌐 Multi-language

| Language | Code | Label |
|---|---|---|
| 日本語 | `ja` | 日本語 |
| English | `en` | English |
| 中文 | `zh` | 中文 |
| 한국어 | `ko` | 한국어 |

言語はヘッダーのボタンで切り替え、選択は LocalStorage に保存されます。

---

## 📄 License

MIT
