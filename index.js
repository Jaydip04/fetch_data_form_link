import dotenv from "dotenv";
import express from "express";
import og from 'open-graph'; 

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/',(req,res)=>{
    res.send("This is fetchData Api")
})

app.get('/api/fetchData/', (req, res) => {
  const url = req.query.url;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'A valid URL is required' });
  }

  og(url, (err, meta) => {
    if (err) {
      console.error('Error fetching Open Graph data:', err);
      return res.status(500).json({ error: 'Failed to fetch Open Graph data' });
    }

    if (!meta) {
      return res.status(404).json({ error: 'No metadata found for this URL' });
    }

    const siteName = meta.site_name || ''; 
    let responseData = {};

    if (siteName.includes('YouTube')) {
      responseData = {
        message: 'YouTube video detected',
        videoUrl: meta.url || 'No video URL found',
      };
    } else if (siteName.includes('Instagram')) {
      responseData = {
        message: 'Instagram post detected',
        originalUrl: meta.url,
      };
    } else if(siteName.includes('Facebook')){
      responseData = {
        message: 'Facebook post detected',
        originalUrl: meta.url,
      };
    }else {
      return res.status(400).json({ error: 'The provided URL is not from YouTube or Instagram.' });
    }

    res.json(responseData);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});