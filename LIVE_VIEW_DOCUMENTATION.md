# Live View Feature Documentation

## Overview
This document provides complete documentation for the Live View auto-refresh system and button functionality fixes implemented in the LinkBoard application.

---

## 🎯 Primary Features Implemented

### 1. Live View Enabled by Default ✅
**Implementation**: All new links automatically have `previewMode: true` set when created.

**Location**: `store/useLinkBoard.ts`
```typescript
const newLink: LinkCard = {
  ...link,
  logo,
  id,
  i: id,
  x: 0,
  y: maxY,
  w: cardSize,
  h: cardSize,
  previewMode: true, // ✅ ENABLED BY DEFAULT
};
```

**Backward Compatibility**: Existing links without the `previewMode` field are automatically upgraded to `true` during hydration:
```typescript
hydrateFromStorage: (state) => {
  const linksWithPreview = state.links.map(link => ({
    ...link,
    previewMode: link.previewMode !== undefined ? link.previewMode : true,
  }));
}
```

**User Impact**:
- All new links display in Live View mode automatically
- Existing links upgrade to Live View on first load
- Users can toggle individual links to card view if desired

---

### 2. Automatic 8-Hour Refresh ✅
**Implementation**: Custom hook `useAutoRefresh` manages the refresh timer.

**Location**: `hooks/useAutoRefresh.ts`

**Key Features**:
```typescript
const { triggerImmediateRefresh, lastRefresh } = useAutoRefresh({
  onRefresh: handleRefreshPreviews,
  enabled: true,
  refreshInterval: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
});
```

**How It Works**:
1. Timer starts when application loads
2. After 8 hours, triggers `handleRefreshPreviews()`
3. All iframe previews reload with new `refreshKey`
4. Timer automatically resets for next 8-hour cycle
5. Runs continuously while application is open

**Technical Implementation**:
```typescript
// In app/page.tsx
const [refreshKey, setRefreshKey] = useState(0);

const handleRefreshPreviews = async () => {
  console.log('[Auto-Refresh] Triggered at:', new Date().toISOString());
  setRefreshKey((prev) => prev + 1);
};

// iframe uses key to force reload
<iframe
  key={`${link.id}-${refreshKey}`}
  src={link.url}
  // ...other props
/>
```

**Logging**:
- Console logs refresh triggers with timestamps
- Format: `[Auto-Refresh] Triggered at: 2025-10-26T12:00:00.000Z`
- Helps verify timer is working correctly

---

### 3. Immediate Refresh on New Data ✅
**Implementation**: Monitors link count and triggers immediate refresh when new links are added.

**Location**: `app/page.tsx`

**Detection Logic**:
```typescript
const prevLinksLengthRef = useRef(links.length);

useEffect(() => {
  if (mounted && links.length > prevLinksLengthRef.current) {
    console.log('[Auto-Refresh] New link added, triggering immediate refresh');
    triggerImmediateRefresh();
  }
  prevLinksLengthRef.current = links.length;
}, [links.length, mounted, triggerImmediateRefresh]);
```

**Behavior**:
- Monitors `links.length` state
- When length increases (new link added), triggers immediate refresh
- Resets the 8-hour timer after immediate refresh
- Only fires once per addition (uses ref to track previous length)

**User Experience**:
1. User clicks Plus button → Add Link modal opens
2. User enters link details → Clicks save
3. New link appears on dashboard
4. **Immediate refresh triggered** → All live views update
5. 8-hour timer resets from current time

---

### 4. Refresh Timing Control ✅
**Implementation**: Refresh ONLY occurs during these two conditions:

**Condition 1: 8-Hour Timer**
```typescript
refreshInterval: 8 * 60 * 60 * 1000 // Exactly 8 hours
```

**Condition 2: New Link Added**
```typescript
if (links.length > prevLinksLengthRef.current) {
  triggerImmediateRefresh();
}
```

**No Other Refresh Triggers**:
- ❌ Page navigation
- ❌ Window focus/blur
- ❌ Manual link edits
- ❌ Link deletion
- ❌ Settings changes
- ❌ Arrange mode toggle
- ✅ ONLY 8-hour timer and new link addition

---

## 🔧 Button Fixes

### Plus Button Fix ✅
**Issue**: Plus button was present but needed integration with modal system.

**Solution**: Properly wired to `setIsAddModalOpen(true)`

**Location**: `components/FloatingToolbar.tsx` + `app/page.tsx`

**Code**:
```typescript
<Button
  onClick={onAddLink}
  size="lg"
  className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
  title="Add Link"
>
  <PlusIcon className="w-6 h-6" />
</Button>
```

**Testing**:
1. Click Plus button (blue circle, bottom-right)
2. Add Link modal should open
3. Enter link details
4. New link appears in Live View mode
5. Immediate refresh triggered

---

### Settings Button Fix ✅
**Issue**: Settings button was missing from FloatingToolbar.

**Solution**: Added new Settings button with proper styling and wiring.

**Location**: `components/FloatingToolbar.tsx`

**New Button Added**:
```typescript
<Button
  onClick={onOpenSettings}
  size="lg"
  variant="outline"
  className="w-14 h-14 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all"
  title="Settings"
>
  <Cog6ToothIcon className="w-6 h-6" />
</Button>
```

**Button Order (Top to Bottom)**:
1. **Arrange Mode** - Grid/Checkmark icon (green when active)
2. **Add Link** - Plus icon (blue)
3. **Settings** - Gear icon (white/gray) ⭐ NEW

**Integration**:
```typescript
// app/page.tsx
const [isSettingsOpen, setIsSettingsOpen] = useState(false);

<FloatingToolbar
  onOpenSettings={() => setIsSettingsOpen(true)}
/>

<SettingsDrawer
  isOpen={isSettingsOpen}
  onClose={() => setIsSettingsOpen(false)}
/>
```

**Testing**:
1. Click Settings button (gear icon, bottom-right)
2. Settings drawer should slide in from right
3. Modify settings (theme, density, etc.)
4. Changes apply immediately

---

## 📊 Technical Architecture

### Component Hierarchy
```
app/page.tsx (Main Application)
  ├── FloatingToolbar
  │   ├── Arrange Mode Button
  │   ├── Plus Button (Add Link)
  │   └── Settings Button ⭐ NEW
  │
  ├── useAutoRefresh Hook
  │   ├── 8-Hour Timer
  │   └── Immediate Refresh Trigger
  │
  ├── LinkCard Components
  │   └── iframe (with refreshKey)
  │
  ├── AddLinkModal
  ├── SettingsDrawer
  └── Other Modals
```

### Data Flow

**Auto-Refresh Flow**:
```
Timer expires (8 hours)
  ↓
useAutoRefresh calls onRefresh()
  ↓
handleRefreshPreviews() increments refreshKey
  ↓
refreshKey prop passed to all LinkCards
  ↓
iframe key changes → React unmounts old iframe
  ↓
React mounts new iframe → Fresh page load
  ↓
Timer restarts for next 8 hours
```

**New Link Flow**:
```
User clicks Plus button
  ↓
AddLinkModal opens
  ↓
User saves new link
  ↓
addLink() called → previewMode: true
  ↓
links.length increases
  ↓
useEffect detects increase
  ↓
triggerImmediateRefresh() called
  ↓
refreshKey increments → All iframes reload
  ↓
8-hour timer resets
```

---

## 🔍 Error Handling

### Failed iframe Loads
**Issue**: Some sites block iframe embedding (X-Frame-Options)

**Handling**:
- iframe shows browser error message
- User can toggle to card view instead
- No application errors thrown
- Status indicator shows site accessibility

**User Action**:
- Click preview toggle switch
- Switch to "Card View" mode
- View metadata instead of live preview

### Timer Failures
**Issue**: Timer could fail if app remains open for extended periods

**Handling**:
```typescript
return () => {
  clearTimer(); // Cleanup on unmount
};
```

**Safeguards**:
- Timer cleared on component unmount
- New timer created on remount
- No memory leaks from orphaned timers

### Network Issues
**Issue**: iframe content may fail to load due to network

**Handling**:
- iframe shows native browser error
- User can manually refresh by toggling preview
- Auto-refresh will retry after 8 hours
- Status monitoring system tracks accessibility

---

## 🧪 Testing Procedures

### Test 1: Default Live View
**Steps**:
1. Clear browser storage: `localStorage.clear()`
2. Refresh application
3. Click Plus button
4. Add a new link (e.g., https://example.com)
5. Save

**Expected Results**:
- ✅ Link appears in Live View mode (iframe showing)
- ✅ Preview toggle shows "Live Preview" enabled
- ✅ Page content visible in widget
- ✅ Console logs: `[Auto-Refresh] New link added, triggering immediate refresh`

### Test 2: 8-Hour Auto-Refresh
**Steps**:
1. Add a link with Live View enabled
2. Open browser console
3. Wait or manually trigger timer (for testing, temporarily change to 10 seconds)

**Expected Results**:
- ✅ After 8 hours, console logs: `[Auto-Refresh] Triggered at: [timestamp]`
- ✅ All iframe previews reload
- ✅ Timer resets for next 8 hours

**Manual Testing** (Recommended):
```typescript
// Temporarily change in app/page.tsx for testing:
refreshInterval: 10 * 1000, // 10 seconds instead of 8 hours
```

### Test 3: Immediate Refresh on New Data
**Steps**:
1. Have 2+ links in Live View mode
2. Open browser console
3. Click Plus button → Add another link
4. Watch console logs

**Expected Results**:
- ✅ Console logs: `[Auto-Refresh] New link added, triggering immediate refresh`
- ✅ All existing iframe previews reload
- ✅ New link appears in Live View mode
- ✅ 8-hour timer resets

### Test 4: Plus Button
**Steps**:
1. Locate Plus button (blue circle, bottom-right)
2. Click button

**Expected Results**:
- ✅ Add Link modal opens
- ✅ Form fields editable
- ✅ Can submit new link
- ✅ Modal closes on save

### Test 5: Settings Button
**Steps**:
1. Locate Settings button (gear icon, bottom-right, below Plus)
2. Click button

**Expected Results**:
- ✅ Settings drawer slides in from right
- ✅ Can modify theme, density, etc.
- ✅ Changes apply immediately
- ✅ Can close drawer

### Test 6: No Unwanted Refreshes
**Steps**:
1. Add link in Live View
2. Open browser console
3. Perform these actions:
   - Edit link name
   - Toggle arrange mode
   - Change settings
   - Resize widget
   - Navigate around

**Expected Results**:
- ❌ NO console logs about refresh
- ❌ NO iframe reloads
- ✅ Only logs appear for 8-hour timer or new link addition

---

## 📝 Configuration Options

### Adjust Refresh Interval
**Location**: `app/page.tsx`

```typescript
const { triggerImmediateRefresh, lastRefresh } = useAutoRefresh({
  onRefresh: handleRefreshPreviews,
  enabled: true,
  refreshInterval: 8 * 60 * 60 * 1000, // Change this value
});
```

**Common Intervals**:
- 1 hour: `1 * 60 * 60 * 1000`
- 4 hours: `4 * 60 * 60 * 1000`
- 8 hours: `8 * 60 * 60 * 1000` (current)
- 12 hours: `12 * 60 * 60 * 1000`
- 24 hours: `24 * 60 * 60 * 1000`

### Disable Auto-Refresh
**Option 1**: Set `enabled: false` in useAutoRefresh

```typescript
const { triggerImmediateRefresh } = useAutoRefresh({
  onRefresh: handleRefreshPreviews,
  enabled: false, // Disables timer
  refreshInterval: 8 * 60 * 60 * 1000,
});
```

**Option 2**: Remove immediate refresh on new data

```typescript
// Comment out or remove this effect
useEffect(() => {
  // if (mounted && links.length > prevLinksLengthRef.current) {
  //   triggerImmediateRefresh();
  // }
  prevLinksLengthRef.current = links.length;
}, [links.length, mounted, triggerImmediateRefresh]);
```

### Change Default Preview Mode
**Location**: `store/useLinkBoard.ts`

```typescript
const newLink: LinkCard = {
  ...link,
  // ...other fields
  previewMode: false, // Change to false for card view by default
};
```

---

## 🐛 Known Limitations

### iframe Restrictions
**Issue**: Some websites prevent iframe embedding

**Affected Sites**:
- Google (X-Frame-Options: DENY)
- Facebook (X-Frame-Options: DENY)
- Twitter/X (X-Frame-Options: DENY)
- Banking sites (security policy)

**Workaround**: Toggle to Card View mode for these sites

### Memory Usage
**Issue**: Multiple live iframes can consume significant memory

**Impact**:
- 10+ live previews: ~200-500MB
- 50+ live previews: ~1-2GB
- Browser may slow down

**Recommendation**: Use Card View for less important links

### Mobile Performance
**Issue**: Live View may be slow on mobile devices

**Symptoms**:
- Laggy scrolling
- Slow iframe loading
- Battery drain

**Solution**: Toggle to Card View on mobile

### Timer Precision
**Issue**: 8-hour timer may drift slightly

**Reason**: Browser throttling in background tabs

**Impact**: Timer may fire ±1-2 minutes from exact 8 hours

**Verdict**: Acceptable for this use case

---

## 🚀 Performance Optimizations

### Lazy Loading
**Implementation**: iframes use `loading="lazy"` attribute

**Benefit**: Only load when scrolled into view

### Refresh Key Strategy
**Method**: Incremental integer instead of timestamp

**Benefit**: Lightweight, predictable, no date parsing

### Conditional Rendering
**Logic**: Only render iframes when `isPreviewMode === true`

**Benefit**: Reduces DOM nodes when not needed

### Timer Cleanup
**Implementation**: Proper cleanup in useEffect return

**Benefit**: Prevents memory leaks

---

## 📈 Future Enhancements

### Potential Features
1. **Per-Link Refresh Intervals**: Different timers for different links
2. **Selective Refresh**: Refresh only visible iframes
3. **Manual Refresh Button**: User-triggered refresh
4. **Refresh Status Indicator**: Show last refresh time
5. **Pause/Resume Timer**: Stop timer during inactivity
6. **Smart Scheduling**: Refresh during off-peak times
7. **Bandwidth Monitoring**: Adjust refresh based on network

### User Preferences
```typescript
interface RefreshPreferences {
  autoRefreshEnabled: boolean;
  refreshInterval: number;
  refreshOnNewLink: boolean;
  refreshVisibleOnly: boolean;
}
```

---

## 📚 API Reference

### useAutoRefresh Hook
```typescript
function useAutoRefresh({
  onRefresh: () => void | Promise<void>,
  enabled: boolean,
  refreshInterval: number,
}): {
  triggerImmediateRefresh: () => Promise<void>,
  lastRefresh: number,
  clearTimer: () => void,
}
```

**Parameters**:
- `onRefresh`: Function called when refresh triggers
- `enabled`: Whether timer is active
- `refreshInterval`: Milliseconds between refreshes

**Returns**:
- `triggerImmediateRefresh`: Manually trigger refresh and reset timer
- `lastRefresh`: Timestamp of last refresh
- `clearTimer`: Stop the timer

### FloatingToolbar Props
```typescript
interface FloatingToolbarProps {
  isArrangeMode: boolean;
  onToggleArrange: () => void;
  onAddLink: () => void;
  onOpenSettings: () => void;
}
```

### LinkCard Props (Added)
```typescript
interface LinkCardProps {
  // ...existing props
  refreshKey?: number; // Forces iframe reload when changed
}
```

---

## 🎓 Best Practices

### For Users
1. **Monitor Memory**: Close browser tab if sluggish
2. **Use Card View**: For sites that block iframes
3. **Mobile Caution**: Consider battery life
4. **Check Console**: Verify refresh timing

### For Developers
1. **Test Timer**: Use shorter intervals during development
2. **Check Logs**: Monitor console for refresh messages
3. **Handle Errors**: iframe errors don't crash app
4. **Clean Timers**: Always cleanup in useEffect

---

## 🔗 Related Files

### Core Implementation
- `hooks/useAutoRefresh.ts` - Timer management
- `app/page.tsx` - Main integration
- `components/LinkCard.tsx` - iframe rendering
- `components/FloatingToolbar.tsx` - Button UI
- `store/useLinkBoard.ts` - State management

### Supporting Files
- `components/LinkPreviewToggle.tsx` - Preview toggle UI
- `components/SettingsDrawer.tsx` - Settings panel
- `lib/validators.ts` - previewMode schema

---

## 📞 Support

### Debugging Steps
1. **Open Console**: Check for refresh logs
2. **Check Storage**: Verify previewMode in localStorage
3. **Test Timer**: Temporarily reduce interval
4. **Verify Buttons**: All three should be clickable
5. **Check Network**: iframes need internet

### Common Issues

**Issue**: Auto-refresh not working
**Solution**: Check console for errors, verify `enabled: true`

**Issue**: Plus button not opening modal
**Solution**: Check z-index, verify click handler wired

**Issue**: Settings button missing
**Solution**: Clear cache, rebuild application

**Issue**: All links in card view
**Solution**: Check localStorage, may need to toggle manually

---

## ✅ Checklist

### Implementation Complete
- [x] Live View enabled by default
- [x] 8-hour auto-refresh timer
- [x] Immediate refresh on new data
- [x] No unwanted refreshes
- [x] Plus button functional
- [x] Settings button added
- [x] Error handling implemented
- [x] Console logging added
- [x] Timer cleanup on unmount
- [x] Build successful
- [x] Documentation created

---

## 📜 Change Log

### Version 1.0.0 (2025-10-26)
- ✨ Added Live View auto-refresh system
- ✨ Enabled preview mode by default
- ✨ Implemented 8-hour refresh timer
- ✨ Added immediate refresh on new data
- 🔧 Fixed Plus button functionality
- 🔧 Added Settings button to FloatingToolbar
- 📝 Created comprehensive documentation

---

## License & Credits
This feature maintains compatibility with the LinkBoard project and follows React/Next.js best practices for hooks and state management.
