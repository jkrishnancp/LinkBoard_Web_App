'use client';

import { useEffect, useState } from 'react';
import { VPNStatusWidget } from '@/components/media/VPNStatusWidget';
import { SpeedsWidget } from '@/components/media/SpeedsWidget';
import { DockerWidget } from '@/components/media/DockerWidget';
import { TorrentsWidget } from '@/components/media/TorrentsWidget';
import { JellyfinWidget } from '@/components/media/JellyfinWidget';

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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRotated, setIsRotated] = useState(false);
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.all([
          endpoints.vpn ? fetch(endpoints.vpn).then(r => r.json()).catch(() => ({ healthy: false, ip: 'Error' })) : Promise.resolve({ healthy: false, ip: 'Not configured' }),
          endpoints.qbittorrent ? fetch(endpoints.qbittorrent).then(r => r.json()).catch(() => ({ download: '0 B/s', upload: '0 B/s', active_count: 0, torrents: [] })) : Promise.resolve({ download: '0 B/s', upload: '0 B/s', active_count: 0, torrents: [] }),
          endpoints.docker ? fetch(endpoints.docker).then(r => r.json()).catch(() => ({ containers: [] })) : Promise.resolve({ containers: [] }),
          endpoints.jellyfin ? fetch(endpoints.jellyfin).then(r => r.json()).catch(() => ({ sessions: [] })) : Promise.resolve({ sessions: [] }),
        ]);

        setData({
          vpn: results[0],
          qbittorrent: results[1],
          containers: results[2].containers || [],
          jellyfin: results[3],
        });
      } catch (error) {
        console.error('Failed to fetch status:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [endpoints]);

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

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
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
              const newEndpoints = {
                vpn: prompt('VPN API endpoint:', endpoints.vpn) || endpoints.vpn,
                qbittorrent:
                  prompt('qBittorrent API endpoint:', endpoints.qbittorrent) ||
                  endpoints.qbittorrent,
                docker:
                  prompt('Docker API endpoint:', endpoints.docker) || endpoints.docker,
                jellyfin:
                  prompt('Jellyfin API endpoint:', endpoints.jellyfin) ||
                  endpoints.jellyfin,
              };
              setEndpoints(newEndpoints);
              localStorage.setItem('media-endpoints', JSON.stringify(newEndpoints));
            }}
            className="underline hover:text-gray-300"
          >
            Configure APIs
          </button>
        </footer>
      </div>
    </div>
  );
}
