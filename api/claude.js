// /api/claude — Anthropic API 프록시 (Vercel Serverless Function, CommonJS)
// 키는 Vercel > Settings > Environment Variables 의 ANTHROPIC_API_KEY 에 저장.
// ※ 환경변수는 "등록 후 Redeploy 한 새 배포"부터 적용됩니다.

module.exports = async (req, res) => {
  const key = process.env.ANTHROPIC_API_KEY;

  // GET: 프런트가 "Vercel 설정 완료" 여부를 확인하는 상태 점검
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ configured: Boolean(key) });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!key) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured (Redeploy needed after adding env var)' });
  }

  try {
    // Vercel이 JSON body를 자동 파싱하지만, 문자열로 올 경우도 방어
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
    });
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (e) {
    return res.status(502).json({ error: 'Upstream error: ' + e.message });
  }
};
