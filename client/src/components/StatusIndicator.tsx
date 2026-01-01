import { AlertCircle, CheckCircle2, Navigation } from "lucide-react";

interface StatusIndicatorProps {
  distance: number | null;
  loading: boolean;
  error?: string | null;
}

export function StatusIndicator({ distance, loading, error }: StatusIndicatorProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"></div>
          <div className="relative bg-blue-100 p-4 rounded-full text-blue-600">
            <Navigation className="w-8 h-8 animate-pulse" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Locating...</h2>
          <p className="text-slate-500">Finding nearest station</p>
        </div>
      </div>
    );
  }

  if (error || distance === null) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center space-y-3">
        <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-red-600">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-red-900">Signal Lost</h2>
        <p className="text-red-700 text-sm">{error || "Could not determine location"}</p>
      </div>
    );
  }

  // Visual states based on distance
  let state = {
    color: "bg-slate-100 text-slate-900",
    ringColor: "ring-slate-200",
    icon: <MapPin className="w-8 h-8" />,
    label: "Roaming",
    subtext: "Searching for signals..."
  };

  if (distance < 50) {
    state = {
      color: "bg-green-500 text-white shadow-lg shadow-green-500/30",
      ringColor: "ring-green-200",
      icon: <CheckCircle2 className="w-10 h-10 animate-bounce" />,
      label: "Arrived",
      subtext: "You are at the station"
    };
  } else if (distance < 500) {
    state = {
      color: "bg-amber-400 text-white shadow-lg shadow-amber-400/30",
      ringColor: "ring-amber-200",
      icon: <Navigation className="w-10 h-10" />,
      label: "Approaching",
      subtext: "Station is nearby"
    };
  } else {
    state = {
      color: "bg-blue-500 text-white shadow-lg shadow-blue-500/30",
      ringColor: "ring-blue-200",
      icon: <Navigation className="w-8 h-8" />,
      label: "En Route",
      subtext: "Head towards a station"
    };
  }

  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-6">
      <div className={`relative ${distance < 500 ? 'animate-pulse-ring' : ''}`}>
        <div className={`
          w-24 h-24 rounded-full flex items-center justify-center
          transition-all duration-500 transform
          ${state.color}
        `}>
          {state.icon}
        </div>
      </div>
      
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-bold tracking-tight">{state.label}</h2>
        <p className="text-muted-foreground font-medium">{state.subtext}</p>
      </div>
    </div>
  );
}
