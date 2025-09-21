import { useState } from 'react';
import { FaRegEye } from 'react-icons/fa';
import { FaRegEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import Button from '../components/button';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const SignIn = () => {
  const primaryColor = '#ff4d2d';
  const hoverColor = '#e64323';
  const bgColor = '#fff9f6';
  const borderColor = '#ddd';
  const [showPassword, setShowPassword] = useState(false);
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
      console.log('google result', result);
      const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
        email: result.user.email,
      });
      //   console.log('data', data);
      dispatch(setUserData(data));
      setError('');
    } catch (error) {
      console.error('Error google signup', error);
      setError(error?.response?.data?.message);
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
      //   console.log('result signin', result);
      setError('');
      dispatch(setUserData(result.data));
    } catch (error) {
      console.error('Error signin', error);
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className='min-h-screen w-full flex items-center justify-center p-4'
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
    </div>
  );
};

export default SignIn;
