import axios from 'axios';
import { useEffect } from 'react';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setDeliveryAssignments } from '../redux/userSlice';

const useGetMyDeliveryAssignments = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMyAssignments = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/order/get-assignments`,
          {
            withCredentials: true,
          }
        );
        dispatch(setDeliveryAssignments(result.data));
      } catch (error) {
        console.error('error fetching delivery assignments', error);
      }
    };
    fetchMyAssignments();
  }, [userData]);
};

export default useGetMyDeliveryAssignments;
