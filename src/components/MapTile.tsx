import {
  GoogleMap,
  useJsApiLoader,
  GoogleMapProps,
  Marker,
} from "@react-google-maps/api";
import { env } from "../env.mjs";
import { FC, memo, useCallback, useState } from "react";

type MapTileProps = {
  lat: number;
  lon: number;
};

const MapTile: FC<MapTileProps> = ({ lat, lon }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds({
      lat,
      lng: lon,
    });

    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{
        width: "100%",
        height: "25vh",
        borderRadius: "0.375rem",
      }}
      center={{ lat, lng: lon }}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <Marker position={{ lat, lng: lon }} />
    </GoogleMap>
  ) : (
    <></>
  );
};

export default memo(MapTile);
