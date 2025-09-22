/**
 * Download Facebook story by URL
 * @param {string} url - Facebook story URL
 * @returns {Promise<Object>} - Result object with media URL or error
 */
async function downloadStory(url) {
  try {
    // Validate input
    if (!url) {
      return {
        success: false,
        error: 'URL is required'
      };
    }

    // Normalize URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    // Convert mobile Facebook URLs to desktop URLs for better parsing
    normalizedUrl = normalizedUrl.replace('m.facebook.com', 'www.facebook.com');
    if (normalizedUrl.includes('facebook.com') && 
        !normalizedUrl.includes('www.facebook.com') && 
        !normalizedUrl.includes('www.www.facebook.com')) {
      normalizedUrl = normalizedUrl.replace('facebook.com', 'www.facebook.com');
    }
    normalizedUrl = normalizedUrl.replace('www.www.facebook.com', 'www.facebook.com');

    console.log(`Fetching story from: ${normalizedUrl}`);


    // Fallback: Fetch the Facebook page with appropriate headers
    const response = await axios.get(normalizedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      timeout: 8000, // 8 second timeout to meet requirement
      maxRedirects: 3,
      validateStatus: function (status) {
        // Accept 200-299 and 400-499 status codes
        return status >= 200 && status < 500;
      }
    });

    // Parse HTML to extract story media
    const $ = cheerio.load(response.data);
    const storyMedia = extractStoryMedia(response.data);
    if (storyMedia) {
      // Handle video content with SD/HD options
      if (storyMedia.type === 'video' && (storyMedia.sd || storyMedia.hd)) {
        return {
          success: true,
          videos: {
            sd: storyMedia.sd,
            hd: storyMedia.hd
          },
          type: 'video'
        };
      }
      
      // Handle m3u8 streams
      if (storyMedia.type === 'm3u8') {
        return {
          success: true,
          mediaUrl: storyMedia.url,
          type: storyMedia.type,
          note: 'This is an m3u8 stream. To download, use a tool like VLC or ffmpeg, or a browser extension that supports m3u8 downloads.'
        };
      }
      
      // Handle images and other media types
      if (storyMedia.url) {
        return {
          success: true,
          mediaUrl: storyMedia.url,
          type: storyMedia.type
        };
      }
    }

    // If no media found, try alternative extraction methods
    const alternativeMedia = await tryAlternativeExtraction(normalizedUrl, response.data);
    if (alternativeMedia) {
      if (alternativeMedia.type === 'm3u8') {
        return {
          success: true,
          mediaUrl: alternativeMedia.url,
          type: alternativeMedia.type,
          note: 'This is an m3u8 stream. To download, use a tool like VLC or ffmpeg, or a browser extension that supports m3u8 downloads.'
        };
      }
      return {
        success: true,
        mediaUrl: alternativeMedia.url,
        type: alternativeMedia.type
      };
    }

    return {
      success: false,
      error: 'Story media not found. If this is a private or expired story, it may not be downloadable.'
    };

  } catch (error) {
    console.error('Error downloading story:', error);
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return {
        success: false,
        error: 'Unable to connect to Facebook. Please check your internet connection.'
      };
    }

    return {
      success: false,
      error: 'Failed to fetch story content'
    };
  }
}

/**
 * Try alternative extraction methods
 * @param {string} url - Story URL
 * @param {string} html - HTML content
 * @returns {Object|null} - Media object or null
 */
async function tryAlternativeExtraction(url, html) {
  try {
    // Look for script tags containing story data with SD/HD options
    const scriptPatterns = [
      /"story_attachment":\s*{[^}]*"media":\s*{[^}]*"playable_url_quality_hd":"([^"]+)"[^}]*"playable_url_quality_sd":"([^"]+)"/g,
      /"story_attachment":\s*{[^}]*"media":\s*{[^}]*"playable_url_quality_sd":"([^"]+)"[^}]*"playable_url_quality_hd":"([^"]+)"/g,
      /"story":\s*{[^}]*"video":\s*{[^}]*"playable_url_quality_hd":"([^"]+)"[^}]*"playable_url_quality_sd":"([^"]+)"/g,
      /"story":\s*{[^}]*"video":\s*{[^}]*"playable_url_quality_sd":"([^"]+)"[^}]*"playable_url_quality_hd":"([^"]+)"/g,
      // Fallback patterns for single URLs
      /"story_attachment":\s*{[^}]*"media":\s*{[^}]*"playable_url":"([^"]+)"/g,
      /"story":\s*{[^}]*"video":\s*{[^}]*"playable_url":"([^"]+)"/g,
      /"story":\s*{[^}]*"image":\s*{[^}]*"uri":"([^"]+)"/g
    ];
    
    for (const pattern of scriptPatterns) {
      let match;
      while ((match = pattern.exec(html)) !== null) {
        // Check if this is a pattern with both HD and SD URLs
        if (match.length >= 3 && match[1] && match[2]) {
          // This pattern has both HD and SD URLs
          const hdUrl = decodeURIComponent(match[1]).replace(/\\\//g, '/');
          const sdUrl = decodeURIComponent(match[2]).replace(/\\\//g, '/');
          
          if ((hdUrl && hdUrl.includes('http')) || (sdUrl && sdUrl.includes('http'))) {
            console.log(`Found story media via alternative method: HD - ${hdUrl}, SD - ${sdUrl}`);
            return {
              hd: hdUrl.includes('http') ? hdUrl : null,
              sd: sdUrl.includes('http') ? sdUrl : null,
              type: 'video'
            };
          }
        } else if (match[1]) {
          // This pattern has a single URL
          const mediaUrl = decodeURIComponent(match[1]).replace(/\\\//g, '/');
          if (mediaUrl && mediaUrl.includes('http')) {
            // Determine media type
            let type = 'unknown';
            if (mediaUrl.includes('.mp4')) {
              type = 'video';
            } else if (mediaUrl.includes('.m3u8')) {
              type = 'm3u8';
            } else if (mediaUrl.match(/\.(jpg|jpeg|png|webp)/i)) {
              type = 'image';
            }
            
            console.log(`Found story media via alternative method: ${type} - ${mediaUrl}`);
            return {
              url: mediaUrl,
              type: type
            };
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error in alternative extraction:', error);
    return null;
  }
}
