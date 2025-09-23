import axios from 'axios';
import { useEffect } from 'react';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const useGetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
        });
        // console.log('result getCurrentUser', result);
        dispatch(setUserData(result.data));
      } catch (error) {
        console.error('error fetching user', error);
      }
    };
    fetchUser();
  }, []);
};

export default useGetCurrentUser;
