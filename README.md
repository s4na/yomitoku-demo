# 🚀 YomiToku Lite — GitHub Pages 自動デプロイ（Node.js 24 LTS対応）

[![Deploy to GitHub Pages](https://github.com/s4na/yomitoku-demo/workflows/Deploy%20YomiToku%20Lite%20to%20GitHub%20Pages/badge.svg)](https://github.com/s4na/yomitoku-demo/actions)

完全無料・ブラウザ上で動作する日本語OCRデモアプリケーション

🌐 **デモサイト**: https://s4na.github.io/yomitoku-demo/

## 📖 概要

YomiToku Lite は、ONNX Runtime Web を使用してブラウザ上で完全に動作する日本語OCRシステムです。

### 主な特徴

- ✅ **完全ブラウザ内処理** - サーバーへの画像送信なし、プライバシー保護
- ✅ **自動デプロイ** - GitHub Actions で自動的に GitHub Pages へデプロイ
- ✅ **Node.js 24 LTS対応** - 長期サポート版で安定動作
- ✅ **完全無料** - インフラコスト0円
- ✅ **HTTPS + CDN** - GitHub Pages の高速配信

## 🏗️ ディレクトリ構成

```
yomitoku-demo/
├─ index.html              # メインHTMLファイル
├─ main.js                 # OCR処理のJavaScript実装
├─ style.css               # スタイルシート
├─ models/
│   └─ download_models.sh  # ONNXモデルダウンロードスクリプト
├─ .github/
│   └─ workflows/
│        └─ deploy.yml     # GitHub Actions設定
├─ package.json            # npm設定（オプション）
└─ README.md
```

## 🚀 セットアップ手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/s4na/yomitoku-demo.git
cd yomitoku-demo
```

### 2. GitHub Actions ワークフローの作成

**重要**: まず GitHub Actions のワークフローファイルを作成します。

以下の内容で `.github/workflows/deploy.yml` を作成してください：

```yaml
name: Deploy YomiToku Lite to GitHub Pages

on:
  push:
    branches: ["main"]

permissions:
  contents: write
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: 🧾 Checkout repository
        uses: actions/checkout@v4

      - name: 🟢 Set up Node.js (LTS v24)
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: "npm"

      - name: 📦 Install dependencies (if any)
        run: |
          npm ci || echo "No package.json found, skipping install."

      - name: 📥 Download ONNX models
        run: |
          cd models
          chmod +x download_models.sh
          ./download_models.sh

      - name: 🏗️ Build static site
        run: |
          mkdir dist
          cp -r index.html main.js style.css models dist/
          echo "✅ Files copied to dist/"
          ls -R dist

      - name: 📤 Upload artifact for Pages
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: 🚀 Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 3. GitHub Pages の有効化

1. GitHub リポジトリの **Settings** → **Pages** に移動
2. **Source** を「GitHub Actions」に設定

### 4. デプロイ

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions workflow"
git push origin main
```

これで自動的にデプロイが開始されます！

## 🔧 技術スタック

| 技術 | 説明 |
|------|------|
| **ONNX Runtime Web** | ブラウザでONNXモデルを実行 |
| **YomiToku** | 日本語OCRモデル |
| **GitHub Actions** | CI/CDパイプライン |
| **GitHub Pages** | 静的サイトホスティング |
| **Node.js 24 LTS** | 長期サポート版（2025〜2028年） |

## 📥 使用するモデル

- **テキスト検出**: [yomitoku-text-detector-dbnet-v2](https://huggingface.co/kotaro-kinoshita/yomitoku-text-detector-dbnet-v2)
- **テキスト認識**: [yomitoku-text-recognizer-parseq](https://huggingface.co/kotaro-kinoshita/yomitoku-text-recognizer-parseq)

モデルは GitHub Actions の実行時に自動的にダウンロードされます。

## 🎯 使い方

1. デプロイされたサイトにアクセス: https://s4na.github.io/yomitoku-demo/
2. 画像をアップロード（ドラッグ&ドロップまたはクリック）
3. 自動的にテキスト検出・認識が実行されます
4. 結果が画像とテキストで表示されます

## 🔄 GitHub Actions ワークフロー

### デプロイフロー

1. `main` ブランチへプッシュ
2. Node.js 24 環境をセットアップ
3. ONNXモデルを自動ダウンロード
4. 静的ファイルをビルド
5. GitHub Pages へデプロイ

⏱️ **デプロイ時間**: 約2分

## 💡 カスタマイズ

### モデルの変更

`models/download_models.sh` を編集して、使用するモデルのURLを変更できます。

### UIのカスタマイズ

- `index.html`: HTML構造
- `style.css`: スタイル
- `main.js`: OCR処理ロジック

## 🐛 トラブルシューティング

### デプロイが失敗する場合

1. GitHub Actions のログを確認
2. `Settings` → `Pages` で Source が「GitHub Actions」になっているか確認
3. リポジトリの権限設定を確認

### モデルが読み込めない場合

- ブラウザのコンソールでエラーを確認
- モデルファイルのパスが正しいか確認
- CORS設定を確認

## 📚 参考リンク

- [YomiToku GitHub](https://github.com/kotaro-kinoshita/yomitoku)
- [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/)
- [GitHub Pages ドキュメント](https://docs.github.com/ja/pages)

## 📄 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストは大歓迎です！

1. Fork する
2. Feature ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Request を作成

## 👤 作者

Created by [@s4na](https://github.com/s4na)

## 🙏 謝辞

- [YomiToku](https://github.com/kotaro-kinoshita/yomitoku) プロジェクトに感謝
- ONNX Runtime チームに感謝

---

⭐️ このプロジェクトが役に立ったら、スターをつけてください！
