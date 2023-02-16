import { GoogleMap, useJsApiLoader, GoogleMapProps, Marker } from '@react-google-maps/api';
import { env } from '../env.mjs';
import { FC, memo, useCallback, useState } from 'react';
import useLocation from '../utils/hooks/useLocation';

const MapTile: FC = () => {
  const location = useLocation();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => { 
    const bounds = new window.google.maps.LatLngBounds({
      lat: location.latitude,
      lng: location.longitude,
    });

    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '25vh' }}
        center={{ lat: location.latitude, lng: location.longitude }}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <Marker position={{ lat: location.latitude, lng: location.longitude }} />
      </GoogleMap>
  ) : <></>
}

export default memo(MapTile);
