# LinkBoard Enhanced Features Documentation

## Overview
This document describes the new enhancements implemented for the LinkBoard application, including customizable names, sidebar menu, caching system, and real-time status monitoring.

---

## 1. Customizable Link Names

### Description
Users can now assign custom display names to links and widgets, separate from their default names. This allows for personalized labeling while maintaining the original link metadata.

### Implementation Details
- **Database Schema**: Added `customName` field to `LinkCard` type
- **UI Location**: Custom name input field in Add/Edit Link modal
- **Priority**: Custom name displays if set, otherwise falls back to default name

### Usage
1. Click the edit (pencil) icon on any link
2. Fill in the "Custom Display Name" field (optional)
3. Leave empty to use the default name
4. Custom names are persisted in localStorage

### Technical Details
```typescript
interface LinkCard {
  name: string;           // Original/default name
  customName?: string;    // User-defined custom name
  // ... other fields
}

// Display logic
const displayName = link.customName || link.name;
```

---

## 2. Collapsible Sidebar Menu

### Description
Top navigation icons have been reorganized into an intuitive collapsible sidebar menu accessed via a hamburger menu icon.

### Features
- **Arrange Mode**: Toggle drag/resize functionality
- **Add Widgets**: Access system information widgets
- **Export/Import Data**: Backup and restore your board
- **Theme Toggle**: Switch between system/light/dark themes
- **Settings**: Access board configuration

### Implementation
- **Component**: `SidebarMenu.tsx`
- **Location**: Left side of header
- **Trigger**: Menu button with hamburger icon
- **Library**: shadcn/ui Sheet component

### Benefits
- Cleaner header design
- Better mobile experience
- Organized menu structure
- Easy access to all features

---

## 3. Webpage Caching System

### Description
Automatic caching system that stores webpage metadata including titles, descriptions, and favicons using Supabase as the backend.

### Features
- **Auto-refresh**: Caches expire and refresh every 8 hours
- **Metadata Storage**: Title, description, favicon, screenshots
- **Fallback Display**: Shows cached content when link is empty
- **Performance**: Non-blocking, asynchronous fetching

### Database Schema
```sql
CREATE TABLE link_cache (
  id uuid PRIMARY KEY,
  link_id text UNIQUE NOT NULL,
  url text NOT NULL,
  screenshot_url text,
  preview_html text,
  title text,
  description text,
  favicon text,
  cached_at timestamptz,
  expires_at timestamptz NOT NULL,
  created_at timestamptz,
  updated_at timestamptz
);
```

### Implementation Details
- **Hook**: `useLinkCache()` in `hooks/useLinkCache.ts`
- **API Service**: Microlink API for metadata extraction
- **Storage**: Supabase PostgreSQL database
- **Refresh Interval**: 8 hours (28,800,000 ms)

### Technical Flow
1. Component mounts → Check for existing cache
2. If cache exists and valid → Use cached data
3. If cache expired or missing → Fetch new metadata
4. Update Supabase with new cache entry
5. Set automatic refresh timer for 8 hours

### Usage in Components
```typescript
const { cache, loading, error, refresh } = useLinkCache(
  link.id,
  link.url,
  !link.hidden
);

const displayLogo = cache?.favicon || link.logo;
const displayDescription = cache?.description || link.description;
```

---

## 4. Real-Time Status Monitoring

### Description
Live status indicators showing whether websites are accessible (UP) or down (DOWN) with color-coded visual feedback.

### Features
- **Status Colors**:
  - 🟢 Green: Website is UP and accessible
  - 🔴 Red: Website is DOWN or unreachable
  - 🟡 Yellow: Status is being checked
- **Auto-refresh**: Checks status every 5 minutes
- **Non-blocking**: Asynchronous checks don't freeze UI
- **Persistent**: Status stored in Supabase database

### Database Schema
```sql
CREATE TABLE link_status (
  id uuid PRIMARY KEY,
  link_id text UNIQUE NOT NULL,
  url text NOT NULL,
  status text NOT NULL DEFAULT 'checking',
  last_checked timestamptz,
  response_time integer,
  created_at timestamptz,
  updated_at timestamptz
);
```

### Implementation Details
- **Hook**: `useLinkStatus()` in `hooks/useLinkStatus.ts`
- **Check Method**: HEAD request with 5-second timeout
- **Refresh Interval**: 5 minutes (300,000 ms)
- **Visual Indicator**: Small colored dot in top-left corner of cards

### Status Check Algorithm
1. Send HEAD request to URL
2. 5-second timeout to prevent hanging
3. Success (response received) → Status: UP
4. Failure (timeout/error) → Status: DOWN
5. Update Supabase with result
6. Display color-coded indicator

### Technical Implementation
```typescript
const { status, lastChecked, responseTime, refresh } = useLinkStatus(
  link.id,
  link.url,
  !link.hidden
);

const getStatusColor = () => {
  switch (status) {
    case 'up': return 'bg-green-500';
    case 'down': return 'bg-red-500';
    case 'checking': return 'bg-yellow-500';
  }
};
```

---

## Error Handling

### Caching System
- **Network Failures**: Gracefully falls back to default link data
- **Invalid URLs**: Catches and logs errors, displays fallback
- **API Limits**: Implements retry logic with exponential backoff

### Status Monitoring
- **Timeout Protection**: 5-second limit prevents infinite waits
- **CORS Issues**: Uses HEAD requests to minimize CORS problems
- **Rate Limiting**: 5-minute intervals prevent excessive checking

### General
- **Database Errors**: Logged to console, app continues functioning
- **User Feedback**: Toast notifications for critical errors
- **Fallback UI**: Default values always available

---

## Performance Optimizations

### Caching
- Only fetches when cache is expired or missing
- Debounced updates to prevent excessive writes
- Conditional fetching based on link visibility

### Status Monitoring
- Non-blocking async operations
- Batched updates to reduce database calls
- Only active for visible (non-hidden) links

### Database
- Indexed columns for fast queries
- Upsert operations to prevent duplicates
- Row Level Security for data protection

---

## Configuration Options

### Cache Refresh Interval
```typescript
// In useLinkCache.ts
const CACHE_DURATION = 8 * 60 * 60 * 1000; // 8 hours
```

### Status Check Interval
```typescript
// In useLinkStatus.ts
const STATUS_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
```

### Status Check Timeout
```typescript
// In lib/supabase.ts
const FETCH_TIMEOUT = 5000; // 5 seconds
```

---

## Database Setup

### Tables Created
1. **link_status** - Stores link availability status
2. **link_cache** - Stores webpage metadata cache

### Indexes
- `idx_link_status_link_id` - Fast status lookups
- `idx_link_status_last_checked` - Refresh queries
- `idx_link_cache_link_id` - Fast cache lookups
- `idx_link_cache_expires_at` - Cache cleanup queries

### Security
- Row Level Security (RLS) enabled on all tables
- Public read/write policies for anonymous users
- HTTPS-only connections to Supabase

---

## API Dependencies

### Microlink API
- **Purpose**: Webpage metadata extraction
- **Endpoint**: `https://api.microlink.io/`
- **Rate Limit**: 50 requests/day (free tier)
- **Fallback**: Uses default link data if API fails

### Supabase
- **Purpose**: Database and caching backend
- **Features Used**: PostgreSQL, Row Level Security
- **Connection**: Automatic via environment variables

---

## Future Enhancements

### Potential Improvements
1. Screenshot capture for link previews
2. Custom refresh intervals per link
3. Status history and uptime tracking
4. Webhook notifications for status changes
5. Batch status checking for performance
6. Advanced cache management UI
7. Export cache and status data
8. Custom status check methods (ping, API, etc.)

---

## Troubleshooting

### Cache Not Updating
- Check Supabase connection
- Verify `expires_at` timestamps
- Check browser console for errors
- Manually trigger refresh from link options

### Status Always Shows "Down"
- Check for CORS restrictions on target URL
- Verify network connectivity
- Some sites block HEAD requests - this is expected
- Check Supabase connection

### Performance Issues
- Reduce number of visible links
- Increase check intervals
- Disable status monitoring for specific links
- Clear expired cache entries

---

## Support & Maintenance

### Monitoring
- Check Supabase dashboard for database health
- Monitor API usage limits
- Review browser console for errors
- Track cache hit/miss ratios

### Maintenance
- Periodically clean up old cache entries
- Archive old status history
- Update API endpoints if changed
- Review and optimize database indexes

---

## License & Credits

This feature enhancement maintains the same license as the main LinkBoard application. Built with modern web technologies including Next.js, React, TypeScript, Supabase, and shadcn/ui.
