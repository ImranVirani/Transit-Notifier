import { useEffect, useState, useMemo } from "react";
import { getDistance } from "geolib";
import { useStations } from "@/hooks/use-stations";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useNotifications } from "@/hooks/use-notifications";
import { StationCard } from "@/components/StationCard";
import { StatusIndicator } from "@/components/StatusIndicator";
import { PermissionBanner } from "@/components/PermissionBanner";
import { Loader2, Map, RefreshCw } from "lucide-react";

interface StationWithDistance {
  id: number;
  name: string;
  line: string;
  distance: number;
}

export default function Home() {
  const { data: stations, isLoading: isLoadingStations, error: stationsError } = useStations();
  const { latitude, longitude, error: geoError, ready: geoReady } = useGeolocation();
  const { permission, requestPermission, sendNotification } = useNotifications();
  
  // Track notifications to prevent spamming
  const [notifiedStations, setNotifiedStations] = useState<Set<number>>(new Set());
  
  // Calculate distances and sort
  const stationsWithDistance = useMemo(() => {
    if (!stations || !latitude || !longitude) return [];

    return stations.map(station => {
      const distance = getDistance(
        { latitude, longitude },
        { latitude: station.latitude, longitude: station.longitude }
      );
      return { ...station, distance };
    }).sort((a, b) => a.distance - b.distance);
  }, [stations, latitude, longitude]);

  const nearestStation = stationsWithDistance[0] || null;

  // Check for notification triggers
  useEffect(() => {
    if (!nearestStation) return;

    // Trigger zone: 50 meters
    if (nearestStation.distance <= 50) {
      if (!notifiedStations.has(nearestStation.id)) {
        sendNotification(
          "Arriving at Station",
          `You are within 50m of ${nearestStation.name} Station`
        );
        setNotifiedStations(prev => new Set(prev).add(nearestStation.id));
      }
    } else {
      // Reset notification if we move away (e.g. > 100m) so we can be notified again on return
      if (nearestStation.distance > 100 && notifiedStations.has(nearestStation.id)) {
        setNotifiedStations(prev => {
          const next = new Set(prev);
          next.delete(nearestStation.id);
          return next;
        });
      }
    }
  }, [nearestStation, sendNotification, notifiedStations]);

  if (isLoadingStations) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium animate-pulse">Loading transit data...</p>
        </div>
      </div>
    );
  }

  if (stationsError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-destructive/10 text-destructive p-6 rounded-2xl max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">Connection Error</h2>
          <p>Failed to load station data. Please check your connection and try again.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-background border border-destructive/20 rounded-lg font-semibold hover:bg-destructive/5"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-safe-bottom">
      <PermissionBanner status={permission} onRequest={requestPermission} />
      
      <main className="max-w-md mx-auto px-4 pb-8 safe-area-top">
        {/* Header */}
        <header className="py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Map className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">TTC Tracker</h1>
              <p className="text-xs text-muted-foreground font-medium">Proximity Alerts</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
             {!geoReady ? (
               <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
             ) : (
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             )}
             <span className="text-xs font-mono text-muted-foreground">GPS ACTIVE</span>
          </div>
        </header>

        {/* Hero Status */}
        <div className="mb-8">
          <StatusIndicator 
            distance={nearestStation?.distance ?? null} 
            loading={!geoReady && !geoError}
            error={geoError}
          />
        </div>

        {/* Nearest Station Main Card */}
        {nearestStation && (
          <div className="mb-8 animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
              Nearest Station
            </h2>
            <StationCard 
              name={nearestStation.name}
              line={nearestStation.line}
              distance={nearestStation.distance}
              isNearest={true}
            />
          </div>
        )}

        {/* Other Nearby Stations */}
        {stationsWithDistance.length > 1 && (
          <div className="space-y-4 animate-in slide-in-from-bottom-8 duration-700 delay-100">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Nearby
              </h2>
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                {stationsWithDistance.length - 1} found
              </span>
            </div>
            
            <div className="grid gap-3">
              {stationsWithDistance.slice(1, 6).map((station) => (
                <StationCard
                  key={station.id}
                  name={station.name}
                  line={station.line}
                  distance={station.distance}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State / No Signal */}
        {stationsWithDistance.length === 0 && geoReady && !geoError && (
          <div className="text-center py-12 px-4 border-2 border-dashed border-border rounded-2xl bg-slate-50">
            <RefreshCw className="w-8 h-8 mx-auto text-muted-foreground mb-3 animate-spin-slow" />
            <h3 className="font-bold text-lg mb-1">No Stations Found</h3>
            <p className="text-muted-foreground text-sm">
              We couldn't locate any nearby stations based on your current coordinates.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
