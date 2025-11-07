# GitHub Actions ワークフロー

このディレクトリには、GitHub Actionsで使用するワークフローファイルが含まれています。

⚠️ **重要**: このディレクトリは `.github` にリネームして使用します。

## 📁 ディレクトリ構造

```
github/
├── workflows/
│   ├── deploy.yml           # GitHub Pages デプロイワークフロー（更新版）
│   └── release-models.yml   # モデルリリースワークフロー
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

### deploy.yml（更新版・推奨）

**CORS問題を解決した改善版のデプロイワークフロー**です。

GitHub Pages デプロイ時にYomiTokuモデルを自動的にエクスポートして含めます。

**機能**:
- GitHub Pagesへの自動デプロイ（mainブランチへのpush時）
- YomiToku Pythonパッケージをインストール
- テキスト検出モデル（DBNet）をONNX形式でエクスポート
- テキスト認識モデル（PARSeq）をONNX形式でエクスポート
- モデルファイルをGitHub Pagesアーティファクトに含める（CORS問題解決）

**重要**: この更新版ワークフローは、GitHub Releases fallbackのCORS問題を解決します。
モデルファイルがGitHub Pagesと同一オリジンに配置されるため、ブラウザから正常にロードできます。

**既存の `.github/workflows/deploy.yml` を更新する場合**:
```bash
# このテンプレートで既存のワークフローを上書き
cp github/workflows/deploy.yml .github/workflows/deploy.yml
git add .github/workflows/deploy.yml
git commit -m "fix: Update deploy workflow to export ONNX models (CORS fix)"
git push
```

**実行時間**: 約3-5分（モデルエクスポート含む）

---

### release-models.yml

YomiToku ONNXモデルを自動的にGitHub Releasesにアップロードするワークフローです。

**注意**: GitHub ReleasesからのモデルロードはCORSエラーで失敗します。
このワークフローはオプションです。deploy.ymlを使用することを推奨します。

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
