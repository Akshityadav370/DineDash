import { useSelector } from 'react-redux';
import { useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../constants/config';
import { useEffect } from 'react';
import DeliveryBoyTracking from './DeliveryBoyTracking';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';

const DeliveryBoyDashboard = () => {
  const { userData, socket } = useSelector((state) => state.user);
  const [availableAssignments, setAvailableAssignments] = useState(null);
  const [currentOrder, setCurrentOrder] = useState();
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null);
  const [otp, setOtp] = useState();
  const [todayDeliveries, setTodayDeliveries] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const ratePerDelivery = 50;
  const totalEarning = todayDeliveries.reduce(
    (sum, d) => sum + d.count * ratePerDelivery,
    0
  );

  const fetchMyAssignments = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`, {
        withCredentials: true,
      });
      setAvailableAssignments(result.data);
    } catch (error) {
      console.error('Error fetching delivery assignments', error);
    }
  };

  const getCurrentOrder = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-my-current-order`,
        { withCredentials: true }
      );
      setCurrentOrder(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptOrder = async (assignmentId) => {
    try {
      await axios.get(`${serverUrl}/api/order/accept-order/${assignmentId}`, {
        withCredentials: true,
      });
      await getCurrentOrder();
    } catch (error) {
      console.error('Error accepting order', error);
    }
  };

  const sendOtp = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/order/send-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
        },
        { withCredentials: true }
      );
      toast.success('OTP sent to user mail!');
      setShowOtpBox(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setMessage('');
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/verify-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
          otp,
        },
        { withCredentials: true }
      );
      setMessage(result.data.message);
      location.reload();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getTodayDeliveries = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-today-deliveries`,
        { withCredentials: true }
      );
      setTodayDeliveries(result.data);
    } catch (error) {
      console.log('Error sending otp', error);
    }
  };

  useEffect(() => {
    fetchMyAssignments();
    getCurrentOrder();
    getTodayDeliveries();
  }, [userData]);

  useEffect(() => {
    socket.on('newAssignment', (data) => {
      setAvailableAssignments((prev) => [...prev, data]);
    });
    return () => {
      socket.off('newAssignment');
    };
  }, [socket]);

  useEffect(() => {
    if (userData.role !== 'deliveryBoy' || !socket) return;

    let watchId;
    if (navigator.geolocation) {
      (watchId = navigator.geolocation.watchPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setDeliveryBoyLocation({ lat: latitude, lon: longitude });
        socket.emit('updateLocation', {
          latitude,
          longitude,
          userId: userData._id,
        });
      })),
        (error) => {
          console.log(error);
        },
        {
          enableHighAccuracy: true,
        };
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [socket, userData]);

  return (
    <div className='w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto'>
      <div className='w-full max-w-[800px] flex flex-col gap-5 items-center'>
        <div className='bg-white rounded-2xl shadow-md p-5 flex flex-col justify-start items-center w-[90%] border border-orange-100 text-center gap-2'>
          <h1 className='text-xl font-bold text-[#ff4d2d] capitalize'>
            Welcome, {userData.fullName}
          </h1>
          <p className='text-[#ff4d2d] '>
            <span className='font-semibold'>Latitude:</span>{' '}
            {deliveryBoyLocation?.lat},{' '}
            <span className='font-semibold'>Longitude:</span>{' '}
            {deliveryBoyLocation?.lon}
          </p>
        </div>
        <div className='bg-white rounded-2xl shadow-md p-5 w-[90%] mb-6 border border-orange-100'>
          <h1 className='text-lg font-bold mb-3 text-[#ff4d2d] '>
            Today Deliveries
          </h1>

          <ResponsiveContainer width='100%' height={200}>
            <BarChart data={todayDeliveries}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='hour' tickFormatter={(h) => `${h}:00`} />
              <YAxis allowDecimals={false} />
              <Tooltip
                formatter={(value) => [value, 'orders']}
                labelFormatter={(label) => `${label}:00`}
              />
              <Bar dataKey='count' fill='#ff4d2d' />
            </BarChart>
          </ResponsiveContainer>

          <div className='max-w-sm mx-auto mt-6 p-6 bg-white rounded-2xl shadow-lg text-center'>
            <h1 className='text-xl font-semibold text-gray-800 mb-2'>
              Today's Earning
            </h1>
            <span className='text-3xl font-bold text-green-600'>
              ₹{totalEarning}
            </span>
          </div>
        </div>
        {!currentOrder && (
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
                      className='bg-orange-500 cursor-pointer text-white px-4 py-1 rounded-lg text-sm hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-600'
                      onClick={() => acceptOrder(a.assignmentId)}
                      disabled={currentOrder}
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
        )}

        {currentOrder && (
          <>
            <div className='bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100'>
              <h2 className='text-lg font-bold mb-3'>📦 Current Order</h2>
              <div className='border rounded-lg p-4 mb-3 relative'>
                <p className='font-semibold text-sm mb-1'>
                  {currentOrder?.shopOrder.shop.name}
                </p>
                <p className='text-sm text-gray-500'>
                  {currentOrder.deliveryAddress.text}
                </p>
                <p className='text-xs text-gray-400'>
                  {currentOrder.shopOrder.shopOrderItems.length} items
                  {/* {currentOrder.shopOrder.subtotal} */}
                </p>
                <p className='absolute top-2 right-2 text-sm'>
                  ₹ {currentOrder.shopOrder.subtotal}.00
                </p>
              </div>
              <DeliveryBoyTracking
                data={{
                  deliveryBoyLocation: deliveryBoyLocation || {
                    lat: userData.location.coordinates[1],
                    lon: userData.location.coordinates[0],
                  },
                  customerLocation: {
                    lat: currentOrder.deliveryAddress.latitude,
                    lon: currentOrder.deliveryAddress.longitude,
                  },
                }}
              />
              {!showOtpBox ? (
                <button
                  className='mt-4 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-green-600 active:scale-95 transition-all duration-200'
                  onClick={sendOtp}
                  disabled={loading}
                >
                  {loading ? (
                    <ClipLoader size={20} color='white' />
                  ) : (
                    'Mark As Delivered'
                  )}
                </button>
              ) : (
                <div className='mt-4 p-4 border rounded-xl bg-gray-50'>
                  <p className='text-sm font-semibold mb-2'>
                    Enter Otp send to{' '}
                    <span className='text-orange-500 capitalize'>
                      {currentOrder.user.fullName}
                    </span>
                  </p>
                  <input
                    type='text'
                    className='w-full border px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400'
                    placeholder='Enter OTP'
                    onChange={(e) => setOtp(e.target.value)}
                    value={otp}
                  />
                  {message && (
                    <p className='text-center text-green-400 text-2xl mb-4'>
                      {message}
                    </p>
                  )}

                  <button
                    className='w-full cursor-pointer bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all'
                    onClick={verifyOtp}
                    disabled={loading}
                  >
                    Submit OTP
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DeliveryBoyDashboard;
