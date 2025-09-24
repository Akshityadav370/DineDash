import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAddress, setCity, setState } from '../redux/userSlice';
import { setLocation, setMapAddress } from '../redux/mapSlice';

const useGetCity = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const apiKey = import.meta.env.VITE_GEOAPIFY_KEY;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      //   console.log(position);
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`
      );
      //   console.log(result);
      dispatch(
        setCity(
          result?.data?.results[0].city || result?.data?.results[0].county
        )
      );
      dispatch(setState(result?.data?.results[0].state));
      dispatch(
        setAddress(
          result?.data?.results[0].address_line1 +
            ', ' +
            result?.data?.results[0].address_line2
        )
      );
      dispatch(setLocation({ lat: latitude, lon: longitude }));
      dispatch(
        setMapAddress(
          result?.data?.results[0].address_line1 +
            ', ' +
            result?.data?.results[0].address_line2
        )
      );
    });
  }, [userData]);
};

export default useGetCity;
