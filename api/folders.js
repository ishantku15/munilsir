const axios = require('axios');

// Hardcoded Master Token (From the ₹20 purchase)
const AUTH_HEADERS = {
  "Auth-Key": "appxapi",
  "Authorization": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjExNTM2NSIsInRpbWVzdGFtcCI6MTc4MTI5NTU4OCwiaXZfdmVyIjoyLCJzZXNzaW9uIjoiZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5LmV5SnBaQ0k2SWpFeE5UTTJOU0lzSW1WdFlXbHNJam9pZUhsNlkzSmxZWFJwYjI1ek9EZzVPVUJuYldGcGJDNWpiMjBpTENKdVlXMWxJam9pU1hOb1lXNTBJaXdpZEdWdVlXNTBWSGx3WlNJNkluVnpaWElpTENKMFpXNWhiblJPWVcxbElqb2liWFZ1YVd4emFYSmZaR0lpTENKMFpXNWhiblJKWkNJNklpSXNJbVJwYzNCdmMyRmliR1VpT21aaGJITmxmUS52VVpxT01KNDdXOTdDWTF4bnNaV3pxa0Z5Q1NFMWZFTEtNenBKZ3FiekprIn0.8WmE2cHY38jb22L6R6jeAY7N6RkBUO9jXLOYn-TAt6o",
  "Client-Service": "Appx",
  "Source": "website",
  "User-Id": "115365",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

  try {
    const courseId = req.query.course_id;
    const parentId = req.query.parent_id || '-1';

    if (!courseId) {
      return res.status(400).json({ error: 'Missing course_id' });
    }

    const apiUrl = `https://munilsirapi.akamai.net.in/get/folder_contentsv3?course_id=${courseId}&parent_id=${parentId}`;

    const response = await axios.get(apiUrl, { headers: AUTH_HEADERS });
    
    return res.status(200).json(response.data);

  } catch (err) {
    console.error('Folder Fetch Error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch course content from original backend' });
  }
};

