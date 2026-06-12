import crypto from 'crypto';

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
    
    // Check if we got an encrypted download link
    if (data && data.download_links && data.download_links.length > 0) {
      const encryptedStr = data.download_links[0].path;
      if (encryptedStr.includes(':')) {
        const parts = encryptedStr.split(':');
        const cipherText = parts[0];
        const keyB64 = parts[1];
        
        // Double base64 encoded IV
        const ivDoubleB64 = data.iv_string;
        const ivB64 = Buffer.from(ivDoubleB64, 'base64').toString('utf8');
        
        const keyBuf = Buffer.from(keyB64, 'base64');
        const ivBuf = Buffer.from(ivB64, 'base64');

        const decipher = crypto.createDecipheriv('aes-128-cbc', keyBuf, ivBuf);
        let decrypted = decipher.update(cipherText, 'base64', 'utf8');
        decrypted += decipher.final('utf8');

        return res.status(200).json({ success: true, url: decrypted });
      }
      
      // Fallback if not encrypted
      return res.status(200).json({ success: true, url: data.download_links[0].path });
    }

    if (data && data.hls_link) {
       return res.status(200).json({ success: true, url: data.hls_link });
    }

    res.status(404).json({ error: 'No video links found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch or decrypt video details' });
  }
}
