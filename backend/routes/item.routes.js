import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import {
  addItem,
  deleteItem,
  editItem,
  getItemById,
  getItemsByCity,
  getItemsByShop,
  rating,
  searchItems,
} from '../controllers/item.controllers.js';
import { upload } from '../middlewares/multer.js';

const itemRouter = express.Router();

itemRouter.post('/add-item', isAuth, upload.single('image'), addItem);
itemRouter.get('/search-items', isAuth, searchItems);
itemRouter.post('/rating', isAuth, rating);
itemRouter.post('/edit-item/:itemId', isAuth, upload.single('image'), editItem);
itemRouter.get('/get-by-id/:itemId', isAuth, getItemById);
itemRouter.get('/delete/:itemId', isAuth, deleteItem);
itemRouter.get('/get-by-city/:city', isAuth, getItemsByCity);
itemRouter.get('/get-by-shop/:shopId', isAuth, getItemsByShop);

export default itemRouter;
