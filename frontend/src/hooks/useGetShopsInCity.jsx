import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setShopsInMyCity } from '../redux/userSlice';
import { serverUrl } from '../constants/config';

const useGetShopsInCity = () => {
  const dispatch = useDispatch();
  const { city } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchShopsInCity = async () => {
      try {
        if (!city) return;
        const result = await axios.get(
          `${serverUrl}/api/shop/get-by-city/${city}`,
          {
            withCredentials: true,
          }
        );
        // console.log('result getCurrentUser', result);
        dispatch(setShopsInMyCity(result.data));
      } catch (error) {
        console.error('error fetching user', error);
      }
    };
    fetchShopsInCity();
  }, [city]);
};

export default useGetShopsInCity;
