import dotenv from "dotenv";
import express from "express";
import og from "open-graph";
import axios from "axios";
import * as cheerio from "cheerio";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("This is the root endpoint. Use /fetchData?url=YOUR_URL to fetch Open Graph data.");
});

app.get("/fetchData", async (req, res) => {
  const url = req.query.url;
  console.log("req.query :>> ", req.query);

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "A valid URL is required" });
  }

  try {
    og(url, function (err, meta) {
      if (err) {
        console.error("Error fetching Open Graph data:", err);
        return res
          .status(500)
          .json({ error: "Failed to fetch Open Graph data" });
      }

      if (!meta) {
        return res
          .status(404)
          .json({ error: "No metadata found for this URL" });
      }

      const siteName = meta.site_name || "";
      let responseData = {};

      if (siteName.includes("YouTube")) {
        responseData = {
          message: "This video is from YouTube",
          title: meta.title || "No title found",
          videoUrl: meta.video.url || "No video URL found",
        };
      } else if (siteName.includes("Instagram")) {
        responseData = {
          message: "This video is from Instagram",
          title: meta.title || "No title found",
          videoUrl: meta.url || "No video URL found",
        };
      } else if (siteName.includes("Facebook")) {
        responseData = {
          message: "This video is from Facebook",
          title: meta.title || "No title found",
          videoUrl: meta.url || "No video URL found",
        };
      } else if (siteName.includes("TikTok")) {
        responseData = {
          message: "This video is from TikTok",
          title: meta.title || "No title found",
          videoUrl: meta.video.url || "No video URL found",
        };
      } else if (siteName.includes("Snapchat")) {
        responseData = {
          message: "This video is from Snapchat",
          title: meta.title || "No title found",
          videoUrl: meta.url || "No video URL found",
        };
      } else if (siteName.includes("")) {
        responseData = {
          message: "This video is from Other",
          title: meta.title || "No title found",
          videoUrl: meta.url || "No video URL found",
        };
      } else {
        return res.status(400).json({
          error:
            "The provided URL is not from a supported site (YouTube, Instagram, Facebook, TikTok).",
        });
      }

      res.json(responseData);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
