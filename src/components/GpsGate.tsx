import { FC, PropsWithChildren, useState } from "react";
import useGeolocation, { EnrichedGeolocationCoordinates } from "react-hook-geolocation";
import LocationContext, { defaultLocation } from "../utils/contexts/location";

const GpsGate: FC<PropsWithChildren> = ({ children }) => {
	const [askLocation, setAskLocation] = useState(true);
	const [location, setLocation] = useState<EnrichedGeolocationCoordinates>(defaultLocation);

	useGeolocation({}, (loc) => {
		setLocation(loc);
		setAskLocation(false);
	}, askLocation);

	return !location.error ? (
		<LocationContext.Provider value={location}>
			{children}
		</LocationContext.Provider>
	) : (
		<div className="flex flex-col items-center justify-center h-full w-full">
			<h2 className="text-3xl text-center">You need to enable location permission to use Sundial</h2>	
		</div>
	);
};

export default GpsGate;
