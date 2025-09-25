import express from 'express';
import {
  acceptOrder,
  getDeliveryBoyAssignments,
  getMyCurrentOrder,
  getMyOrders,
  getOrderById,
  placeOrder,
  sendOtp,
  updateOrderStatus,
  verifyOtp,
} from '../controllers/order.controllers.js';
import isAuth from '../middlewares/isAuth.js';

const orderRouter = express.Router();

orderRouter.post('/place-order', isAuth, placeOrder);
orderRouter.get('/my-orders', isAuth, getMyOrders);
orderRouter.get('/get-assignments', isAuth, getDeliveryBoyAssignments);
orderRouter.get('/get-my-current-order', isAuth, getMyCurrentOrder);
orderRouter.post('/send-delivery-otp', isAuth, sendOtp);
orderRouter.post('/verify-delivery-otp', isAuth, verifyOtp);
orderRouter.get('/get-by-id/:orderId', isAuth, getOrderById);
orderRouter.post('/update-status/:orderId/:shopId', isAuth, updateOrderStatus);
orderRouter.get('/accept-order/:assignmentId', isAuth, acceptOrder);

export default orderRouter;
