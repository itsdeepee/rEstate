
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignOut from './pages/SignUp';
import Header from './components/Header';
import SignUp from './pages/SignUp';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';

export default function App() {
  return (
   <BrowserRouter>
   <Header/>
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/about' element={<About/>}></Route>
      <Route element={<PrivateRoute/>}>
          <Route path='/profile' element={<Profile/>}></Route>
          <Route path='/create-listing' element={<CreateListing/>}></Route>
          <Route path='/update-listing/:listingId' element={<UpdateListing/>}></Route>
      </Route>
      <Route path='/sign-in' element={<SignIn/>}></Route>
      <Route path='/sign-up' element={<SignUp/>}></Route>
    </Routes>
   </BrowserRouter>
    
  )
}
