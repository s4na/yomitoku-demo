# YomiToku ONNX Models

このディレクトリには、YomiToku Liteで使用するONNXモデルファイルを配置します。

## 📥 モデルのダウンロード

モデルファイルは大きいため、Gitリポジトリには含まれていません。
以下の方法でダウンロードしてください：

### 自動ダウンロード（推奨）

```bash
bash download_models.sh
```

### 必要なモデルファイル

1. **text_detector.onnx** - テキスト検出モデル（DBNet）
2. **text_recognizer.onnx** - テキスト認識モデル（PARSeq）

## ⚠️ 注意事項

現在、YomiTokuの公式HuggingFaceリポジトリへのアクセスに制限がある可能性があります。

**想定されるソース**:
- HuggingFace: `KotaroKinoshita/yomitoku-text-detector-dbnet-open-beta`
- HuggingFace: `KotaroKinoshita/yomitoku-text-recognizer-parseq-open-beta`

モデルのダウンロードが失敗する場合は、以下を試してください：

1. ローカル環境でYomiToku Pythonパッケージを使用してモデルをエクスポート
2. 代替のOCRモデル（PaddleOCR等）を使用

## 🔧 代替モデルの使用

PaddleOCR等の他のONNXモデルを使用する場合は、`download_models.sh`と`main.js`を適宜修正してください。

## 📄 ライセンス

YomiTokuモデルはCC BY-NC-SA 4.0ライセンスで、非商用利用は無料です。
商用利用には別途ライセンスが必要です。

詳細: https://www.mlism.com/
