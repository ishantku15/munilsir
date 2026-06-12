const { fetchPage, parseCourses } = require('../lib/scraper');

module.exports = async (req, res) => {
  try {
    const html = await fetchPage('/zero-price-courses');
    const courses = parseCourses(html);
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.json({ courses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
