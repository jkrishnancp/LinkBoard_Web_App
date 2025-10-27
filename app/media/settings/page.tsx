'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export default function MediaSettings() {
  const router = useRouter();
  const [endpoints, setEndpoints] = useState({
    vpn: '',
    qbittorrent: '',
    docker: '',
    jellyfin: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('media-endpoints');
    if (saved) {
      try {
        setEndpoints(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load endpoints', e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('media-endpoints', JSON.stringify(endpoints));
    alert('Settings saved!');
    router.push('/media');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Media Dashboard Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure API endpoints for your media server services
          </p>
        </div>

        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="vpn">VPN Status API Endpoint</Label>
            <Input
              id="vpn"
              type="url"
              value={endpoints.vpn}
              onChange={(e) => setEndpoints({ ...endpoints, vpn: e.target.value })}
              placeholder="https://your-server.com/api/vpn-status"
            />
            <p className="text-xs text-gray-500">
              Should return: {`{ "healthy": boolean, "ip": string }`}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qbittorrent">qBittorrent API Endpoint</Label>
            <Input
              id="qbittorrent"
              type="url"
              value={endpoints.qbittorrent}
              onChange={(e) => setEndpoints({ ...endpoints, qbittorrent: e.target.value })}
              placeholder="https://your-server.com/api/qbittorrent"
            />
            <p className="text-xs text-gray-500">
              Should return speeds, active count, and torrents array
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="docker">Docker Containers API Endpoint</Label>
            <Input
              id="docker"
              type="url"
              value={endpoints.docker}
              onChange={(e) => setEndpoints({ ...endpoints, docker: e.target.value })}
              placeholder="https://your-server.com/api/docker"
            />
            <p className="text-xs text-gray-500">
              Should return: {`{ "containers": [{ "name": string, "running": boolean }] }`}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jellyfin">Jellyfin Sessions API Endpoint</Label>
            <Input
              id="jellyfin"
              type="url"
              value={endpoints.jellyfin}
              onChange={(e) => setEndpoints({ ...endpoints, jellyfin: e.target.value })}
              placeholder="https://your-server.com/api/jellyfin"
            />
            <p className="text-xs text-gray-500">
              Should return sessions array with user, title, progress, remaining
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} className="flex-1">
              Save Settings
            </Button>
            <Button variant="outline" onClick={() => router.push('/media')}>
              Cancel
            </Button>
          </div>
        </Card>

        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            📖 API Requirements
          </h3>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <p>
              <strong>VPN API:</strong> Returns connection status and public IP
            </p>
            <p>
              <strong>qBittorrent API:</strong> Returns download/upload speeds and active
              torrents
            </p>
            <p>
              <strong>Docker API:</strong> Returns list of containers with their running
              status
            </p>
            <p>
              <strong>Jellyfin API:</strong> Returns active playback sessions
            </p>
            <p className="pt-2 border-t border-blue-300 dark:border-blue-700">
              You need to create backend endpoints that fetch data from your services and
              return it in the expected format. See documentation for examples.
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <a
            href="/"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            ← Back to LinkBoard
          </a>
        </div>
      </div>
    </div>
  );
}
