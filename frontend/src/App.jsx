import { Navigate, Route, Routes } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';
import useGetCurrentUser from './hooks/useGetCurrentUser';
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import useGetCity from './hooks/useGetCity';
import useGetMyShop from './hooks/useGetMyShop';
import CreateEditShop from './pages/CreateEditShop';
import AddFoodItem from './pages/AddFoodItem';
import EditFoodItem from './pages/EditFoodItem';

export const serverUrl = 'http://localhost:8000';

function App() {
  useGetCurrentUser();
  useGetCity();
  useGetMyShop();
  const { userData } = useSelector((state) => state.user);

  return (
    <Routes>
      <Route
        path='/signup'
        element={!userData ? <SignUp /> : <Navigate to={'/'} />}
      />
      <Route
        path='/signin'
        element={!userData ? <SignIn /> : <Navigate to={'/'} />}
      />
      <Route
        path='/forgot-password'
        element={!userData ? <ForgotPassword /> : <Navigate to={'/'} />}
      />
      <Route
        path='/'
        element={userData ? <Home /> : <Navigate to={'/signin'} />}
      />
      <Route
        path='/create-edit-shop'
        element={userData ? <CreateEditShop /> : <Navigate to={'/signin'} />}
      />
      <Route
        path='/add-item'
        element={userData ? <AddFoodItem /> : <Navigate to={'/signin'} />}
      />
      <Route
        path='/edit-item/:itemId'
        element={userData ? <EditFoodItem /> : <Navigate to={'/signin'} />}
      />
    </Routes>
  );
}

export default App;
