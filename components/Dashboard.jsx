import React, { useState } from 'react';
import StressChart from './StressChart';
import { saveEntry } from '../lib/storage';

const SCORE_PRESETS = [
  { label: '最高！', value: 80, color: '#22c55e' },
  { label: 'よかった', value: 40, color: '#86efac' },
  { label: 'まあまあ', value: 10, color: '#94a3b8' },
  { label: 'しんどい', value: -40, color: '#fca5a5' },
  { label: '限界…', value: -80, color: '#ef4444' },
];

export default function Dashboard({ entries, onNewEntry, stressIndex, economicDefense }) {
  const [text, setText] = useState('');
  const [score, setScore] = useState(0);

  function handleSubmit() {
    if (!text.trim()) return;
    const entry = saveEntry({ text, score: Number(score), tags: [], summary: '', advice: '' });
    onNewEntry(entry);
    setText('');
    setScore(0);
  }

  const scoreColor = (s) => (s >= 25 ? '#22c55e' : s >= -25 ? '#f59e0b' : '#ef4444');
  const defensePercent = Math.round((economicDefense / 50) * 100);
  const currentScore = Number(score);

  return (
    <div className="flex flex-col gap-4 h-full">

      {/* ===== 日記入力 ===== */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-bold text-blue-300 mb-2">📝 今日の出来事・気持ち</h3>
        <textarea
          className="diary-input w-full rounded-lg p-3 text-sm leading-relaxed"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="今日の出来事を自由に書いてください…"
        />

        {/* スコア入力 */}
        <div className="mt-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-400">今日のスコア</span>
            <span
              className="text-2xl font-black tabular-nums"
              style={{ color: scoreColor(currentScore) }}
            >
              {currentScore > 0 ? '+' : ''}{currentScore}
            </span>
          </div>

          {/* スライダー */}
          <input
            type="range"
            min="-100"
            max="100"
            step="1"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>-100（限界）</span>
            <span>0（普通）</span>
            <span>+100（最高）</span>
          </div>

          {/* プリセットボタン */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {SCORE_PRESETS.map((p) => (
              <button
                key={p.value}
                onClick={() => setScore(p.value)}
                className="px-3 py-1 rounded-full text-xs font-bold border transition-all"
                style={{
                  borderColor: p.color,
                  color: currentScore === p.value ? '#fff' : p.color,
                  background: currentScore === p.value ? p.color + '44' : 'transparent',
                }}
              >
                {p.label}（{p.value > 0 ? '+' : ''}{p.value}）
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-3">
          <button
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="btn-primary px-5 py-2 rounded-lg text-sm font-bold"
          >
            📌 記録する
          </button>
        </div>
      </div>

      {/* ===== 感情グラフ ===== */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-bold text-slate-300 mb-2">
          📊 ストレス指数の推移（直近30件）
        </h3>
        <StressChart entries={entries} />
      </div>

      {/* ===== 経済的自制ゲージ ===== */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-bold text-yellow-300 mb-3">🛡️ 経済的防御力</h3>
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

        {entries.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-3">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-300">{entries.length}</div>
              <div className="text-xs text-slate-500">記録数</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold" style={{ color: scoreColor(stressIndex) }}>
                {stressIndex > 0 ? '+' : ''}{Math.round(stressIndex)}
              </div>
              <div className="text-xs text-slate-500">現在指数</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-slate-300">
                {Math.round(entries.reduce((a, e) => a + (e.score || 0), 0) / entries.length)}
              </div>
              <div className="text-xs text-slate-500">平均スコア</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
