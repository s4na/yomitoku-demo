#!/usr/bin/env bash
set -e

echo "📦 Downloading YomiToku Lite models..."

DETECTOR_URL="https://huggingface.co/kotaro-kinoshita/yomitoku-text-detector-dbnet-v2/resolve/main/model.onnx"
RECOGNIZER_URL="https://huggingface.co/kotaro-kinoshita/yomitoku-text-recognizer-parseq/resolve/main/model.onnx"

mkdir -p models

echo "⬇️ Downloading detector model..."
curl -L "$DETECTOR_URL" -o models/text_detector.onnx

echo "⬇️ Downloading recognizer model..."
curl -L "$RECOGNIZER_URL" -o models/text_recognizer.onnx

echo "✅ All models downloaded successfully!"
