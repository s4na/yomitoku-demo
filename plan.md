# GitHub Actions デプロイ設定 追加タスク

## 現状
- リポジトリにGitHub Actionsのワークフロー設定が存在しない
- ローカルブランチ `claude/check-gha-deploy-011CUsosb3mhoZNyFKGzhT46` にコミット済み（ff4649d）
- GitHub Appの`workflows`権限不足によりプッシュが失敗

## 目的
GitHub Pagesへの自動デプロイを設定する

## 実施手順

### 1. 現在のコミットを取り消す
```bash
git reset --soft HEAD~1
git reset --hard HEAD
```

### 2. ワークフローファイルを作成
ファイルパス: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 3. コミット＆プッシュ
```bash
git add .github/workflows/deploy.yml
git commit -m "feat: Add GitHub Actions workflow for automatic deployment

Add workflow to automatically deploy to GitHub Pages on push to main branch."
git push origin claude/check-gha-deploy-011CUsosb3mhoZNyFKGzhT46
```

## 補足事項
- このワークフローはmainブランチへのpush時に自動実行される
- `workflow_dispatch`により、GitHub UIから手動実行も可能
- GitHub Pagesの設定でSourceを "GitHub Actions" に変更する必要がある場合あり
