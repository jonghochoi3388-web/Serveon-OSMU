// /api/claude — Anthropic API 프록시 (Vercel Serverless Function)
// 키는 Vercel 대시보드 > Settings > Environment Variables 의
// ANTHROPIC_API_KEY 에 저장되며 브라우저에 절대 노출되지 않습니다.

export default async function handler(req, res) {
  const key = process.env.ANTHROPIC_API_KEY;

  // GET: 프런트가 "Vercel 설정 완료" 여부를 확인하는 상태 점검
  if (req.method === 'GET') {
    return res.status(200).json({ configured: Boolean(key) });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!key) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (e) {
    return res.status(502).json({ error: 'Upstream error: ' + e.message });
  }
}
