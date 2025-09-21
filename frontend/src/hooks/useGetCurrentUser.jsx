import axios from 'axios';
import { useEffect } from 'react';
import { serverUrl } from '../App';

const useGetCurrentUser = () => {
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
        });
        console.log('result getCurrentUser', result);
      } catch (error) {
        console.error('error fetching user', error);
      }
    };
    fetchUser();
  }, []);
};

export default useGetCurrentUser;
