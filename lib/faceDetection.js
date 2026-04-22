let faceapi = null;
let modelsLoaded = false;
const MODEL_URL = '/models';

export async function loadModels() {
  if (modelsLoaded) return true;
  try {
    faceapi = await import('face-api.js');
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    modelsLoaded = true;
    return true;
  } catch (err) {
    console.warn('顔検出モデルの読み込み失敗（センタークロップで代替）:', err.message);
    return false;
  }
}

function createImageElement(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}

function cropToCanvas(img, x, y, w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(w);
  canvas.height = Math.round(h);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
  return canvas.toDataURL('image/jpeg', 0.92);
}

function centerCrop(img) {
  const size = Math.min(img.naturalWidth, img.naturalHeight);
  const x = (img.naturalWidth - size) / 2;
  // 顔は上寄りにあることが多いので上1/3あたりから
  const y = Math.max(0, (img.naturalHeight - size) / 3);
  return cropToCanvas(img, x, y, size, size);
}

/**
 * 画像ファイルから顔を検出・切り出し、dataURLを返す
 * 検出失敗時はセンタークロップにフォールバック
 */
export async function detectAndCropFace(file) {
  const img = await createImageElement(file);
  const loaded = await loadModels();

  if (!loaded || !faceapi) {
    return centerCrop(img);
  }

  try {
    const detection = await faceapi.detectSingleFace(
      img,
      new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.4 })
    );

    if (!detection) {
      return centerCrop(img);
    }

    const { x, y, width, height } = detection.box;

    // 顔の周囲に余白を追加（上は髪のぶん多め）
    const padW = width * 0.55;
    const padHTop = height * 0.85;
    const padHBot = height * 0.35;

    const cx = Math.max(0, x - padW);
    const cy = Math.max(0, y - padHTop);
    const cw = Math.min(img.naturalWidth - cx, width + padW * 2);
    const ch = Math.min(img.naturalHeight - cy, height + padHTop + padHBot);

    return cropToCanvas(img, cx, cy, cw, ch);
  } catch (err) {
    console.warn('顔検出エラー:', err.message);
    return centerCrop(img);
  }
}
