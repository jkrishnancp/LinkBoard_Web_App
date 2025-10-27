'use client';

interface SpeedsWidgetProps {
  download: string;
  upload: string;
  activeCount: number;
}

export function SpeedsWidget({ download, upload, activeCount }: SpeedsWidgetProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-lg">
      <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">
        Vitesses
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
            Download
          </span>
          <span className="text-lg font-bold text-cyan-400">{download}</span>
        </div>
        <div className="flex justify-between items-center px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
            Upload
          </span>
          <span className="text-lg font-bold text-orange-400">{upload}</span>
        </div>
        <div className="flex justify-between items-center px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
            Torrents actifs
          </span>
          <span className="text-lg font-bold text-green-500">{activeCount}</span>
        </div>
      </div>
    </div>
  );
}
