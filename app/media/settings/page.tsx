'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export default function MediaSettings() {
  const router = useRouter();
  const [config, setConfig] = useState({
    ip: '10.6.3.70',
    qbport: '8080',
    dockerport: '2375',
    jellyfinport: '8096',
  });

  useEffect(() => {
    const saved = localStorage.getItem('media-server-config');
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load config', e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('media-server-config', JSON.stringify(config));
    alert('Settings saved!');
    router.push('/media');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Media Server Configuration
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure your media server connection details
          </p>
        </div>

        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ip">Server IP Address</Label>
            <Input
              id="ip"
              type="text"
              value={config.ip}
              onChange={(e) => setConfig({ ...config, ip: e.target.value })}
              placeholder="10.6.3.70"
            />
            <p className="text-xs text-gray-500">
              IP address of your media server
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qbport">qBittorrent Port</Label>
            <Input
              id="qbport"
              type="text"
              value={config.qbport}
              onChange={(e) => setConfig({ ...config, qbport: e.target.value })}
              placeholder="8080"
            />
            <p className="text-xs text-gray-500">
              Default: 8080 (Web UI port)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dockerport">Docker API Port</Label>
            <Input
              id="dockerport"
              type="text"
              value={config.dockerport}
              onChange={(e) => setConfig({ ...config, dockerport: e.target.value })}
              placeholder="2375"
            />
            <p className="text-xs text-gray-500">
              Default: 2375 (Docker Remote API port - must be enabled)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jellyfinport">Jellyfin Port</Label>
            <Input
              id="jellyfinport"
              type="text"
              value={config.jellyfinport}
              onChange={(e) => setConfig({ ...config, jellyfinport: e.target.value })}
              placeholder="8096"
            />
            <p className="text-xs text-gray-500">
              Default: 8096 (Jellyfin web port)
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
            Service Requirements
          </h3>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <p>
              <strong>qBittorrent:</strong> Web UI at http://{config.ip}:{config.qbport}
            </p>
            <p>
              <strong>Docker:</strong> Remote API enabled on port {config.dockerport}
            </p>
            <p>
              <strong>Jellyfin:</strong> Accessible at http://{config.ip}:{config.jellyfinport}
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <a
            href="/"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            Back to LinkBoard
          </a>
        </div>
      </div>
    </div>
  );
}
