export default async function handler(req, res) {
  const { course_id, video_id } = req.query;

  if (!course_id || !video_id) {
    return res.status(400).json({ error: 'Missing course_id or video_id' });
  }

  try {
    const response = await fetch(`https://munilsirapi.akamai.net.in/get/fetchVideoDetailsById?course_id=${course_id}&video_id=${video_id}&ytflag=0&folder_wise_course=1&lc_app_api_url=`, {
      method: 'GET',
      headers: {
        'Auth-Key': 'appxapi',
        'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjExNTM2NSIsInRpbWVzdGFtcCI6MTc4MTI5NTU4OCwiaXZfdmVyIjoyLCJzZXNzaW9uIjoiZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5LmV5SnBaQ0k2SWpFeE5UTTJOU0lzSW1WdFlXbHNJam9pZUhsNlkzSmxZWFJwYjI1ek9EZzVPVUJuYldGcGJDNWpiMjBpTENKdVlXMWxJam9pU1hOb1lXNTBJaXdpZEdWdVlXNTBWSGx3WlNJNkluVnpaWElpTENKMFpXNWhiblJPWVcxbElqb2liWFZ1YVd4emFYSmZaR0lpTENKMFpXNWhiblJKWkNJNklpSXNJbVJwYzNCdmMyRmliR1VpT21aaGJITmxmUS52VVpxT01KNDdXOTdDWTF4bnNaV3pxa0Z5Q1NFMWZFTEtNenBKZ3FiekprIn0.8WmE2cHY38jb22L6R6jeAY7N6RkBUO9jXLOYn-TAt6o',
        'Client-Service': 'Appx',
        'Device-Type': 'Windows',
        'Source': 'website'
      }
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch video details' });
  }
}
