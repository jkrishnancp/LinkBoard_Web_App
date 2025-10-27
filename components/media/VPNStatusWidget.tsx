'use client';

interface VPNStatusWidgetProps {
  healthy: boolean;
  ip: string;
}

export function VPNStatusWidget({ healthy, ip }: VPNStatusWidgetProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`px-4 py-2 rounded-full font-bold text-sm tracking-wider border-2 ${
              healthy
                ? 'bg-green-500/20 text-green-500 border-green-500'
                : 'bg-red-500/20 text-red-500 border-red-500'
            }`}
          >
            {healthy ? 'VPN CONNECTÉ' : 'VPN DOWN'}
          </div>
          <div className="font-mono text-sm text-cyan-400 font-semibold">{ip}</div>
        </div>
      </div>
    </div>
  );
}
