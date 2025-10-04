import axiosInstance from '../utils/axiosConfig';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDeliveryAssignments } from '../redux/userSlice';

const useGetMyDeliveryAssignments = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMyAssignments = async () => {
      try {
        const result = await axiosInstance.get('/api/order/get-assignments');
        dispatch(setDeliveryAssignments(result.data));
      } catch (error) {
        console.error('error fetching delivery assignments', error);
      }
    };
    fetchMyAssignments();
  }, [userData]);
};

export default useGetMyDeliveryAssignments;
