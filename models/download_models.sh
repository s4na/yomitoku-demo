#!/usr/bin/env bash
set -e

echo "📦 Downloading YomiToku Lite models..."
echo ""

# モデルのダウンロード元URL
DETECTOR_URL="https://huggingface.co/kotaro-kinoshita/yomitoku-text-detector-dbnet-v2/resolve/main/model.onnx"
RECOGNIZER_URL="https://huggingface.co/kotaro-kinoshita/yomitoku-text-recognizer-parseq/resolve/main/model.onnx"

# ディレクトリ作成
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
mkdir -p "$SCRIPT_DIR"

# 最小ファイルサイズ（バイト）- 正常なONNXモデルは通常数MB以上
MIN_SIZE=1000000  # 1MB

# ダウンロード関数
download_model() {
    local url=$1
    local output=$2
    local name=$3

    echo "⬇️ Downloading $name..."

    # ファイルが既に存在し、サイズが十分なら、スキップ
    if [ -f "$output" ]; then
        local size=$(stat -f%z "$output" 2>/dev/null || stat -c%s "$output" 2>/dev/null)
        if [ "$size" -gt "$MIN_SIZE" ]; then
            echo "✅ $name already exists ($(($size / 1024 / 1024))MB). Skipping download."
            return 0
        else
            echo "⚠️ Existing file is too small (${size} bytes). Re-downloading..."
            rm -f "$output"
        fi
    fi

    # ダウンロード実行
    if curl -L -f "$url" -o "$output" 2>&1; then
        # ファイルサイズ確認
        local downloaded_size=$(stat -f%z "$output" 2>/dev/null || stat -c%s "$output" 2>/dev/null)

        if [ "$downloaded_size" -lt "$MIN_SIZE" ]; then
            echo "❌ Error: Downloaded file is too small (${downloaded_size} bytes)"
            echo "   This usually means access was denied or the file doesn't exist."
            cat "$output"
            rm -f "$output"
            return 1
        fi

        echo "✅ $name downloaded successfully ($(($downloaded_size / 1024 / 1024))MB)"
        return 0
    else
        echo "❌ Error: Failed to download $name"
        return 1
    fi
}

# モデルのダウンロード
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if download_model "$DETECTOR_URL" "$SCRIPT_DIR/text_detector.onnx" "Text Detector Model"; then
    DETECTOR_OK=true
else
    DETECTOR_OK=false
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if download_model "$RECOGNIZER_URL" "$SCRIPT_DIR/text_recognizer.onnx" "Text Recognizer Model"; then
    RECOGNIZER_OK=true
else
    RECOGNIZER_OK=false
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 結果確認
if [ "$DETECTOR_OK" = true ] && [ "$RECOGNIZER_OK" = true ]; then
    echo "✅ All models downloaded successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Start a local server: python -m http.server 8000"
    echo "2. Open http://localhost:8000 in your browser"
    exit 0
else
    echo "❌ Model download failed!"
    echo ""
    echo "⚠️ The HuggingFace models may require authentication or may not be publicly available."
    echo ""
    echo "Alternative options:"
    echo "1. Install YomiToku Python package and export models:"
    echo "   pip install yomitoku"
    echo "   python -c \"import yomitoku; yomitoku.export_onnx_models('./models')\""
    echo ""
    echo "2. Use GitHub Releases:"
    echo "   If you have access to the models, upload them to GitHub Releases"
    echo "   and update main.js to use the release URLs."
    echo ""
    echo "3. Contact the model maintainer for access:"
    echo "   https://www.mlism.com/"
    exit 1
fi
