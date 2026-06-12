const axios = require('axios');
const cheerio = require('cheerio');

const SITE = 'https://study.munilsir.com';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

// ── Fetch a page from the original site ──
async function fetchPage(urlPath) {
  const url = urlPath.startsWith('http') ? urlPath : `${SITE}${urlPath}`;
  const { data } = await axios.get(url, {
    headers: { 'User-Agent': UA, 'Accept': 'text/html,application/xhtml+xml' },
    timeout: 12000
  });
  return data;
}

// ── Extract __NEXT_DATA__ JSON from SSR'd HTML ──
function extractNextData(html) {
  const m = html.match(/<script\s+id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (m) { try { return JSON.parse(m[1]); } catch {} }
  return null;
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ── Parse course cards from rendered HTML ──
function parseCourses(html) {
  const $ = cheerio.load(html);
  const courses = [];
  const seen = new Set();

  $('div[id]').each((_, el) => {
    const id = $(el).attr('id');
    if (!id || isNaN(id) || seen.has(id)) return;
    seen.add(id);

    const $c = $(el);
    const name = $c.find('h3').first().text().trim();
    if (!name) return;

    const img = $c.find('img').first().attr('src') || '';
    const priceText = $c.find('p').filter((_, p) => $(p).text().includes('₹')).first().text().trim();
    const strikeText = $c.find('.text-decoration-line-through').first().text().trim();

    const price = parseInt(priceText.replace(/[₹,\s]/g, '')) || 0;
    const originalPrice = parseInt(strikeText.replace(/[₹,\s]/g, '')) || price;
    const discMatch = $c.text().match(/(\d+)\s*%\s*off/i);
    const discount = discMatch ? parseInt(discMatch[1]) : (originalPrice > price ? Math.round((1 - price/originalPrice)*100) : 0);
    const isNew = $c.text().includes('NEW');

    courses.push({
      id: parseInt(id), name,
      image: img.startsWith('/') ? `${SITE}${img}` : img,
      price, originalPrice, discount, isNew,
      slug: `${id}-${slugify(name)}`
    });
  });

  return courses;
}

// ── Parse hero banners from homepage ──
function parseBanners(html) {
  const $ = cheerio.load(html);
  const banners = [];
  const seen = new Set();

  $('img[alt="hero"]').each((_, el) => {
    const src = $(el).attr('src');
    if (!src || seen.has(src)) return;
    seen.add(src);
    const link = $(el).closest('a').attr('href') || '#';
    banners.push({ image: src, link });
  });

  return banners;
}

// ── Parse course detail page ──
function parseCourseDetail(html) {
  const nd = extractNextData(html);
  if (nd?.props?.pageProps) return nd.props.pageProps;

  const $ = cheerio.load(html);
  return {
    name: $('h1').first().text().trim() || $('h2').first().text().trim(),
    image: $('img[alt]').first().attr('src') || '',
    description: $('[class*="prose"]').first().html() || '',
    subjects: []
  };
}

module.exports = { SITE, fetchPage, extractNextData, parseCourses, parseBanners, parseCourseDetail, slugify };
