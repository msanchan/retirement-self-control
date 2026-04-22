import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;
  if (!text || text.trim().length < 2) {
    return res.status(400).json({ error: 'テキストを入力してください' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // APIキー未設定時のモックレスポンス
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    const mockScore = text.includes('疲れ') || text.includes('つらい') || text.includes('辞め')
      ? -Math.floor(Math.random() * 40 + 40)
      : text.includes('楽し') || text.includes('嬉し') || text.includes('良かっ')
      ? Math.floor(Math.random() * 40 + 30)
      : Math.floor(Math.random() * 40 - 20);

    return res.status(200).json({
      score: mockScore,
      tags: ['職場', 'ストレス', '感情'],
      summary: '⚠️ APIキー未設定のため仮スコアを使用しています。.env.local に GEMINI_API_KEY を設定してください。',
      advice: '退職前に財務シミュレーションを必ず行いましょう。',
      positive_points: mockScore > 0 ? ['前向きな内容が含まれています'] : [],
      negative_points: mockScore < 0 ? ['ネガティブな感情が検出されました'] : [],
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const diarySection = '=== 日記テキスト ===\n' + text;
    const formatSection = [
      '=== 出力形式 (JSONのみ。説明文やコードブロック記号は不要) ===',
      '{',
      '  "score": -100から100の整数(-100=退職寸前, 0=中立, 100=仕事充実),',
      '  "tags": ["感情タグを最大3個(日本語10文字以内)"],',
      '  "summary": "2〜3文の分析(日本語)",',
      '  "advice": "経済的・現実的なアドバイス1文(日本語)",',
      '  "positive_points": ["ポジティブな要素(なければ空配列)"],',
      '  "negative_points": ["ネガティブな要素(なければ空配列)"]',
      '}',
    ].join('\n');

    const prompt = [
      'あなたは40代サラリーマンのメンタルヘルスと退職衝動を専門に分析するAIカウンセラーです。',
      '以下の日記テキストを分析し、必ず指定のJSON形式のみで回答してください。',
      '',
      diarySection,
      '',
      formatSection,
    ].join('\n');

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('JSONが見つかりません');

    const data = JSON.parse(jsonMatch[0]);
    data.score = Math.max(-100, Math.min(100, parseInt(data.score, 10) || 0));
    if (!Array.isArray(data.tags)) data.tags = [];
    if (!Array.isArray(data.positive_points)) data.positive_points = [];
    if (!Array.isArray(data.negative_points)) data.negative_points = [];

    return res.status(200).json(data);
  } catch (err) {
    console.error('Gemini API エラー:', err);
    return res.status(500).json({
      error: 'AI分析中にエラーが発生しました',
      details: err.message,
    });
  }
}
