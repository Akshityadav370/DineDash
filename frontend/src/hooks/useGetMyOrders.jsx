import axios from 'axios';
import { useEffect } from 'react';
import { serverUrl } from '../constants/config';
import { useDispatch, useSelector } from 'react-redux';
import { setMyOrders } from '../redux/userSlice';

const useGetMyOrders = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/order/my-orders`, {
          withCredentials: true,
        });
        // console.log('result getCurrentUser', result);
        dispatch(setMyOrders(result.data));
      } catch (error) {
        console.error('error fetching user', error);
      }
    };
    fetchMyOrders();
  }, [userData]);
};

export default useGetMyOrders;
