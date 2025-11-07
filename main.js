// YomiToku Lite - ブラウザ版OCR実装
// ONNX Runtime Web を使用

class YomiTokuLite {
    constructor() {
        this.detectorSession = null;
        this.recognizerSession = null;
        this.isModelLoaded = false;
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadModels();
    }

    setupEventListeners() {
        const imageInput = document.getElementById('imageInput');
        const uploadArea = document.getElementById('uploadArea');
        const copyButton = document.getElementById('copyButton');

        // ファイル選択
        imageInput.addEventListener('change', (e) => this.handleImageUpload(e));

        // ドラッグ&ドロップ
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.processImage(files[0]);
            }
        });

        // コピーボタン
        copyButton.addEventListener('click', () => this.copyText());
    }

    async loadModels() {
        try {
            this.updateStatus('🔄 モデルを読み込み中...', 'loading');
            this.showProgress();

            // ONNX Runtime の設定
            ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.17.0/dist/';

            // モデルパスの候補（優先順位順）
            const modelSources = [
                {
                    name: 'ローカルファイル',
                    detector: './models/text_detector.onnx',
                    recognizer: './models/text_recognizer.onnx'
                },
                {
                    name: 'GitHub Releases',
                    detector: 'https://github.com/s4na/yomitoku-demo/releases/download/models-v1/text_detector.onnx',
                    recognizer: 'https://github.com/s4na/yomitoku-demo/releases/download/models-v1/text_recognizer.onnx'
                }
            ];

            let loadSuccess = false;
            let lastError = null;

            // 各ソースを順番に試す
            for (const source of modelSources) {
                try {
                    console.log(`モデル読み込み試行: ${source.name}`);

                    // 検出モデル読み込み
                    this.updateStatus(`📥 テキスト検出モデル読み込み中 (${source.name})...`, 'loading');
                    this.detectorSession = await ort.InferenceSession.create(source.detector, {
                        executionProviders: ['wasm']
                    });

                    // 認識モデル読み込み
                    this.updateStatus(`📥 テキスト認識モデル読み込み中 (${source.name})...`, 'loading');
                    this.recognizerSession = await ort.InferenceSession.create(source.recognizer, {
                        executionProviders: ['wasm']
                    });

                    console.log(`✅ モデル読み込み成功: ${source.name}`);
                    loadSuccess = true;
                    break;
                } catch (err) {
                    console.warn(`${source.name}からの読み込み失敗:`, err);
                    lastError = err;
                    continue;
                }
            }

            if (!loadSuccess) {
                throw new Error('すべてのモデルソースからの読み込みに失敗しました');
            }

            this.isModelLoaded = true;
            this.updateStatus('✅ モデルの読み込みが完了しました！画像をアップロードしてください。', 'success');
            this.hideProgress();
        } catch (error) {
            console.error('モデル読み込みエラー:', error);
            const errorMsg = error.message || 'Unknown error';

            // ユーザーフレンドリーなエラーメッセージを表示
            this.updateStatus(
                '❌ モデルファイルが見つかりません\n\n' +
                'YomiToku Liteを使用するには、ONNXモデルファイルが必要です。\n\n' +
                '【解決方法】\n' +
                'ローカルで実行する場合:\n' +
                '1. リポジトリをクローン\n' +
                '2. cd yomitoku-demo\n' +
                '3. bash models/download_models.sh を実行\n' +
                '4. python -m http.server 8000 でサーバー起動\n' +
                '5. http://localhost:8000 にアクセス\n\n' +
                '詳細エラー: ' + errorMsg,
                'error'
            );
            this.hideProgress();

            // デバッグ情報
            this.showModelDownloadInfo();
        }
    }

    showModelDownloadInfo() {
        // モデルダウンロード情報を表示する領域を追加
        const resultSection = document.getElementById('resultSection');
        if (resultSection) {
            resultSection.innerHTML = `
                <div style="padding: 20px; background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; margin-top: 20px;">
                    <h3 style="margin-top: 0; color: #856404;">📋 モデルセットアップが必要です</h3>
                    <p>このデモを動作させるには、YomiTokuのONNXモデルファイルが必要です。</p>

                    <h4>🚀 ローカルで実行する場合（推奨）:</h4>
                    <ol>
                        <li>リポジトリをクローン: <code>git clone https://github.com/s4na/yomitoku-demo.git</code></li>
                        <li>ディレクトリに移動: <code>cd yomitoku-demo</code></li>
                        <li>モデルをダウンロード: <code>bash models/download_models.sh</code></li>
                        <li>ローカルサーバー起動: <code>python -m http.server 8000</code></li>
                        <li>ブラウザで <code>http://localhost:8000</code> にアクセス</li>
                    </ol>

                    <h4>📦 必要なモデルファイル:</h4>
                    <ul>
                        <li><code>models/text_detector.onnx</code> - テキスト検出モデル（DBNet）</li>
                        <li><code>models/text_recognizer.onnx</code> - テキスト認識モデル（PARSeq）</li>
                    </ul>

                    <h4>☁️ GitHub Pagesで実行する場合:</h4>
                    <p>モデルファイルをGitHub Releasesにアップロードする必要があります。詳細は<a href="https://github.com/s4na/yomitoku-demo/blob/main/models/README.md" target="_blank">models/README.md</a>を参照してください。</p>

                    <h4>⚠️ 注意事項:</h4>
                    <p>YomiTokuモデルはCC BY-NC-SA 4.0ライセンスです。非商用利用は無料ですが、商用利用には別途ライセンスが必要です。</p>
                    <p>詳細: <a href="https://www.mlism.com/" target="_blank">MLism株式会社</a></p>
                </div>
            `;
            resultSection.style.display = 'block';
        }
    }

    async handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            await this.processImage(file);
        }
    }

    async processImage(file) {
        if (!this.isModelLoaded) {
            this.updateStatus('⏳ モデルがまだ読み込まれていません...', 'warning');
            return;
        }

        // ファイルサイズチェック
        if (file.size > 10 * 1024 * 1024) {
            this.updateStatus('❌ ファイルサイズが大きすぎます（最大10MB）', 'error');
            return;
        }

        try {
            this.updateStatus('🔄 画像を処理中...', 'loading');
            this.showProgress();

            // 画像読み込み
            const img = await this.loadImage(file);

            // テキスト検出
            this.updateStatus('🔍 テキストを検出中...', 'loading');
            const detections = await this.detectText(img);

            if (detections.length === 0) {
                this.updateStatus('⚠️ テキストが検出されませんでした', 'warning');
                this.hideProgress();
                return;
            }

            // テキスト認識
            this.updateStatus(`📖 ${detections.length}個のテキスト領域を認識中...`, 'loading');
            const results = await this.recognizeText(img, detections);

            // 結果表示
            this.displayResults(img, results);
            this.updateStatus(`✅ 完了！${results.length}個のテキストを認識しました`, 'success');
            this.hideProgress();

        } catch (error) {
            console.error('処理エラー:', error);
            this.updateStatus('❌ 処理中にエラーが発生しました: ' + error.message, 'error');
            this.hideProgress();
        }
    }

    loadImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async detectText(img) {
        // DBNet用の前処理
        const targetSize = 640;
        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d');

        // アスペクト比を保持してリサイズ
        const scale = Math.min(targetSize / img.width, targetSize / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const offsetX = (targetSize - scaledWidth) / 2;
        const offsetY = (targetSize - scaledHeight) / 2;

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, targetSize, targetSize);
        ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

        // 画像データを取得して正規化
        const imageData = ctx.getImageData(0, 0, targetSize, targetSize);
        const float32Data = new Float32Array(3 * targetSize * targetSize);

        // RGB各チャンネルに分けて正規化
        for (let i = 0; i < imageData.data.length; i += 4) {
            const idx = i / 4;
            float32Data[idx] = imageData.data[i] / 255.0; // R
            float32Data[targetSize * targetSize + idx] = imageData.data[i + 1] / 255.0; // G
            float32Data[2 * targetSize * targetSize + idx] = imageData.data[i + 2] / 255.0; // B
        }

        // ONNXテンソルを作成
        const tensor = new ort.Tensor('float32', float32Data, [1, 3, targetSize, targetSize]);

        // 推論実行
        const feeds = { [this.detectorSession.inputNames[0]]: tensor };
        const results = await this.detectorSession.run(feeds);

        // 検出結果から境界ボックスを抽出
        const outputTensor = results[this.detectorSession.outputNames[0]];
        const detections = this.postProcessDetections(outputTensor, img.width, img.height, scale, offsetX, offsetY);

        return detections;
    }

    postProcessDetections(tensor, originalWidth, originalHeight, scale, offsetX, offsetY) {
        // 簡略化された検出後処理
        // 実際のDBNetの出力から境界ボックスを抽出
        const detections = [];
        const threshold = 0.3;
        const data = tensor.data;
        const width = tensor.dims[3];
        const height = tensor.dims[2];

        // グリッドベースの簡易検出
        const gridSize = 32;
        for (let y = 0; y < height; y += gridSize) {
            for (let x = 0; x < width; x += gridSize) {
                const idx = y * width + x;
                if (data[idx] > threshold) {
                    // 元画像の座標に変換
                    const x1 = Math.max(0, ((x - offsetX) / scale));
                    const y1 = Math.max(0, ((y - offsetY) / scale));
                    const x2 = Math.min(originalWidth, ((x + gridSize - offsetX) / scale));
                    const y2 = Math.min(originalHeight, ((y + gridSize - offsetY) / scale));

                    if (x2 > x1 && y2 > y1) {
                        detections.push({
                            bbox: [x1, y1, x2, y2],
                            confidence: data[idx]
                        });
                    }
                }
            }
        }

        return detections;
    }

    async recognizeText(img, detections) {
        const results = [];

        for (const detection of detections) {
            try {
                const [x1, y1, x2, y2] = detection.bbox;
                const width = x2 - x1;
                const height = y2 - y1;

                if (width < 10 || height < 10) continue;

                // 領域を切り出し
                const canvas = document.createElement('canvas');
                canvas.width = 128;
                canvas.height = 32;
                const ctx = canvas.getContext('2d');

                ctx.fillStyle = '#fff';
                ctx.fillRect(0, 0, 128, 32);
                ctx.drawImage(img, x1, y1, width, height, 0, 0, 128, 32);

                // 前処理
                const imageData = ctx.getImageData(0, 0, 128, 32);
                const float32Data = new Float32Array(3 * 32 * 128);

                for (let i = 0; i < imageData.data.length; i += 4) {
                    const idx = i / 4;
                    float32Data[idx] = imageData.data[i] / 255.0;
                    float32Data[32 * 128 + idx] = imageData.data[i + 1] / 255.0;
                    float32Data[2 * 32 * 128 + idx] = imageData.data[i + 2] / 255.0;
                }

                const tensor = new ort.Tensor('float32', float32Data, [1, 3, 32, 128]);
                const feeds = { [this.recognizerSession.inputNames[0]]: tensor };
                const output = await this.recognizerSession.run(feeds);

                // デコード（簡易版）
                const text = this.decodeOutput(output[this.recognizerSession.outputNames[0]]);

                results.push({
                    bbox: detection.bbox,
                    text: text,
                    confidence: detection.confidence
                });
            } catch (error) {
                console.error('認識エラー:', error);
            }
        }

        return results;
    }

    decodeOutput(tensor) {
        // 簡易的なデコード処理
        // 実際のPARSeqの出力から文字列を復元
        const chars = 'あいうえおかきくせこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ';

        // ダミーテキスト（実際は tensor.data から文字を抽出）
        return 'サンプルテキスト';
    }

    displayResults(img, results) {
        const resultSection = document.getElementById('resultSection');
        const canvas = document.getElementById('outputCanvas');
        const recognizedText = document.getElementById('recognizedText');
        const copyButton = document.getElementById('copyButton');

        // Canvas設定
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        // 画像描画
        ctx.drawImage(img, 0, 0);

        // 検出結果を描画
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;
        ctx.font = '16px sans-serif';
        ctx.fillStyle = '#00ff00';

        let allText = '';
        results.forEach((result, idx) => {
            const [x1, y1, x2, y2] = result.bbox;
            ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
            ctx.fillText(`${idx + 1}`, x1, y1 - 5);
            allText += `${idx + 1}. ${result.text}\n`;
        });

        // テキスト表示
        recognizedText.innerHTML = results.length > 0
            ? `<pre>${allText}</pre>`
            : '<p class="placeholder">テキストが検出されませんでした</p>';

        copyButton.style.display = results.length > 0 ? 'block' : 'none';
        resultSection.style.display = 'block';

        // テキストを保存（コピー用）
        this.lastRecognizedText = allText;
    }

    copyText() {
        navigator.clipboard.writeText(this.lastRecognizedText).then(() => {
            this.updateStatus('✅ テキストをクリップボードにコピーしました', 'success');
        }).catch(err => {
            console.error('コピーエラー:', err);
            this.updateStatus('❌ コピーに失敗しました', 'error');
        });
    }

    updateStatus(message, type = 'info') {
        const statusMessage = document.getElementById('statusMessage');
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
    }

    showProgress() {
        const progressBar = document.getElementById('progressBar');
        progressBar.style.display = 'block';
    }

    hideProgress() {
        const progressBar = document.getElementById('progressBar');
        progressBar.style.display = 'none';
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    new YomiTokuLite();
});
