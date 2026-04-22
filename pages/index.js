import React, { useState, useEffect } from 'react';
import CharacterDisplay from '../components/CharacterDisplay';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import {
  calculateStressIndex,
  calcEconomicDefense,
  getCharacterState,
  calcResignationUrge,
} from '../lib/stressLogic';
import { getEntries, getFaceData, getEconomicParams } from '../lib/storage';

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [faceDataUrl, setFaceDataUrl] = useState(null);
  const [economicParams, setEconomicParams] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // localStorageからデータを復元
  useEffect(() => {
    setEntries(getEntries());
    setFaceDataUrl(getFaceData());
    setEconomicParams(getEconomicParams());
  }, []);

  // 派生状態の計算
  const stressIndex = calculateStressIndex(entries);
  const economicDefense = calcEconomicDefense(economicParams);
  const characterState = getCharacterState(stressIndex, economicDefense);
  const resignationUrge = calcResignationUrge(stressIndex, economicDefense);

  function handleNewEntry(entry) {
    setEntries((prev) => [...prev, entry]);
  }

  const stateEmoji = {
    normal: '😐',
    dejected: '😞',
    energetic: '😄',
  }[characterState];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f1629 0%, #0d1b4b 50%, #1a0a2e 100%)' }}>
      {/* ===== ヘッダー ===== */}
      <header className="border-b border-slate-700/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{stateEmoji}</span>
          <div>
            <h1 className="text-base font-black text-white leading-tight">
              退職自制管理アプリ
            </h1>
            <p className="text-xs text-slate-400">40代サラリーマンの感情×経済シミュレーター</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span>記録数: <span className="text-white font-bold">{entries.length}</span></span>
          </div>
          {/* モバイル用サイドバーボタン */}
          <button
            className="lg:hidden btn-primary px-3 py-1.5 rounded-lg text-xs"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ⚙️ 設定
          </button>
        </div>
      </header>

      {/* ===== メインレイアウト ===== */}
      <div className="flex h-[calc(100vh-57px)]">

        {/* ===== サイドバー（設定） ===== */}
        <aside
          className={`
            ${sidebarOpen ? 'flex' : 'hidden'} lg:flex
            flex-col w-72 shrink-0 p-4 overflow-y-auto
            border-r border-slate-700/50
            ${sidebarOpen ? 'absolute inset-0 z-50 bg-[#0f1629] lg:relative lg:z-auto' : ''}
          `}
        >
          {sidebarOpen && (
            <button
              className="lg:hidden mb-3 text-xs text-slate-400 hover:text-white self-end"
              onClick={() => setSidebarOpen(false)}
            >
              ✕ 閉じる
            </button>
          )}
          <Sidebar
            faceDataUrl={faceDataUrl}
            onFaceChange={setFaceDataUrl}
            economicParams={economicParams}
            onParamsChange={setEconomicParams}
            entries={entries}
          />
        </aside>

        {/* ===== キャラクター表示（中央） ===== */}
        <main className="flex flex-col items-center justify-start pt-6 px-4 flex-shrink-0 w-64 xl:w-72 border-r border-slate-700/50 overflow-y-auto">
          <CharacterDisplay
            state={characterState}
            faceDataUrl={faceDataUrl}
            stressIndex={stressIndex}
            resignationUrge={resignationUrge}
          />

          {/* 経済的パラメータ防御サマリー */}
          <div className="mt-4 w-full glass-card p-3 text-xs">
            <div className="text-yellow-300 font-bold mb-2">💰 経済的リスク</div>
            <div className="space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span>退職金損失</span>
                <span className="text-red-300 font-medium">
                  -{(economicParams.retirementBonus || 500)}万
                </span>
              </div>
              <div className="flex justify-between">
                <span>転職収入減</span>
                <span className="text-red-300 font-medium">
                  -{(economicParams.jobChangeLoss || 300)}万
                </span>
              </div>
              <div className="flex justify-between">
                <span>将来必要資金</span>
                <span className="text-orange-300 font-medium">
                  {(economicParams.futureFunds || 1000)}万
                </span>
              </div>
              <div className="border-t border-slate-600 pt-1 flex justify-between font-bold">
                <span className="text-slate-200">防御ポイント</span>
                <span className="text-yellow-300">+{Math.round(economicDefense)}</span>
              </div>
            </div>
          </div>
        </main>

        {/* ===== ダッシュボード（右） ===== */}
        <section className="flex-1 p-4 overflow-y-auto">
          <Dashboard
            entries={entries}
            onNewEntry={handleNewEntry}
            stressIndex={stressIndex}
            economicDefense={economicDefense}
          />
        </section>
      </div>

      {/* サイドバーオーバーレイ（モバイル） */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
