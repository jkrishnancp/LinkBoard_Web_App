import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Config {
  serverIP: string;
  qbittorrentPort: number;
  dockerPort: number;
  jellyfinPort: number;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B/s';
  const k = 1024;
  const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function formatTime(seconds: number): string {
  if (seconds === 0 || seconds === Infinity || seconds === 8640000) return '∞';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  const hours = Math.floor(seconds / 3600);
  const mins = Math.round((seconds % 3600) / 60);
  return `${hours}h ${mins}m`;
}

async function fetchVPNStatus(): Promise<{ healthy: boolean; ip: string }> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return {
      healthy: true,
      ip: data.ip,
    };
  } catch {
    return {
      healthy: false,
      ip: 'Unknown',
    };
  }
}

async function fetchQBittorrent(config: Config) {
  try {
    const baseUrl = `http://${config.serverIP}:${config.qbittorrentPort}/api/v2`;

    const [transferInfo, torrentsInfo] = await Promise.all([
      fetch(`${baseUrl}/transfer/info`).then(r => r.json()),
      fetch(`${baseUrl}/torrents/info`).then(r => r.json()),
    ]);

    const activeTorrents = torrentsInfo
      .filter((t: any) => t.state === 'downloading' || t.state === 'uploading' || t.state === 'stalledDL')
      .slice(0, 10)
      .map((t: any) => ({
        name: t.name,
        progress: Math.round(t.progress * 100),
        downloaded: formatBytes(t.downloaded),
        size: formatBytes(t.size),
        dl_speed: formatBytes(t.dlspeed),
        eta: formatTime(t.eta),
      }));

    return {
      download: formatBytes(transferInfo.dl_info_speed),
      upload: formatBytes(transferInfo.up_info_speed),
      active_count: activeTorrents.length,
      torrents: activeTorrents,
    };
  } catch (error) {
    console.error('qBittorrent error:', error);
    return {
      download: '0 B/s',
      upload: '0 B/s',
      active_count: 0,
      torrents: [],
    };
  }
}

async function fetchDocker(config: Config) {
  try {
    const response = await fetch(`http://${config.serverIP}:${config.dockerPort}/containers/json?all=true`);
    const containers = await response.json();

    return containers.map((c: any) => ({
      name: c.Names[0]?.replace('/', '') || c.Id.substring(0, 12),
      running: c.State === 'running',
    }));
  } catch (error) {
    console.error('Docker error:', error);
    return [];
  }
}

async function fetchJellyfin(config: Config) {
  try {
    const response = await fetch(
      `http://${config.serverIP}:${config.jellyfinPort}/Sessions`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );
    const sessions = await response.json();

    const activeSessions = sessions
      .filter((s: any) => s.NowPlayingItem)
      .map((s: any) => {
        const positionTicks = s.PlayState?.PositionTicks || 0;
        const runtimeTicks = s.NowPlayingItem?.RunTimeTicks || 1;
        const progress = (positionTicks / runtimeTicks) * 100;
        const remainingSeconds = (runtimeTicks - positionTicks) / 10000000;

        return {
          user: s.UserName || 'Unknown',
          title: s.NowPlayingItem?.Name || 'Unknown',
          progress: Math.round(progress),
          remaining: formatTime(remainingSeconds),
        };
      });

    return { sessions: activeSessions };
  } catch (error) {
    console.error('Jellyfin error:', error);
    return { sessions: [] };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const config: Config = {
      serverIP: url.searchParams.get('ip') || '10.6.3.70',
      qbittorrentPort: parseInt(url.searchParams.get('qbport') || '8080'),
      dockerPort: parseInt(url.searchParams.get('dockerport') || '2375'),
      jellyfinPort: parseInt(url.searchParams.get('jellyfinport') || '8096'),
    };

    const [vpn, qbittorrent, containers, jellyfin] = await Promise.all([
      fetchVPNStatus(),
      fetchQBittorrent(config),
      fetchDocker(config),
      fetchJellyfin(config),
    ]);

    const data = {
      vpn,
      qbittorrent,
      containers,
      jellyfin,
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(data), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});