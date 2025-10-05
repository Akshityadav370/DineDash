import axiosInstance from '../utils/axiosConfig';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setItemsInMyCity } from '../redux/userSlice';

const useGetItemsInCity = () => {
  const dispatch = useDispatch();
  const { city } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchItemsInCity = async () => {
      try {
        if (!city) return;
        const result = await axiosInstance.get(`/api/item/get-by-city/${city}`);
        // console.log('result getCurrentUser', result);
        dispatch(setItemsInMyCity(result.data));
      } catch (error) {
        console.error('error fetching items in city', error);
      }
    };
    fetchItemsInCity();
  }, [city]);
};

export default useGetItemsInCity;
