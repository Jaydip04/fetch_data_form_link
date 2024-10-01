import dotenv from "dotenv";
import express from "express";
import og from 'open-graph'; // Import the open-graph package

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/',(req,res)=>{
    res.send("This is fetchData Api")
})

app.get('/api/fetchData', (req, res) => {
  const url = req.query.url;

  // Validate URL input
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'A valid URL is required' });
  }

  // Use the open-graph package to fetch metadata
  og(url, (err, meta) => {
    if (err) {
      console.error('Error fetching Open Graph data:', err);
      return res.status(500).json({ error: 'Failed to fetch Open Graph data' });
    }

    // Check if metadata was retrieved
    if (!meta) {
      return res.status(404).json({ error: 'No metadata found for this URL' });
    }

    // Determine if the site is YouTube or Instagram
    const siteName = meta.site_name || ''; // Extract the site name from metadata
    let responseData = {};

    if (siteName.includes('YouTube')) {
      // If the site is YouTube, extract the video URL
      responseData = {
        message: 'YouTube video detected',
        videoUrl: meta.video.url || 'No video URL found',
      };
    } else if (siteName.includes('Instagram')) {
      // If the site is Instagram, return the original URL
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

    // Return the response data
    res.json(responseData);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});