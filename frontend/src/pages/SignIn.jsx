import { useState } from 'react';
import { FaRegEye } from 'react-icons/fa';
import { FaRegEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../constants/config';
import Button from '../components/button';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { bgColor, borderColor, primaryColor } from '../utils/category';
import toast from 'react-hot-toast';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      //   console.log('google result', result);
      const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
        email: result.user.email,
      });
      console.log('data', data, JSON.stringify(data));

      // Store token in localStorage for cross-domain requests
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      dispatch(setUserData(data.user));
      setError(null);
      toast.success('Google signin successful');
    } catch (error) {
      setError(error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      console.log('result signin', result, JSON.stringify(result));
      setError('');

      // Store token in localStorage for cross-domain requests
      if (result.data.token) {
        localStorage.setItem('token', result.data.token);
      }

      dispatch(setUserData(result.data.user));
      toast.success('Signin successful');
    } catch (error) {
      // console.error('Error signin', error);
      setError(error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className='min-h-screen w-full flex items-center justify-center p-4 relative'
      style={{ backgroundColor: bgColor }}
    >
      <div
        className={`bg-white rouded-xl shadow-lg w-full max-w-md p-8 border-[1px]`}
        style={{ border: `1px solid ${borderColor}` }}
      >
        <h1
          className={`text-3xl font-bold mb-2 text-center`}
          style={{ color: primaryColor }}
        >
          DineDash
        </h1>
        <p className='text-gray-600 mb-8 text-center'>
          Login to your account to get started with delicious food deliveries
        </p>

        {/* Email */}
        <div className='mb-4'>
          <label
            htmlFor='email'
            className='block text-gray-700 font-medium mb-1'
          >
            Email
          </label>
          <input
            type='email'
            className='w-full border rouded-lg px-3 py-2 focus:outline-none focus:border-orange-500'
            placeholder='Enter your Email'
            style={{ border: `1px solid ${borderColor}` }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className='mb-4'>
          <label
            htmlFor='password'
            className='block text-gray-700 font-medium mb-1'
          >
            Password
          </label>
          <div className='relative'>
            <input
              type={`${showPassword ? 'text' : 'password'}`}
              className='w-full border rouded-lg px-3 py-2 focus:outline-none focus:border-orange-500'
              placeholder='Enter your Password'
              style={{ border: `1px solid ${borderColor}` }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-[12px] text-gray-500 cursor-pointer'
            >
              {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
        </div>
        <div
          className='text-right mb-4 text-[#ff4d2d] text-sm cursor-pointer'
          onClick={() => navigate('/forgot-password')}
        >
          Forgot Password
        </div>

        <Button text={'Sign In'} onSubmit={handleSignIn} loading={loading} />
        {error && (
          <p className='text-red-500 text-center my-[10px]'>*{error}</p>
        )}
        <button
          onClick={handleGoogleAuth}
          className='w-full mt-4 cursor-pointer flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 hover:bg-gray-100'
          disabled={loading}
        >
          <FcGoogle size={20} />
          <span>Sign In with Google</span>
        </button>
        <p
          className='text-center mt-6 cursor-pointer'
          onClick={() => navigate('/signup')}
        >
          Want to create a new Account ?{' '}
          <span className='text-[#ff4d2d]'>Sign Up</span>
        </p>
      </div>
      <div
        className={`hidden lg:block rounded-lg w-full max-w-md p-4 absolute top-10 left-5`}
      >
        <h3
          className='text-lg font-semibold mb-3'
          style={{ color: primaryColor }}
        >
          🚀 Project Features
        </h3>
        <ul className='space-y-2 text-sm'>
          <li className='flex items-start'>
            <span className='text-green-500 mr-2'>✓</span>
            <span>Role-based Authentication (Sign in & Sign up)</span>
          </li>
          <li className='flex items-start'>
            <span className='text-green-500 mr-2'>✓</span>
            <span>Google OAuth Integration</span>
          </li>
          <li className='flex items-start'>
            <span className='text-green-500 mr-2'>✓</span>
            <span>
              <strong>Forgot Password with OTP Verification</strong>
            </span>
          </li>
          <li className='flex items-start'>
            <span className='text-green-500 mr-2'>✓</span>
            <span>Order Placement & Management System</span>
          </li>
          <li className='flex items-start'>
            <span className='text-green-500 mr-2'>✓</span>
            <span>Restaurant Owner Dashboard</span>
          </li>
          <li className='flex items-start'>
            <span className='text-green-500 mr-2'>✓</span>
            <span>Delivery Personnel Interface</span>
          </li>
          <li className='flex items-start'>
            <span className='text-green-500 mr-2'>✓</span>
            <span>
              <strong>OTP Verification for Order Delivery</strong>
            </span>
          </li>
          <li className='flex items-start'>
            <span className='text-green-500 mr-2'>✓</span>
            <span>
              <strong>Real-time Socket.io Events & Notifications</strong>
            </span>
          </li>
          <li className='flex items-start'>
            <span className='text-green-500 mr-2'>✓</span>
            <span>
              <strong>Razorpay Payment Gateway Integration</strong>
            </span>
          </li>
          <li className='flex items-start'>
            <span className='text-green-500 mr-2'>✓</span>
            <span>Item Rating & Review System</span>
          </li>
          <li className='flex items-start'>
            <span className='text-green-500 mr-2'>✓</span>
            <span>Advanced Search & Filter Functionality For Food Items</span>
          </li>
          <li className='flex items-start'>
            <span className='text-green-500 mr-2'>✓</span>
            <span>
              <strong>Realtime delivery tracking of the order for user</strong>
            </span>
          </li>
          <li className='flex items-start'>
            <span className='text-green-500 mr-2'>✓</span>
            <span>Delivery Boy earning stats</span>
          </li>
        </ul>

        <div className='mt-5'>
          <h3
            className='text-lg font-semibold mb-3'
            style={{ color: primaryColor }}
          >
            🔨 Testing Credentials
          </h3>
          <ul className='space-y-2 text-sm'>
            <li className='flex flex-col'>
              <span className='font-bold'>Owner</span>
              <span>owner@gmail.com</span>
              <span>1234567890</span>
              <br />
              <span>owner2@gmail.com</span>
              <span>1234567890</span>
            </li>
            <li className='flex flex-col'>
              <span className='font-bold'>Delivery Boy</span>
              <span>deliveryBoy@gmail.com</span>
              <span>1234567890</span>
            </li>
            <li className='flex flex-col'>
              <span className='font-bold'>User</span>
              <span>user@gmail.com</span>
              <span>1234567890</span>
            </li>
          </ul>
          <ul className='space-y-2 text-sm mt-5'>
            <li className='flex flex-col'>
              <span className='font-bold'>Note</span>
              <span>
                Your requested to create your own valid user email for testing{' '}
                <strong>Forgot Password</strong> &{' '}
                <strong>Order Delivery</strong> feature, as you shall receive
                OTP on this email!
              </span>
            </li>
          </ul>
        </div>
      </div>
      <button
        onClick={() => setShowFeatures(!showFeatures)}
        className='lg:hidden fixed bottom-6 right-6 bg-white border-2 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200'
        style={{
          borderColor: primaryColor,
          color: primaryColor,
        }}
      >
        <svg
          className='w-6 h-6'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      </button>
      {showFeatures && (
        <div className='lg:hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-lg w-full max-w-md p-6 max-h-[80vh] overflow-y-auto'>
            <div className='flex justify-between items-center mb-4'>
              <span></span>
              <button
                onClick={() => setShowFeatures(false)}
                className='text-gray-500 hover:text-gray-700 text-2xl'
              >
                ×
              </button>
            </div>
            <h3
              className='text-lg font-semibold mb-3'
              style={{ color: primaryColor }}
            >
              🚀 Project Features
            </h3>
            <ul className='space-y-2 text-sm'>
              <li className='flex items-start'>
                <span className='text-green-500 mr-2'>✓</span>
                <span>Role-based Authentication (Sign in & Sign up)</span>
              </li>
              <li className='flex items-start'>
                <span className='text-green-500 mr-2'>✓</span>
                <span>Google OAuth Integration</span>
              </li>
              <li className='flex items-start'>
                <span className='text-green-500 mr-2'>✓</span>
                <span>
                  <strong>Forgot Password with OTP Verification</strong>
                </span>
              </li>
              <li className='flex items-start'>
                <span className='text-green-500 mr-2'>✓</span>
                <span>Order Placement & Management System</span>
              </li>
              <li className='flex items-start'>
                <span className='text-green-500 mr-2'>✓</span>
                <span>Restaurant Owner Dashboard</span>
              </li>
              <li className='flex items-start'>
                <span className='text-green-500 mr-2'>✓</span>
                <span>Delivery Personnel Interface</span>
              </li>
              <li className='flex items-start'>
                <span className='text-green-500 mr-2'>✓</span>
                <span>
                  <strong>OTP Verification for Order Delivery</strong>
                </span>
              </li>
              <li className='flex items-start'>
                <span className='text-green-500 mr-2'>✓</span>
                <span>
                  <strong>Real-time Socket.io Events & Notifications</strong>
                </span>
              </li>
              <li className='flex items-start'>
                <span className='text-green-500 mr-2'>✓</span>
                <span>
                  <strong>Razorpay Payment Gateway Integration</strong>
                </span>
              </li>
              <li className='flex items-start'>
                <span className='text-green-500 mr-2'>✓</span>
                <span>Item Rating & Review System</span>
              </li>
              <li className='flex items-start'>
                <span className='text-green-500 mr-2'>✓</span>
                <span>
                  Advanced Search & Filter Functionality For Food Items
                </span>
              </li>
              <li className='flex items-start'>
                <span className='text-green-500 mr-2'>✓</span>
                <span>
                  <strong>
                    Realtime delivery tracking of the order for user
                  </strong>
                </span>
              </li>
              <li className='flex items-start'>
                <span className='text-green-500 mr-2'>✓</span>
                <span>Delivery Boy earning stats</span>
              </li>
            </ul>

            <div className='mt-5'>
              <h3
                className='text-lg font-semibold mb-3'
                style={{ color: primaryColor }}
              >
                🔨 Testing Credentials
              </h3>
              <ul className='space-y-2 text-sm'>
                <li className='flex flex-col'>
                  <span className='font-bold'>Owner</span>
                  <span>owner@gmail.com</span>
                  <span>1234567890</span>
                </li>
                <li className='flex flex-col'>
                  <span className='font-bold'>Delivery Boy</span>
                  <span>deliveryBoy@gmail.com</span>
                  <span>1234567890</span>
                </li>
                <li className='flex flex-col'>
                  <span className='font-bold'>User</span>
                  <span>user@gmail.com</span>
                  <span>1234567890</span>
                </li>
              </ul>
              <ul className='space-y-2 text-sm mt-5'>
                <li className='flex flex-col'>
                  <span className='font-bold'>Note</span>
                  <span>
                    Your requested to create your own valid user email for
                    testing <strong>Forgot Password</strong> &{' '}
                    <strong>Order Delivery</strong> feature, as you shall
                    receive OTP on this email!
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;
