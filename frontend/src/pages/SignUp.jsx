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

const SignUp = () => {
  const primaryColor = '#ff4d2d';
  const hoverColor = '#e64323';
  const bgColor = '#fff9f6';
  const borderColor = '#ddd';
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');

  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          fullName,
          email,
          password,
          mobile,
          role,
        },
        { withCredentials: true }
      );
      setError(null);
      console.log('result signup', result);
    } catch (error) {
      console.error('Error signup', error);
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    if (!mobile) {
      setError('Mobile No is required!');
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('google result', result);
      const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
        fullName: result.user.displayName,
        email: result.user.email,
        mobile,
        role,
      });
      console.log('data', data);
      setError(null);
    } catch (error) {
      console.error('Error google signup', error);
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
          className={`text-3xl font-bold mb-2`}
          style={{ color: primaryColor }}
        >
          DineDash
        </h1>
        <p className='text-gray-600 mb-8'>
          Create your account to get started with delicious food deliveries
        </p>

        {/* fullName */}
        <div className='mb-4'>
          <label
            htmlFor='fullName'
            className='block text-gray-700 font-medium mb-1'
          >
            Full Name
          </label>
          <input
            type='text'
            className='w-full border rouded-lg px-3 py-2 focus:outline-none focus:border-orange-500'
            placeholder='Enter your Full Name'
            style={{ border: `1px solid ${borderColor}` }}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
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
        {/* Mobile */}
        <div className='mb-4'>
          <label
            htmlFor='mobile'
            className='block text-gray-700 font-medium mb-1'
          >
            Mobile
          </label>
          <input
            type='text'
            className='w-full border rouded-lg px-3 py-2 focus:outline-none focus:border-orange-500'
            placeholder='Enter your Mobile No.'
            style={{ border: `1px solid ${borderColor}` }}
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
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
        {/* Role */}
        <div className='mb-4'>
          <label
            htmlFor='role'
            className='block text-gray-700 font-medium mb-1'
          >
            Role
          </label>
          <div className='flex gap-2'>
            {['user', 'owner', 'deliveryBoy'].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className='flex-1 border capitalize rounded-lg px-3 py-2 text-center font-medium transition-colors cursor-pointer'
                style={
                  role === r
                    ? { backgroundColor: primaryColor, color: 'white' }
                    : {
                        border: `1px solid ${primaryColor}`,
                        color: primaryColor,
                      }
                }
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <Button text={'Sign Up'} onSubmit={handleSignUp} loading={loading} />
        {error && (
          <p className='text-red-500 text-center my-[10px]'>*{error}</p>
        )}

        <button
          disabled={loading}
          onClick={handleGoogleAuth}
          className='w-full mt-4 cursor-pointer flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 hover:bg-gray-100'
        >
          <FcGoogle size={20} />
          <span>Sign up with Google</span>
        </button>
        <p
          className='text-center mt-6 cursor-pointer'
          onClick={() => navigate('/signin')}
        >
          Already have an account ?{' '}
          <span className='text-[#ff4d2d]'>Sign In</span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
