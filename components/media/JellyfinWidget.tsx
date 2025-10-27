'use client';

interface JellyfinSession {
  user: string;
  title: string;
  progress: number;
  remaining: string;
}

interface JellyfinWidgetProps {
  sessions: JellyfinSession[];
}

export function JellyfinWidget({ sessions }: JellyfinWidgetProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-lg">
      <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">
        Jellyfin - En lecture
      </div>
      {sessions.length === 0 ? (
        <div className="text-center text-gray-500 text-sm italic py-4">
          Personne ne regarde rien actuellement
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session, index) => (
            <div
              key={index}
              className="bg-gray-950 border border-gray-800 rounded-lg p-3"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  👤 {session.user}
                </span>
                <span className="text-sm font-bold text-cyan-400">
                  ⏱ {session.remaining}
                </span>
              </div>
              <div className="text-sm font-semibold text-gray-200 mb-2">
                {session.title}
              </div>
              <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${session.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
