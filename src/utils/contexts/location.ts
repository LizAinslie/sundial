import { createContext } from "react";
import { EnrichedGeolocationCoordinates } from "react-hook-geolocation";

export const defaultLocation: EnrichedGeolocationCoordinates = {
  speed: null,
  altitude: null,
  altitudeAccuracy: null,
  timestamp: null,
  error: { code: 1, message: 'Permission not yet granted' } as GeolocationPositionError,
  accuracy: 0,
  heading: null,
  latitude: 0,
  longitude: 0,
};

const LocationContext = createContext<EnrichedGeolocationCoordinates>(defaultLocation);

export default LocationContext;

