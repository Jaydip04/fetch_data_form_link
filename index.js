import dotenv from "dotenv";
import express from "express";
import og from "open-graph";

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

app.get("/", (req, res) => {
  res.send("This is fetchData Api form link add");
});

app.get("/api/fetchData/", (req, res) => {
  const url = req.query.url;

  // Validate URL input
  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "A valid URL is required" });
  }

  // Use the open-graph package to fetch metadata
  og(url, function (err, meta) {
    if (err) {
      console.error("Error fetching Open Graph data:", err);
      return res.status(500).json({ error: "Failed to fetch Open Graph data" });
    }

    // Check if metadata was retrieved
    if (!meta) {
      return res.status(404).json({ error: "No metadata found for this URL" });
    }

    const siteName = meta.site_name || "";
    let responseData = {};

    // Determine the site and prepare the response data accordingly
    if (siteName.includes("YouTube")) {
      responseData = {
        message: "This video is from YouTube",
        title: meta.title || "No title found",
        videoUrl: meta.video.url || "No video URL found",
        // likes: meta.likes || "Likes information not available",
      };
    } else if (siteName.includes("Instagram")) {
      responseData = {
        message: "This video is from Instagram",
        title: meta.title || "No title found",
        videoUrl: meta.url || "No video URL found",
        // likes: meta.site_name || "Likes information not available",
      };
    } else if (siteName.includes("Facebook")) {
      responseData = {
        message: "This video is from Facebook",
        title: meta.title || "No title found",
        videoUrl: meta.video.url || "No video URL found",
        // likes: meta.likes || "Likes information not available",
      };
    } else if (siteName.includes("TikTok")) {
      responseData = {
        message: "This video is from TikTok",
        title: meta.title || "No title found",
        videoUrl: meta.video.url || "No video URL found",
        // likes: meta.likes || "Likes information not available",
      };
    } else if (siteName.includes("")) {
      responseData = {
        message: meta
        // "This video is from other",
        // title: meta.title || "No title found",
        // videoUrl: meta.url || "No video URL found",
      };
    } else {
      return res.status(400).json({
        error:
          "The provided URL is not from a supported site (YouTube, Instagram, Facebook, TikTok).",
      });
    }

    // Return the response data
    res.json(responseData);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
