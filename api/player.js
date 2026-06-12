export default async function handler(req, res) {
  const { token, type } = req.query;

  if (!token) {
    return res.status(400).send('Missing token');
  }

  // Support both video and PDF player based on type
  let target = `https://player.appx.co.in/secure-player?isMobile=true&token=${token}`;
  if (type === 'PDF' || type === 'DOCUMENT') {
     target = `https://appx-play.classx.co.in/combined-img-player?isMobile=true&token=${token}`;
  }

  try {
    const response = await fetch(target, {
      method: 'GET',
      headers: {
        'Referer': 'https://study.munilsir.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return res.status(response.status).send(`Failed to load player: ${response.statusText}`);
    }

    let html = await response.text();

    // Inject base tag to fix relative assets
    const baseTag = '<base href="https://player.appx.co.in/">';
    html = html.replace('<head>', `<head>${baseTag}`);

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send('Internal Server Error proxying player');
  }
}
