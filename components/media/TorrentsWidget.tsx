'use client';

interface Torrent {
  name: string;
  progress: number;
  downloaded: string;
  size: string;
  dl_speed: string;
  eta: string;
}

interface TorrentsWidgetProps {
  torrents: Torrent[];
}

export function TorrentsWidget({ torrents }: TorrentsWidgetProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-lg overflow-y-auto max-h-[300px]">
      <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">
        Téléchargements en cours
      </div>
      {torrents.length === 0 ? (
        <div className="text-center text-gray-500 text-sm italic py-4">
          Aucun téléchargement en cours
        </div>
      ) : (
        <div className="space-y-3">
          {torrents.map((torrent, index) => (
            <div
              key={index}
              className="bg-gray-950 border border-gray-800 rounded-lg p-3"
            >
              <div className="flex justify-between items-center mb-2">
                <span
                  className="text-sm font-semibold text-gray-200 truncate flex-1"
                  title={torrent.name}
                >
                  {torrent.name}
                </span>
                <span className="text-sm font-bold text-orange-500 ml-3">
                  {torrent.eta}
                </span>
              </div>
              <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-orange-400 transition-all duration-300"
                  style={{ width: `${torrent.progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  📦 {torrent.downloaded} / {torrent.size}
                </span>
                <span className="flex items-center gap-1">⚡ {torrent.dl_speed}</span>
                <span className="flex items-center gap-1">📊 {torrent.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
