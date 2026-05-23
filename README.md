# 🧠 Second Brain - Frontend

A modern, responsive **React-based user interface** for the Second Brain personal AI knowledge assistant. Upload documents, search your digital memory, and manage your personal knowledge base with an intuitive web application.

## 📋 Table of Contents

- [What is Second Brain?](#what-is-second-brain)
- [Why Second Brain?](#why-second-brain)
- [Real-Life Use Cases](#real-life-use-cases)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Current Features](#current-features)
- [Upcoming Features](#upcoming-features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 What is Second Brain?

Second Brain is your **personal AI memory system** - another copy of your brain 🧠! It helps you store, organize, and retrieve information from:
- Meeting notes and conversations
- Personal documents and files
- Professional research
- Work-related communications
- Personal knowledge bases

Instead of struggling to remember everything, Second Brain becomes your **digital memory**, allowing you to focus on what matters most.

---

## 💡 Why Second Brain?

**Problem**: Information overload and cognitive burden
- Remember every meeting discussion? ❌
- Recall yesterday's client feedback? ❌
- Find that important document from 3 weeks ago? ❌
- Manage scattered notes and files? ❌

**Solution**: Second Brain
- ✅ Intuitive interface to upload and manage documents
- ✅ Intelligent search that understands meaning, not just keywords
- ✅ Beautiful UI for organizing your digital memory
- ✅ Reduces mental stress and cognitive load
- ✅ Improves productivity and decision-making
- ✅ Accessible from any device via web browser

---

## 🌍 Real-Life Use Cases

### 1. **Software Engineer with Busy Schedule**
> **Scenario**: A developer has multiple daily stand-ups, client meetings, and 1-on-1s. When their manager asks about implementation details from yesterday's meeting, they don't need to remember or search through emails.
>
> **Solution**: Quickly upload meeting notes and transcripts. When asked a question, search Second Brain to find exact context, allowing confident answers without stress.

### 2. **Sales Professional**
> **Scenario**: Preparing for a client call. Need to recall previous conversations, deal amounts, pain points, and timeline from months ago.
>
> **Solution**: Upload all client emails, CRM notes, and call recordings. Search "What were the budget constraints?" and get instant context before the call.

### 3. **Researcher or Academic**
> **Scenario**: Working on a thesis or research paper. Need to find specific citations, methodology notes, or previous findings related to a topic.
>
> **Solution**: Upload PDFs of papers and research notes. Use semantic search to find relevant sections without manual review of hundreds of documents.

### 4. **Project Manager**
> **Scenario**: Managing multiple projects with decisions, action items, and blockers discussed across team meetings over months.
>
> **Solution**: Upload meeting notes and transcripts. Search "What was decided about the API redesign?" to get all relevant context instantly.

### 5. **Consultant**
> **Scenario**: Multiple clients with different projects. Need to recall specific recommendations or solutions provided to each client.
>
> **Solution**: Organize client documents by folder. Upload all interactions and solutions. Quickly search to provide consistent recommendations.

### 6. **Student or Lifelong Learner**
> **Scenario**: Taking notes across multiple courses, books, and online resources. Difficult to find that one concept learned weeks ago.
>
> **Solution**: Upload all learning materials and notes. Search to find related concepts and connections across different subjects.

---

## 🛠️ Tech Stack

### Frontend Framework
- **React** (19.2.0) - Modern UI library with hooks and latest features
- **React DOM** (19.2.0) - React rendering for web

### Styling & UI Components
- **Material-UI (MUI)** (7.3.5) - Professional component library
- **MUI Icons** (7.3.5) - Material Design icons
- **Emotion** (React & Styled) (11.14.0+) - CSS-in-JS styling solution

### Routing & Navigation
- **React Router DOM** (7.10.0) - Client-side routing and navigation
- **React Router** declarative routing for single-page application

### Data Management & API
- **Axios** (1.13.2) - HTTP client for backend communication
- **RESTful API** integration with Second Brain backend

### Authentication
- **React Google OAuth** (0.12.2) - Google login integration
- **JWT** - Secure token-based authentication

### File Handling
- **react-dropzone** (14.3.8) - Drag-and-drop file upload interface

### Content Display & Formatting
- **react-markdown** (10.1.0) - Markdown rendering in React
- **remark-gfm** (4.0.1) - GitHub Flavored Markdown support
- **react-syntax-highlighter** (16.1.0) - Code syntax highlighting

### Date & Time Management
- **date-fns** (4.1.0) - Modern date utility library

### Testing
- **Testing Library** (React, DOM, User Event) - Component testing
- **Jest DOM** - DOM testing assertions

### Build & Development
- **React Scripts** (5.0.1) - Create React App build tools
- **Webpack** - Module bundler (via React Scripts)
- **Babel** - JavaScript transpiler (via React Scripts)

---

## ✨ Features

### 1. **Document Management**
- 📤 Drag-and-drop file upload
- 📁 Multiple file format support
- 🗂️ Organize documents by folders/categories
- 🔄 Upload progress tracking
- ❌ Delete and manage documents

### 2. **Intelligent Search**
- 🔍 Semantic search (meaning-based, not just keywords)
- ⚡ Real-time search results
- 📊 Search history tracking
- 🎯 Relevance scoring
- 💬 Natural language query support

### 3. **User Authentication**
- 🔐 Google OAuth login
- 📝 User registration and login
- 🔑 JWT token management
- 👤 User profile management
- 🚪 Secure logout

### 4. **Document Viewing**
- 📄 Preview uploaded documents
- 📝 Display metadata (upload date, size, type)
- 🏷️ Tag and categorize documents
- 💾 Download documents

### 5. **Dashboard & Analytics**
- 📈 Storage usage statistics
- 📊 Document count and types
- 📅 Upload history timeline
- 🔥 Most searched topics

### 6. **Responsive Design**
- 📱 Mobile-friendly interface
- 🖥️ Desktop optimization
- 🌓 Light and dark mode support
- ♿ Accessibility features (WCAG compliant)

---

## 📌 Current Features

### 🧠 Memory Management UI
- **Personal Memory Dashboard** - Visual organization of all stored memories
- **Memory Cards** - Beautiful card-based display of memories
- **Quick Actions** - Pin, favorite, and organize memories with one click
- **Memory Details** - Rich metadata display for each memory
- **Memory Export** - Export memories as PDF, JSON, or TXT formats
- **Memory Sharing** - Share specific memories with colleagues or friends

### 📅 Schedule Management UI
- **Calendar Integration** - Visual calendar view of your schedules
- **Schedule Details Panel** - See full details of any schedule
- **Schedule Filtering** - Filter by type, importance, or date range
- **Visual Indicators** - Color-coded schedule types and priorities
- **Quick Schedule Creation** - Fast UI for adding new schedules
- **Schedule Sync Indicator** - See sync status with backend calendars

### 🔐 Privacy & Data Management
- **Data Privacy Settings** - Control what data is indexed and searchable
- **Storage Management** - Visual representation of storage usage
- **Data Export** - Download all your data in standard formats
- **Account Settings** - Comprehensive privacy and security controls
- **Session Management** - View active sessions and login history
- **Device Trust** - Manage trusted devices and two-factor authentication

---

## 🚀 Upcoming Features

### 🎤 Voice Mode (Coming Soon)
- **Voice Input Interface** - Beautiful UI for recording voice notes
- **Real-Time Transcription** - See transcription as you speak
- **Voice Search Interface** - Intuitive voice-based search UI
- **Voice History** - View all your voice recordings and transcriptions
- **Audio Playback** - Listen to recorded memories directly in app
- **Voice Preferences** - Settings for language, voice speed, and quality

### 📧 Gmail Integration UI (In Development)
- **Gmail Sync Dashboard** - Control which emails get imported
- **Email Preview** - Read emails directly in Second Brain
- **Email Organization** - Auto-organize emails by sender, date, or content
- **Email Thread Viewer** - See full email conversations
- **Quick Reply** - Reply to important emails without leaving Second Brain
- **Email Backup Status** - Monitor backup progress and status
- **Attachment Manager** - Browse and search all email attachments
- **Email Settings** - Configure Gmail sync preferences

### 📆 Calendar Integration UI (In Development)
- **Multi-Calendar View** - See events from Google Calendar, Outlook, etc.
- **Meeting Notes Panel** - Attach and view notes for each meeting
- **Calendar Analytics** - Visualize your time allocation and meeting patterns
- **Team Calendars** - View team members' availability (if shared)
- **Meeting Preparation** - AI suggestions for meeting prep based on memories
- **Calendar Sync Status** - See real-time sync status of calendars
- **Event Reminders** - Smart reminders for upcoming events
- **Time Zone Display** - Automatic time zone handling for global teams

### 💾 Local Vector Data Storage (Enhancement)
- **Offline Mode** - Full functionality without internet connection
- **Local Search** - Fast semantic search using device storage
- **Sync Management** - Control what data stays local vs. cloud
- **Storage Monitor** - See how much storage local indexes use
- **Download Manager** - Manage which documents to keep locally
- **Sync Scheduler** - Background sync when network is available
- **Compression Settings** - Optimize local storage usage

### 📬 Email Backup Management UI (Enhancement)
- **Backup Dashboard** - Visual overview of backup status and history
- **Backup Scheduler** - Set backup frequency and timing preferences
- **Backup Explorer** - Browse and restore from backups
- **Backup Status** - See storage usage for backups
- **Backup Settings** - Configure encryption and compression options
- **Restore Options** - Selective restore of specific emails or date ranges
- **Backup Notifications** - Get alerts when backups complete
- **Storage Optimization** - Smart cleanup suggestions for old backups

---

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm 7+
- Backend API running (see second-brain-backend README)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Step 1: Clone the Repository
```bash
cd second-brain-web
```

### Step 2: Install Dependencies
```bash
npm install
```

This installs all packages listed in `package.json`:
- React and React Router
- Material-UI components
- Axios for HTTP requests
- Markdown and syntax highlighting libraries
- Testing libraries

### Step 3: Verify Installation
```bash
npm test -- --listTests
```

---

## ⚙️ Configuration

### Step 1: Create `.env` File
Create a `.env` file in the frontend root directory:

```bash
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:7860
# or for mobile devices testing: REACT_APP_API_URL=http://192.168.1.100:7860
REACT_APP_API_TIMEOUT=30000

# Google OAuth Configuration
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here

# Storage Configuration
REACT_APP_MAX_LOCAL_STORAGE=500 # MB
REACT_APP_ENABLE_FILE_SYSTEM_API=true
REACT_APP_ENABLE_INDEXED_DB=true

# Application Settings
REACT_APP_APP_NAME=Second Brain
REACT_APP_ENVIRONMENT=development
REACT_APP_MAX_FILE_SIZE=52428800  # 50MB in bytes
REACT_APP_ALLOWED_FILE_TYPES=pdf,docx,txt,doc,jpg,jpeg,png

# Feature Flags
REACT_APP_ENABLE_DARK_MODE=true
REACT_APP_ENABLE_ANALYTICS=false
```

### Step 2: Update API Configuration
Update `src/config/api.js` or similar to use environment variables:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:7860';
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT) || 30000;

export default {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT
};
```

---

## 🚀 Running the Application

### Development Mode
```bash
npm start
```

The application will automatically open in your browser at `http://localhost:3000`

Features in development mode:
- Hot reloading (changes reflect immediately)
- Detailed error messages
- React DevTools support
- Source maps for debugging

### Build for Production
```bash
npm run build
```

This creates an optimized production build in the `build/` directory:
- Minified JavaScript and CSS
- Optimized asset loading
- Production-ready code splitting

### Test
```bash
npm test
```

Run all tests with interactive watch mode.

### Production Deployment
```bash
# Install production server (optional)
npm install -g serve

# Serve built application
serve -s build -l 3000
```

---

## 📁 Project Structure

```
second-brain-web/
├── public/                    # Static assets
│   ├── index.html            # Main HTML file
│   └── favicon.ico
├── src/
│   ├── components/           # React components
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   ├── DocumentUpload/
│   │   ├── SearchBar/
│   │   ├── DocumentList/
│   │   └── Dashboard/
│   ├── pages/                # Page components
│   │   ├── Login/
│   │   ├── Dashboard/
│   │   ├── Documents/
│   │   ├── Search/
│   │   └── NotFound/
│   ├── services/             # API services
│   │   ├── apiClient.js      # Axios instance
│   │   ├── authService.js    # Auth API calls
│   │   ├── documentService.js
│   │   └── searchService.js
│   ├── context/              # React Context for state
│   │   ├── AuthContext.js
│   │   └── AppContext.js
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.js
│   │   └── useDocument.js
│   ├── styles/               # Global styles
│   │   ├── theme.js          # MUI theme config
│   │   └── globals.css
│   ├── utils/                # Utility functions
│   │   ├── formatters.js
│   │   └── validators.js
│   ├── config/               # Configuration
│   │   └── api.js
│   ├── App.js                # Main app component
│   ├── App.test.js
│   └── index.js              # React entry point
├── build/                    # Production build (generated)
├── node_modules/             # Dependencies (generated)
├── package.json              # Project manifest & scripts
├── package-lock.json         # Dependency lock file
├── .env                      # Environment variables
├── .gitignore
└── README.md                 # This file
```

---

## 🌐 Deployment

### Option 1: Vercel (Recommended for React)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Vercel automatically:
- Builds and optimizes your React app
- Provides global CDN
- Sets environment variables
- Enables automatic deployments on git push

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=build
```

### Option 3: AWS S3 + CloudFront

```bash
# Build the application
npm run build

# Configure AWS credentials
aws configure

# Upload to S3
aws s3 sync build/ s3://your-bucket-name/

# Invalidate CloudFront cache (if using CloudFront)
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### Option 4: Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
```

Build and run:
```bash
docker build -t second-brain-web .
docker run -p 3000:3000 -e REACT_APP_API_BASE_URL=http://backend:7860 second-brain-web
```

### Option 5: GitHub Pages

```bash
# Add to package.json
"homepage": "https://yourusername.github.io/second-brain-web"

# Install gh-pages
npm install --save-dev gh-pages

# Add deploy scripts to package.json
"predeploy": "npm run build",
"deploy": "gh-pages -d build"

# Deploy
npm run deploy
```

---

## 🔌 API Integration

The frontend communicates with the Second Brain backend via REST API:

### Key Endpoints Used
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/google-login` - Google OAuth
- `POST /documents/upload` - Upload documents
- `GET /documents` - Fetch user's documents
- `DELETE /documents/<id>` - Delete document
- `POST /search` - Semantic search
- `POST /query` - Natural language query
- `GET /user/profile` - Get user profile

---

## 🧪 Testing

### Run Unit Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run E2E Tests (if configured)
```bash
npm run test:e2e
```

---

## 🔒 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Keep API keys in `.env.local`
   - Use different keys for dev/prod

2. **HTTPS**
   - Always use HTTPS in production
   - Enable HSTS headers

3. **CORS**
   - Configure CORS properly on backend
   - Whitelist trusted origins only

4. **Authentication**
   - Store JWT in secure cookies (httpOnly)
   - Implement token refresh mechanism
   - Clear tokens on logout

5. **Data Protection**
   - Validate all user inputs
   - Sanitize file uploads
   - Use Content Security Policy headers

---

## 🤝 Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: support@secondbrain.dev
- Check documentation wiki
- Visit our community forum

---

## 🚀 Performance Optimization Tips

1. **Lazy Load Routes**
   - Use React.lazy() for code splitting
   - Load components only when needed

2. **Image Optimization**
   - Compress images before upload
   - Use modern formats (WebP)

3. **Caching**
   - Cache API responses
   - Use service workers for offline support

4. **Bundle Size**
   - Monitor bundle size with `npm run build`
   - Remove unused dependencies

---

**Transform your digital memory. Never lose important information again.** 🚀

**Get started with Second Brain today and supercharge your productivity!** ✨
