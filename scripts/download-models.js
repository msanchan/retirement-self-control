/**
 * face-api.js 軽量モデルをダウンロード
 * 実行: node scripts/download-models.js
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../public/models');
const BASE_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';

const FILES = [
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
];

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function download(filename) {
  return new Promise((resolve, reject) => {
    const dest = path.join(OUTPUT_DIR, filename);
    const url = BASE_URL + filename;
    console.log(`Downloading: ${filename}`);

    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${filename}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`  ✅ ${filename} (${fs.statSync(dest).size} bytes)`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

(async () => {
  console.log('🔍 face-api.js 顔検出モデルをダウンロード中...\n');
  try {
    for (const file of FILES) {
      await download(file);
    }
    console.log('\n✅ 完了！ /public/models/ にモデルファイルを保存しました。');
    console.log('顔写真アップロード時に自動的に使用されます。\n');
  } catch (err) {
    console.error('\n❌ ダウンロード失敗:', err.message);
    console.error('モデルなしでも動作しますが、顔検出精度が下がります。\n');
  }
})();
