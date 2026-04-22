import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

function formatDate(isoStr) {
  const d = new Date(isoStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const score = payload[0]?.value;
  return (
    <div className="glass-card p-2 text-xs">
      <div className="text-slate-300">{label}</div>
      <div className="font-bold" style={{ color: score >= 0 ? '#22c55e' : '#ef4444' }}>
        スコア: {score > 0 ? '+' : ''}{score}
      </div>
      {payload[0]?.payload?.tags?.length > 0 && (
        <div className="text-slate-400">{payload[0].payload.tags.join(' / ')}</div>
      )}
    </div>
  );
}

export default function StressChart({ entries }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
        日記を書くとグラフが表示されます
      </div>
    );
  }

  const data = entries
    .slice(-30) // 直近30件
    .map((e) => ({
      date: formatDate(e.timestamp),
      score: e.score || 0,
      tags: e.tags || [],
    }));

  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
        <YAxis domain={[-100, 100]} tick={{ fontSize: 10 }} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={0} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />
        <ReferenceLine y={25} stroke="rgba(34,197,94,0.3)" strokeDasharray="4 4" />
        <ReferenceLine y={-25} stroke="rgba(239,68,68,0.3)" strokeDasharray="4 4" />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#5c6bc0"
          strokeWidth={2.5}
          dot={{ r: 3.5, fill: '#5c6bc0', strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#7986cb' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
