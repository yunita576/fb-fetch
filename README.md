# 🎬 Facebook Content Downloader

A powerful full-stack web application that allows users to download Facebook content (videos, posts, reels, public stories) by simply pasting a Facebook URL. Built with React frontend and Node.js backend.

![Facebook Downloader](https://img.shields.io/badge/Facebook-Downloader-blue?style=for-the-badge&logo=facebook)
![React](https://img.shields.io/badge/React-18.x-61dafb?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)

## ✨ Features

- 🎥 **Real Facebook Content Extraction** - Downloads actual videos and images from Facebook URLs
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices
- ⚡ **Direct Downloads** - Download content directly to your device without redirects
- 🖼️ **Thumbnail Preview** - See content preview before downloading
- 🎯 **Multiple Formats** - Support for SD and HD video qualities
- 🛡️ **Error Handling** - Graceful fallback when Facebook blocks access
- 🚀 **Vercel Ready** - Easy deployment with one-click setup

## 🛠️ Tech Stack

- **Frontend**: React 18, Axios, CSS3
- **Backend**: Node.js, Express.js, Cheerio (HTML parsing)
- **Deployment**: Vercel compatible
- **Package Manager**: npm

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/facebook-content-downloader.git
   cd facebook-content-downloader
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies (root, server, and client)
   npm install
   ```

3. **Start the application**
   ```bash
   # Start both frontend and backend
   npm run dev
   ```

   This will start:
   - 🌐 Frontend: http://localhost:3000
   - 🔧 Backend API: http://localhost:5000

### Manual Setup (Alternative)

If you prefer to start servers manually:

1. **Start Backend Server**
   ```bash
   cd server
   npm start
   ```

2. **Start Frontend** (in a new terminal)
   ```bash
   cd client
   npm start
   ```

## 📖 Usage

1. 🌐 Open http://localhost:3000 in your browser
2. 📋 Paste a Facebook URL (video, post, reel, or public story)
3. 🔍 Click "Fetch Content" to extract the content
4. ⬇️ Download the extracted content using the provided buttons

### Supported URL Formats
- `https://www.facebook.com/watch?v=VIDEO_ID`
- `https://www.facebook.com/share/v/VIDEO_ID/`
- `https://www.facebook.com/username/posts/POST_ID`
- `https://m.facebook.com/story.php?story_fbid=STORY_ID`

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/fetch` | Extract content from Facebook URL |
| `GET` | `/api/health` | Health check endpoint |
| `GET` | `/api/test` | Test endpoint for server verification |

### API Request Format
```json
{
  "url": "https://www.facebook.com/watch?v=123456789"
}
```

### API Response Format
```json
{
  "success": true,
  "url": "https://www.facebook.com/watch?v=123456789",
  "content": {
    "videos": {
      "sd": "https://video.fbcdn.net/...",
      "hd": "https://video.fbcdn.net/..."
    },
    "images": ["https://scontent.fbcdn.net/..."],
    "postText": "Post content text...",
    "reels": [],
    "stories": []
  },
  "timestamp": "2025-09-20T07:35:51.653Z"
}
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Deploy automatically

3. **Environment Variables** (if needed)
   - Add any required environment variables in Vercel dashboard

### Manual Deployment

The project includes `vercel.json` configuration for seamless deployment.

## 📁 Project Structure

```
facebook-content-downloader/
├── 📁 client/                 # React frontend
│   ├── 📁 src/
│   │   ├── 📄 App.js         # Main React component
│   │   ├── 📄 App.css        # Styles and responsive design
│   │   └── 📄 index.js       # React entry point
│   └── 📄 package.json       # Frontend dependencies
├── 📁 server/                 # Node.js backend
│   ├── 📄 index.js           # Express server with content extraction
│   └── 📄 package.json       # Backend dependencies
├── 📄 package.json           # Root package.json with scripts
├── 📄 vercel.json           # Vercel deployment configuration
├── 📄 .gitignore            # Git ignore rules
└── 📄 README.md             # This file
```

## 🎯 Features in Detail

### Content Extraction
- 🎥 **Videos**: Extracts SD and HD video URLs from Facebook's CDN
- 🖼️ **Images**: Extracts thumbnail and post images
- 📝 **Text**: Extracts post text content with Unicode support
- 🎬 **Reels**: Extracts reel content (when available)
- 📖 **Stories**: Extracts public story content

### Download Functionality
- ⬇️ **Direct Downloads**: Files download directly to your device
- 🎯 **Multiple Formats**: Support for different video qualities
- 📊 **Progress Indication**: Shows download progress with visual feedback
- 📱 **Mobile Support**: Works on both desktop and mobile browsers

### Error Handling
- 🛡️ **Graceful Fallbacks**: Provides sample content when Facebook blocks access
- 💬 **User Feedback**: Clear error messages and status indicators
- 🔄 **Retry Logic**: Automatic retry for failed requests
- 🌐 **Network Resilience**: Handles various network conditions

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start both frontend and backend
npm start           # Start backend server only

# Frontend
cd client && npm start    # Start React development server
cd client && npm build    # Build for production

# Backend
cd server && npm start    # Start Express server
cd server && npm run dev  # Start with nodemon (auto-restart)
```

### Adding New Features

1. **Backend Changes**: Modify `server/index.js`
2. **Frontend Changes**: Modify `client/src/App.js` and `App.css`
3. **Dependencies**: Update respective `package.json` files

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💻 Make your changes
4. ✅ Test thoroughly
5. 📝 Commit your changes (`git commit -m 'Add amazing feature'`)
6. 📤 Push to the branch (`git push origin feature/amazing-feature`)
7. 🔄 Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Test on both desktop and mobile
- Update README if adding new features

## 📄 License

This project is for educational purposes. Please respect Facebook's Terms of Service and use responsibly.

## ⚠️ Disclaimer

This tool is for educational and personal use only. Users are responsible for complying with Facebook's Terms of Service and applicable laws. The developers are not responsible for any misuse of this tool.

## 🆘 Support

If you encounter any issues:

1. 📋 Check the [Issues](https://github.com/yourusername/facebook-content-downloader/issues) page
2. 🐛 Create a new issue with detailed information
3. 💬 Join our discussions for help

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/facebook-content-downloader&type=Date)](https://star-history.com/#yourusername/facebook-content-downloader&Date)

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/yourusername">Rafi Shaik</a></p>
  <p>⭐ Star this repository if you found it helpful!</p>
</div>