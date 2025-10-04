import axios from 'axios';
import { useEffect } from 'react';
import { serverUrl } from '../constants/config';
import { useSelector } from 'react-redux';

function useUpdateLocation() {
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const updateLocation = async (lat, lon) => {
      await axios.post(
        `${serverUrl}/api/user/update-location`,
        { lat, lon },
        { withCredentials: true }
      );
      //   console.log(result.data);
    };

    navigator.geolocation.watchPosition((pos) => {
      updateLocation(pos.coords.latitude, pos.coords.longitude);
    });
  }, [userData]);
}

export default useUpdateLocation;
