import { FC, PropsWithChildren, useState } from "react";
import useGeolocation, {
  EnrichedGeolocationCoordinates,
} from "react-hook-geolocation";
import LocationContext, { defaultLocation } from "../utils/contexts/location";

const GpsGate: FC<PropsWithChildren> = ({ children }) => {
  const [askLocation, setAskLocation] = useState(true);
  const [location, setLocation] =
    useState<EnrichedGeolocationCoordinates>(defaultLocation);

  useGeolocation(
    {
      enableHighAccuracy: true,
    },
    (loc) => {
      setLocation(loc);
      setAskLocation(false);
    },
    askLocation
  );

  return !location.error ? (
    <LocationContext.Provider value={location}>
      {children}
    </LocationContext.Provider>
  ) : (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h2 className="text-center text-3xl">
        You need to enable location permission to use Sundial
      </h2>
    </div>
  );
};

export default GpsGate;
