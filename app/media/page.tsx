'use client';

import { useEffect, useState } from 'react';
import { VPNStatusWidget } from '@/components/media/VPNStatusWidget';
import { SpeedsWidget } from '@/components/media/SpeedsWidget';
import { DockerWidget } from '@/components/media/DockerWidget';
import { TorrentsWidget } from '@/components/media/TorrentsWidget';
import { JellyfinWidget } from '@/components/media/JellyfinWidget';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

interface MediaStatus {
  vpn: {
    healthy: boolean;
    ip: string;
  };
  qbittorrent: {
    download: string;
    upload: string;
    active_count: number;
    torrents: Array<{
      name: string;
      progress: number;
      downloaded: string;
      size: string;
      dl_speed: string;
      eta: string;
    }>;
  };
  containers: Array<{
    name: string;
    running: boolean;
  }>;
  jellyfin: {
    sessions: Array<{
      user: string;
      title: string;
      progress: number;
      remaining: string;
    }>;
  };
}

export default function MediaDashboard() {
  const [data, setData] = useState<MediaStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRotated, setIsRotated] = useState(false);
  const [serverConfig, setServerConfig] = useState({
    ip: '10.6.3.70',
    qbport: '8080',
    dockerport: '2375',
    jellyfinport: '8096',
  });

  useEffect(() => {
    const saved = localStorage.getItem('media-server-config');
    if (saved) {
      try {
        setServerConfig(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load config', e);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
          setError('Supabase configuration missing. Please check your .env file.');
          setIsLoading(false);
          return;
        }

        const params = new URLSearchParams({
          ip: serverConfig.ip,
          qbport: serverConfig.qbport,
          dockerport: serverConfig.dockerport,
          jellyfinport: serverConfig.jellyfinport,
        });

        const apiUrl = `${SUPABASE_URL}/functions/v1/media-status?${params.toString()}`;

        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const json = await response.json();
          setData(json);
          setError(null);
          setIsLoading(false);
        } else {
          const errorText = await response.text();
          setError(`API error (${response.status}): ${errorText}`);
          setIsLoading(false);
          console.error('API error:', response.status, errorText);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setError(`Failed to fetch status: ${errorMessage}`);
        setIsLoading(false);
        console.error('Failed to fetch status:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [serverConfig]);

  const timeString = currentTime.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const dateString = currentTime.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-8">
        <div className="max-w-2xl text-center">
          <div className="text-red-500 text-2xl font-bold mb-4">Dashboard Error</div>
          <div className="text-white text-lg mb-6">{error}</div>
          <div className="space-y-4 text-left bg-gray-900 p-6 rounded-lg">
            <div className="text-yellow-400 font-semibold">Troubleshooting Steps:</div>
            <ol className="text-gray-300 space-y-2 list-decimal list-inside">
              <li>Verify your server at {serverConfig.ip} is accessible</li>
              <li>Check that services are running on the configured ports</li>
              <li>Ensure Docker Remote API is enabled (port {serverConfig.dockerport})</li>
              <li>Test endpoints manually or check browser console for details</li>
            </ol>
          </div>
          <div className="mt-6 space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
            <a
              href="/media/settings"
              className="inline-block px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Configure Settings
            </a>
            <a
              href="/"
              className="inline-block px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Back to LinkBoard
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Loading Media Dashboard...</div>
          <div className="text-gray-500 text-sm">Connecting to {serverConfig.ip}</div>
          <div className="mt-4">
            <div className="inline-block w-8 h-8 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-black text-white ${
        isRotated ? 'rotate-90' : ''
      }`}
      style={
        isRotated
          ? {
              transformOrigin: 'center center',
              width: '100vh',
              height: '100vw',
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginLeft: '-50vh',
              marginTop: '-50vw',
            }
          : {}
      }
    >
      <div className="h-screen flex flex-col p-3 gap-3">
        <header className="text-center bg-gray-900 border border-gray-800 rounded-xl p-3 shadow-lg">
          <h1 className="text-2xl font-bold tracking-[0.3em] mb-1 bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">
            HOME
          </h1>
          <div className="text-4xl font-light tracking-wider my-1">{timeString}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            {dateString.charAt(0).toUpperCase() + dateString.slice(1)}
          </div>
        </header>

        <div className="flex-1 grid grid-cols-2 gap-3 overflow-hidden">
          <div className="col-span-2">
            <VPNStatusWidget healthy={data.vpn.healthy} ip={data.vpn.ip} />
          </div>

          <SpeedsWidget
            download={data.qbittorrent.download}
            upload={data.qbittorrent.upload}
            activeCount={data.qbittorrent.active_count}
          />

          <DockerWidget containers={data.containers} />

          <div className="col-span-2">
            <TorrentsWidget torrents={data.qbittorrent.torrents} />
          </div>

          <div className="col-span-2">
            <JellyfinWidget sessions={data.jellyfin.sessions} />
          </div>
        </div>

        <footer className="text-center py-1 text-xs text-gray-500">
          <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse mr-2" />
          Pi4 • Auto-refresh: 3s •{' '}
          <button
            onClick={() => setIsRotated(!isRotated)}
            className="underline hover:text-gray-300"
          >
            {isRotated ? 'Normal' : 'Rotate 90°'}
          </button>
          {' • '}
          <button
            onClick={() => {
              const newConfig = {
                ip: prompt('Server IP:', serverConfig.ip) || serverConfig.ip,
                qbport: prompt('qBittorrent Port:', serverConfig.qbport) || serverConfig.qbport,
                dockerport: prompt('Docker Port:', serverConfig.dockerport) || serverConfig.dockerport,
                jellyfinport: prompt('Jellyfin Port:', serverConfig.jellyfinport) || serverConfig.jellyfinport,
              };
              setServerConfig(newConfig);
              localStorage.setItem('media-server-config', JSON.stringify(newConfig));
            }}
            className="underline hover:text-gray-300"
          >
            Configure Server
          </button>
        </footer>
      </div>
    </div>
  );
}
