import mongoose from 'mongoose';
import User from '../models/user.model.js';

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    await User.syncIndexes();
    console.log('*****DB Connected*****');
  } catch (error) {
    console.error('*****DB Connection error*****', error);
  }
};

export default connectDb;
