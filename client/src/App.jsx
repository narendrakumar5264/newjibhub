import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import PrivateRoute from './components/auth/PrivateRoute';
import CreateListing from './pages/CreateListing';
import Listing from './pages/Listing';
import UpdateListing from './pages/UpdateListing';
import ListingPage from './pages/ListingPage';
import Search from './pages/Search';
import ScrollToTop from './components/common/ScrollToTop';
import Subscription from './pages/Subscription';
import Ai_interview from './pages/AiInterview';
import Recuirtment from './pages/Recuirtment';
import Resume from './pages/Resume';

const noFooterPages = ['/', '/sign-in', '/sign-up'];

function AppContent() {
  const location = useLocation();

  const showFooter = !noFooterPages.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {location.pathname !== '/' && <Header />}
      <ScrollToTop />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/listing/:listingId" element={<ListingPage />} />
          <Route path='/search' element={<Search />} />

          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/Recuirtment" element={<Recuirtment />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/Resume" element={<Resume />} />
            <Route path="/Ai_interview" element={<Ai_interview />} />
            <Route path="/update-listing/:listingId" element={<UpdateListing />} />
            <Route path="/listing" element={<Listing />} />
            <Route path="/Subscription" element={<Subscription />} />
          </Route>
        </Routes>
      </div>
      {showFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
