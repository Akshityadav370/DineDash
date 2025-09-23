import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setItemsInMyCity } from '../redux/userSlice';
import { serverUrl } from '../App';

const useGetItemsInCity = () => {
  const dispatch = useDispatch();
  const { city } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!city) return;
        const result = await axios.get(
          `${serverUrl}/api/item/get-by-city/${city}`,
          {
            withCredentials: true,
          }
        );
        // console.log('result getCurrentUser', result);
        dispatch(setItemsInMyCity(result.data));
      } catch (error) {
        console.error('error fetching user', error);
      }
    };
    fetchUser();
  }, [city]);
};

export default useGetItemsInCity;
