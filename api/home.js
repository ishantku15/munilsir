const { fetchPage, parseBanners, parseCourses } = require('../lib/scraper');

module.exports = async (req, res) => {
  try {
    const html = await fetchPage('/');
    const banners = parseBanners(html);
    const featured = parseCourses(html);
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.json({ banners, featured });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
