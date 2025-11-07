# GitHub Actions ワークフロー

このディレクトリには、GitHub Actionsで使用するワークフローファイルが含まれています。

⚠️ **重要**: このディレクトリは `.github` にリネームして使用します。

## 📁 ディレクトリ構造

```
github/
├── workflows/
│   └── release-models.yml  # モデルリリースワークフロー
└── README.md
```

## 🚀 セットアップ方法

### オプション1: ディレクトリをリネーム（推奨・簡単）

```bash
# このディレクトリを .github にリネーム
mv github .github

# 変更をコミット
git add .github/
git commit -m "Add GitHub Actions workflow"
git push
```

### オプション2: ファイルをコピー

```bash
# .github ディレクトリを作成してファイルをコピー
mkdir -p .github/workflows
cp github/workflows/release-models.yml .github/workflows/

# 変更をコミット
git add .github/
git commit -m "Add GitHub Actions workflow"
git push
```

## 📋 ワークフロー詳細

### release-models.yml

YomiToku ONNXモデルを自動的にGitHub Releasesにアップロードするワークフローです。

**機能**:
- YomiToku Pythonパッケージをインストール
- テキスト検出モデル（DBNet）をONNX形式でエクスポート（約15-20MB）
- テキスト認識モデル（PARSeq）をONNX形式でエクスポート（約10-15MB）
- モデルファイルをGitHub Releasesに自動アップロード（タグ: `models-v1`）
- ファイルサイズの検証（最低1MB以上）

**実行時間**: 約5-10分

**実行方法**:
1. GitHubリポジトリの **Actions** タブに移動
2. 左サイドバーから **Release ONNX Models** を選択
3. **Run workflow** ボタンをクリック
4. 完了後、Releasesタブに `models-v1` が作成されます

## ⚙️ カスタマイズ

### リリースタグの変更

`workflows/release-models.yml` の以下の行を編集:

```yaml
tag_name: models-v1  # models-v2, models-v3 など
```

### 自動トリガーの設定

タグをプッシュしたときに自動実行する場合、`workflows/release-models.yml` のコメントを解除:

```yaml
on:
  workflow_dispatch:  # 手動実行
  push:               # この行のコメントを解除
    tags:             # この行のコメントを解除
      - 'models-v*'   # この行のコメントを解除
```

## 🔍 トラブルシューティング

### ワークフローが表示されない
- `.github/workflows/` ディレクトリにファイルが配置されているか確認
- ファイル名が `.yml` で終わっているか確認
- mainブランチにプッシュされているか確認

### ワークフローが失敗する
- Actions タブでエラーログを確認
- リポジトリの権限を確認（Settings → Actions → General → Workflow permissions → Read and write permissions）
- YomiTokuのインストールエラーがないか確認

### リリースが作成されない
- リポジトリの権限を確認（`contents: write` が必要）
- 既に同じタグのリリースが存在しないか確認

## 📄 ライセンス

YomiTokuモデルは **CC BY-NC-SA 4.0** ライセンスです。
詳細: https://www.mlism.com/
