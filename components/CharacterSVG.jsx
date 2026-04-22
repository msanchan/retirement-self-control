import React from 'react';

function DefaultFace({ state }) {
  const mouths = {
    normal:    <path d="M 88 80 Q 100 89 112 80" stroke="#7a4030" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
    dejected:  <path d="M 87 85 Q 100 78 113 85" stroke="#7a4030" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
    energetic: <path d="M 85 78 Q 100 94 115 78" stroke="#7a4030" strokeWidth="3"   fill="none" strokeLinecap="round" />,
  };
  const browsL = {
    normal:    <path d="M 80 54 Q 87 50 94 54" stroke="#3d2b1f" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
    dejected:  <path d="M 80 57 Q 87 51 93 58" stroke="#3d2b1f" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
    energetic: <path d="M 79 50 Q 87 45 94 50" stroke="#3d2b1f" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
  };
  const browsR = {
    normal:    <path d="M 106 54 Q 113 50 120 54" stroke="#3d2b1f" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
    dejected:  <path d="M 107 58 Q 113 51 120 57" stroke="#3d2b1f" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
    energetic: <path d="M 106 50 Q 113 45 121 50" stroke="#3d2b1f" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
  };

  return (
    <>
      {/* 白目 */}
      <ellipse cx="87" cy="65" rx="8" ry="8.5" fill="white" />
      <ellipse cx="113" cy="65" rx="8" ry="8.5" fill="white" />
      {/* 瞳 */}
      <circle cx="88" cy="65" r="4.5" fill="#1a1a1a" />
      <circle cx="114" cy="65" r="4.5" fill="#1a1a1a" />
      {/* ハイライト */}
      <circle cx="90" cy="63" r="1.5" fill="white" />
      <circle cx="116" cy="63" r="1.5" fill="white" />
      {/* メガネ */}
      <rect x="78" y="58" width="19" height="14" rx="4" fill="none" stroke="#2a2a2a" strokeWidth="1.8" />
      <rect x="103" y="58" width="19" height="14" rx="4" fill="none" stroke="#2a2a2a" strokeWidth="1.8" />
      <path d="M 97 65 L 103 65" stroke="#2a2a2a" strokeWidth="1.8" />
      <line x1="78" y1="65" x2="73" y2="67" stroke="#2a2a2a" strokeWidth="1.8" />
      <line x1="122" y1="65" x2="127" y2="67" stroke="#2a2a2a" strokeWidth="1.8" />
      {/* まゆ毛 */}
      {browsL[state] || browsL.normal}
      {browsR[state] || browsR.normal}
      {/* 鼻 */}
      <path d="M 100 73 Q 96 77 97 80 Q 100 82 103 80 Q 104 77 100 73" fill="none" stroke="#c4855a" strokeWidth="1.2" />
      {/* 口 */}
      {mouths[state] || mouths.normal}
    </>
  );
}

export default function CharacterSVG({ state = 'normal', faceDataUrl = null }) {
  return (
    <svg
      viewBox="0 0 200 320"
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="320"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <clipPath id="face-clip">
          <ellipse cx="100" cy="70" rx="43" ry="51" />
        </clipPath>
        <radialGradient id="faceGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#fde0bb" />
          <stop offset="100%" stopColor="#f5b896" />
        </radialGradient>
        <radialGradient id="suitGrad" cx="30%" cy="20%" r="80%">
          <stop offset="0%" stopColor="#283593" />
          <stop offset="100%" stopColor="#0d1258" />
        </radialGradient>
        <filter id="char-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* ===== 頭部グループ（状態により変形） ===== */}
      <g className="char-head-group">
        {/* 耳 */}
        <ellipse cx="57" cy="72" rx="9" ry="12" fill="#f5b896" />
        <ellipse cx="143" cy="72" rx="9" ry="12" fill="#f5b896" />
        <ellipse cx="57" cy="72" rx="5.5" ry="8" fill="#e09a76" />
        <ellipse cx="143" cy="72" rx="5.5" ry="8" fill="#e09a76" />

        {/* 顔のベース */}
        <ellipse cx="100" cy="70" rx="43" ry="51" fill="url(#faceGrad)" />

        {/* ユーザー顔写真（アップロード時） */}
        {faceDataUrl && (
          <image
            href={faceDataUrl}
            x="57"
            y="19"
            width="86"
            height="102"
            clipPath="url(#face-clip)"
            preserveAspectRatio="xMidYMid slice"
          />
        )}

        {/* デフォルト表情（写真なし時） */}
        {!faceDataUrl && <DefaultFace state={state} />}

        {/* 髪 */}
        <path
          d="M 58 46 Q 63 16 100 12 Q 137 16 142 46 Q 132 22 100 22 Q 68 22 58 46 Z"
          fill="#1a1a1a"
        />
        <path d="M 57 65 Q 56 42 63 30" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="4" strokeLinecap="round" />
        <path d="M 143 65 Q 144 42 137 30" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="4" strokeLinecap="round" />

        {/* 首 */}
        <rect x="86" y="119" width="28" height="24" rx="3" fill="#f5b896" />
        <line x1="94" y1="120" x2="93" y2="143" stroke="#e09a76" strokeWidth="1" opacity="0.6" />
        <line x1="106" y1="120" x2="107" y2="143" stroke="#e09a76" strokeWidth="1" opacity="0.6" />
      </g>

      {/* ===== 胴体グループ（状態により変形） ===== */}
      <g className="char-body-group" filter="url(#char-shadow)">
        {/* スーツ本体 */}
        <path
          d="M 22 150 L 10 320 L 190 320 L 178 150
             Q 155 134 132 138 L 110 141 L 100 155 L 90 141 L 68 138
             Q 45 134 22 150 Z"
          fill="url(#suitGrad)"
        />

        {/* シャツ（中央） */}
        <path
          d="M 90 141 L 86 320 L 114 320 L 110 141 L 100 155 Z"
          fill="#f0f0f0"
        />

        {/* ネクタイノット */}
        <polygon points="97,145 103,145 104,153 100,157 96,153" fill="#7b0000" />
        {/* ネクタイ本体 */}
        <polygon points="96,155 104,155 107,185 100,200 93,185" fill="#c62828" />
        {/* ネクタイ縦線 */}
        <line x1="100" y1="160" x2="100" y2="194" stroke="#7b0000" strokeWidth="1.2" opacity="0.5" />

        {/* 左ラペル */}
        <path d="M 90 141 L 68 138 L 83 182 L 92 170 Z" fill="#1e3a8a" />
        {/* 右ラペル */}
        <path d="M 110 141 L 132 138 L 117 182 L 108 170 Z" fill="#1e3a8a" />

        {/* 襟（左） */}
        <polygon points="86,121 88,141 100,155 94,135" fill="#f5f5f5" />
        {/* 襟（右） */}
        <polygon points="114,121 112,141 100,155 106,135" fill="#f5f5f5" />

        {/* 胸ポケット */}
        <rect x="54" y="172" width="28" height="20" rx="3" fill="#1e3a8a" />
        {/* ポケットチーフ */}
        <polygon points="60,172 66,161 72,172" fill="#fdd835" opacity="0.95" />
        <polygon points="64,172 68,163 70,172" fill="#fff176" opacity="0.7" />

        {/* ボタン */}
        <circle cx="100" cy="218" r="4.5" fill="#1e3a8a" />
        <circle cx="100" cy="237" r="4.5" fill="#1e3a8a" />
        <circle cx="100" cy="256" r="4.5" fill="#1e3a8a" />

        {/* 左腕 */}
        <path d="M 22 150 Q 8 210 14 278 L 44 278 Q 40 214 48 157" fill="#1a2a7e" />
        {/* 右腕 */}
        <path d="M 178 150 Q 192 210 186 278 L 156 278 Q 160 214 152 157" fill="#1a2a7e" />

        {/* カフス（左） */}
        <rect x="11" y="269" width="35" height="17" rx="4" fill="#283593" />
        <rect x="12" y="270" width="33" height="6" fill="#f0f0f0" />
        {/* カフス（右） */}
        <rect x="154" y="269" width="35" height="17" rx="4" fill="#283593" />
        <rect x="155" y="270" width="33" height="6" fill="#f0f0f0" />
      </g>
    </svg>
  );
}
