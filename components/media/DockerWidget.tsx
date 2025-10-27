'use client';

interface Container {
  name: string;
  running: boolean;
}

interface DockerWidgetProps {
  containers: Container[];
}

export function DockerWidget({ containers }: DockerWidgetProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-lg overflow-y-auto max-h-[400px]">
      <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">
        Docker Containers
      </div>
      <div className="space-y-2">
        {containers.length === 0 ? (
          <div className="text-center text-gray-500 text-sm italic py-4">
            Aucun container
          </div>
        ) : (
          containers.map((container, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg"
            >
              <span className="text-sm font-medium text-gray-200">{container.name}</span>
              <span
                className={`text-xs px-2 py-1 rounded-full font-bold tracking-wide ${
                  container.running
                    ? 'bg-green-500/20 text-green-500'
                    : 'bg-red-500/20 text-red-500'
                }`}
              >
                {container.running ? 'UP' : 'DOWN'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
