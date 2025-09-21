import { useState } from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import Button from '../components/button';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [step, setStep] = useState(3);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [otp, setOtp] = useState('');

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
              />
            </div>
            <Button text={'Send OTP'} onSubmit={() => {}} />
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
              />
            </div>
            <Button text={'Verify'} onSubmit={() => {}} />
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
              />
            </div>
            <Button text={'Reset Password'} onSubmit={() => {}} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
