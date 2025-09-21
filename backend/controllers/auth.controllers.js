import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import genToken from '../utils/token.js';
import { sendOtpMail } from '../utils/mail.js';

export const signUp = async (req, res) => {
  try {
    const { fullName, email, mobile, password, role } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User Already exists!' });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be atleast 6 characters!' });
    }
    if (mobile.length !== 10) {
      return res
        .status(400)
        .json({ message: 'Mobile no should be of 10 digits!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      role,
      mobile,
      password: hashedPassword,
    });

    const token = await genToken(newUser._id);

    res.cookie('token', token, {
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json(`Signup error ${error}`);
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User does not exist!' });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be atleast 6 characters!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect Email/Password' });
    }

    const token = await genToken(user._id);

    res.cookie('token', token, {
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json(`Signin error ${error}`);
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logout Successfully!' });
  } catch (error) {
    return res.status(500).json(`Sign out error ${error}`);
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User does not exist!' });
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetOpt = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;

    await user.save();

    await sendOtpMail(email, otp);

    return res.status(200).json({ message: 'OTP sent successfully!' });
  } catch (error) {
    return res.status(500).json(`Error in sending OTP: ${error}`);
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.resetOpt != otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid/Expired OTP!' });
    }
    user.resetOpt = undefined;
    user.otpExpires = undefined;
    user.isOtpVerified = true;
    await user.save();

    return res.status(200).json({ message: 'OTP verified successfully!' });
  } catch (error) {
    return res.status(500).json(`Error in verifying OTP: ${error}`);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User does not exist!' });
    }
    if (!user.isOtpVerified) {
      return res.status(400).json({ message: 'OTP verification required!' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.isOtpVerified = false;

    await user.save();

    return res.status(200).json({ message: 'Password reset successfully!' });
  } catch (error) {
    return res.status(500).json(`Error in Reset OTP: ${error}`);
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { fullName, email, mobile, role } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        fullName,
        email,
        role,
        mobile,
      });
    }

    const token = await genToken(user._id);

    res.cookie('token', token, {
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json(`Google Auth error ${error}`);
  }
};
