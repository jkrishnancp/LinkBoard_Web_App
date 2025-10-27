# LinkBoard - Dashboard Link Manager

A modern, feature-rich dashboard application for managing and visualizing your favorite links with live previews and comprehensive organization tools. **All data is stored locally in your browser - no database or backend required.**

![Next.js](https://img.shields.io/badge/Next.js-13.5-black?logo=next.js)
![React](https://img.shields.io/badge/React-18.2-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)
![localStorage](https://img.shields.io/badge/Storage-localStorage-orange)
![PWA](https://img.shields.io/badge/PWA-Ready-green)

---

## 🚀 Quick Start (No Database Required!)

### Prerequisites
- **Node.js** (version 14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)

**That's it!** No database installation, no configuration files, no environment variables.

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/linkboard.git
cd linkboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) - Your dashboard is ready!

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

Or deploy the `out/` folder to any static hosting service.

---

## ✨ Features

### 🎯 Core Features
- **Multiple Workspaces** - Organize links across unlimited pages
- **Live Preview Mode** - View actual webpage content in iframe widgets
- **Auto-Refresh System** - Customizable refresh intervals per link (30s to 24h)
- **100% Client-Side** - All data stored in browser localStorage
- **Fully Responsive** - Seamless experience on desktop, tablet, and mobile
- **Dark Mode Support** - System, Light, and Dark themes

### 🔥 Advanced Features
- **Smart Search & Filters** - Real-time search with category/tag filtering
- **Keyboard Shortcuts** - 15+ shortcuts for power users (press `?` to see all)
- **Categories & Tags** - Hierarchical organization with custom icons and colors
- **Drag & Drop Import** - Bulk import from CSV, JSON, or browser bookmarks
- **PWA Ready** - Install as desktop/mobile app, works offline
- **System Widgets** - Display IP, battery, network, uptime, and more

### 🎨 Customization
- **Page Management** - Create, rename, delete workspace pages
- **Custom Refresh Intervals** - Per-link refresh from 30 seconds to 24 hours
- **Grid Layouts** - Drag-and-drop positioning with resize support
- **Visual Themes** - Multiple density modes and card radius options
- **Color Schemes** - Custom accent colors per link

---

## 📖 Quick Guide

### Getting Started

1. **Add Your First Link**
   - Press `Ctrl + N` or click the blue + button
   - Fill in name and URL (required)
   - Optionally set category, refresh interval, description
   - Click "Add Link"

2. **Create Workspaces**
   - Click "+ New Page" in the page tabs
   - Name it (e.g., "Work", "Personal", "Projects")
   - Choose an icon (🏠, 💼, 📱, etc.)
   - Switch pages with tabs or `Ctrl + 1-9`

3. **Install as App (PWA)**
   - **Desktop:** Click install icon in address bar
   - **Mobile:** Add to Home Screen from browser menu
   - Works offline with cached data

### Essential Keyboard Shortcuts

Press `?` to see all shortcuts:

| Shortcut | Action |
|----------|--------|
| `Ctrl + N` | Add new link |
| `Ctrl + K` | Open search |
| `Ctrl + ,` | Open settings |
| `Ctrl + R` | Refresh all previews |
| `Ctrl + Shift + A` | Toggle arrange mode |
| `Ctrl + 1-9` | Switch to page 1-9 |

### Bulk Import

Import existing bookmarks in three ways:

1. **Browser Bookmarks (HTML)**
   - Export bookmarks from your browser
   - Menu → Bulk Import → Drop file

2. **CSV Format**
   ```csv
   name,url,description
   Google,https://google.com,Search engine
   GitHub,https://github.com,Code hosting
   ```

3. **JSON Format**
   ```json
   [
     {"name": "Google", "url": "https://google.com"},
     {"name": "GitHub", "url": "https://github.com"}
   ]
   ```

---

## 🏗️ Architecture

### Storage Strategy

LinkBoard uses **browser localStorage** - no database required:

```typescript
// All data stored in browser
interface AppState {
  pages: Page[];           // Multiple workspace pages
  currentPageId: string;   // Active page
  categories: Category[];  // Organization categories
  settings: Settings;      // User preferences
}
```

**Storage Capacity:**
- Chrome/Edge/Firefox: ~10MB
- Safari: ~5MB
- Sufficient for: 500-1000+ links

**Data Persistence:**
- Auto-save every 250ms
- Export JSON anytime for backup
- Import JSON to restore
- All data stays on your device

---

## 🚀 Deployment

### One-Line Deploy (Static Hosting)

```bash
npm run build
# Deploy 'out/' folder anywhere - no database needed!
```

### Vercel (Recommended)

```bash
# Push to GitHub, then:
# 1. Import in Vercel
# 2. Click Deploy
# 3. Done! (No env vars or database setup)
```

### GitHub Pages

```bash
npm run build
git subtree push --prefix out origin gh-pages
```

### Any Static Host

Works on: Netlify, AWS S3, Azure Static Web Apps, Cloudflare Pages, or any web server.

**No backend. No database. Just static files.**

---

## 💾 Data Management

### Backup Your Data

```bash
# Export (do weekly!)
Menu → Export Data → Save JSON file
```

### Sync Across Devices

```bash
# Manual sync (no automatic cloud sync)
Device A → Export JSON
Transfer file (email, cloud, USB)
Device B → Import JSON
```

### Data Location

- Stored in: Browser localStorage
- Key: `linkboard-state`
- Format: JSON
- Access: DevTools → Application → Local Storage

---

## 🔒 Privacy & Security

### 100% Private

- ✅ All data in browser localStorage
- ✅ Nothing sent to any server
- ✅ No tracking or analytics
- ✅ No accounts or sign-ups
- ✅ Export anytime

### Security

- iframe sandboxing for previews
- Input validation and sanitization
- HTTPS recommended
- No credential storage

---

## 📚 Documentation

Complete guides available:

- **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup guide
- **[COMPREHENSIVE_FEATURES.md](./COMPREHENSIVE_FEATURES.md)** - Detailed features
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical details

---

## 🐛 Troubleshooting

### Data Not Saving?
- Check localStorage is enabled
- Not in private/incognito mode
- Export data as backup regularly

### Live Preview Not Loading?
- Some sites block iframes (X-Frame-Options)
- Toggle to Card View
- Check browser console

### PWA Won't Install?
- Use HTTPS or localhost
- Check browser supports PWA
- Clear cache and reload

**More solutions:** See troubleshooting section in COMPREHENSIVE_FEATURES.md

---

## 🤝 Contributing

Contributions welcome!

```bash
git checkout -b feature/amazing-feature
git commit -m 'Add amazing feature'
git push origin feature/amazing-feature
# Open Pull Request
```

---

## 📝 License

MIT License - feel free to use for any project!

---

## 🙏 Credits

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - Components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Zustand](https://zustand-demo.pmnd.rs/) - State management

---

## 💡 Why No Database?

**Advantages:**
- ✅ **Zero Setup** - Clone and run in seconds
- ✅ **Privacy First** - Data never leaves your device
- ✅ **Instant Performance** - No network latency
- ✅ **Works Offline** - By default
- ✅ **Free Hosting** - Deploy anywhere
- ✅ **No Costs** - No database fees

**Trade-offs:**
- ⚠️ Storage limit ~5-10MB (500+ links)
- ⚠️ Manual device sync
- ⚠️ Regular backups recommended

**Perfect For:**
- Personal dashboards
- Development tools
- Bookmark management
- Team starter kits
- Browser start pages

---

## 🎯 Feature Highlights

### Implemented Features (8/10)

✅ Multiple Pages/Workspaces
✅ Custom Refresh Intervals
✅ Link Categories & Tags
✅ Search & Advanced Filters
✅ Keyboard Shortcuts
✅ PWA Support (Offline)
✅ Bulk Import (CSV/JSON/HTML)
✅ Mobile Responsive

⚠️ Cloud Sync (Manual export/import)
❌ Browser Extension (Use PWA instead)

**80% Feature Complete - Production Ready!**

---

## 📊 Stats

- **Build Size:** 97.5 kB
- **Initial Load:** < 1 second
- **Search:** Real-time (< 100ms)
- **Supported Links:** 500-1000+
- **No Database:** Zero setup time

---

## ✨ Get Started in 30 Seconds!

```bash
# 1. Clone
git clone https://github.com/yourusername/linkboard.git

# 2. Install (NO database setup!)
cd linkboard && npm install

# 3. Run
npm run dev

# 4. Open http://localhost:3000 🎉
```

**That's it! No database. No config. Just works.**

---

## 📧 Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/linkboard/issues)
- **Docs:** See README and guides in repo
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/linkboard/discussions)

---

**Made with ❤️ using Next.js, React, TypeScript, and localStorage**

**No database. No complexity. Just links.** 🔗

---

*Version 2.0.0 | Last Updated: October 27, 2025*
