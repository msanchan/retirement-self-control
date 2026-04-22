/**
 * エビングハウス忘却曲線に基づく減衰係数
 * @param {number} daysOld - 経過日数
 */
export function decayWeight(daysOld) {
  // R = e^(-t/S) の近似: S=10日で半減
  return Math.exp(-daysOld / 10);
}

/**
 * ストレス指数を計算（忘却曲線 + 相殺ロジック）
 * @param {Array} entries - 日記エントリ配列
 * @returns {number} -100 〜 +100
 */
export function calculateStressIndex(entries) {
  if (!entries || entries.length === 0) return 0;

  const now = new Date();
  let weightedSum = 0;
  let totalWeight = 0;

  entries.forEach((entry) => {
    const daysOld = Math.max(0, (now - new Date(entry.timestamp)) / (1000 * 60 * 60 * 24));
    const w = decayWeight(daysOld);
    weightedSum += (entry.score || 0) * w;
    totalWeight += w;
  });

  if (totalWeight === 0) return 0;
  return Math.max(-100, Math.min(100, weightedSum / totalWeight));
}

/**
 * 経済的防御ポイントを計算
 * @param {object} params
 * @returns {number} 0 〜 50 の防御ポイント（ストレス指数に加算）
 */
export function calcEconomicDefense(params) {
  const {
    retirementBonus = 0,     // 退職金推定額（万円）
    continuationBonus = 0,   // 継続勤務による増額（万円）
    jobChangeLoss = 0,        // 転職損失額（万円）
    futureFunds = 0,          // 将来必要資金（万円）
  } = params;

  const netLoss = retirementBonus + continuationBonus - Math.max(0, jobChangeLoss);
  const futureRisk = futureFunds;

  // 100万円あたり1ポイント、最大50ポイント
  const points = (netLoss + futureRisk) / 100;
  return Math.max(0, Math.min(50, points));
}

/**
 * キャラクター状態を決定
 * @param {number} stressIndex - 現在のストレス指数
 * @param {number} economicDefense - 経済的防御ポイント
 * @returns {'normal' | 'dejected' | 'energetic'}
 */
export function getCharacterState(stressIndex, economicDefense) {
  // 経済的防御は正方向に加算（辞める理由を弱める）
  const adjusted = stressIndex + economicDefense * 0.4;

  if (adjusted > 25) return 'energetic';
  if (adjusted < -25) return 'dejected';
  return 'normal';
}

export const STATE_LABELS = {
  normal: '😐 普通',
  dejected: '😞 うなだれ中…',
  energetic: '😄 生き生き！',
};

export const STATE_COLORS = {
  normal: '#94a3b8',
  dejected: '#ef4444',
  energetic: '#22c55e',
};

/**
 * 退職衝動スコアを計算（0=冷静, 100=限界）
 */
export function calcResignationUrge(stressIndex, economicDefense) {
  const raw = (-stressIndex + 100) / 2; // -100→100, 0→50
  const defended = raw * (1 - economicDefense / 100);
  return Math.max(0, Math.min(100, defended));
}
