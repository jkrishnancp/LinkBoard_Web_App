# LinkBoard - Dashboard Link Manager

A modern, feature-rich dashboard application for managing and visualizing your favorite links with live previews, automatic status monitoring, and intelligent caching.

![Next.js](https://img.shields.io/badge/Next.js-13.5-black?logo=next.js)
![React](https://img.shields.io/badge/React-18.2-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Enabled-green?logo=supabase)

## ✨ Features

### Core Functionality
- 🎯 **Drag-and-Drop Grid Layout** - Customize your dashboard with resizable widgets
- 🖼️ **Live Preview Mode** - View actual webpage content in iframe widgets (enabled by default)
- 📊 **Real-Time Status Monitoring** - Visual indicators for link availability (UP/DOWN)
- 💾 **Intelligent Caching** - Automatic 8-hour refresh cycle for metadata
- 🎨 **Customizable Themes** - System, Light, and Dark modes
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile

### Advanced Features
- 🔄 **Auto-Refresh System** - Live views update every 8 hours automatically
- ⚡ **Immediate Updates** - New links trigger instant refresh across all views
- 🏷️ **Custom Names** - Rename links and widgets with custom labels
- 🔍 **Link Status Tracking** - Database-backed availability monitoring
- 🎛️ **System Widgets** - Display system info (IP, battery, network, uptime)
- 💬 **Confirmation Dialogs** - Prevent accidental deletions
- 📥 **Import/Export** - Backup and restore your dashboard configuration

## 🚀 Quick Start

### Prerequisites
- **Node.js** (version 14 or higher) - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **Supabase Account** (Free) - [Sign up](https://supabase.com/)

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/linkboard.git
cd linkboard
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Database Setup (Supabase)

#### 3.1 Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in your project details:
   - **Name**: LinkBoard (or your preferred name)
   - **Database Password**: Create a secure password
   - **Region**: Choose closest to your location
4. Click "Create new project" and wait for setup to complete (~2 minutes)

#### 3.2 Get Your API Credentials
1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

#### 3.3 Configure Environment Variables
1. Create a `.env.local` file in the project root:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

#### 3.4 Run Database Migrations
The application will automatically create the necessary tables on first connection. The following tables will be created:
- `link_status` - Stores link availability monitoring data
- `link_cache` - Stores cached webpage metadata

**Manual Migration** (if needed):
```bash
# The migration files are located in:
# supabase/migrations/20251026215604_create_link_status_and_cache_tables.sql

# To manually apply, run the SQL in your Supabase SQL Editor:
# Dashboard → SQL Editor → New Query → Paste and Run
```

### Step 4: Start the Development Server
```bash
npm run dev
```

The application will open at [http://localhost:3000](http://localhost:3000)

### Step 5: Build for Production
```bash
npm run build
npm start
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

### Environment Variables
```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional (for development)
NODE_ENV=development
PORT=3000
```

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

## 📊 Database Schema

### link_status
Tracks real-time availability of links.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| link_id | text | Link identifier (unique) |
| url | text | Website URL |
| status | text | 'up', 'down', or 'checking' |
| last_checked | timestamptz | Last check timestamp |
| response_time | integer | Response time in ms |
| created_at | timestamptz | Record creation time |
| updated_at | timestamptz | Last update time |

### link_cache
Stores cached webpage metadata.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| link_id | text | Link identifier (unique) |
| url | text | Website URL |
| screenshot_url | text | Screenshot URL (optional) |
| preview_html | text | Cached HTML (optional) |
| title | text | Page title |
| description | text | Page description |
| favicon | text | Favicon URL |
| cached_at | timestamptz | Cache creation time |
| expires_at | timestamptz | Cache expiration (8 hours) |
| created_at | timestamptz | Record creation time |
| updated_at | timestamptz | Last update time |

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

### Database Connection Issues
**Problem**: Application won't load or shows errors about Supabase

**Solutions**:
1. Verify `.env.local` file exists and contains correct credentials
2. Check Supabase project is active (not paused)
3. Confirm URL starts with `https://` and key is complete
4. Try regenerating anon key in Supabase dashboard

### Live Preview Not Loading
**Problem**: iframe shows blank or error message

**Solutions**:
1. Some sites block iframe embedding (X-Frame-Options header)
2. Toggle to Card View for these sites
3. Check browser console for specific errors
4. Verify URL is correct and accessible

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

### Backend & Database
- **Supabase** - PostgreSQL database with real-time features
- **Row Level Security** - Database-level security

### Additional Libraries
- **react-grid-layout** - Drag-and-drop grid
- **date-fns** - Date formatting
- **zod** - Schema validation
- **lucide-react** - Additional icons

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com) and sign in
3. Click "New Project" → Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click "Deploy"

### Other Platforms
- **Netlify**: Supports Next.js with edge functions
- **Railway**: Simple deployment with database hosting
- **Self-Hosted**: Use `npm run build && npm start`

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
- [Supabase](https://supabase.com/) - Backend infrastructure
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Heroicons](https://heroicons.com/) - Icon system

## 📧 Support

Need help? Have questions?

- **Issues**: [GitHub Issues](https://github.com/yourusername/linkboard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/linkboard/discussions)
- **Email**: support@yourdomain.com

## 🗺️ Roadmap

### Upcoming Features
- [ ] Screenshot capture for link previews
- [ ] Custom refresh intervals per link
- [ ] Webhook notifications for status changes
- [ ] Link grouping and categories
- [ ] Search and filter functionality
- [ ] Keyboard shortcuts
- [ ] PWA support for offline access
- [ ] Multi-user support with authentication
- [ ] Dashboard templates
- [ ] Analytics and usage tracking

---

**Made with ❤️ using Next.js and Supabase**

*Last updated: October 26, 2025*
