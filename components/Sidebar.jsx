import React, { useRef, useState } from 'react';
import { detectAndCropFace } from '../lib/faceDetection';
import { saveFaceData, clearFaceData, saveEconomicParams } from '../lib/storage';

const DEFAULT_PARAMS = {
  retirementBonus: 500,
  continuationBonus: 200,
  jobChangeLoss: 300,
  futureFunds: 1000,
};

export default function Sidebar({ faceDataUrl, onFaceChange, economicParams, onParamsChange, entries }) {
  const fileInputRef = useRef(null);
  const [detecting, setDetecting] = useState(false);
  const [detectMsg, setDetectMsg] = useState('');
  const params = { ...DEFAULT_PARAMS, ...economicParams };

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setDetectMsg('画像ファイルを選択してください');
      return;
    }
    setDetecting(true);
    setDetectMsg('顔を検出中…');
    try {
      const dataUrl = await detectAndCropFace(file);
      saveFaceData(dataUrl);
      onFaceChange(dataUrl);
      setDetectMsg('✅ 顔写真を設定しました！');
    } catch (err) {
      setDetectMsg('⚠️ 処理に失敗しました');
    } finally {
      setDetecting(false);
      setTimeout(() => setDetectMsg(''), 3000);
    }
    e.target.value = '';
  }

  function handleClearFace() {
    clearFaceData();
    onFaceChange(null);
    setDetectMsg('');
  }

  function handleParamChange(key, value) {
    const newParams = { ...params, [key]: Number(value) || 0 };
    onParamsChange(newParams);
    saveEconomicParams(newParams);
  }

  const paramFields = [
    { key: 'retirementBonus',   label: '退職金推定額（万円）',        min: 0,    max: 5000 },
    { key: 'continuationBonus', label: '継続勤務による増額（万円）',  min: 0,    max: 2000 },
    { key: 'jobChangeLoss',     label: '転職損失額（万円）',          min: 0,    max: 3000 },
    { key: 'futureFunds',       label: '将来必要資金・教育費（万円）', min: 0,    max: 5000 },
  ];

  const recentEntries = (entries || []).slice(-10).reverse();

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto pr-1">

      {/* ===== 顔写真設定 ===== */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-bold text-blue-300 mb-3 flex items-center gap-1">
          🧑 自分の顔写真
        </h3>

        {/* プレビュー */}
        <div className="flex justify-center mb-3">
          {faceDataUrl ? (
            <div className="relative">
              <img
                src={faceDataUrl}
                alt="顔写真"
                className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
              />
              <button
                onClick={handleClearFace}
                className="absolute -top-1 -right-1 bg-red-600 rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-500"
                title="削除"
              >✕</button>
            </div>
          ) : (
            <div
              className="face-upload-area w-24 h-24 rounded-full flex items-center justify-center text-3xl"
              onClick={() => fileInputRef.current?.click()}
            >
              👤
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={detecting}
          className="btn-primary w-full py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
        >
          {detecting ? (
            <><span className="spinner" /> 顔を検出中…</>
          ) : (
            <>{faceDataUrl ? '📷 写真を変更' : '📷 写真をアップロード'}</>
          )}
        </button>

        {detectMsg && (
          <p className="text-xs text-center mt-2 text-blue-200">{detectMsg}</p>
        )}
        <p className="text-xs text-slate-500 mt-2 text-center">
          AIが顔を自動認識・切り出しします
        </p>
      </div>

      {/* ===== 経済的パラメータ ===== */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-bold text-yellow-300 mb-3 flex items-center gap-1">
          💰 経済的パラメータ
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          高いほど退職への抵抗力が上がります
        </p>
        <div className="flex flex-col gap-3">
          {paramFields.map(({ key, label, min, max }) => (
            <div key={key}>
              <label className="text-xs text-slate-400 block mb-1">{label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={params[key]}
                  onChange={(e) => handleParamChange(key, e.target.value)}
                  min={min}
                  max={max}
                  className="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">万円</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 履歴ログ ===== */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-1">
          📋 最近の記録
        </h3>
        {recentEntries.length === 0 ? (
          <p className="text-xs text-slate-500">記録がありません</p>
        ) : (
          <div className="flex flex-col gap-2">
            {recentEntries.map((entry) => {
              const d = new Date(entry.timestamp);
              const dateStr = `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
              return (
                <div key={entry.id} className="flex items-start gap-2 text-xs">
                  <span
                    className="font-bold tabular-nums shrink-0"
                    style={{ color: entry.score >= 0 ? '#22c55e' : '#ef4444' }}
                  >
                    {entry.score > 0 ? '+' : ''}{entry.score}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-400">{dateStr}</div>
                    <div className="text-slate-300 truncate">
                      {entry.tags?.join(' · ') || entry.text?.slice(0, 20)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
