# YomiToku ONNX Models

このディレクトリには、YomiToku Liteで使用するONNXモデルファイルを配置します。

## 📥 モデルのダウンロード方法

モデルファイルは大きいため（合計数十MB）、Gitリポジトリには含まれていません。
以下のいずれかの方法でモデルを入手してください。

### 方法1: YomiToku Pythonパッケージを使用（推奨）

最も確実な方法は、YomiTokuの公式Pythonパッケージを使用してモデルをエクスポートすることです。

```bash
# YomiTokuをインストール
pip install yomitoku

# YomiTokuを一度実行してモデルをダウンロード
python3 << 'EOF'
from yomitoku import DocumentAnalyzer
import torch

# 初期化（初回実行時にモデルが自動ダウンロードされる）
analyzer = DocumentAnalyzer(configs={"device": "cpu"})

# 各モジュールのONNXエクスポート
print("Exporting detector model...")
detector = analyzer.detector
detector.infer_onnx = True
detector.export_model_to_onnx("./models/text_detector.onnx")

print("Exporting recognizer model...")
recognizer = analyzer.recognizer
recognizer.infer_onnx = True
recognizer.export_model_to_onnx("./models/text_recognizer.onnx")

print("✅ Models exported successfully!")
EOF
```

### 方法2: 自動ダウンロードスクリプト（実験的）

HuggingFaceから直接ダウンロードを試みます（アクセス制限がある場合は失敗する可能性があります）。

```bash
bash models/download_models.sh
```

### 方法3: GitHub Releasesから取得

モデルがGitHub Releasesにアップロードされている場合は、以下からダウンロードできます：

```bash
# GitHub Releasesから手動でダウンロード
wget https://github.com/s4na/yomitoku-demo/releases/download/models-v1/text_detector.onnx -O models/text_detector.onnx
wget https://github.com/s4na/yomitoku-demo/releases/download/models-v1/text_recognizer.onnx -O models/text_recognizer.onnx
```

**注**: 現在、Releasesにモデルはアップロードされていません。モデルファイルは個別に入手する必要があります。

## 📦 必要なモデルファイル

| ファイル名 | 説明 | 用途 |
|-----------|------|------|
| `text_detector.onnx` | テキスト検出モデル（DBNet） | 画像内のテキスト領域を検出 |
| `text_recognizer.onnx` | テキスト認識モデル（PARSeq） | 検出された領域のテキストを認識 |

## 🚀 セットアップ完了後の実行方法

モデルファイルを配置した後、以下のコマンドでローカルサーバーを起動します：

```bash
# リポジトリのルートディレクトリで実行
python -m http.server 8000

# または
python3 -m http.server 8000
```

その後、ブラウザで http://localhost:8000 にアクセスしてデモを使用できます。

## ☁️ GitHub Pagesでの使用方法

GitHub Pagesでこのデモを動作させるには、以下の手順でモデルファイルをGitHub Releasesにアップロードします：

1. モデルファイルを方法1または2で入手
2. GitHubリポジトリの「Releases」セクションで新しいリリースを作成
3. リリースに `text_detector.onnx` と `text_recognizer.onnx` をアセットとしてアップロード
4. リリースを `models-v1` としてタグ付け
5. GitHub Pagesを有効化

`main.js` は自動的にローカルファイルが見つからない場合、GitHub Releasesからモデルを読み込みます。

## ⚠️ トラブルシューティング

### HuggingFaceからのダウンロードが失敗する

YomiTokuモデルは制限付きでホストされている可能性があります。方法1（Pythonパッケージ）を使用してください。

### モデルファイルが正しくダウンロードできているか確認

```bash
# ファイルサイズを確認（正常なモデルは1MB以上のはず）
ls -lh models/*.onnx

# 各モデルが1MB以上あることを確認
# 13バイト程度の小さなファイルの場合、エラーメッセージが含まれている可能性があります
```

### "Access denied"エラーが表示される

HuggingFaceのモデルにアクセス制限がある場合です。方法1を使用してください。

## 📄 ライセンス

YomiTokuモデルは **CC BY-NC-SA 4.0** ライセンスです：
- ✅ 個人利用・研究目的の使用は無料
- ✅ 非商用プロジェクトでの使用は無料
- ❌ 商用利用には別途ライセンスが必要

商用利用について詳しくは、以下をご確認ください：
- 公式サイト: https://www.mlism.com/
- YomiTokuドキュメント: https://github.com/kotaro-kinoshita/yomitoku

## 🔧 代替モデルの使用

他のOCRモデル（PaddleOCR、EasyOCR等）のONNXモデルを使用する場合は、`main.js`のモデル読み込み部分を適宜修正してください。
