import axios from 'axios';
import { useEffect } from 'react';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice';

const useGetMyShop = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/shop/get-my-shop`, {
          withCredentials: true,
        });
        // console.log('result getCurrentUser', result);
        dispatch(setMyShopData(result.data));
      } catch (error) {
        console.error('error fetching user', error);
      }
    };
    fetchShop();
  }, [userData]);
};

export default useGetMyShop;
