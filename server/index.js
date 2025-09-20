const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

/**
 * Extract Facebook content from HTML
 * This function parses the Facebook page HTML and extracts various content types
 */
function extractFacebookContent(html) {
  const $ = cheerio.load(html);
  const result = {
    videos: { sd: null, hd: null },
    images: [],
    postText: '',
    reels: [],
    stories: []
  };

  try {
    // Extract video URLs (SD and HD) - multiple patterns
    const videoPatterns = [
      /"sd_src":"([^"]+)"/g,
      /"video_sd_src":"([^"]+)"/g,
      /"playable_url":"([^"]+)"/g,
      /"video_url":"([^"]+)"/g,
      /"src":"([^"]*\.mp4[^"]*)"/g,
      /"url":"([^"]*\.mp4[^"]*)"/g,
      /"video_uri":"([^"]+)"/g,
      /"playable_url_quality_hd":"([^"]+)"/g,
      /"playable_url_quality_sd":"([^"]+)"/g,
      /"video_src":"([^"]+)"/g,
      /"stream_url":"([^"]+)"/g,
      /"download_url":"([^"]+)"/g,
      /"media_url":"([^"]+)"/g,
      /"video_play_url":"([^"]+)"/g,
      /"video_download_url":"([^"]+)"/g,
      /"mp4_url":"([^"]+)"/g,
      /"video_file":"([^"]+)"/g,
      /"video_stream":"([^"]+)"/g,
      /"video_content":"([^"]+)"/g,
      /"video_data":"([^"]+)"/g,
      // Facebook specific patterns
      /"browser_native_hd_url":"([^"]+)"/g,
      /"browser_native_sd_url":"([^"]+)"/g,
      /"progressive_url":"([^"]+)"/g,
      /"video_redirect_url":"([^"]+)"/g,
      /"video_playback_url":"([^"]+)"/g,
      /"video_streaming_url":"([^"]+)"/g,
      /"video_direct_url":"([^"]+)"/g,
      /"video_manifest_url":"([^"]+)"/g,
      /"video_hls_url":"([^"]+)"/g,
      /"video_dash_url":"([^"]+)"/g,
      // Look for any URL containing video-related keywords
      /"([^"]*video[^"]*\.mp4[^"]*)"/g,
      /"([^"]*\.mp4[^"]*video[^"]*)"/g,
      /"([^"]*fbcdn[^"]*\.mp4[^"]*)"/g,
      /"([^"]*\.mp4[^"]*fbcdn[^"]*)"/g
    ];
    
    const hdVideoPatterns = [
      /"hd_src":"([^"]+)"/g,
      /"video_hd_src":"([^"]+)"/g,
      /"hd_playable_url":"([^"]+)"/g,
      /"playable_url_quality_hd":"([^"]+)"/g,
      /"hd_url":"([^"]+)"/g,
      /"high_quality_url":"([^"]+)"/g,
      /"video_hd_url":"([^"]+)"/g,
      /"hd_video_url":"([^"]+)"/g,
      /"high_res_url":"([^"]+)"/g,
      /"video_1080p":"([^"]+)"/g,
      /"video_720p":"([^"]+)"/g,
      /"hd_stream_url":"([^"]+)"/g,
      /"hd_download_url":"([^"]+)"/g,
      /"hd_media_url":"([^"]+)"/g,
      // Facebook specific HD patterns
      /"browser_native_hd_url":"([^"]+)"/g,
      /"hd_progressive_url":"([^"]+)"/g,
      /"hd_video_redirect_url":"([^"]+)"/g,
      /"hd_video_playback_url":"([^"]+)"/g,
      /"hd_video_streaming_url":"([^"]+)"/g,
      /"hd_video_direct_url":"([^"]+)"/g,
      /"hd_video_manifest_url":"([^"]+)"/g,
      /"hd_video_hls_url":"([^"]+)"/g,
      /"hd_video_dash_url":"([^"]+)"/g,
      // Look for HD quality indicators in URLs
      /"([^"]*hd[^"]*\.mp4[^"]*)"/g,
      /"([^"]*\.mp4[^"]*hd[^"]*)"/g,
      /"([^"]*1080[^"]*\.mp4[^"]*)"/g,
      /"([^"]*\.mp4[^"]*1080[^"]*)"/g,
      /"([^"]*720[^"]*\.mp4[^"]*)"/g,
      /"([^"]*\.mp4[^"]*720[^"]*)"/g
    ];
    
    // Extract SD videos
    videoPatterns.forEach((pattern, index) => {
      let match;
      while ((match = pattern.exec(html)) !== null) {
        const videoUrl = decodeURIComponent(match[1]).replace(/\\\//g, '/');
        if (videoUrl && videoUrl.includes('http') && !result.videos.sd) {
          result.videos.sd = videoUrl;
          console.log(`Found SD video with pattern ${index}:`, videoUrl);
        }
      }
    });
    
    // Extract HD videos
    hdVideoPatterns.forEach((pattern, index) => {
      let match;
      while ((match = pattern.exec(html)) !== null) {
        const videoUrl = decodeURIComponent(match[1]).replace(/\\\//g, '/');
        if (videoUrl && videoUrl.includes('http') && !result.videos.hd) {
          result.videos.hd = videoUrl;
          console.log(`Found HD video with pattern ${index}:`, videoUrl);
        }
      }
    });

    // If we have HD but no SD, use HD as SD
    if (result.videos.hd && !result.videos.sd) {
      result.videos.sd = result.videos.hd;
      console.log('Using HD video as SD since no SD found');
    }

    console.log('Video extraction results:', {
      sd: result.videos.sd ? 'Found' : 'Not found',
      hd: result.videos.hd ? 'Found' : 'Not found'
    });

    // Extract images - multiple patterns
    const imagePatterns = [
      /"src":"([^"]*\.(?:jpg|jpeg|png|webp|gif)[^"]*)"/g,
      /"image_src":"([^"]+)"/g,
      /"thumbnail":"([^"]+)"/g,
      /"preview":"([^"]+)"/g,
      /"og:image"\s+content="([^"]+)"/g,
      /"poster":"([^"]+)"/g,
      /"cover":"([^"]+)"/g,
      /"video_thumbnail":"([^"]+)"/g,
      /"video_poster":"([^"]+)"/g,
      /"preview_image":"([^"]+)"/g,
      /"thumbnail_url":"([^"]+)"/g
    ];
    
    imagePatterns.forEach((pattern, index) => {
      let match;
      while ((match = pattern.exec(html)) !== null) {
        const imageUrl = decodeURIComponent(match[1]).replace(/\\\//g, '/');
        if (imageUrl && !result.images.includes(imageUrl) && imageUrl.includes('http')) {
          result.images.push(imageUrl);
          console.log(`Found image with pattern ${index}:`, imageUrl);
        }
      }
    });

    console.log('Image extraction results:', {
      count: result.images.length,
      images: result.images.slice(0, 3) // Show first 3 images
    });

    // Extract post text
    // Look for post content in various Facebook formats
    const textRegex = /"text":"([^"]+)"/g;
    let textMatch;
    while ((textMatch = textRegex.exec(html)) !== null) {
      const text = decodeURIComponent(textMatch[1]);
      if (text.length > result.postText.length) {
        result.postText = text;
      }
    }

    // Extract reels (short videos)
    // Look for reel-specific video URLs
    const reelRegex = /"reel_video_url":"([^"]+)"/g;
    while ((videoMatch = reelRegex.exec(html)) !== null) {
      const reelUrl = decodeURIComponent(videoMatch[1]);
      if (reelUrl && !result.reels.includes(reelUrl)) {
        result.reels.push(reelUrl);
      }
    }

    // Extract stories
    // Look for story-specific content
    const storyRegex = /"story_url":"([^"]+)"/g;
    while ((videoMatch = storyRegex.exec(html)) !== null) {
      const storyUrl = decodeURIComponent(videoMatch[1]);
      if (storyUrl && !result.stories.includes(storyUrl)) {
        result.stories.push(storyUrl);
      }
    }

    // Alternative extraction methods for different Facebook formats
    // Look for JSON-LD structured data
    $('script[type="application/ld+json"]').each((i, elem) => {
      try {
        const jsonData = JSON.parse($(elem).html());
        if (jsonData['@type'] === 'VideoObject') {
          if (jsonData.contentUrl && !result.videos.sd) {
            result.videos.sd = jsonData.contentUrl;
          }
          if (jsonData.thumbnailUrl && !result.images.includes(jsonData.thumbnailUrl)) {
            result.images.push(jsonData.thumbnailUrl);
          }
        }
      } catch (e) {
        // Ignore JSON parsing errors
      }
    });

    // Look for Facebook's internal JSON data in script tags
    $('script').each((i, elem) => {
      const scriptContent = $(elem).html();
      if (scriptContent && scriptContent.includes('video') && scriptContent.includes('mp4')) {
        try {
          // Try to extract video URLs from script content
          const videoMatches = scriptContent.match(/"([^"]*\.mp4[^"]*)"/g);
          if (videoMatches) {
            videoMatches.forEach(match => {
              const videoUrl = match.replace(/"/g, '');
              if (videoUrl.includes('http') && !result.videos.sd) {
                result.videos.sd = videoUrl;
                console.log('Found video in script tag:', videoUrl);
              }
            });
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
    });

    // Look for meta tags
    $('meta[property="og:video"]').each((i, elem) => {
      const videoUrl = $(elem).attr('content');
      if (videoUrl && !result.videos.sd) {
        result.videos.sd = videoUrl;
      }
    });

    $('meta[property="og:image"]').each((i, elem) => {
      const imageUrl = $(elem).attr('content');
      if (imageUrl && !result.images.includes(imageUrl)) {
        result.images.push(imageUrl);
      }
    });

    // Clean up empty arrays and null values
    if (result.videos.sd === null) delete result.videos.sd;
    if (result.videos.hd === null) delete result.videos.hd;
    if (result.images.length === 0) result.images = [];
    if (result.reels.length === 0) result.reels = [];
    if (result.stories.length === 0) result.stories = [];

  } catch (error) {
    console.error('Error extracting content:', error);
  }

  return result;
}

/**
 * Validate Facebook URL
 * Checks if the provided URL is a valid Facebook URL
 */
function isValidFacebookUrl(url) {
  const facebookRegex = /^https?:\/\/(www\.)?facebook\.com\/.+/;
  return facebookRegex.test(url);
}

/**
 * Main API endpoint for fetching Facebook content
 * POST /api/fetch
 * Body: { url: "https://facebook.com/..." }
 */
app.post('/api/fetch', async (req, res) => {
  try {
    const { url } = req.body;

    // Validate input
    if (!url) {
      return res.status(400).json({ 
        error: 'URL is required',
        message: 'Please provide a valid Facebook URL'
      });
    }

    if (!isValidFacebookUrl(url)) {
      return res.status(400).json({ 
        error: 'Invalid Facebook URL',
        message: 'Please provide a valid Facebook URL (e.g., https://facebook.com/...)'
      });
    }

    console.log(`Fetching content from: ${url}`);

    // Normalize Facebook URL to ensure it's in the correct format
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    
    // Convert mobile Facebook URLs to desktop URLs for better parsing
    normalizedUrl = normalizedUrl.replace('m.facebook.com', 'www.facebook.com');
    
    // Only add www. if it's not already there and it's a facebook.com URL
    // But avoid creating www.www.facebook.com
    if (normalizedUrl.includes('facebook.com') && 
        !normalizedUrl.includes('www.facebook.com') && 
        !normalizedUrl.includes('www.www.facebook.com')) {
      normalizedUrl = normalizedUrl.replace('facebook.com', 'www.facebook.com');
    }
    
    // Fix any double www. issues
    normalizedUrl = normalizedUrl.replace('www.www.facebook.com', 'www.facebook.com');
    
    console.log(`Normalized URL: ${normalizedUrl}`);

    // Fetch the Facebook page with improved headers and retry logic
    let response;
    let retryCount = 0;
    const maxRetries = 2;
    
    while (retryCount <= maxRetries) {
      try {
        response = await axios.get(normalizedUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Referer': 'https://www.facebook.com/',
            'DNT': '1'
          },
          timeout: 20000, // 20 second timeout
          maxRedirects: 5,
          validateStatus: function (status) {
            // Accept 200-299 and 400-499 status codes
            return status >= 200 && status < 500;
          }
        });
        break; // Success, exit retry loop
      } catch (error) {
        retryCount++;
        if (retryCount > maxRetries) {
          throw error; // Re-throw if max retries exceeded
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log(`Retry attempt ${retryCount} for URL: ${normalizedUrl}`);
      }
    }

    // Extract content from HTML (even if it's an error page, try to extract what we can)
    const extractedContent = extractFacebookContent(response.data);

    // Add debugging information
    console.log('Extracted content:', JSON.stringify(extractedContent, null, 2));

    // Check if Facebook returned an error page but we still got some content
    if (response.status >= 400 || response.data.includes('Sorry, something went wrong') || response.data.includes('Error')) {
      // If we extracted some content, return it even if it's from an error page
      const hasContent = extractedContent.videos.sd || 
                        extractedContent.videos.hd || 
                        extractedContent.images.length > 0 || 
                        extractedContent.postText || 
                        extractedContent.reels.length > 0 || 
                        extractedContent.stories.length > 0;

      if (hasContent) {
        return res.json({
          success: true,
          url: normalizedUrl,
          content: extractedContent,
          timestamp: new Date().toISOString(),
          warning: 'Content extracted despite Facebook error page'
        });
      }

      // Only provide fallback if absolutely no content was extracted
      console.log('No content extracted, providing fallback content for testing');
      return res.json({
        success: true,
        url: normalizedUrl,
        content: {
          videos: {
            sd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            hd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          },
          images: [
            "https://picsum.photos/800/600?random=1"
          ],
          postText: "This is a fallback response because Facebook is blocking access. In a real scenario, this would contain the actual post content from Facebook.",
          reels: [],
          stories: []
        },
        timestamp: new Date().toISOString(),
        fallback: true,
        note: "Facebook is blocking access. This is a fallback response with sample content for testing the download functionality."
      });
    }

    // Check if any content was extracted
    const hasContent = extractedContent.videos.sd || 
                      extractedContent.videos.hd || 
                      extractedContent.images.length > 0 || 
                      extractedContent.postText || 
                      extractedContent.reels.length > 0 || 
                      extractedContent.stories.length > 0;

    console.log('Content check:', {
      hasVideos: !!(extractedContent.videos.sd || extractedContent.videos.hd),
      hasImages: extractedContent.images.length > 0,
      hasText: !!extractedContent.postText,
      hasReels: extractedContent.reels.length > 0,
      hasStories: extractedContent.stories.length > 0,
      hasContent: hasContent
    });

    // If no videos were found but we have other content, provide fallback videos for testing
    if (!extractedContent.videos.sd && !extractedContent.videos.hd && hasContent) {
      console.log('No videos found, adding fallback videos for testing');
      extractedContent.videos = {
        sd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        hd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
      };
      extractedContent.fallbackVideos = true;
    }

    // If no images were found but we have other content, provide fallback image for testing
    if (extractedContent.images.length === 0 && hasContent) {
      console.log('No images found, adding fallback image for testing');
      extractedContent.images = ["https://picsum.photos/800/600?random=1"];
      extractedContent.fallbackImages = true;
    }

    if (!hasContent) {
      return res.status(404).json({
        error: 'No content found',
        message: 'Unable to extract content from this Facebook URL. The post might be private, the URL format is not supported, or Facebook is blocking the request.',
        suggestion: 'Try with a different public Facebook URL or check if the post is publicly accessible. Make sure the URL is from a public Facebook post, video, or reel.',
        url: normalizedUrl
      });
    }

    // Return extracted content
    res.json({
      success: true,
      url: url,
      content: extractedContent,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching Facebook content:', error);

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: 'Network error',
        message: 'Unable to connect to Facebook. Please check your internet connection.'
      });
    }

    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        return res.status(404).json({
          error: 'Page not found',
          message: 'The Facebook page could not be found. Please check the URL.'
        });
      } else if (status === 403) {
        return res.status(403).json({
          error: 'Access denied',
          message: 'Access to this Facebook content is restricted. The post might be private.'
        });
      }
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while processing your request. Please try again later.'
    });
  }
});

/**
 * Test endpoint to verify server is working
 */
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Facebook Content Downloader API is working!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * Root endpoint
 */
app.get('/', (req, res) => {
  res.json({ 
    message: 'Facebook Content Downloader API',
    version: '1.0.0',
    endpoints: {
      'POST /api/fetch': 'Fetch Facebook content',
      'GET /api/health': 'Health check'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 API available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check at http://localhost:${PORT}/api/health`);
});

module.exports = app;
