import { useNavigate } from 'react-router-dom';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { IoLocationSharp } from 'react-icons/io5';
import { IoSearchOutline } from 'react-icons/io5';
import { TbCurrentLocation } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import axios from 'axios';
import { setLocation, setMapAddress } from '../redux/mapSlice';
import { useState } from 'react';
import { useEffect } from 'react';

function RecenterMap({ location }) {
  const map = useMap();
  if (location.lat && location.lon) {
    map.setView([location.lat, location.lon], 16, { animate: true });
  }
  return null;
}

const CheckOut = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { location, mapAddress } = useSelector((state) => state.map);

  const apiKey = import.meta.env.VITE_GEOAPIFY_KEY;

  const [addressInput, setAddressInput] = useState('');

  const getAddressByLatLng = async (lat, lng) => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`
      );

      dispatch(
        setMapAddress(
          result?.data?.results[0].address_line1 +
            ', ' +
            result?.data?.results[0].address_line2
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getLatLngByAddress = async () => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          addressInput
        )}&apiKey=${apiKey}`
      );
      const { lat, lon } = result.data.features[0].properties;
      dispatch(setLocation({ lat, lon }));
    } catch (error) {
      console.log(error);
    }
  };

  const onDragEnd = (e) => {
    const { lat, lng } = e.target._latlng;
    dispatch(setLocation({ lat, lon: lng }));
    getAddressByLatLng(lat, lng);
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      //   console.log(position);
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      dispatch(setLocation({ lat: latitude, lon: longitude }));
      getAddressByLatLng(latitude, longitude);
    });
  };

  useEffect(() => {
    setAddressInput(mapAddress);
  }, [mapAddress]);

  return (
    <div className='min-h-screen bg-[#fff9f6] flex items-center justify-center p-6'>
      <div
        className='absolute top-[20px] left-[20px] z-[10] cursor-pointer'
        onClick={() => navigate('/')}
      >
        <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
      </div>

      <div className='w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Checkout</h1>

        <section>
          <h2 className='text-lg font-semibold mb-2 flex items-center gap-2 text-gray-800'>
            <IoLocationSharp className='text-[#ff4d2d]' /> Delivery Location
          </h2>
          <div className='flex gap-2 mb-3'>
            <input
              type='text'
              className='flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]'
              placeholder='Enter Your Delivery Address..'
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
            />
            <button
              onClick={getLatLngByAddress}
              className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex items-center justify-center'
            >
              <IoSearchOutline size={17} />
            </button>
            <button
              onClick={getCurrentLocation}
              className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center cursor-pointer'
            >
              <TbCurrentLocation size={17} />
            </button>
          </div>
          <div className='rounded-xl border overflow-hidden'>
            <div className='h-64 w-full flex items-center justify-center'>
              <MapContainer
                className={'w-full h-full'}
                center={[location?.lat, location?.lon]}
                zoom={16}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <RecenterMap location={location} />
                <Marker
                  position={[location?.lat, location?.lon]}
                  draggable
                  eventHandlers={{ dragend: onDragEnd }}
                />
              </MapContainer>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CheckOut;
