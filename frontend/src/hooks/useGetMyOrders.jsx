import axiosInstance from '../utils/axiosConfig';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMyOrders } from '../redux/userSlice';

const useGetMyOrders = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const result = await axiosInstance.get('/api/order/my-orders');
        // console.log('result getCurrentUser', result);
        dispatch(setMyOrders(result.data));
      } catch (error) {
        console.error('error fetching my orders', error);
      }
    };
    fetchMyOrders();
  }, [userData]);
};

export default useGetMyOrders;
