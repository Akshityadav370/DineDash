import axiosInstance from '../utils/axiosConfig';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

function useUpdateLocation() {
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const updateLocation = async (lat, lon) => {
      await axiosInstance.post('/api/user/update-location', { lat, lon });
      //   console.log(result.data);
    };

    let watchId = navigator.geolocation.watchPosition((pos) => {
      updateLocation(pos.coords.latitude, pos.coords.longitude);
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [userData]);
}

export default useUpdateLocation;
