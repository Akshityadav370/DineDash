import { FaLocationDot } from 'react-icons/fa6';
import { IoIosSearch } from 'react-icons/io';
import { FiShoppingCart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { setSearchItems, setUserData } from '../redux/userSlice';
import { FaPlus } from 'react-icons/fa6';
import { TbReceipt2 } from 'react-icons/tb';

const Nav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userData, city, cartItems, myOrders } = useSelector(
    (state) => state.user
  );
  const { myShopData } = useSelector((state) => state.owner);

  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');

  const debounceRef = useRef(null);

  const handleLogout = async () => {
    try {
      await axiosInstance.get('/api/auth/signout');
      // Clear token from localStorage
      localStorage.removeItem('token');
      dispatch(setUserData(null));
    } catch (error) {
      console.error('Error logging out', error);
      // Clear token even if logout fails
      localStorage.removeItem('token');
      dispatch(setUserData(null));
    }
  };

  const handleSearchItems = async (searchQuery) => {
    try {
      const result = await axiosInstance.get(
        `/api/item/search-items?query=${searchQuery}&city=${city}`
      );
      dispatch(setSearchItems(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim()) {
      debounceRef.current = setTimeout(() => {
        handleSearchItems(query);
      }, 500);
    } else {
      dispatch(setSearchItems(null));
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, city]);

  return (
    <div className='w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-[20px] fixed top-0 z-[999] bg-[#fff9f6] overflow-visible'>
      {showSearch && userData.role === 'user' && (
        <div className='w-[90%] h-[70px]  bg-white shadow-xl rounded-lg items-center gap-[20px] flex fixed top-[80px] left-[5%] md:hidden'>
          <div className='flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400'>
            <FaLocationDot size={25} className='text-[#ff4d2d]' />
            <div className='w-[80%] truncate text-gray-600'>{city}</div>
          </div>
          <div className='w-[80%] flex items-center gap-[10px]'>
            <IoIosSearch size={25} className='text-[#ff4d2d]' />
            <input
              type='text'
              name=''
              id=''
              placeholder='Search your favorite food...'
              className='px-[10px] text-gray-700 outline-0 w-full'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      )}
      <h1 className='text-3xl font-bold mb-2 text-[#ff4d2d]'>DineDash</h1>
      {userData.role === 'user' && (
        <div className='md:w-[60%] lg:w-[40%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-[20px] hidden md:flex'>
          <div className='flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400'>
            <FaLocationDot size={25} className='text-[#ff4d2d]' />
            <div className='w-[80%] truncate text-gray-600'>{city}</div>
          </div>
          <div className='w-[80%] flex items-center gap-[10px]'>
            <IoIosSearch size={25} className='text-[#ff4d2d]' />
            <input
              type='text'
              name=''
              id=''
              placeholder='Search your favorite food...'
              className='px-[10px] text-gray-700 outline-0 w-full'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      )}
      <div className='flex items-center gap-4'>
        {userData.role === 'user' && (
          <>
            <IoIosSearch
              onClick={() => setShowSearch((prev) => !prev)}
              size={25}
              className='text-[#ff4d2d] md:hidden'
            />{' '}
            <div
              className='relative cursor-pointer'
              onClick={() => navigate('/cart')}
            >
              <FiShoppingCart size={25} className='text-[#ff4d2d]' />
              <span className='absolute right-[-9px] top-[-12px] text-[#ff4d2d]'>
                {cartItems
                  ? cartItems.reduce(
                      (acc, current) => acc + current.quantity,
                      0
                    )
                  : 0}
              </span>
            </div>
            <button
              className='hidden cursor-pointer md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium'
              onClick={() => navigate('/my-orders')}
            >
              My Orders
            </button>
          </>
        )}

        {userData.role === 'owner' && (
          <>
            {myShopData && (
              <>
                <button
                  className='hidden md:flex items-center gap-1 p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]'
                  onClick={() => navigate('/add-item')}
                >
                  <FaPlus size={15} />
                  <span className='text-xs font-medium'>Add Food Item</span>
                </button>
                <button
                  className='md:hidden flex items-center p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]'
                  onClick={() => navigate('/add-item')}
                >
                  <FaPlus size={20} />
                </button>
              </>
            )}
            <div
              className='hidden md:flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium'
              onClick={() => navigate('/my-orders')}
            >
              <TbReceipt2 size={20} />
              <span className='text-xs font-medium cursor-pointer'>
                My Orders
              </span>
              <span className='absolute -right-2 -top-2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-[6px] py-[1px]'>
                {
                  myOrders.filter(
                    (order) => order.shopOrders.status !== 'delivered'
                  ).length
                }
              </span>
            </div>
            <div
              className='md:hidden flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium'
              onClick={() => navigate('/my-orders')}
            >
              <TbReceipt2 size={20} />
              <span className='absolute -right-2 -top-2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-[6px] py-[1px]'>
                {
                  myOrders.filter(
                    (order) => order.shopOrders.status !== 'delivered'
                  ).length
                }
              </span>
            </div>
          </>
        )}

        <div
          onClick={() => setShowInfo((prev) => !prev)}
          className='w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-[18px] shadow-xl font-semibold cursor-pointer'
        >
          {userData?.fullName.slice(0, 1)}
        </div>
        {showInfo && (
          <div
            className={`fixed top-[80px] right-[10px] 
                    ${
                      userData.role == 'deliveryBoy'
                        ? 'md:right-[20%] lg:right-[40%]'
                        : 'md:right-[10%] lg:right-[25%]'
                    } w-[180px] bg-white shadow-2xl rounded-xl p-[20px] flex flex-col gap-[10px] z-[9999]`}
          >
            <div className='text-[17px] font-semibold'>{userData.fullName}</div>
            {userData.role == 'user' && (
              <div
                className='md:hidden text-[#ff4d2d] font-semibold cursor-pointer'
                onClick={() => navigate('/my-orders')}
              >
                My Orders
              </div>
            )}

            <div
              className='text-[#ff4d2d] font-semibold cursor-pointer'
              onClick={handleLogout}
            >
              Log Out
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nav;
