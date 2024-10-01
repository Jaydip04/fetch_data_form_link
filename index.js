import dotenv from "dotenv";
import express from "express";
import og from "open-graph";

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("This api use the fetch Data from link");
});

app.get("/api/fetchData", (req, res) => {
  const url = req.query.url;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "A valid URL is required" });
  }

  og(url, (err, meta) => {
    if (err) {
      console.error("Error fetching Open Graph data:", err);
      return res.status(500).json({ error: "Failed to fetch Open Graph data" });
    }

    if (!meta) {
      return res.status(404).json({ error: "No metadata found for this URL" });
    }

    const siteName = meta.site_name || ""; // Extract the site name from metadata
    let responseData = {};

    if (siteName.includes("YouTube")) {
      responseData = {
        message: "YouTube video detected",
        videoUrl: meta.video.url || "No video URL found",
      };
    } else if (siteName.includes("Instagram")) {
      responseData = {
        message: "Instagram post detected",
        originalUrl: meta.url,
      };
    }else {
      return res
        .status(400)
        .json({ error: "The provided URL is not from YouTube or Instagram." });
    }

    res.json(responseData);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
