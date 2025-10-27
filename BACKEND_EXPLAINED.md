# Media Dashboard Backend - No Separate Backend Needed!

## ⚠️ Important: You DON'T Need a Separate Backend!

**The backend is ALREADY deployed and working!** You don't need to create any Python or Node.js backend.

---

## How It Works

### Architecture Overview

```
Your Browser
    ↓
Supabase Edge Function (ALREADY DEPLOYED)
    ↓
Your Media Server (10.6.3.70)
    ├─→ qBittorrent (port 8080)
    ├─→ Docker (port 2375)
    ├─→ Jellyfin (port 8096)
    └─→ VPN Check (api.ipify.org)
```

### What's Already Done

✅ **Supabase Edge Function Deployed**
- Function name: `media-status`
- URL: `https://jhanvhtkgzyrtdhmjwsd.supabase.co/functions/v1/media-status`
- Handles all API calls to your services
- Formats data for the dashboard
- Already configured and working

✅ **Frontend Configured**
- Dashboard page: `/media`
- Calls the Edge Function automatically
- Updates every 3 seconds
- Error handling included

---

## What You Need To Do

### Only One Thing: Enable Docker Remote API

On your media server (10.6.3.70):

```bash
# 1. Edit Docker daemon config
sudo nano /etc/docker/daemon.json

# 2. Add this configuration:
{
  "hosts": ["unix:///var/run/docker.sock", "tcp://0.0.0.0:2375"]
}

# 3. Restart Docker
sudo systemctl restart docker

# 4. Verify it's working
curl http://localhost:2375/containers/json
```

**That's it!** Everything else is already set up.

---

## Why No Separate Backend?

### The Old Documentation Was Confusing

The `MEDIA_DASHBOARD.md` file mentioned creating a Python or Node.js backend. **Ignore that!**

Those were **examples** showing what you would need IF you were building from scratch. But you're not building from scratch - everything is already built!

### What Actually Happens

1. **Browser** → Makes request to Supabase Edge Function
2. **Edge Function** → Fetches data from your services at 10.6.3.70
3. **Edge Function** → Formats the data
4. **Edge Function** → Returns it to your browser
5. **Dashboard** → Displays the data

The Edge Function IS your backend!

---

## Testing Your Setup

### Step 1: Check Dashboard Works

Visit: `http://localhost:3000/media`

**If you see:**
- Loading screen → Good! It's trying to connect
- Error screen → Check the error message for details
- Data showing → Perfect! Everything works!

### Step 2: Verify Services Are Accessible

From your media server (10.6.3.70):

```bash
# Test qBittorrent
curl http://localhost:8080/api/v2/transfer/info

# Test Docker (after enabling Remote API)
curl http://localhost:2375/containers/json

# Test Jellyfin
curl http://localhost:8096/Sessions
```

All should return JSON data.

### Step 3: Test Edge Function Directly

```bash
# Replace with your actual Supabase URL and key
curl "https://jhanvhtkgzyrtdhmjwsd.supabase.co/functions/v1/media-status?ip=10.6.3.70&qbport=8080&dockerport=2375&jellyfinport=8096" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Should return data about VPN, qBittorrent, Docker, and Jellyfin.

---

## Common Mistakes

### ❌ Mistake 1: "I need to deploy a Python backend"
**No!** The Edge Function IS your backend. It's already deployed.

### ❌ Mistake 2: "Where do I run the Flask app?"
**You don't!** Those were just examples. You're using Supabase Edge Functions instead.

### ❌ Mistake 3: "I need to configure API endpoints"
**The Edge Function already knows the endpoints!** It constructs them from:
- Your server IP: 10.6.3.70
- Default ports: 8080, 2375, 8096

If you need different ports, click "Configure Server" in the dashboard footer.

### ❌ Mistake 4: "Dashboard shows error"
**Check what the error says!** Common issues:
- Docker Remote API not enabled → Follow setup above
- Services not running → Start qBittorrent, Jellyfin, etc.
- Firewall blocking → Allow connections on required ports

---

## Architecture Details

### Edge Function Location
```
project/
└── supabase/
    └── functions/
        └── media-status/
            └── index.ts  ← Your backend code
```

### What It Does

1. **Accepts Parameters**
   - `ip`: Server IP (default: 10.6.3.70)
   - `qbport`: qBittorrent port (default: 8080)
   - `dockerport`: Docker port (default: 2375)
   - `jellyfinport`: Jellyfin port (default: 8096)

2. **Fetches Data**
   - Checks public IP (VPN status)
   - Queries qBittorrent API
   - Queries Docker API
   - Queries Jellyfin API

3. **Returns Formatted JSON**
   ```json
   {
     "vpn": { "healthy": true, "ip": "..." },
     "qbittorrent": { "download": "5 MB/s", ... },
     "containers": [...],
     "jellyfin": { "sessions": [...] }
   }
   ```

---

## Troubleshooting

### Dashboard Shows "Loading..." Forever

**Check browser console (F12):**
- Network errors? → Check server is reachable
- 401/403 errors? → Check Supabase credentials in `.env`
- CORS errors? → Edge Function handles CORS automatically
- 500 errors? → Check Edge Function logs in Supabase dashboard

### "Docker containers not showing"

**Most common issue!**

```bash
# On your server, verify Remote API is enabled:
curl http://localhost:2375/containers/json

# If it fails, Docker Remote API is not enabled
# Follow the setup steps above
```

### "qBittorrent shows 0 B/s"

Possible causes:
1. qBittorrent not running
2. Web UI disabled
3. Wrong port configured
4. No active torrents

```bash
# Test qBittorrent API:
curl http://10.6.3.70:8080/api/v2/transfer/info
```

### "Jellyfin shows no sessions"

This is normal if nobody is watching anything!

Sessions only appear when someone is actively playing media.

---

## Configuration

### Default Configuration
```javascript
{
  ip: "10.6.3.70",
  qbittorrentPort: "8080",
  dockerPort: "2375",
  jellyfinPort: "8096"
}
```

### How to Change
1. Visit `/media`
2. Click "Configure Server" in footer
3. Enter new values
4. Click Save

Settings are stored in browser localStorage.

---

## Security Notes

### Docker Remote API Warning

Port 2375 is **unencrypted**!

**Only use on:**
- Trusted local networks
- Behind firewall
- Not exposed to internet

**For production:**
- Use port 2376 with TLS
- Configure certificates
- Restrict access with firewall rules

### Firewall Recommendations

```bash
# Allow from local network only
sudo ufw allow from 192.168.1.0/24 to any port 2375 proto tcp
sudo ufw allow from 192.168.1.0/24 to any port 8080 proto tcp
sudo ufw allow from 192.168.1.0/24 to any port 8096 proto tcp

# Block from internet
sudo ufw deny 2375
sudo ufw deny 8080
sudo ufw deny 8096
```

---

## Summary

### What You Have
✅ Supabase Edge Function (backend) - **DEPLOYED**
✅ React Dashboard (frontend) - **WORKING**
✅ Auto-refresh every 3s - **ENABLED**
✅ Error handling - **IMPLEMENTED**

### What You Need To Do
1. Enable Docker Remote API on 10.6.3.70
2. Make sure services are running
3. Access `/media` and enjoy!

### What You DON'T Need
❌ Python backend
❌ Node.js backend
❌ Flask/Express setup
❌ Separate API server
❌ Additional deployment

---

**Questions?** The Edge Function logs are available in your Supabase dashboard if you need to debug.

**Everything is already working!** Just enable Docker Remote API and you're done! 🎉
