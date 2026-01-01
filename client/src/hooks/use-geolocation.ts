import { useState, useEffect, useRef } from 'react';

interface GeoLocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  ready: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeoLocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    ready: false,
  });

  const watchId = useRef<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(s => ({ ...s, error: "Geolocation is not supported by your browser", ready: true }));
      return;
    }

    const success = (position: GeolocationPosition) => {
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        error: null,
        ready: true,
      });
    };

    const error = (err: GeolocationPositionError) => {
      setState(s => ({ ...s, error: err.message, ready: true }));
    };

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    watchId.current = navigator.geolocation.watchPosition(success, error, options);

    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  return state;
}
