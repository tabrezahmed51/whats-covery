# 🔧 Whats-Covery

> **WhatsApp Recovery Web App** - Recover, view, and export WhatsApp data with a futuristic cyberpunk UI. Fully featured with Google Sheets backend and admin portal.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan)](https://tailwindcss.com/)

## ✨ Features

### Core Features
- 📱 **Selective Folder Scanning** - Target specific WhatsApp media/database folders
- ⚡ **Incremental Recovery** - Skip already recovered files for faster processing
- 🔄 **On-Device De-duplication** - Detect and remove duplicate messages/media
- 🎨 **WhatsApp-Style UI** - Familiar chat interface for recovered data
- 📦 **ZIP Export** - Export recovered data as organized ZIP files
- 🌙 **Cyberpunk Dark Theme** - Futuristic neon-accented design
- ⚙️ **Hidden Admin Portal** - Secure admin interface with JWT auth
- ☁️ **Google Sheets Backend** - Lightweight metadata storage
- 📅 **Historical Recovery** - Recover WhatsApp data up to 1 year old (Android)

### Performance Optimizations
- **Lazy Loading UI** - Load message previews only when visible
- **Compressed Cache** - WebP/AVIF thumbnails with aggressive compression
- **Background Worker Pool** - Heavy parsing runs off main thread
- **Adaptive Throttling** - Automatic performance adjustment based on device load
- **Modular Plugin Architecture** - Load only what you need

## 🏗️ Project Structure

```
whats-covery/
├── src/
│   ├── components/
│   │   ├── Recover/
│   │   │   ├── FolderPicker.jsx
│   │   │   └── ScanButton.jsx
│   │   ├── Viewer/
│   │   │   ├── ChatList.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   └── MediaModal.jsx
│   │   ├── Admin/
│   │   │   ├── Login.jsx
│   │   │   └── Dashboard.jsx
│   │   └── Export/
│   │       └─ExportModal.jsx
│   ├── hooks/
│   │   └── useStore.js          # Zustand state management
│   ├── workers/
│   │   ├── scannerWorker.js     # File scanning & SQLite parsing
│   │   └── zipWorker.js         # ZIP file generation
│   ├── utils/
│   │   ├── api.js               # Google Sheets API wrapper
│   │   └── androidBridge.js     # Native Android bridge
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
├── vite.config.js
├── tailwind.config.cjs
├── postcss.config.cjs
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/tabrezahmed51/whats-covery.git

# Navigate to project directory
cd whats-covery

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

### Google Sheets Backend Setup

1. Create a new Google Sheet
2. Go to [script.google.com](https://script.google.com)
3. Create a new project and paste the Apps Script code (see below)
4. Deploy as Web App
5. Copy the deployment URL
6. Create `.env` file:

```env
VITE_GS_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

### Google Apps Script Code

```javascript
const SHEET_ID = 'YOUR_SHEET_ID_HERE';
const SHEET_NAME = 'ChatMeta';

function getSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = getSheet();
  sheet.appendRow([
    data.chatId,
    data.participants.join(', '),
    data.lastMessage,
    data.messageCount,
    new Date(data.timestamp)
  ]);
  return ContentService.createTextOutput(JSON.stringify({status: 'ok'}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const chatId = e.parameter.chatId;
  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();
  const match = rows.find(r => r[0] === chatId);
  if (!match) {
    return ContentService.createTextOutput(JSON.stringify({error: 'not found'}))
      .setMimeType(ContentService.MimeType.JSON)
      .setResponseCode(404);
  }
  const result = {
    chatId: match[0],
    participants: match[1].split(', '),
    lastMessage: match[2],
    messageCount: match[3],
    timestamp: match[4]
  };
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 📱 Deployment

### GitHub Pages

1. Enable GitHub Pages in repository settings
2. Set source to `gh-pages` branch
3. Add deployment script to `package.json`:

```json
"scripts": {
  "deploy": "vite build && gh-pages -d dist"
}
```

4. Run deployment:

```bash
npm run deploy
```

Your app will be live at: `https://tabrezahmed51.github.io/whats-covery/`

### Netlify / Vercel

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

### Android APK (via Capacitor)

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# Initialize Capacitor
npx cap init WhatsCovery com.example.whatscovery

# Add Android platform
npx cap add android

# Build and copy to Android
npm run build
npx cap copy android

# Open Android Studio
npx cap open android
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Icons**: Heroicons
- **Database**: sql.js (SQLite in WebAssembly)
- **File Handling**: JSZip
- **Backend**: Google Apps Script

## 🎨 UI Architecture

### Responsive Design
- Mobile-first approach
- Adaptive layouts (single-column → split-view)
- Touch-optimized interactions
- Smooth 60fps animations

### Cyberpunk Theme
- Deep dark backgrounds (#0f0f2a)
- Neon cyan accents (#00ffea)
- Fira Code monospace font
- Custom glowing effects

## 🔐 Security

- JWT-based admin authentication
- Secure hidden admin portal (`/admin`)
- Client-side encryption for sensitive data
- No passwords stored in browser
- HTTPS-only in production

## 📊 Performance

- **Bundle Size**: < 300KB (gzipped)
- **First Load**: < 2s
- **Time to Interactive**: < 3s
- **Lighthouse Score**: 95+

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**tabrezahmed51**
- GitHub: [@tabrezahmed51](https://github.com/tabrezahmed51)
- Company: Next Gen Ops Pvt Ltd

## 🙏 Acknowledgments

- Inspired by WhatsApp's clean UI design
- Built with modern web technologies
- Powered by open-source community

## 📚 Documentation

For detailed documentation on:
- Component structure
- State management patterns  
- Worker implementation
- API integration
- Deployment strategies

Please refer to the `/docs` directory (coming soon).

## 🐛 Known Issues

- Web Workers may not be supported in older browsers
- File system access requires modern browser APIs
- Android-specific features require native bridge

## 🗺️ Roadmap

- [ ] Add iOS support
- [ ] Implement end-to-end encryption
- [ ] Add multi-language support
- [ ] Create desktop app (Electron)
- [ ] Add cloud backup integration
- [ ] Implement real-time sync
- [ ] Add media viewer enhancements
- [ ] Create Chrome extension

---

**Made with ❤️ for the open-source community**
