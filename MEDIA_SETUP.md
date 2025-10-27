# Media Dashboard - Setup Guide

Your media server dashboard is **fully deployed and ready**!

## ✅ What's Deployed

- ✅ Dashboard page at `/media`
- ✅ Supabase Edge Function (`media-status`)
- ✅ Pre-configured for server: `10.6.3.70`
- ✅ Default ports: qBittorrent (8080), Docker (2375), Jellyfin (8096)
- ✅ Auto-refresh every 3 seconds

---

## 🚀 3-Step Setup

### Step 1: Access Dashboard

Visit: **http://localhost:3000/media**

Or click "Media Dashboard" in the LinkBoard header.

### Step 2: Enable Docker Remote API

**This is required for container monitoring!**

On your media server (10.6.3.70):

```bash
# Edit Docker daemon config
sudo nano /etc/docker/daemon.json
```

Add this configuration:
```json
{
  "hosts": ["unix:///var/run/docker.sock", "tcp://0.0.0.0:2375"]
}
```

Restart Docker:
```bash
sudo systemctl restart docker
```

### Step 3: Test Your Dashboard

The dashboard should now display:
- ✅ VPN status and public IP
- ✅ qBittorrent speeds and torrents
- ✅ Docker container status
- ✅ Jellyfin playback sessions

---

## 🎨 Features

- **Real-time monitoring** (3s refresh)
- **Portrait mode** (90° rotation for vertical displays)
- **Dark theme** (OLED optimized)
- **No backend needed** (runs via Supabase Edge Function)

---

## 🔧 Configuration

Click **"Configure Server"** in the dashboard footer to change:
- Server IP
- Service ports

Settings are saved in your browser.

---

## 🐛 Troubleshooting

### No Docker containers showing?
→ Enable Docker Remote API (see Step 2)

### No qBittorrent data?
→ Check Web UI is enabled and accessible at port 8080

### No Jellyfin sessions?
→ Verify Jellyfin is running on port 8096

### Test endpoints manually:
```bash
curl http://10.6.3.70:8080/api/v2/transfer/info
curl http://10.6.3.70:2375/containers/json
curl http://10.6.3.70:8096/Sessions
```

---

## 🔒 Security Note

Docker Remote API (port 2375) is **unencrypted**. Only use on trusted networks!

For better security:
- Use firewall rules to restrict access
- Access via VPN when remote
- Don't expose to internet

---

## 📚 More Info

See `MEDIA_DASHBOARD.md` for complete documentation including:
- Detailed API specs
- Advanced configuration
- Backend implementation examples
- Security best practices

---

**Your dashboard is ready! Just enable Docker Remote API and start monitoring.** 🎉
