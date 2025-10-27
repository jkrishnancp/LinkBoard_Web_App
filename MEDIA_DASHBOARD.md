# Media Server Dashboard

A specialized dashboard for monitoring your media server infrastructure in real-time.

## 🎯 Features

- **VPN Status** - Monitor VPN connection and public IP
- **qBittorrent Stats** - Track download/upload speeds and active torrents
- **Docker Containers** - View all container statuses
- **Jellyfin Sessions** - Monitor active media playback
- **Auto-Refresh** - Updates every 3 seconds
- **Portrait Mode** - 90° rotation support for vertical displays
- **Dark Theme** - Optimized for 24/7 monitoring

## 🚀 Quick Start

### Access the Dashboard

1. Open LinkBoard
2. Click "Media Dashboard" button in header
3. Or navigate to: `http://localhost:3000/media`

### Configure API Endpoints

Click "Configure APIs" in the footer or visit `/media/settings`:

```typescript
// Required API endpoints
{
  vpn: "https://your-server.com/api/vpn-status",
  qbittorrent: "https://your-server.com/api/qbittorrent",
  docker: "https://your-server.com/api/docker",
  jellyfin: "https://your-server.com/api/jellyfin"
}
```

## 📡 API Requirements

### 1. VPN Status API

**Endpoint:** GET `/api/vpn-status`

**Response:**
```json
{
  "healthy": true,
  "ip": "123.45.67.89"
}
```

### 2. qBittorrent API

**Endpoint:** GET `/api/qbittorrent`

**Response:**
```json
{
  "dl_speed": 5242880,
  "up_speed": 1048576,
  "active_count": 3,
  "torrents": [
    {
      "name": "Ubuntu 22.04 LTS",
      "progress": 0.75,
      "downloaded": 3221225472,
      "size": 4294967296,
      "dlspeed": 5242880,
      "eta": 300
    }
  ]
}
```

### 3. Docker Containers API

**Endpoint:** GET `/api/docker`

**Response:**
```json
{
  "containers": [
    {
      "name": "jellyfin",
      "running": true
    },
    {
      "name": "qbittorrent",
      "running": true
    }
  ]
}
```

### 4. Jellyfin Sessions API

**Endpoint:** GET `/api/jellyfin`

**Response:**
```json
{
  "sessions": [
    {
      "user": "John",
      "title": "Movie Title (2023)",
      "progress": 0.45,
      "remaining": 3600
    }
  ]
}
```

## 🛠️ Backend Implementation Examples

### Python (Flask) Example

```python
from flask import Flask, jsonify
import requests
import docker

app = Flask(__name__)

@app.route('/api/vpn-status')
def vpn_status():
    try:
        # Check VPN interface or endpoint
        ip = requests.get('https://api.ipify.org').text
        # Add VPN health check logic here
        return jsonify({"healthy": True, "ip": ip})
    except:
        return jsonify({"healthy": False, "ip": "Unknown"})

@app.route('/api/qbittorrent')
def qbittorrent():
    # Connect to qBittorrent API
    qb_url = "http://localhost:8080/api/v2"

    # Get transfer info
    transfer = requests.get(f"{qb_url}/transfer/info").json()

    # Get torrents
    torrents = requests.get(f"{qb_url}/torrents/info").json()

    active_torrents = [t for t in torrents if t['state'] == 'downloading']

    return jsonify({
        "dl_speed": transfer['dl_info_speed'],
        "up_speed": transfer['up_info_speed'],
        "active_count": len(active_torrents),
        "torrents": [{
            "name": t['name'],
            "progress": t['progress'],
            "downloaded": t['downloaded'],
            "size": t['size'],
            "dlspeed": t['dlspeed'],
            "eta": t['eta']
        } for t in active_torrents[:5]]  # Limit to 5
    })

@app.route('/api/docker')
def docker_containers():
    client = docker.from_env()
    containers = client.containers.list(all=True)

    return jsonify({
        "containers": [{
            "name": c.name,
            "running": c.status == 'running'
        } for c in containers]
    })

@app.route('/api/jellyfin')
def jellyfin_sessions():
    # Connect to Jellyfin API
    jellyfin_url = "http://localhost:8096"
    api_key = "your-api-key"

    headers = {"X-Emby-Token": api_key}
    sessions = requests.get(
        f"{jellyfin_url}/Sessions",
        headers=headers
    ).json()

    active = [s for s in sessions if s.get('NowPlayingItem')]

    return jsonify({
        "sessions": [{
            "user": s['UserName'],
            "title": s['NowPlayingItem']['Name'],
            "progress": s['PlayState'].get('PositionTicks', 0) /
                       s['NowPlayingItem']['RunTimeTicks'],
            "remaining": (s['NowPlayingItem']['RunTimeTicks'] -
                         s['PlayState'].get('PositionTicks', 0)) / 10000000
        } for s in active]
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

### Node.js (Express) Example

```javascript
const express = require('express');
const axios = require('axios');
const Docker = require('dockerode');

const app = express();
const docker = new Docker();

app.get('/api/vpn-status', async (req, res) => {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    res.json({ healthy: true, ip: response.data.ip });
  } catch (error) {
    res.json({ healthy: false, ip: 'Unknown' });
  }
});

app.get('/api/qbittorrent', async (req, res) => {
  const qbUrl = 'http://localhost:8080/api/v2';

  try {
    const [transfer, torrents] = await Promise.all([
      axios.get(`${qbUrl}/transfer/info`),
      axios.get(`${qbUrl}/torrents/info`)
    ]);

    const activeTorrents = torrents.data
      .filter(t => t.state === 'downloading')
      .slice(0, 5);

    res.json({
      dl_speed: transfer.data.dl_info_speed,
      up_speed: transfer.data.up_info_speed,
      active_count: activeTorrents.length,
      torrents: activeTorrents.map(t => ({
        name: t.name,
        progress: t.progress,
        downloaded: t.downloaded,
        size: t.size,
        dlspeed: t.dlspeed,
        eta: t.eta
      }))
    });
  } catch (error) {
    res.json({
      dl_speed: 0,
      up_speed: 0,
      active_count: 0,
      torrents: []
    });
  }
});

app.get('/api/docker', async (req, res) => {
  try {
    const containers = await docker.listContainers({ all: true });
    res.json({
      containers: containers.map(c => ({
        name: c.Names[0].replace('/', ''),
        running: c.State === 'running'
      }))
    });
  } catch (error) {
    res.json({ containers: [] });
  }
});

app.get('/api/jellyfin', async (req, res) => {
  const jellyfinUrl = 'http://localhost:8096';
  const apiKey = 'your-api-key';

  try {
    const response = await axios.get(`${jellyfinUrl}/Sessions`, {
      headers: { 'X-Emby-Token': apiKey }
    });

    const active = response.data
      .filter(s => s.NowPlayingItem)
      .map(s => ({
        user: s.UserName,
        title: s.NowPlayingItem.Name,
        progress: (s.PlayState.PositionTicks || 0) / s.NowPlayingItem.RunTimeTicks,
        remaining: (s.NowPlayingItem.RunTimeTicks - (s.PlayState.PositionTicks || 0)) / 10000000
      }));

    res.json({ sessions: active });
  } catch (error) {
    res.json({ sessions: [] });
  }
});

app.listen(5000, () => {
  console.log('Media API server running on port 5000');
});
```

## 🔧 Setup Instructions

### 1. Deploy Backend APIs

Choose one of the backend examples above and deploy it on your server:

```bash
# Python
pip install flask requests docker
python api_server.py

# Node.js
npm install express axios dockerode
node api_server.js
```

### 2. Configure LinkBoard

1. Visit `/media/settings`
2. Enter your API endpoint URLs
3. Click "Save Settings"
4. Navigate to `/media` to view dashboard

### 3. For Portrait Display (90° Rotation)

Click "Rotate 90°" in the footer to enable portrait mode. Perfect for:
- Raspberry Pi with portrait monitor
- Vertical TV/monitor setup
- Tablet in portrait orientation

## 🎨 Customization

### Update Refresh Interval

Edit `app/media/page.tsx`:

```typescript
// Change from 3000ms to your preferred interval
const interval = setInterval(fetchData, 5000); // 5 seconds
```

### Modify Layout

Edit grid layout in `app/media/page.tsx`:

```typescript
<div className="flex-1 grid grid-cols-2 gap-3 overflow-hidden">
  {/* Customize grid here */}
</div>
```

### Add Custom Widgets

Create new widgets in `components/media/`:

```typescript
// components/media/CustomWidget.tsx
export function CustomWidget({ data }: CustomWidgetProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      {/* Your custom widget */}
    </div>
  );
}
```

## 🐛 Troubleshooting

### Dashboard Shows "Loading..."

- Check browser console for errors
- Verify API endpoints are configured
- Test API endpoints manually with curl/Postman

### CORS Errors

Add CORS headers to your backend:

```python
# Flask
from flask_cors import CORS
CORS(app)

# Express
const cors = require('cors');
app.use(cors());
```

### Data Not Updating

- Check browser console for fetch errors
- Verify APIs return correct JSON format
- Check network tab in DevTools

### Portrait Mode Not Working

- Use modern browser (Chrome, Firefox, Edge)
- Check CSS transform support
- Try different rotation: Edit style in `app/media/page.tsx`

## 📊 Performance

- **Update Frequency:** 3 seconds (configurable)
- **API Calls:** 4 concurrent requests per refresh
- **Bundle Size:** ~15 KB additional to LinkBoard
- **RAM Usage:** Minimal (< 50 MB)

## 🔒 Security

- **API Authentication:** Add bearer tokens to your backend
- **HTTPS:** Use HTTPS for all API endpoints
- **CORS:** Restrict to your domain only
- **Rate Limiting:** Add rate limits to backend APIs

## 📝 Notes

- Dashboard uses localStorage for endpoint configuration
- No database required (same as LinkBoard)
- Real-time updates via polling (not WebSockets)
- Optimized for 24/7 display on Raspberry Pi
- Dark theme optimized for OLED displays

## 🎯 Use Cases

1. **Home Server Monitoring** - 24/7 dashboard for media server
2. **Network Operations** - Monitor VPN and download traffic
3. **Multi-user Tracking** - See who's watching what on Jellyfin
4. **Container Health** - Quick view of Docker services
5. **Torrent Progress** - Track active downloads

## 🚀 Future Enhancements

- [ ] WebSocket support for real-time updates
- [ ] Historical graphs and analytics
- [ ] Alert notifications
- [ ] Mobile app push notifications
- [ ] Multi-server support
- [ ] Custom widget builder

---

**Built with:** Next.js, React, TypeScript, Tailwind CSS

**Storage:** localStorage only (no database)

**License:** MIT
