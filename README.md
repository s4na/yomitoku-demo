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
│   ├─ download_models.sh  # ONNXモデルダウンロードスクリプト
│   └─ README.md           # モデルセットアップ詳細ガイド
├─ github/                 # .githubにリネームして使用
│   ├─ workflows/
│   │   └─ release-models.yml  # モデルリリースワークフロー
│   └─ README.md           # GitHub Actions詳細ガイド
├─ .github/                # GitHub Actions設定（デプロイ用）
│   └─ workflows/
│        └─ deploy.yml     # GitHub Pages自動デプロイ
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

### ⚠️ モデルが読み込めない場合

**エラー**: `❌ モデルの読み込みに失敗しました`

**原因**: モデルファイルがダウンロードされていないか、HuggingFaceのモデルへのアクセスが制限されています。

**解決方法**:

#### オプション 1: YomiToku Pythonパッケージを使用（推奨）

```bash
# 1. リポジトリをクローン
git clone https://github.com/s4na/yomitoku-demo.git
cd yomitoku-demo

# 2. YomiTokuをインストール
pip install yomitoku

# 3. モデルをエクスポート
python3 << 'EOF'
from yomitoku import DocumentAnalyzer

analyzer = DocumentAnalyzer(configs={"device": "cpu"})

# モデルをONNX形式でエクスポート
detector = analyzer.detector
detector.infer_onnx = True
detector.export_model_to_onnx("./models/text_detector.onnx")

recognizer = analyzer.recognizer
recognizer.infer_onnx = True
recognizer.export_model_to_onnx("./models/text_recognizer.onnx")

print("✅ Models exported successfully!")
EOF

# 4. ローカルサーバーを起動
python -m http.server 8000

# 5. ブラウザでアクセス
# http://localhost:8000
```

#### オプション 2: 自動ダウンロードスクリプト（実験的）

```bash
git clone https://github.com/s4na/yomitoku-demo.git
cd yomitoku-demo
bash models/download_models.sh  # HuggingFaceから直接ダウンロード
python -m http.server 8000
```

**注意**: HuggingFaceのモデルへのアクセスに制限がある場合、このスクリプトは失敗します。
その場合はオプション1を使用してください。

#### オプション 3: GitHub Actionsで自動リリース（推奨・GitHub Pages用）

GitHub Actionsを使って、モデルファイルを自動的にGitHub Releasesにアップロードできます。

**セットアップ手順**:

1. `github` ディレクトリを `.github` にリネーム:
   ```bash
   mv github .github
   git add .github/
   git commit -m "Add GitHub Actions workflow"
   git push
   ```

2. GitHubリポジトリの **Actions** タブに移動

3. 左サイドバーから **Release ONNX Models** ワークフローを選択

4. **Run workflow** ボタンをクリックして実行

ワークフローが完了すると（約5-10分）、モデルファイルが `models-v1` リリースに自動的にアップロードされ、GitHub Pagesで利用可能になります。

**仕組み**:
- YomiToku Pythonパッケージをインストール
- モデルをONNX形式でエクスポート（約20-30MB）
- GitHub Releasesに自動アップロード
- `main.js` が自動的にこのリリースからモデルを読み込む

詳細: [`github/README.md`](github/README.md)

**トラブルシューティング**:
- ブラウザのコンソールでエラーを確認
- モデルファイルのサイズを確認: `ls -lh models/*.onnx`（1MB以上であること）
- GitHub Actions のログでモデルダウンロードステップが成功しているか確認
- 詳細なセットアップ手順: [`models/README.md`](models/README.md)

## 📚 参考リンク

- [YomiToku GitHub](https://github.com/kotaro-kinoshita/yomitoku)
- [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/)
- [GitHub Pages ドキュメント](https://docs.github.com/ja/pages)

## 📄 ライセンス

⚠️ **重要**: このプロジェクトは **2つの異なるライセンス** で構成されています。

### ライセンス概要

| 対象 | ライセンス | 商用利用 | 場所 |
|------|-----------|---------|------|
| **このGitHubリポジトリのコード** | MIT License | ✅ 可能 | このリポジトリ内 |
| **YomiToku ONNXモデル** | CC BY-NC-SA 4.0 | ❌ 別途ライセンス必要 | 別途入手 |

---

### 1. GitHubリポジトリのコード（MIT License）

このリポジトリに含まれる**すべてのコード**（HTML、JavaScript、CSS、シェルスクリプト等）は **MIT License** です。

```
MIT License
Copyright (c) 2025 s4na
```

- ✅ 商用利用可能
- ✅ 改変・再配布自由
- ✅ 無料

詳細: [LICENSE](LICENSE) ファイル

### 2. YomiToku ONNXモデル（CC BY-NC-SA 4.0）

モデルファイル（`text_detector.onnx`, `text_recognizer.onnx`）は **別ライセンス** です。

**重要**:
- ❌ モデルファイルはこのリポジトリに含まれていません
- ❌ モデルファイルは別途入手が必要です
- ⚠️ モデルのライセンスはこのリポジトリのMITライセンスとは**別**です

**モデルライセンス**: CC BY-NC-SA 4.0
- ✅ **個人利用**: 無料
- ✅ **研究目的**: 無料
- ✅ **非商用プロジェクト**: 無料
- ❌ **商用利用**: 別途ライセンスが必要 → [MLism株式会社](https://www.mlism.com/)に問い合わせ

モデルの提供元:
- ライセンス: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
- プロジェクト: [YomiToku](https://github.com/kotaro-kinoshita/yomitoku)
- 商用ライセンス: https://www.mlism.com/

---

### ⚠️ 使用時の注意

このデモアプリケーションを使用する場合：

1. **コードのみ使用（モデルなし）**: MIT Licenseに従う
2. **コード + YomiTokuモデルを使用**: 両方のライセンス（MIT + CC BY-NC-SA 4.0）に従う必要があります

商用利用する場合は、YomiTokuモデルの商用ライセンスが必要です。

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
