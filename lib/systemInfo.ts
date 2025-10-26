export type WidgetType =
  | 'local-ip'
  | 'public-ip'
  | 'datetime'
  | 'uptime'
  | 'battery'
  | 'network'
  | 'performance';

export interface SystemWidget {
  id: string;
  type: WidgetType;
  customName?: string;
  enabled: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  i: string;
}

export interface SystemInfoData {
  localIP?: string;
  publicIP?: string;
  currentTime: Date;
  uptime?: number;
  battery?: {
    level: number;
    charging: boolean;
  };
  network?: {
    online: boolean;
    effectiveType?: string;
  };
  performance?: {
    memory?: number;
    memoryLimit?: number;
  };
}

export async function getLocalIP(): Promise<string | null> {
  try {
    const pc = new RTCPeerConnection({ iceServers: [] });
    pc.createDataChannel('');

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    return new Promise((resolve) => {
      pc.onicecandidate = (ice) => {
        if (!ice || !ice.candidate || !ice.candidate.candidate) {
          resolve(null);
          return;
        }

        const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
        const match = ipRegex.exec(ice.candidate.candidate);

        if (match) {
          resolve(match[1]);
          pc.close();
        }
      };

      setTimeout(() => {
        resolve(null);
        pc.close();
      }, 2000);
    });
  } catch (error) {
    console.error('Error getting local IP:', error);
    return null;
  }
}

export async function getPublicIP(): Promise<string | null> {
  try {
    const response = await fetch('https://api.ipify.org?format=json', {
      signal: AbortSignal.timeout(5000),
    });
    const data = await response.json();
    return data.ip || null;
  } catch (error) {
    console.error('Error getting public IP:', error);
    return null;
  }
}

export function getBatteryInfo(): Promise<{ level: number; charging: boolean } | null> {
  return new Promise((resolve) => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        resolve({
          level: Math.round(battery.level * 100),
          charging: battery.charging,
        });
      }).catch(() => resolve(null));
    } else {
      resolve(null);
    }
  });
}

export function getNetworkInfo(): { online: boolean; effectiveType?: string } {
  const online = navigator.onLine;
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

  return {
    online,
    effectiveType: connection?.effectiveType,
  };
}

export function getPerformanceInfo(): { memory?: number; memoryLimit?: number } {
  const performance = (window.performance as any);

  if (performance.memory) {
    return {
      memory: performance.memory.usedJSHeapSize,
      memoryLimit: performance.memory.jsHeapSizeLimit,
    };
  }

  return {};
}

export function getUptimeSeconds(): number {
  return Math.floor(performance.now() / 1000);
}

export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export const WIDGET_METADATA: Record<WidgetType, { title: string; description: string; icon: string }> = {
  'local-ip': {
    title: 'Local IP Address',
    description: 'Your device\'s local network IP address',
    icon: 'network',
  },
  'public-ip': {
    title: 'Public IP Address',
    description: 'Your public-facing IP address',
    icon: 'globe',
  },
  'datetime': {
    title: 'Date & Time',
    description: 'Current date and time',
    icon: 'clock',
  },
  'uptime': {
    title: 'Session Uptime',
    description: 'How long your browser session has been active',
    icon: 'timer',
  },
  'battery': {
    title: 'Battery Status',
    description: 'Current battery level and charging status',
    icon: 'battery',
  },
  'network': {
    title: 'Network Status',
    description: 'Connection status and type',
    icon: 'signal',
  },
  'performance': {
    title: 'Memory Usage',
    description: 'Current JavaScript heap memory usage',
    icon: 'chart',
  },
};
