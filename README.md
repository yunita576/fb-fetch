# Facebook Content Downloader

A full-stack web application that allows users to download Facebook content including videos, images, reels, and stories by simply pasting a Facebook URL.

## Features

- 🎥 **Video Downloads**: Download SD and HD quality videos
- 🖼️ **Image Downloads**: Download all images from posts
- 🎬 **Reels Support**: Download Facebook reels
- 📖 **Stories Support**: Download public stories
- 📱 **Responsive Design**: Works on desktop and mobile
- 🔧 **Debug Mode**: View raw JSON data for verification
- ⚡ **Fast & Lightweight**: No heavy dependencies like Puppeteer

## Tech Stack

### Frontend
- React 18
- Axios for API calls
- CSS3 with responsive design
- Modern JavaScript (ES6+)

### Backend
- Node.js
- Express.js
- Cheerio for HTML parsing
- Axios for HTTP requests

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Internet connection

## Installation & Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd facebook-downloader
```

### 2. Install dependencies

#### Install root dependencies
```bash
npm install
```

#### Install backend dependencies
```bash
cd server
npm install
cd ..
```

#### Install frontend dependencies
```bash
cd client
npm install
cd ..
```

### 3. Environment Setup

Create a `.env` file in the `server` directory:
```bash
cd server
touch .env
```

Add the following content to `server/.env`:
```env
PORT=5000
NODE_ENV=development
```

### 4. Run the application

#### Development mode (recommended)
```bash
npm run dev
```

This will start both the backend server (port 5000) and frontend development server (port 3000) simultaneously.

#### Or run separately:

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

### 5. Access the application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health

## Usage

1. **Open the application** in your browser (http://localhost:3000)
2. **Paste a Facebook URL** in the input field. Supported formats:
   - Video posts: `https://www.facebook.com/username/videos/123456789`
   - Regular posts: `https://www.facebook.com/username/posts/123456789`
   - Reels: `https://www.facebook.com/reel/123456789`
   - Stories: `https://www.facebook.com/stories/username/123456789`
3. **Click "Fetch Content"** to extract the content
4. **Download** the available content using the provided buttons
5. **View raw JSON** data for debugging if needed

## API Endpoints

### POST /api/fetch
Fetches and extracts content from a Facebook URL.

**Request:**
```json
{
  "url": "https://www.facebook.com/username/videos/123456789"
}
```

**Response:**
```json
{
  "success": true,
  "url": "https://www.facebook.com/username/videos/123456789",
  "content": {
    "videos": {
      "sd": "https://video-url-sd.mp4",
      "hd": "https://video-url-hd.mp4"
    },
    "images": [
      "https://image-url-1.jpg",
      "https://image-url-2.jpg"
    ],
    "postText": "Post content text here",
    "reels": ["https://reel-url.mp4"],
    "stories": ["https://story-url.mp4"]
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 123.456
}
```

## Deployment

### Vercel Deployment

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy backend:**
```bash
cd server
vercel --prod
```

3. **Deploy frontend:**
```bash
cd client
vercel --prod
```

4. **Update API URL** in `client/src/App.js` to point to your deployed backend URL.

### Manual Deployment

1. **Build the frontend:**
```bash
cd client
npm run build
```

2. **Deploy backend** to your preferred hosting service (Heroku, DigitalOcean, etc.)

3. **Deploy frontend** to a static hosting service (Netlify, Vercel, etc.)

## Configuration

### Backend Configuration

The backend can be configured using environment variables:

- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)

### Frontend Configuration

The frontend uses a proxy configuration to connect to the backend during development. For production, update the API base URL in the axios calls.

## Error Handling

The application handles various error scenarios:

- **Invalid URLs**: Validates Facebook URL format
- **Network errors**: Handles connection issues
- **Private content**: Gracefully handles private posts
- **Rate limiting**: Implements basic error handling
- **Malformed responses**: Validates API responses

## Limitations

- **Private content**: Cannot download private posts or content requiring login
- **Rate limiting**: Facebook may rate limit requests
- **Content availability**: Some content may not be available for download
- **Terms of service**: Users must comply with Facebook's terms of service

## Troubleshooting

### Common Issues

1. **"Unable to connect to server"**
   - Ensure the backend server is running on port 5000
   - Check if the proxy configuration is correct

2. **"No content found"**
   - The post might be private or the URL format is not supported
   - Try with a different Facebook URL

3. **"Network error"**
   - Check your internet connection
   - Facebook might be blocking the request

4. **CORS errors**
   - Ensure the backend CORS configuration is correct
   - Check if the frontend is making requests to the correct backend URL

### Debug Mode

Enable debug mode by clicking "Show Raw JSON Data" to see the extracted content structure and identify parsing issues.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Disclaimer

This tool is for educational purposes only. Users are responsible for complying with Facebook's Terms of Service and applicable laws. The developers are not responsible for any misuse of this tool.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the debug JSON output
3. Create an issue in the repository
4. Provide detailed error information and steps to reproduce
