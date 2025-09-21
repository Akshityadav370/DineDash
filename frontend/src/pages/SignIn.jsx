import { useState } from 'react';
import { FaRegEye } from 'react-icons/fa';
import { FaRegEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import Button from '../components/button';

const SignIn = () => {
  const primaryColor = '#ff4d2d';
  const hoverColor = '#e64323';
  const bgColor = '#fff9f6';
  const borderColor = '#ddd';
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      console.log('result signin', result);
    } catch (error) {
      console.error('Error signin', error);
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
          className={`text-3xl font-bold mb-2`}
          style={{ color: primaryColor }}
        >
          DineDash
        </h1>
        <p className='text-gray-600 mb-8'>
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

        {/* <button
          onClick={handleSignIn}
          className={`w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 cursor-pointer bg-[#ff4d2d] text-white hover:bg-[#e64323]`}
        >
          Sign In
        </button> */}
        <Button text={'Sign In'} onSubmit={handleSignIn} />
        <button className='w-full mt-4 cursor-pointer flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 hover:bg-gray-100'>
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
