# LinkBoard - Dashboard Link Manager

A modern, lightweight dashboard application for managing and visualizing your favorite links with live previews and automatic refresh. All data is stored locally in your browser - no database or backend required.

![Next.js](https://img.shields.io/badge/Next.js-13.5-black?logo=next.js)
![React](https://img.shields.io/badge/React-18.2-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)
![localStorage](https://img.shields.io/badge/Storage-localStorage-orange)

## ✨ Features

### Core Functionality
- 🎯 **Drag-and-Drop Grid Layout** - Customize your dashboard with resizable widgets
- 🖼️ **Live Preview Mode** - View actual webpage content in iframe widgets (enabled by default)
- 🔄 **Auto-Refresh System** - Live views update every 8 hours automatically
- 💾 **Client-Side Storage** - All data stored locally in browser localStorage
- 🎨 **Customizable Themes** - System, Light, and Dark modes
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile

### Advanced Features
- ⚡ **Immediate Updates** - New links trigger instant refresh across all views
- 🏷️ **Custom Names** - Rename links and widgets with custom labels
- 🎛️ **System Widgets** - Display system info (IP, battery, network, uptime)
- 💬 **Confirmation Dialogs** - Prevent accidental deletions
- 📥 **Import/Export** - Backup and restore your dashboard configuration
- 🚀 **No Backend Required** - Pure client-side application

## 🚀 Quick Start

### Prerequisites
- **Node.js** (version 14 or higher) - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)

That's it! No database installation or configuration needed.

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/linkboard.git
cd linkboard
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start the Development Server
```bash
npm run dev
```

The application will open at [http://localhost:3000](http://localhost:3000)

### Step 4: Build for Production
```bash
npm run build
npm start
```

## 🏗️ Architecture

### Storage System
LinkBoard uses **browser localStorage** for all data persistence:

- **Links & Widgets**: Stored in `linkboard-pages` key
- **Settings**: Stored in `linkboard-settings` key
- **No Backend**: Zero server-side dependencies
- **Privacy First**: All data stays on your device

### Data Structure

```typescript
interface LinkBoard {
  pages: Page[];
  settings: {
    title: string;
    subtitle: string;
    theme: 'system' | 'light' | 'dark';
    density: 'compact' | 'comfy' | 'poster';
    cardRadius: 'sm' | 'md' | 'lg' | 'xl';
    gridColumns: number;
    showHeader: boolean;
  };
}

interface Page {
  id: string;
  name: string;
  icon: string;
  cards: LinkCard[];
}

interface LinkCard {
  id: string;
  name: string;
  customName?: string;
  url: string;
  logo?: string;
  description?: string;
  accentColor?: string;
  previewMode: boolean;
  hidden: boolean;
  layout: { x: number; y: number; w: number; h: number };
}
```

## 📖 Usage Guide

### Adding Your First Link
1. Click the **Plus button** (blue circle) in the bottom-right corner
2. Fill in the link details:
   - **Name**: Display name for the link
   - **Custom Name** (optional): Override the display name
   - **URL**: Full website URL (must include https://)
   - **Description** (optional): Brief description
   - **Accent Color** (optional): Custom color theme
3. Click **Add Link**
4. Your link appears in **Live Preview mode** by default

### Using Live Preview Mode
- **Toggle Preview**: Click the switch at the bottom of any link card
- **Live View**: Shows actual webpage content in an iframe
- **Card View**: Shows metadata (logo, title, description)
- **Auto-Refresh**: Live views update every 8 hours automatically
- **Immediate Refresh**: Adding new links triggers instant refresh

### Managing Your Dashboard

#### Arrange Mode
1. Click the **Grid icon** (top button, bottom-right)
2. Drag links to reposition them
3. Resize links by dragging the resize handle
4. Click the **Checkmark** to save changes

#### Link Actions
- **Edit**: Click the pencil icon (hover over link)
- **Delete**: Click the trash icon → Confirm deletion
- **Hide**: Click the eye icon → Confirm hiding
- **Duplicate**: Click the duplicate icon
- **Resize**: Click resize icon in arrange mode

#### Settings
1. Click the **Gear icon** (bottom button, bottom-right)
2. Configure:
   - **Title & Subtitle**: Dashboard header text
   - **Theme**: System, Light, or Dark mode
   - **Density**: Compact, Comfy, or Poster view
   - **Card Radius**: Border rounding (sm, md, lg, xl)
   - **Grid Columns**: Number of columns (1-12)
   - **Show Header**: Toggle header visibility

### System Widgets
1. Click **Menu** (hamburger icon) → **Add Widgets**
2. Available widgets:
   - **Local IP**: Display your local network IP
   - **Public IP**: Display your public IP address
   - **Date & Time**: Live clock widget
   - **Uptime**: System uptime tracker
   - **Battery**: Battery status (laptops only)
   - **Network**: Network information
   - **Performance**: Memory usage stats

### Import/Export
- **Export**: Menu → Export Data → Saves JSON file
- **Import**: Menu → Import Data → Select JSON file
- **Format**: All data stored in JSON format

## 🛠️ Configuration

### Auto-Refresh Settings
Located in `app/page.tsx`:
```typescript
const { triggerImmediateRefresh } = useAutoRefresh({
  onRefresh: handleRefreshPreviews,
  enabled: true,
  refreshInterval: 8 * 60 * 60 * 1000, // 8 hours (change as needed)
});
```

**Common intervals**:
- 1 hour: `1 * 60 * 60 * 1000`
- 4 hours: `4 * 60 * 60 * 1000`
- 8 hours: `8 * 60 * 60 * 1000` (default)
- 12 hours: `12 * 60 * 60 * 1000`
- 24 hours: `24 * 60 * 60 * 1000`

### Storage Limits
Browser localStorage has storage limits:
- **Chrome/Edge**: ~10MB
- **Firefox**: ~10MB
- **Safari**: ~5MB

This is sufficient for hundreds of links. Monitor usage in browser DevTools → Application → Local Storage.

## 🧪 Testing

### Run Type Checking
```bash
npm run typecheck
```

### Run Linting
```bash
npm run lint
```

### Build Production Bundle
```bash
npm run build
```

### Test Live Preview
1. Add a link (e.g., https://example.com)
2. Verify it appears in Live Preview mode
3. Check browser console for refresh logs:
   - `[Auto-Refresh] Triggered at: [timestamp]`
   - `[Auto-Refresh] New link added, triggering immediate refresh`

### Test Buttons
- **Plus Button**: Should open Add Link modal
- **Settings Button**: Should open Settings drawer
- **Arrange Button**: Should toggle arrange mode (green when active)

## 🐛 Troubleshooting

### Data Not Persisting
**Problem**: Settings or links disappear after refresh

**Solutions**:
1. Check browser's localStorage is enabled
2. Verify not in private/incognito mode (localStorage limited)
3. Check browser storage quota: DevTools → Application → Storage
4. Clear other site data to free up space
5. Export your data as backup regularly

### Live Preview Not Loading
**Problem**: iframe shows blank or error message

**Solutions**:
1. Some sites block iframe embedding (X-Frame-Options header)
2. Toggle to Card View for these sites
3. Check browser console for specific errors
4. Verify URL is correct and accessible
5. Try disabling browser extensions that might block iframes

### Auto-Refresh Not Working
**Problem**: Live views don't update after 8 hours

**Solutions**:
1. Check browser console for `[Auto-Refresh]` logs
2. Verify `enabled: true` in useAutoRefresh hook
3. Test with shorter interval (10 seconds) for debugging
4. Ensure browser tab remains open (timer pauses when closed)

### Button Not Working
**Problem**: Plus or Settings button unresponsive

**Solutions**:
1. Check browser console for JavaScript errors
2. Try clearing browser cache and reload
3. Verify z-index not blocked by other elements
4. Test in different browser

### Build Errors
**Problem**: `npm run build` fails

**Solutions**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

### localStorage Full
**Problem**: "QuotaExceededError" or data not saving

**Solutions**:
1. Export current data as JSON backup
2. Delete unused links to free space
3. Clear browser cache (keep localStorage)
4. Consider splitting across multiple pages/domains
5. Use browser cleanup tools to remove old data

## 📚 Documentation

Comprehensive documentation available in the project:

- **[FEATURES.md](./FEATURES.md)** - Complete feature documentation
- **[ISSUE_FIXES.md](./ISSUE_FIXES.md)** - Detailed issue fixes and solutions
- **[LIVE_VIEW_DOCUMENTATION.md](./LIVE_VIEW_DOCUMENTATION.md)** - Auto-refresh system guide

## 🔧 Tech Stack

### Frontend
- **Next.js 13.5** - React framework with App Router
- **React 18.2** - UI library
- **TypeScript 5.2** - Type safety
- **Tailwind CSS 3.3** - Utility-first CSS
- **shadcn/ui** - Component library
- **Heroicons** - Icon library
- **Zustand 5.0** - State management

### Storage
- **localStorage** - Browser-native persistent storage
- **No backend required** - Pure client-side application

### Additional Libraries
- **react-grid-layout** - Drag-and-drop grid
- **date-fns** - Date formatting
- **zod** - Schema validation
- **lucide-react** - Additional icons

## 🚀 Deployment

### Static Export (Recommended)
LinkBoard is a pure client-side app - deploy anywhere:

```bash
npm run build
```

Copy the `out/` folder to:
- **GitHub Pages**: Free static hosting
- **Netlify**: Drag & drop deployment
- **Vercel**: Zero-config deployment
- **AWS S3**: Static website hosting
- **Any web server**: Just serve the HTML/CSS/JS files

### Vercel (One-Click Deploy)
1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com) and sign in
3. Click "New Project" → Import your repository
4. Click "Deploy" (no environment variables needed!)

### GitHub Pages
1. Push code to GitHub
2. Go to Settings → Pages
3. Select branch and `/root` or `/docs` folder
4. Save and access at `https://yourusername.github.io/linkboard`

### Self-Hosted
```bash
npm run build
npm start

# Or use any static file server:
npx serve out/
python -m http.server 3000 -d out/
```

## 🔒 Privacy & Security

### Data Privacy
- **100% Local**: All data stored in browser localStorage
- **No Cloud Sync**: Your data never leaves your device
- **No Tracking**: Zero analytics or telemetry
- **No Backend**: No server to store or leak your data
- **Export Anytime**: Full data portability via JSON export

### Security Considerations
- **HTTPS Required**: Use secure connections for live previews
- **iframe Sandboxing**: All previews run in sandboxed iframes
- **XSS Protection**: Input sanitization and validation
- **CORS Aware**: Respects Cross-Origin Resource Sharing policies

## 💾 Backup & Migration

### Export Your Data
1. Open menu → Export Data
2. Save JSON file to safe location
3. Recommended: Back up weekly

### Import Data
1. Open menu → Import Data
2. Select previously exported JSON file
3. Confirm import (will replace current data)

### Transfer to Another Browser/Device
1. Export from old browser
2. Transfer JSON file
3. Import on new browser

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Heroicons](https://heroicons.com/) - Icon system
- [Zustand](https://zustand-demo.pmnd.rs/) - State management

## 📧 Support

Need help? Have questions?

- **Issues**: [GitHub Issues](https://github.com/yourusername/linkboard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/linkboard/discussions)

## 🗺️ Roadmap

### Upcoming Features
- [ ] Multiple pages/workspaces support
- [ ] Custom refresh intervals per link
- [ ] Link grouping and categories
- [ ] Search and filter functionality
- [ ] Keyboard shortcuts
- [ ] PWA support for offline access
- [ ] Cloud sync (optional, via user's cloud storage)
- [ ] Browser extension
- [ ] Mobile app versions
- [ ] Drag-and-drop link import

## 🌟 Why localStorage?

**Advantages:**
- ✅ **Zero Setup**: No database installation or configuration
- ✅ **Instant Start**: Clone and run in seconds
- ✅ **Privacy First**: Your data never leaves your browser
- ✅ **Fast Performance**: Instant read/write operations
- ✅ **Offline Ready**: Works without internet connection
- ✅ **Free Hosting**: Deploy anywhere, no server costs
- ✅ **Simple Backup**: Export JSON file anytime

**Limitations:**
- ⚠️ **Storage Limit**: ~5-10MB (sufficient for 500+ links)
- ⚠️ **No Auto-Sync**: Data tied to single browser
- ⚠️ **Manual Backup**: Export regularly to prevent loss
- ⚠️ **Browser-Specific**: Not shared across browsers

**Perfect For:**
- Personal dashboards
- Bookmarks replacement
- Productivity tools
- Quick link collections
- Browser start pages

---

**Made with ❤️ using Next.js and localStorage**

*Last updated: October 26, 2025*
