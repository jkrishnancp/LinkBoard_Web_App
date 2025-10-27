# Media Dashboard Troubleshooting

## Current Status: Docker Working, Others Not Loading

Good news: Docker API is working! This means CORS is enabled and working for Docker.

Now we need to fix qBittorrent and Jellyfin.

---

## Step 1: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors related to:
   - `qBittorrent transfer/info failed`
   - `qBittorrent torrents/info failed`
   - `Jellyfin failed`

**Common errors you'll see:**

### CORS Error
```
Access to fetch at 'http://10.6.3.70:8080/...' from origin 'http://localhost:3000'
has been blocked by CORS policy
```

**Solution:** CORS needs to be enabled on qBittorrent and Jellyfin (see below)

### Network Error / Failed to Fetch
```
TypeError: Failed to fetch
```

**Solutions:**
- Service not running
- Wrong port number
- Firewall blocking connection
- Service not accessible from your machine

### 401 Unauthorized
```
qBittorrent returned status: 401 Unauthorized
```

**Solution:** qBittorrent requires authentication (see below)

---

## Step 2: Enable qBittorrent Web API

### Check qBittorrent is Running
```bash
# On your server (10.6.3.70)
sudo systemctl status qbittorrent
# or
ps aux | grep qbittorrent
```

### Enable Web UI

1. Open qBittorrent
2. Tools → Options → Web UI
3. ✅ Enable "Web User Interface (Remote control)"
4. Set port to 8080 (or your preferred port)
5. ✅ Enable "Bypass authentication for clients on localhost" (if accessing locally)
6. Or set username/password

### Test qBittorrent API

From your **local machine** (where browser runs):
```bash
curl http://10.6.3.70:8080/api/v2/transfer/info
```

**If this works** → CORS is the issue (browser blocks it)
**If this fails** → Network/firewall issue

---

## Step 3: Fix qBittorrent CORS

qBittorrent Web UI doesn't support CORS headers natively. You have two options:

### Option A: Disable Browser CORS (Quick, Development Only)

**Close ALL Chrome windows first!** Then:

**macOS:**
```bash
open -na Google\ Chrome --args --user-data-dir=/tmp/chrome_dev --disable-web-security
```

**Windows:**
```cmd
chrome.exe --user-data-dir="C:\temp" --disable-web-security
```

**Linux:**
```bash
google-chrome --user-data-dir=/tmp/chrome_dev --disable-web-security
```

**⚠️ SECURITY WARNING:** Never browse the web with these flags! Only use for this dashboard.

### Option B: Nginx Reverse Proxy (Production)

Create `/etc/nginx/sites-available/media-proxy`:

```nginx
server {
    listen 3001;
    server_name localhost;

    # qBittorrent
    location /qbittorrent/ {
        proxy_pass http://10.6.3.70:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;

        if ($request_method = OPTIONS) {
            return 204;
        }
    }

    # Jellyfin
    location /jellyfin/ {
        proxy_pass http://10.6.3.70:8096/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;

        if ($request_method = OPTIONS) {
            return 204;
        }
    }

    # Docker
    location /docker/ {
        proxy_pass http://10.6.3.70:2375/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;

        if ($request_method = OPTIONS) {
            return 204;
        }
    }
}
```

Enable and start:
```bash
sudo ln -s /etc/nginx/sites-available/media-proxy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Then update dashboard config:
- Server IP: `localhost`
- qBittorrent port: `3001/qbittorrent`
- Wait, this won't work with current setup...

**Better approach:** Use browser extension or disabled CORS for now.

---

## Step 4: Fix Jellyfin Access

### Check Jellyfin is Running
```bash
# On your server
sudo systemctl status jellyfin
```

### Test Jellyfin API
```bash
curl http://10.6.3.70:8096/Sessions
```

Should return JSON (empty array `[]` if no active sessions).

### Jellyfin CORS

Jellyfin **does** support CORS! Enable it:

1. Open Jellyfin web interface: `http://10.6.3.70:8096`
2. Dashboard → Networking
3. Find "CORS Settings" or "Remote connections"
4. Add `*` or `http://localhost:3000` to allowed origins
5. Save and restart Jellyfin

Or edit config file:
```bash
sudo nano /etc/jellyfin/network.xml
```

Add:
```xml
<NetworkConfiguration>
  <EnableRemoteAccess>true</EnableRemoteAccess>
  <EnableCORS>true</EnableCORS>
  <CORSDomains>
    <string>http://localhost:3000</string>
    <string>*</string>
  </CORSDomains>
</NetworkConfiguration>
```

Restart:
```bash
sudo systemctl restart jellyfin
```

---

## Step 5: Verify Services Are Accessible

From your **local machine** (where browser runs):

```bash
# Test all endpoints
echo "VPN/IP:"
curl -s https://api.ipify.org?format=json

echo -e "\n\nqBittorrent Transfer Info:"
curl -s http://10.6.3.70:8080/api/v2/transfer/info

echo -e "\n\nqBittorrent Torrents:"
curl -s http://10.6.3.70:8080/api/v2/torrents/info

echo -e "\n\nDocker Containers:"
curl -s http://10.6.3.70:2375/containers/json

echo -e "\n\nJellyfin Sessions:"
curl -s http://10.6.3.70:8096/Sessions
```

All should return JSON data (not HTML error pages).

---

## Step 6: Check Console for Detailed Errors

With the updated code, you'll now see detailed error messages in browser console:

```javascript
// Open DevTools Console (F12) and look for:
qBittorrent transfer/info failed: TypeError: Failed to fetch
qBittorrent returned status: 401 Unauthorized
Jellyfin failed: TypeError: NetworkError
```

These tell you **exactly** what's wrong!

---

## Common Issues & Solutions

### Issue: "0 B/s" for qBittorrent

**Causes:**
1. qBittorrent Web UI not enabled → Enable it (see Step 2)
2. Authentication required → Add credentials or bypass localhost
3. CORS blocking request → Disable browser CORS (see Step 3)
4. Wrong port → Check qBittorrent Web UI settings
5. No active torrents → This is normal! Add torrents to see speeds

### Issue: "Aucun container" (No containers) for Docker

**You've already fixed this!** Docker is working. Shows "Aucun container" because you have no containers running.

To verify Docker works, start a container:
```bash
docker run -d --name test nginx
```

Should appear in dashboard!

### Issue: "Personne ne regarde rien actuellement" (Nobody watching) for Jellyfin

**This is normal!** Jellyfin only shows active playback sessions.

**To test:**
1. Open Jellyfin web or app
2. Start playing a video
3. Check dashboard - should show the session!

### Issue: "Failed to fetch" for everything

**Causes:**
1. Services running on wrong ports
2. Firewall blocking connections
3. Server IP wrong (not 10.6.3.70)
4. Services not running

**Solutions:**
```bash
# Check ports are listening
sudo netstat -tlnp | grep -E '8080|2375|8096'

# Check firewall
sudo ufw status

# Allow ports if needed
sudo ufw allow from 192.168.1.0/24 to any port 8080
sudo ufw allow from 192.168.1.0/24 to any port 2375
sudo ufw allow from 192.168.1.0/24 to any port 8096
```

---

## Quick Fix Checklist

✅ **Docker**: Working! Shows "Aucun container" (correct if no containers)

⬜ **qBittorrent**:
- [ ] Web UI enabled in qBittorrent settings
- [ ] Port 8080 accessible (`curl http://10.6.3.70:8080`)
- [ ] Authentication bypassed or credentials configured
- [ ] CORS handled (browser flag or proxy)
- [ ] Active torrents exist (to show data)

⬜ **Jellyfin**:
- [ ] Jellyfin running (`sudo systemctl status jellyfin`)
- [ ] Port 8096 accessible (`curl http://10.6.3.70:8096/Sessions`)
- [ ] CORS enabled in Jellyfin network settings
- [ ] Active playback session exists (to show data)

⬜ **VPN/IP**: Should work automatically (uses public API)

---

## Most Likely Solution

Since Docker works (CORS is fine), the issue is probably:

1. **qBittorrent Web UI not enabled** → Enable in qBittorrent options
2. **qBittorrent requires auth** → Bypass localhost or add credentials
3. **Jellyfin CORS not enabled** → Enable in Jellyfin network settings

**Quick test:**
```bash
# From your local machine:
curl http://10.6.3.70:8080/api/v2/transfer/info
curl http://10.6.3.70:8096/Sessions
```

If these work → CORS issue → Use Chrome with `--disable-web-security`
If these fail → Service configuration issue → Check service settings

---

## Next Steps

1. Check browser console (F12) for specific errors
2. Test services with curl from local machine
3. Enable qBittorrent Web UI
4. Enable Jellyfin CORS
5. Use Chrome with CORS disabled (easiest for development)
6. Share console errors if still stuck!

---

## Still Not Working?

**Share these details:**

1. Browser console errors (F12 → Console tab)
2. Result of: `curl http://10.6.3.70:8080/api/v2/transfer/info`
3. Result of: `curl http://10.6.3.70:8096/Sessions`
4. qBittorrent Web UI settings (is it enabled?)
5. Are you using Chrome with `--disable-web-security`?

This will help diagnose the exact issue!
