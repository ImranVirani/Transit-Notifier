import { MapPin, Navigation } from "lucide-react";

interface StationCardProps {
  name: string;
  line: string;
  distance: number; // in meters
  isNearest?: boolean;
}

export function StationCard({ name, line, distance, isNearest = false }: StationCardProps) {
  // Determine color based on distance
  let statusColor = "bg-slate-100 border-slate-200 text-slate-600";
  let iconColor = "text-slate-400";
  
  if (distance < 50) {
    statusColor = "bg-green-50 border-green-200 text-green-900";
    iconColor = "text-green-600";
  } else if (distance < 500) {
    statusColor = "bg-amber-50 border-amber-200 text-amber-900";
    iconColor = "text-amber-500";
  } else if (isNearest) {
    statusColor = "bg-blue-50 border-blue-200 text-blue-900";
    iconColor = "text-blue-500";
  }

  return (
    <div 
      className={`
        relative p-4 rounded-xl border transition-all duration-300
        ${isNearest ? 'shadow-md scale-[1.02]' : 'shadow-sm hover:shadow-md hover:border-primary/20'}
        ${statusColor}
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-lg leading-tight mb-1">{name} Station</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-background/50 border border-black/5">
              {line}
            </span>
          </div>
        </div>
        
        <div className={`flex flex-col items-end ${iconColor}`}>
          <div className="bg-background/80 p-2 rounded-full shadow-sm mb-1">
            {isNearest ? <Navigation className="w-5 h-5 animate-pulse" /> : <MapPin className="w-5 h-5" />}
          </div>
        </div>
      </div>
      
      <div className="flex items-baseline gap-1 mt-2">
        <span className="text-2xl font-mono font-bold tracking-tight">
          {distance < 1000 ? Math.round(distance) : (distance / 1000).toFixed(1)}
        </span>
        <span className="text-sm opacity-70 font-medium">
          {distance < 1000 ? 'meters' : 'km'} away
        </span>
      </div>
    </div>
  );
}
