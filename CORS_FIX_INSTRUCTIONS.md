# 🔧 CORS問題の修正手順

## 問題の概要

GitHub Releases URLからのモデルロードは、以下のCORSヘッダーによりブラウザでブロックされます：
- `Cross-Origin-Resource-Policy: same-origin`
- `Access-Control-Allow-Origin` ヘッダーなし

## 実施した修正

### ✅ 1. `main.js` の修正（完了）
- GitHub Releases fallbackを削除
- ローカルモデルファイルのみを使用するように簡素化
- **コミット済み・プッシュ済み**

### ⚠️ 2. `.github/workflows/deploy.yml` の更新（手動対応が必要）

デプロイワークフローを更新してモデルをエクスポートする必要がありますが、
GitHub App の権限制限により自動更新できませんでした。

## 📋 手動での対応手順

### オプション1: テンプレートをコピー（推奨）

```bash
# 更新されたワークフローテンプレートをコピー
cp github/workflows/deploy.yml .github/workflows/deploy.yml

# 変更を確認
git diff .github/workflows/deploy.yml

# コミット・プッシュ
git add .github/workflows/deploy.yml
git commit -m "fix: Update deploy workflow to export ONNX models (CORS fix)"
git push
```

### オプション2: GitHub UIで直接編集

1. GitHubのリポジトリページに移動
2. `.github/workflows/deploy.yml` を開く
3. 編集ボタン（鉛筆アイコン）をクリック
4. `github/workflows/deploy.yml` の内容をコピー
5. 貼り付けて保存
6. コミットメッセージ: "fix: Update deploy workflow to export ONNX models (CORS fix)"

## 🔍 更新内容の詳細

追加される手順：

```yaml
- name: 🐍 Set up Python
  uses: actions/setup-python@v5
  with:
    python-version: '3.11'

- name: 📦 Install YomiToku
  run: |
    pip install yomitoku torch --no-cache-dir

- name: 📥 Export ONNX models
  run: |
    python3 << 'EOF'
    from yomitoku import DocumentAnalyzer
    import os

    print("🔄 Exporting models for GitHub Pages...")
    analyzer = DocumentAnalyzer(configs={"device": "cpu"})

    # Export detector
    text_detector = analyzer.text_detector
    text_detector.infer_onnx = True
    text_detector.convert_onnx("./models/text_detector.onnx")

    detector_size = os.path.getsize("./models/text_detector.onnx")
    print(f"✅ Detector: {detector_size / 1024 / 1024:.2f} MB")

    # Export recognizer
    text_recognizer = analyzer.text_recognizer
    text_recognizer.infer_onnx = True
    text_recognizer.convert_onnx("./models/text_recognizer.onnx")

    recognizer_size = os.path.getsize("./models/text_recognizer.onnx")
    print(f"✅ Recognizer: {recognizer_size / 1024 / 1024:.2f} MB")
    EOF
```

## ✅ 期待される結果

ワークフロー更新後：
1. mainブランチへのpushで自動デプロイが実行される
2. デプロイ時にYomiTokuモデルが自動的にONNX形式でエクスポートされる
3. モデルファイルがGitHub Pagesアーティファクトに含まれる
4. GitHub PagesサイトからモデルがCORSエラーなしでロードできる

## 📊 確認方法

ワークフロー実行後：
1. GitHub Actions タブで実行ログを確認
2. "📥 Export ONNX models" ステップで以下が表示されることを確認：
   ```
   ✅ Detector: XX.XX MB
   ✅ Recognizer: XX.XX MB
   ```
3. デプロイされたサイト（https://s4na.github.io/yomitoku-demo/）にアクセス
4. ブラウザの開発者ツール（Console）でエラーがないことを確認
5. 画像をアップロードしてOCRが動作することを確認

## 📚 参考資料

- 更新されたワークフロー: `github/workflows/deploy.yml`
- ワークフロー詳細: `github/README.md`
- CORS問題の詳細: [MDN - CORS](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS)
