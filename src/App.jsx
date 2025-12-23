import './App.css'
import Footer from './components/Footer'
import Home from './pages/Home'
import TodayAuction from './pages/TodayAuction'
import MyProfile from '../src/pages/MyProfile'
import AuctionDetails from './pages/AuctionDetails'
import AuctionCards from './pages/AuctionCards'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'


function App() {
 

  return (
    <>
    <BrowserRouter>
    <ScrollToTop/>
    <Routes>
      <Route exact path="/" element={<Home/>}/>
      <Route exact path="/auction" element={<AuctionCards/>}/>
      <Route exact path="/auction-details/:auctionId" element={<AuctionDetails/>}/>
      <Route exact path="/myProfile" element={<MyProfile/>}/>
    </Routes>
    </BrowserRouter>
  
    </>
  )
}

export default App
