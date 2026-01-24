import './App.css'
import Footer from './components/Footer'
import Home from './pages/Home'
import TodayAuction from './pages/TodayAuction'
import MyProfile from '../src/pages/MyProfile'
import AuctionDetails from './pages/AuctionDetails'
import AuctionCards from './pages/AuctionCards'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import { ToastContainer } from 'react-toastify'
import CreateEditAuction from './pages/CreateEditAuction'
import AdminAuctionControl from './pages/Live_Auction/admin/AdminAuctionControl'
import BiddingPanel from '../src/pages/Live_Auction/TeamOwner/BiddingPanel'
import AuctionDetailsForUser from '../src/pages/AuctionDetailsForUser'
import LandingPage from './pages/Landing Page/LandingPage'


function AppContent() {
  return (
    <>
    <BrowserRouter>
    <ScrollToTop/>
    <Routes>
      <Route exact path="/" element={<Home/>}/>
      <Route exact path="/auction" element={<AuctionCards/>}/>
      <Route exact path="/auction-details/:auctionId" element={<AuctionDetails/>}/>
      <Route exact path="/myProfile" element={<MyProfile/>}/>
      <Route exact path='/live-auction/:auctionId' element={<AdminAuctionControl/>}/>
      <Route exact path='/today-auction' element={<TodayAuction/>}/>
      <Route exact path="/createAuction" element={<CreateEditAuction/>}/>
      <Route exact path="/editAuction/:auctionId" element={<CreateEditAuction/>}/>
      <Route exact path="/team-bidding/:auctionId" element={<BiddingPanel/>}/>  
      <Route exact path="/viewAuction/:auctionId" element={<AuctionDetailsForUser/>}/>  
      <Route exact path="/viewAuction/:auctionId" element={<AuctionDetailsForUser/>}/>  
      <Route exact path="/auction-registration" element={<LandingPage/>}/>  
    </Routes>
    </BrowserRouter>
  
    </>
  )
}

export default function App() {
  return (
    
    
        <div className="min-h-screen bg-gray-50">
        <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
          <AppContent />
        </div>
     

  )
}
