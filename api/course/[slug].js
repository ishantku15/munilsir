const { fetchPage, parseCourseDetail } = require('../../lib/scraper');

module.exports = async (req, res) => {
  try {
    const { slug } = req.query;
    const html = await fetchPage(`/new-courses/${slug}`);
    const data = parseCourseDetail(html);
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
