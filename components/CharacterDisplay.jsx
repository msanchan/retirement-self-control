import React, { useState, useEffect, useRef } from 'react';
import CharacterSVG from './CharacterSVG';
import { STATE_LABELS, STATE_COLORS } from '../lib/stressLogic';

const SPARKLE_EMOJIS = ['✨', '⭐', '🌟', '💫', '🎉'];
const CLOUD_EMOJIS = ['💧', '😔', '💦', '🌧️', '😮‍💨'];

export default function CharacterDisplay({ state, faceDataUrl, stressIndex, resignationUrge }) {
  const [animClass, setAnimClass] = useState('');
  const [particles, setParticles] = useState([]);
  const prevStateRef = useRef(state);
  const containerRef = useRef(null);

  useEffect(() => {
    if (prevStateRef.current === state) return;
    const prev = prevStateRef.current;
    prevStateRef.current = state;

    // ぐにゃりアニメーション
    setAnimClass('anim-gunya');
    setTimeout(() => setAnimClass(''), 800);

    // パーティクル生成
    if (state === 'energetic') {
      spawnParticles(SPARKLE_EMOJIS, 'sparkle-particle', 8);
    } else if (state === 'dejected' && prev !== 'dejected') {
      spawnParticles(CLOUD_EMOJIS, 'cloud-particle', 5);
    }
  }, [state]);

  function spawnParticles(emojis, className, count) {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      className,
      left: 20 + Math.random() * 60,   // %
      bottom: 30 + Math.random() * 40, // %
      delay: Math.random() * 0.4,
      duration: 1.0 + Math.random() * 0.6,
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 2500);
  }

  const stressPercent = Math.round(((stressIndex + 100) / 200) * 100);
  const urgeColor = resignationUrge > 70 ? '#ef4444' : resignationUrge > 40 ? '#f59e0b' : '#22c55e';

  return (
    <div className="flex flex-col items-center gap-4">
      {/* キャラクター状態バッジ */}
      <div className={`state-badge ${state}`}>
        <span>{STATE_LABELS[state]}</span>
      </div>

      {/* キャラクター本体 */}
      <div
        ref={containerRef}
        className={`character-wrapper state-${state} relative`}
        style={{ width: 220, height: 340 }}
      >
        {/* パーティクル */}
        {particles.map((p) => (
          <span
            key={p.id}
            className={p.className}
            style={{
              left: `${p.left}%`,
              bottom: `${p.bottom}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          >
            {p.emoji}
          </span>
        ))}

        {/* キャラクターSVG */}
        <div className={`state-${state} ${animClass}`} style={{ width: 220, display: 'flex', justifyContent: 'center' }}>
          <CharacterSVG state={state} faceDataUrl={faceDataUrl} />
        </div>

        {/* 顔写真なし時のヒント */}
        {!faceDataUrl && (
          <div
            className="absolute text-xs text-blue-300 opacity-70 text-center"
            style={{ bottom: 4, left: 0, right: 0 }}
          >
            ← サイドバーから顔写真をアップロード
          </div>
        )}
      </div>

      {/* ストレス指数メーター */}
      <div className="w-full max-w-xs glass-card p-3">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>😞 ネガティブ</span>
          <span className="font-bold text-white">
            {stressIndex > 0 ? '+' : ''}{Math.round(stressIndex)}
          </span>
          <span>😄 ポジティブ</span>
        </div>
        <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
            style={{
              width: `${stressPercent}%`,
              background: `linear-gradient(90deg, #ef4444, #f59e0b 40%, #22c55e)`,
            }}
          />
          {/* 中央線 */}
          <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white opacity-40" />
        </div>

        {/* 退職衝動ゲージ */}
        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">退職衝動</span>
            <span style={{ color: urgeColor }} className="font-bold">
              {Math.round(resignationUrge)}%
            </span>
          </div>
          <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
              style={{ width: `${resignationUrge}%`, background: urgeColor }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
