import React, { useState } from 'react';
import StressChart from './StressChart';
import { saveEntry } from '../lib/storage';

export default function Dashboard({ entries, onNewEntry, stressIndex, economicDefense }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function handleAnalyze() {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '分析に失敗しました');

      setResult(data);
      const entry = saveEntry({ text, ...data });
      onNewEntry(entry);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const scoreColor = (s) => (s >= 25 ? '#22c55e' : s >= -25 ? '#f59e0b' : '#ef4444');

  // 経済的防御力の表示（0〜50 → 0〜100%）
  const defensePercent = Math.round((economicDefense / 50) * 100);

  return (
    <div className="flex flex-col gap-4 h-full">

      {/* ===== 日記入力 ===== */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-bold text-blue-300 mb-2 flex items-center gap-1">
          📝 今日の出来事・気持ち
        </h3>
        <textarea
          className="diary-input w-full rounded-lg p-3 text-sm leading-relaxed"
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="今日の出来事を自由に書いてください…&#10;例：上司にまた理不尽な指摘をされた。もう限界かもしれない。&#10;例：プロジェクトが無事完了して部長に褒められた！"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAnalyze();
          }}
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-slate-500">Ctrl+Enter で送信</span>
          <button
            onClick={handleAnalyze}
            disabled={!text.trim() || loading}
            className="btn-primary px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
          >
            {loading ? (
              <><span className="spinner" /> AI分析中…</>
            ) : (
              <>🤖 AIに分析してもらう</>
            )}
          </button>
        </div>
        {error && <p className="text-red-400 text-xs mt-2">⚠️ {error}</p>}
      </div>

      {/* ===== AI分析結果 ===== */}
      {result && (
        <div className="glass-card p-4">
          <h3 className="text-sm font-bold text-purple-300 mb-3">🧠 AI分析結果</h3>

          {/* スコアと感情タグ */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className="text-3xl font-black tabular-nums"
              style={{ color: scoreColor(result.score) }}
            >
              {result.score > 0 ? '+' : ''}{result.score}
            </div>
            <div className="flex flex-wrap gap-1">
              {result.tags?.map((tag, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* サマリー */}
          <p className="text-sm text-slate-200 leading-relaxed mb-3">{result.summary}</p>

          {/* ポジティブ/ネガティブ要素 */}
          {(result.positive_points?.length > 0 || result.negative_points?.length > 0) && (
            <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
              {result.positive_points?.length > 0 && (
                <div>
                  <div className="text-green-400 font-bold mb-1">✅ 良い点</div>
                  {result.positive_points.map((p, i) => (
                    <div key={i} className="text-slate-300">・{p}</div>
                  ))}
                </div>
              )}
              {result.negative_points?.length > 0 && (
                <div>
                  <div className="text-red-400 font-bold mb-1">⚠️ ストレス源</div>
                  {result.negative_points.map((p, i) => (
                    <div key={i} className="text-slate-300">・{p}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 経済的アドバイス */}
          <div className="bg-yellow-900/30 border border-yellow-700/40 rounded-lg p-3">
            <div className="text-yellow-300 text-xs font-bold mb-1">💡 経済的自制アドバイス</div>
            <p className="text-xs text-yellow-100">{result.advice}</p>
          </div>
        </div>
      )}

      {/* ===== 感情グラフ ===== */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-1">
          📊 ストレス指数の推移（直近30件）
        </h3>
        <StressChart entries={entries} />
      </div>

      {/* ===== 経済的自制ゲージ ===== */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-bold text-yellow-300 mb-3 flex items-center gap-1">
          🛡️ 経済的防御力
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>防御ポイント</span>
            <span className="text-yellow-300 font-bold">{defensePercent}%</span>
          </div>
          <div className="economic-gauge">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${defensePercent}%`,
                background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
              }}
            />
          </div>
          <p className="text-xs text-slate-500">
            サイドバーの経済パラメータを設定すると防御力が上がります
          </p>
        </div>

        {/* 統計サマリー */}
        {entries.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-3">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-300">{entries.length}</div>
              <div className="text-xs text-slate-500">記録数</div>
            </div>
            <div className="text-center">
              <div
                className="text-lg font-bold"
                style={{ color: scoreColor(stressIndex) }}
              >
                {stressIndex > 0 ? '+' : ''}{Math.round(stressIndex)}
              </div>
              <div className="text-xs text-slate-500">現在指数</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-slate-300">
                {Math.round(
                  entries.reduce((a, e) => a + (e.score || 0), 0) / entries.length
                )}
              </div>
              <div className="text-xs text-slate-500">平均スコア</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
