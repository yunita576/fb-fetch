import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

/**
 * Main App component for Facebook Content Downloader
 * Handles URL input, API calls, and content display
 */
function App() {
  // State management
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Handle form submission
   * Validates URL and calls the backend API
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset previous results
    setError(null);
    setResult(null);

    // Basic URL validation
    if (!url.trim()) {
      setError('Please enter a Facebook URL');
      return;
    }

    if (!url.includes('facebook.com')) {
      setError('Please enter a valid Facebook URL');
      return;
    }

    setLoading(true);

    try {
      // Call backend API
      const response = await axios.post('http://localhost:5000/api/fetch', { url: url.trim() });
      
      if (response.data.success) {
        setResult(response.data);
      } else {
        setError(response.data.message || 'Failed to fetch content');
      }
    } catch (err) {
      console.error('Error fetching content:', err);
      
      if (err.response) {
        // Server responded with error status
        setError(err.response.data.message || 'Server error occurred');
      } else if (err.request) {
        // Network error
        setError('Unable to connect to server. Please check your internet connection.');
      } else {
        // Other error
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle download functionality
   * Downloads content directly to user's device
   */
  const handleDownload = async (downloadUrl, filename, event) => {
    if (!downloadUrl) {
      alert('Download URL not available');
      return;
    }

    try {
      // Show loading state
      const button = event.target;
      const originalText = button.textContent;
      button.textContent = 'Downloading...';
      button.disabled = true;

      // Fetch the file
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch file');
      }

      // Convert to blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'facebook-content';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url);
      
      // Reset button
      button.textContent = originalText;
      button.disabled = false;
      
    } catch (err) {
      console.error('Download error:', err);
      alert('Download failed. Please try again.');
      
      // Reset button
      const button = event.target;
      button.textContent = button.textContent.replace('Downloading...', 'Download');
      button.disabled = false;
    }
  };

  /**
   * Generate filename for downloads
   */
  const generateFilename = (type, quality = '') => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    return `facebook-${type}${quality ? `-${quality}` : ''}-${timestamp}`;
  };

  /**
   * Render video download section
   */
  const renderVideoSection = () => {
    if (!result?.content?.videos) return null;

    const { videos } = result.content;
    const hasVideos = videos.sd || videos.hd;

    if (!hasVideos) return null;

    return (
      <div className="content-section">
        <h3>📹 Download Videos</h3>
        <div className="download-buttons">
          {videos.sd && (
            <button
              className="download-btn sd"
              onClick={(e) => handleDownload(videos.sd, generateFilename('video', 'sd'), e)}
            >
              Download SD Video
            </button>
          )}
          {videos.hd && (
            <button
              className="download-btn hd"
              onClick={(e) => handleDownload(videos.hd, generateFilename('video', 'hd'), e)}
            >
              Download HD Video
            </button>
          )}
        </div>
      </div>
    );
  };

  /**
   * Render thumbnail preview section
   */
  const renderThumbnailSection = () => {
    const hasImages = result?.content?.images && result.content.images.length > 0;
    
    return (
      <div className="content-section">
        <h3>📸 Preview</h3>
        <div className="thumbnail-container">
          {hasImages ? (
            <img
              src={result.content.images[0]}
              alt="Facebook content preview"
              className="thumbnail-preview"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="thumbnail-placeholder">
              <div className="placeholder-icon">📹</div>
              <p>Video Preview</p>
            </div>
          )}
        </div>
      </div>
    );
  };


  /**
   * Render post text section
   */
  const renderPostTextSection = () => {
    if (!result?.content?.postText) return null;

    return (
      <div className="content-section">
        <h3>📝 Post Text</h3>
        <div className="post-text">
          {result.content.postText}
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <div className="container">
        {/* Header */}
        <header className="header">
          <h1>Facebook Content Downloader</h1>
          <p>Download videos, images, reels, and stories from Facebook</p>
        </header>

        {/* Main content */}
        <main className="main-content">
          {/* Input form */}
          <section className="input-section">
            <form onSubmit={handleSubmit}>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste Facebook URL here (video, post, reel, story)"
                className="url-input"
                disabled={loading}
              />
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Fetching...' : 'Fetch Content'}
              </button>
            </form>
          </section>

          {/* Loading state */}
          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Fetching content from Facebook...</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="error">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Success state */}
          {result && (
            <div className="success">
              <strong>Success!</strong> Content fetched successfully from {result.url}
              {result.warning && (
                <div style={{ marginTop: '10px', padding: '10px', background: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '5px' }}>
                  <strong>✅ Real Content Extracted:</strong> {result.warning}
                </div>
              )}
              {result.fallback && (
                <div style={{ marginTop: '10px', padding: '10px', background: '#d1ecf1', border: '1px solid #bee5eb', borderRadius: '5px' }}>
                  <strong>Fallback Mode:</strong> {result.note}
                </div>
              )}
            </div>
          )}

          {/* Results section */}
          {result && (
            <section className="results-section">
              <h2 className="results-title">Extracted Content</h2>
              
              {/* Post text */}
              {renderPostTextSection()}
              
              {/* Thumbnail preview */}
              {renderThumbnailSection()}
              
              {/* Videos */}
              {renderVideoSection()}
            </section>
          )}
        </main>

        {/* Footer */}
        <footer style={{ textAlign: 'center', color: 'white', marginTop: '40px' }}>
          <p>Facebook Content Downloader v1.0.0</p>
          <p>Use responsibly and respect Facebook's terms of service</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
