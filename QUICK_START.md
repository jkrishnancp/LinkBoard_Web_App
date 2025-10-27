# LinkBoard - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Installation
```bash
npm install
```

### Step 2: Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Step 3: Build for Production
```bash
npm run build
npm start
```

---

## 🎯 First-Time User Guide

### Creating Your First Workspace

1. **Default Page:**
   - You start with a "Home" page
   - Add your first link with `Ctrl + N` or the blue + button

2. **Add More Pages:**
   - Click "+ New Page" in the page tabs
   - Name it (e.g., "Work", "Personal", "Learning")
   - Choose an icon (🏠, 💼, 📱, etc.)

3. **Switch Pages:**
   - Click any page tab
   - Or use `Ctrl + 1`, `Ctrl + 2`, etc.

### Adding Links

**Method 1: Manual (Best for few links)**
- Press `Ctrl + N` or click the + button
- Fill in:
  - Name (required)
  - URL (required)
  - Description (optional)
  - Category (optional)
  - Refresh Interval (default: 8 hours)
- Click "Add Link"

**Method 2: Bulk Import (Best for many links)**
- Open Menu → "Bulk Import"
- Drop a CSV, JSON, or HTML bookmarks file
- Review imported links
- Click "Import X Links"

### Organizing with Categories

1. **Create Category:**
   - Open Menu
   - Find "Categories" section
   - Click "+ Add"
   - Choose name, icon, and color

2. **Assign Links:**
   - Edit any link
   - Select category from dropdown
   - Save

3. **Filter by Category:**
   - Use search bar's filter button
   - Select categories
   - View filtered results

### Using Search

1. **Quick Search:**
   - Click search bar or press `Ctrl + K`
   - Type anything (name, URL, description)
   - Results update instantly

2. **Advanced Filters:**
   - Click filter icon (funnel)
   - Select categories
   - Toggle options (show hidden, preview only)
   - Multiple filters work together

### Keyboard Shortcuts

Press `?` to see all shortcuts. Most useful:

- `Ctrl + N` - Add link
- `Ctrl + K` - Search
- `Ctrl + 1-9` - Switch pages
- `Ctrl + R` - Refresh all
- `Ctrl + Shift + A` - Arrange mode
- `?` - Show help

### Installing as PWA

**Desktop (Chrome/Edge):**
1. Click install icon in address bar
2. Click "Install"
3. App appears in applications

**Mobile (iOS/Android):**
1. Open browser menu
2. Select "Add to Home Screen"
3. Name the app
4. Tap "Add"

---

## 📱 Mobile Usage

### Touch Gestures
- Tap card to open link
- Long press for options
- Pinch to zoom
- Swipe to scroll

### Mobile Tips
- Use 2-4 column grid for mobile
- Enable preview mode for quick access
- Install as PWA for app-like experience
- Use search instead of scrolling

---

## 💾 Backup & Sync

### Export Your Data
1. Open Menu
2. Click "Export Data"
3. Save JSON file somewhere safe
4. Do this weekly!

### Import Data
1. Open Menu
2. Click "Import Data"
3. Select your JSON file
4. Confirm import

### Manual Sync Workflow
1. Export from Device A
2. Transfer JSON file (email, cloud, USB)
3. Import on Device B
4. Both devices now have same data

---

## 🎨 Customization

### Settings (Ctrl + ,)

**Appearance:**
- **Title/Subtitle:** Dashboard header text
- **Theme:** System / Light / Dark
- **Density:** Compact / Comfy / Poster
- **Card Radius:** Small / Medium / Large / Extra Large
- **Grid Columns:** 1-12 columns
- **Show Header:** Toggle header visibility

**Per-Link Settings:**
- **Refresh Interval:** 30s to 24h
- **Preview Mode:** On/Off
- **Category:** Assign to category
- **Hidden:** Hide from view
- **Custom Name:** Override display name

---

## 🔧 Troubleshooting

### Data Not Saving?
- Check browser's localStorage is enabled
- Not in private/incognito mode?
- Clear other site data to free space
- Export data as backup

### Live Preview Not Loading?
- Some sites block iframe embedding
- Toggle to Card View for these sites
- Check browser console for errors
- Verify URL is correct

### Keyboard Shortcuts Not Working?
- Make sure not typing in input field
- Check browser extension conflicts
- Try different browser
- Reload page

### PWA Won't Install?
- Use HTTPS or localhost
- Check browser supports PWA
- Try different browser
- Clear browser cache

---

## 📊 Usage Tips

### Performance
- Keep links per page under 100
- Use longer refresh intervals for static sites
- Close unused pages
- Clear search history periodically

### Organization
- **Pages:** High-level grouping (Work, Personal)
- **Categories:** Fine-grained organization (Tools, Social)
- **Tags:** Cross-cutting themes (Urgent, Reference)

### Security
- Don't store sensitive URLs
- Export data regularly
- Use HTTPS URLs only
- Be careful with iframe previews

---

## 🎯 Common Workflows

### Workflow 1: Daily Dashboard
```
1. Create "Daily" page
2. Add frequently visited sites
3. Set 15-minute refresh intervals
4. Use preview mode for all
5. Install as PWA
6. Open as app every morning
```

### Workflow 2: Research Projects
```
1. Create page per project
2. Add categories: Articles, Tools, References
3. Bulk import bookmarks
4. Use search to find specific topics
5. Export when project complete
```

### Workflow 3: Team Sharing
```
1. Set up dashboard with team tools
2. Organize by categories (Frontend, Backend)
3. Export as JSON
4. Share file with team
5. Everyone imports identical setup
```

---

## 🆘 Getting Help

### Built-in Help
- Press `?` for keyboard shortcuts
- Read `COMPREHENSIVE_FEATURES.md` for details
- Check `README.md` for overview

### Browser Console
- Press `F12` to open DevTools
- Check Console tab for errors
- Look for red error messages

### Common Solutions
1. Clear cache and reload
2. Try incognito mode
3. Check browser version
4. Update to latest LinkBoard version
5. Export data before major changes

---

## 🌟 Pro Tips

1. **Learn 5-6 keyboard shortcuts** - 10x faster workflow
2. **Export weekly** - Never lose data
3. **Use categories** - Better than folders
4. **Set smart refresh intervals** - Save resources
5. **Install as PWA** - Best experience
6. **Mobile-first** - Design for smallest screen
7. **Search, don't scroll** - Faster than browsing
8. **Bulk import** - Don't manually add 100 links

---

## 🎉 You're Ready!

That's it! You now know enough to be productive with LinkBoard.

**Next Steps:**
1. Add your first 10 links
2. Create 2-3 pages
3. Try keyboard shortcuts
4. Install as PWA
5. Export a backup

Enjoy your new dashboard! 🚀

---

**Need more help?** Read `COMPREHENSIVE_FEATURES.md` for detailed documentation.

**Found a bug?** Check browser console and report with details.

**Want a feature?** Open a GitHub issue with description.

---

*Happy linking!* ✨
