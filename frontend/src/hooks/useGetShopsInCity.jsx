import axiosInstance from '../utils/axiosConfig';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setShopsInMyCity } from '../redux/userSlice';

const useGetShopsInCity = () => {
  const dispatch = useDispatch();
  const { city } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchShopsInCity = async () => {
      try {
        if (!city) return;
        const result = await axiosInstance.get(`/api/shop/get-by-city/${city}`);
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
