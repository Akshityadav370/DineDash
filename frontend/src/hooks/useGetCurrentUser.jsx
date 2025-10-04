import axiosInstance from '../utils/axiosConfig';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const useGetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axiosInstance.get('/api/user/current');
        // console.log('result getCurrentUser', result);
        dispatch(setUserData(result.data));
      } catch (error) {
        console.error('error fetching user', error);
        // Clear token if invalid
        localStorage.removeItem('token');
      }
    };
    fetchUser();
  }, [dispatch]);
};

export default useGetCurrentUser;
