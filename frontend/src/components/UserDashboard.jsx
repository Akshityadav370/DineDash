import { useRef } from 'react';
import { useState } from 'react';
import { categories } from '../utils/category';
import CategoryCard from './CategoryCard';
import { FaCircleChevronLeft } from 'react-icons/fa6';
import { FaCircleChevronRight } from 'react-icons/fa6';
import { PiBowlFoodDuotone } from 'react-icons/pi';
import { GiFoodTruck } from 'react-icons/gi';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useGetShopsInCity from '../hooks/useGetShopsInCity';
import { useNavigate } from 'react-router-dom';
import useGetItemsInCity from '../hooks/useGetItemsInCity';
import FoodCard from './FoodCard';

const UserDashboard = () => {
  useGetShopsInCity();
  useGetItemsInCity();

  const [showLeftCateButton, setShowLeftCateButton] = useState(false);
  const [showRightCateButton, setShowRightCateButton] = useState(false);
  const [showLeftShopButton, setShowLeftShopButton] = useState(false);
  const [showRightShopButton, setShowRightShopButton] = useState(false);
  const [updatedItemsList, setUpdatedItemsList] = useState([]);

  const { city, shopsInMyCity, itemsInMyCity, searchItems } = useSelector(
    (state) => state.user
  );

  const cateScrollRef = useRef();
  const shopScrollRef = useRef();
  const navigate = useNavigate();

  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction == 'left' ? -200 : 200,
        behavior: 'smooth',
      });
    }
  };

  const updateButton = (ref, setLeftButton, setRightButton) => {
    const element = ref.current;
    if (element) {
      setLeftButton(element.scrollLeft > 0);
      setRightButton(
        element.scrollLeft + element.clientWidth < element.scrollWidth
      );
    }
  };

  const handleFilterByCategory = (category) => {
    if (category == 'All') {
      setUpdatedItemsList(itemsInMyCity);
    } else {
      const filteredList = itemsInMyCity?.filter(
        (i) => i.category === category
      );
      setUpdatedItemsList(filteredList);
    }
  };

  useEffect(() => {
    if (cateScrollRef.current) {
      updateButton(
        cateScrollRef,
        setShowLeftCateButton,
        setShowRightCateButton
      );

      cateScrollRef.current.addEventListener('scroll', () => {
        updateButton(
          cateScrollRef,
          setShowLeftCateButton,
          setShowRightCateButton
        );
      });
    }

    if (shopScrollRef.current) {
      updateButton(
        shopScrollRef,
        setShowLeftShopButton,
        setShowRightShopButton
      );

      shopScrollRef.current.addEventListener('scroll', () => {
        updateButton(
          shopScrollRef,
          setShowLeftShopButton,
          setShowRightShopButton
        );
      });
    }

    return () => {
      cateScrollRef?.current?.removeEventListener('scroll', () => {
        updateButton(
          cateScrollRef,
          setShowLeftCateButton,
          setShowRightCateButton
        );
      });

      shopScrollRef?.current?.removeEventListener('scroll', () => {
        updateButton(
          shopScrollRef,
          setShowLeftShopButton,
          setShowRightShopButton
        );
      });
    };
  }, []);

  useEffect(() => {
    setUpdatedItemsList(itemsInMyCity);
  }, [itemsInMyCity]);

  return (
    <div className='w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto'>
      {searchItems && searchItems.length > 0 && (
        <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-5 bg-white shadow-md rounded-2xl mt-4'>
          <h1 className='text-gray-900 text-2xl sm:text-3xl font-semibold border-b border-gray-200 pb-2'>
            Search Results
          </h1>
          <div className='w-full h-auto flex flex-wrap gap-6 justify-center'>
            {searchItems.map((item) => (
              <FoodCard data={item} key={item._id} />
            ))}
          </div>
        </div>
      )}

      {/* Category */}
      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'>
        <h1 className='text-gray-800 text-2xl sm:text-3xl'>
          Inspiration for your first order
        </h1>
        <div className='w-full relative'>
          {showLeftCateButton && (
            <button
              className='absolute left-5 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10'
              onClick={() => scrollHandler(cateScrollRef, 'left')}
            >
              <FaCircleChevronLeft />
            </button>
          )}

          <div
            className='w-full flex overflow-x-auto gap-4 pb-2 '
            ref={cateScrollRef}
          >
            {categories.map((cate, index) => (
              <CategoryCard
                name={cate.category}
                image={cate.image}
                key={index}
                onClick={() => handleFilterByCategory(cate.category)}
              />
            ))}
          </div>
          {showRightCateButton && (
            <button
              className='absolute right-5 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10'
              onClick={() => scrollHandler(cateScrollRef, 'right')}
            >
              <FaCircleChevronRight />
            </button>
          )}
        </div>
      </div>
      {/* Shop */}
      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'>
        <h1 className='text-gray-800 text-2xl sm:text-3xl'>
          Best shops in {city}
        </h1>
        <div className='w-full relative'>
          {showLeftShopButton && (
            <button
              className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10'
              onClick={() => scrollHandler(shopScrollRef, 'left')}
            >
              <FaCircleChevronLeft />
            </button>
          )}

          <div
            className='w-full flex overflow-x-auto gap-4 pb-2 '
            ref={shopScrollRef}
          >
            {shopsInMyCity?.map((shop, index) => (
              <CategoryCard
                name={shop.name}
                image={shop.image}
                key={index}
                onClick={() => navigate(`/shop/${shop._id}`)}
              />
            ))}
          </div>
          {showRightShopButton && (
            <button
              className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10'
              onClick={() => scrollHandler(shopScrollRef, 'right')}
            >
              <FaCircleChevronRight />
            </button>
          )}
        </div>
        {shopsInMyCity && shopsInMyCity.length === 0 && (
          <div className='text-center w-full mt-5 justify-center items-center content-center'>
            <GiFoodTruck
              className='mx-auto opacity-80'
              color={'#ff4d2d'}
              size={60}
            />
            <h2 className='text-[#ff4d2d] text-lg opacity-75'>
              All restaurants are closed!
            </h2>
            <p className='text-[#bf6656]'>
              Please hold on...! Until someone opens the shop.
            </p>
          </div>
        )}
      </div>
      {/* Items */}
      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'>
        <h1 className='text-gray-800 text-2xl sm:text-3xl'>
          Suggested Food Items
        </h1>
        <div className='w-full h-auto flex flex-wrap gap-[20px] justify-center'>
          {updatedItemsList?.map((item, index) => (
            <FoodCard key={index} data={item} />
          ))}
          {updatedItemsList && updatedItemsList.length === 0 && (
            <div className='text-center mt-5 justify-center items-center content-center'>
              <PiBowlFoodDuotone
                className='mx-auto opacity-80'
                color={'#ff4d2d'}
                size={60}
              />
              <h2 className='text-[#ff4d2d] text-lg opacity-75'>
                Dishes are still being prepared!
              </h2>
              <p className='text-[#bf6656]'>
                You can try other category foods in the mean time!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
