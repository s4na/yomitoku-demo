# GitHub Actions ワークフローテンプレート

このディレクトリには、GitHub Actionsワークフローのテンプレートファイルが含まれています。

## 📁 ファイル

### release-models.yml

YomiToku ONNXモデルを自動的にGitHub Releasesにアップロードするワークフローです。

**機能**:
- YomiToku Pythonパッケージをインストール
- テキスト検出モデル（DBNet）をONNX形式でエクスポート
- テキスト認識モデル（PARSeq）をONNX形式でエクスポート
- モデルファイルをGitHub Releasesに自動アップロード
- ファイルサイズの検証（最低1MB以上）

## 🚀 使用方法

1. ワークフローファイルを `.github/workflows/` ディレクトリにコピー:

```bash
mkdir -p .github/workflows
cp workflows-templates/release-models.yml .github/workflows/
```

2. 変更をコミット＆プッシュ:

```bash
git add .github/workflows/release-models.yml
git commit -m "Add model release workflow"
git push
```

3. GitHubリポジトリで実行:
   - **Actions** タブに移動
   - **Release ONNX Models** ワークフローを選択
   - **Run workflow** ボタンをクリック

## ⚙️ カスタマイズ

### リリースタグの変更

デフォルトでは `models-v1` タグでリリースされます。別のバージョンを使用する場合は、ワークフローファイルの以下の行を編集してください：

```yaml
tag_name: models-v1  # models-v2, models-v3 など
```

### 自動トリガー

タグをプッシュしたときに自動実行する場合は、以下のコメントを解除してください：

```yaml
on:
  workflow_dispatch:  # 手動実行
  push:
    tags:
      - 'models-v*'  # models-v で始まるタグでトリガー
```

## 📊 実行時間

- 約5-10分（モデルのダウンロードとエクスポートを含む）
- ネットワーク速度とGitHub Actionsの実行環境に依存

## 🔍 トラブルシューティング

### ワークフローが失敗する

1. Actions タブでエラーログを確認
2. YomiTokuのバージョンを確認（`pip list | grep yomitoku`）
3. モデルファイルのサイズを確認（最低1MB以上必要）

### リリースが作成されない

- リポジトリの権限を確認（`contents: write` が必要）
- `GITHUB_TOKEN` がアクションで利用可能か確認

## 📄 ライセンス

YomiTokuモデルは **CC BY-NC-SA 4.0** ライセンスです。
詳細: https://www.mlism.com/
