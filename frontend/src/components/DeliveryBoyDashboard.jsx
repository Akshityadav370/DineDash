import { useSelector } from 'react-redux';
import { useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { useEffect } from 'react';

const DeliveryBoyDashboard = () => {
  const { userData } = useSelector((state) => state.user);
  const [availableAssignments, setAvailableAssignments] = useState(null);

  const fetchMyAssignments = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`, {
        withCredentials: true,
      });
      setAvailableAssignments(result.data);
    } catch (error) {
      console.error('error fetching delivery assignments', error);
    }
  };

  useEffect(() => {
    fetchMyAssignments();
  }, [userData]);

  return (
    <div className='w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto'>
      <div className='w-full max-w-[800px] flex flex-col gap-5 items-center'>
        <div className='bg-white rounded-2xl shadow-md p-5 flex flex-col justify-start items-center w-[90%] border border-orange-100 text-center gap-2'>
          <h1 className='text-xl font-bold text-[#ff4d2d] capitalize'>
            Welcome, {userData.fullName}
          </h1>
          <p className='text-[#ff4d2d] '>
            <span className='font-semibold'>Latitude:</span>{' '}
            {userData.location.coordinates[1]}{' '}
            <span className='font-semibold'>Longitude:</span>{' '}
            {userData.location.coordinates[0]}
          </p>
        </div>

        <div className='bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100'>
          <h1 className='text-lg font-bold mb-4 flex items-center gap-2'>
            Available Orders
          </h1>

          <div className='space-y-4'>
            {availableAssignments?.length > 0 ? (
              availableAssignments.map((a, index) => (
                <div
                  className='relative border rounded-lg p-4 flex justify-between items-baseline-last'
                  key={index}
                >
                  <div className='space-y-1'>
                    <p className='text-sm font-semibold'>{a?.shopName}</p>
                    <p className='text-sm text-gray-500 max-w-[80%]'>
                      <p className='font-semibold underline'>
                        Delivery Address:
                      </p>
                      {'\n'}
                      {a?.deliveryAddress.text}
                    </p>
                    <p className='text-xs text-gray-400'>
                      {a.items.length} items
                    </p>
                  </div>
                  <button
                    className='bg-orange-500 cursor-pointer text-white px-4 py-1 rounded-lg text-sm hover:bg-orange-600'
                    onClick={() => {}}
                  >
                    Accept
                  </button>
                  <p className='absolute top-4 right-5'>₹ {a.subtotal}.00</p>
                </div>
              ))
            ) : (
              <p className='text-gray-400 text-sm'>No Available Orders</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryBoyDashboard;
