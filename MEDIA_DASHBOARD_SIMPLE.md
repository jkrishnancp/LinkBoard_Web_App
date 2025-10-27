# Media Dashboard - Simple Setup Guide

## 🎉 NO BACKEND REQUIRED!

Your media dashboard fetches data **directly from your services** - no backend server needed!

---

## How It Works

```
Your Browser
    ↓ Direct Fetch
10.6.3.70:8080  (qBittorrent API)
10.6.3.70:2375  (Docker API)
10.6.3.70:8096  (Jellyfin API)
api.ipify.org   (Public IP check)
```

Everything runs in your browser. No servers, no APIs, no deployment.

---

## Setup (2 Minutes)

### Step 1: Enable CORS on Your Services

Your browser needs permission to fetch from your services.

#### qBittorrent
Settings → Web UI → Enable "Bypass authentication for clients on localhost" (if accessing locally)
Or add your IP to trusted proxies

#### Docker
Enable Remote API:
```bash
sudo nano /etc/docker/daemon.json
```

Add:
```json
{
  "hosts": ["unix:///var/run/docker.sock", "tcp://0.0.0.0:2375"]
}
```

Restart:
```bash
sudo systemctl restart docker
```

#### Jellyfin
Jellyfin API is publicly accessible by default (Sessions endpoint)

### Step 2: Access Dashboard

Visit: `http://localhost:3000/media`

That's it!

---

## Configuration

Click **"Configure Server"** in the footer to change:
- Server IP (default: 10.6.3.70)
- qBittorrent port (default: 8080)
- Docker port (default: 2375)
- Jellyfin port (default: 8096)

---

## CORS Issues?

If you see CORS errors in browser console, you have two options:

### Option 1: Run Chrome with CORS Disabled (Development Only!)

**macOS:**
```bash
open -na Google\ Chrome --args --user-data-dir=/tmp/chrome_dev --disable-web-security
```

**Windows:**
```bash
chrome.exe --user-data-dir="C:\temp" --disable-web-security
```

**Linux:**
```bash
google-chrome --user-data-dir=/tmp/chrome_dev --disable-web-security
```

**⚠️ Only for development! Never browse the web with these flags!**

### Option 2: Use a CORS Proxy

Deploy a simple CORS proxy like:
- https://github.com/Rob--W/cors-anywhere
- Or use a browser extension like "CORS Unblock"

### Option 3: Enable CORS on Services

Add CORS headers to qBittorrent, Docker, and Jellyfin (requires service configuration)

---

## What You'll See

- **VPN Status** - Your public IP address
- **Download/Upload Speeds** - Live qBittorrent stats
- **Active Torrents** - Progress, ETA, speeds
- **Docker Containers** - Running/stopped status
- **Jellyfin Sessions** - Who's watching what

Auto-refreshes every 3 seconds!

---

## Troubleshooting

### "Failed to fetch"
- Services not running
- Wrong IP/ports configured
- Firewall blocking connections
- CORS not enabled

### "CORS policy" errors
- See CORS section above
- Most common issue with direct browser → server calls

### No Docker containers showing
- Docker Remote API not enabled (see Step 1)
- Port 2375 not accessible

### No qBittorrent data
- Web UI not enabled
- Authentication required
- Port 8080 not accessible

---

## Why No Backend?

**Simple!** Modern browsers can fetch from multiple sources. No need for a middleman.

**Pros:**
- ✅ No backend to deploy
- ✅ No server costs
- ✅ Faster (direct connection)
- ✅ Less complexity

**Cons:**
- ❌ CORS issues (requires workarounds)
- ❌ Browser must have network access to services
- ❌ No server-side caching

---

## Security Notes

### Docker Remote API
Port 2375 is **unencrypted**. Only use on trusted networks!

For production:
- Use port 2376 with TLS
- Configure certificates
- Restrict with firewall

### Access Control
These services should NOT be exposed to the internet:
- qBittorrent Web UI
- Docker Remote API
- Jellyfin (unless intended)

Use firewall rules:
```bash
sudo ufw allow from 192.168.1.0/24 to any port 2375
sudo ufw allow from 192.168.1.0/24 to any port 8080
```

---

## Advanced: Fixing CORS Properly

If you want to avoid CORS workarounds, set up Nginx reverse proxy:

```nginx
server {
    listen 3001;
    location /qbittorrent/ {
        proxy_pass http://10.6.3.70:8080/;
        add_header Access-Control-Allow-Origin *;
    }
    location /docker/ {
        proxy_pass http://10.6.3.70:2375/;
        add_header Access-Control-Allow-Origin *;
    }
    location /jellyfin/ {
        proxy_pass http://10.6.3.70:8096/;
        add_header Access-Control-Allow-Origin *;
    }
}
```

Then update dashboard config to use localhost:3001

---

## Summary

✅ Dashboard fetches directly from services
✅ No backend server required
✅ No Supabase needed
✅ No deployment required
✅ Just enable Docker Remote API and go!

**It's that simple!** 🎉
