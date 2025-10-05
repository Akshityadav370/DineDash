import { useState } from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import Button from '../components/button';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../constants/config';
import axios from 'axios';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [otp, setOtp] = useState('');

  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        {
          email,
        },
        { withCredentials: true }
      );
      console.log('otp sent', result);
      setError('');
      setStep(2);
    } catch (error) {
      // console.error('Error sending otp', error);
      setError(error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        {
          email,
          otp,
        },
        { withCredentials: true }
      );
      // console.log('otp verify', result);
      toast.success('OTP verified successfully');
      setStep(3);
      setError('');
    } catch (error) {
      // console.error('Error verify otp', error);
      toast.error(error?.response?.data?.message);
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    if (newPassword != confirmPassword) {
      return null;
    }
    try {
      await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        {
          email,
          newPassword,
        },
        { withCredentials: true }
      );
      // console.log('reset password', result);
      toast.success('Password reset successfully');
      setError('');
      navigate('/signin');
      //   setStep(3);
    } catch (error) {
      // console.error('Error sending otp', error);
      toast.error(error?.response?.data?.message);
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]'>
      <div className='bg-white rounded-xl shadow-lg w-full max-w-md p-8'>
        <div className='flex items-center gap-4 mb-4'>
          <IoIosArrowRoundBack
            onClick={() => navigate('/signin')}
            size={30}
            className='text-[#ff4d2d] cursor-pointer'
          />
          <h1 className='text-2xl font-bold text-center text-[#ff4d2d]'>
            Forgot Password
          </h1>
        </div>
        {step === 1 && (
          <div>
            <div className='mb-4'>
              <label
                htmlFor='email'
                className='block text-gray-700 font-medium mb-1'
              >
                Email
              </label>
              <input
                type='email'
                className='w-full border-[1px] rounded border-gray-200 rouded-lg px-3 py-2 focus:outline-none focus:border-orange-500'
                placeholder='Enter your Email'
                style={{ border: `1px solid #ddd` }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button
              text={'Send OTP'}
              onSubmit={handleSendOtp}
              loading={loading}
            />
            {error && (
              <p className='text-red-500 text-center my-[10px]'>*{error}</p>
            )}
          </div>
        )}
        {step === 2 && (
          <div>
            <div className='mb-4'>
              <label
                htmlFor='email'
                className='block text-gray-700 font-medium mb-1'
              >
                OTP
              </label>
              <input
                type='text'
                className='w-full border-[1px] rounded border-gray-200 rouded-lg px-3 py-2 focus:outline-none focus:border-orange-500'
                placeholder='Enter OTP'
                style={{ border: `1px solid #ddd` }}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <Button
              text={'Verify'}
              onSubmit={handleVerifyOtp}
              loading={loading}
            />
            {error && (
              <p className='text-red-500 text-center my-[10px]'>*{error}</p>
            )}
          </div>
        )}
        {step === 3 && (
          <div>
            <div className='mb-4'>
              <label
                htmlFor='password'
                className='block text-gray-700 font-medium mb-1'
              >
                New Password
              </label>
              <input
                type='password'
                className='w-full border-[1px] rounded border-gray-200 rouded-lg px-3 py-2 focus:outline-none focus:border-orange-500'
                placeholder='Enter New Password'
                style={{ border: `1px solid #ddd` }}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className='mb-4'>
              <label
                htmlFor='newPassword'
                className='block text-gray-700 font-medium mb-1'
              >
                Confirm Password
              </label>
              <input
                type='password'
                className='w-full border-[1px] rounded border-gray-200 rouded-lg px-3 py-2 focus:outline-none focus:border-orange-500'
                placeholder='Enter Confirm Password'
                style={{ border: `1px solid #ddd` }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button
              text={'Reset Password'}
              onSubmit={handleResetPassword}
              loading={loading}
            />
            {error && (
              <p className='text-red-500 text-center my-[10px]'>*{error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
