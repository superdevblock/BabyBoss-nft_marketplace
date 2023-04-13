import { createContext, useState, CSSProperties } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { RefreshContextProvider } from 'contexts/RefreshContext';
import './App.css';
import Signup from 'views/signup';
import ReferralProgramme from 'views/referral';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Marketplace from 'views/marketplace';
import Detail from 'views/Detail/Detail';
import Collection from 'views/collection/Collection';
import { useMarketplaceData } from 'state/marketplace/hooks';
import { useSelector } from 'react-redux';
import Notifications from 'views/notifications/Notifications';
import BuyTaurus from 'views/swap/BuyTaurus';
import { useStakingData } from 'state/staking/hooks';
import { useOwnerData } from 'state/owners/hooks';
import { useIsRegistered, useRegisterState } from 'state/register/hooks';
import { useWeb3Context } from 'hooks/useWeb3Context';
import { useCookies } from 'react-cookie';
import useIsLogin from 'hooks/useIsLogin';
import Header from 'layouts/Header';
import Footer from 'layouts/Footer';
import Main from 'views/main';
import Stake from 'views/stake';
import ScrollUpButton from 'components/scrollUpButton';

import BarLoader from "react-spinners/BarLoader";

export const MainContext = createContext({})

const override: CSSProperties = {
  display: "block",
  position: 'fixed',
  left: '0',
  top: '0',
  width: '100vw',
  height: '100vh',
  margin: "0 auto",
  borderColor: "red",
};

const App = () => {
  // useNFTUserData(web3Context?.account)
  const web3Context = useWeb3Context()
  const [cookies, setCookie] = useCookies(['token', 'public_key'])
  
  useMarketplaceData()
  useStakingData()
  useOwnerData()  
  useIsRegistered(web3Context?.account)

  // const isLogin = useIsLogin(web3Context?.account, cookies?.token)
  // console.log("sniper: isLogin: ", isLogin)
  
  // const loadingRegister = useSelector((state: any) => state.register.status)
  const isLogin = true;
  
  // const loadingMarketplaceData = useSelector((state: any) => state.marketplace.status)
  const loadingStakingData = useSelector((state: any) => state.staking.status)
  // const loadingOwnerData = useSelector((state: any) => state.owner.status)

  const [toggle, setToggle] = useState(false)
  const [loader, setLoader] = useState(false)

  return (
    <RefreshContextProvider>
      <MainContext.Provider value={{toggle, setToggle}}>
        <BrowserRouter>
          {/* <ToastContainer /> */}
          <div className='container'>
            <Header />
            <Routes>
              <Route path="/" element={<Main setLoader={setLoader}/>} /> 
              {/* protected routes */}
              <Route path="/stake" element={isLogin? <Stake /> : <Navigate to='/' />} />
              {/* <Route path="/referral-Program" element={<ReferralProgramme /> } />
              <Route path="/notifications" element={<ReferralProgramme /> } />
              <Route path="/swap" element={<ReferralProgramme /> } />
              <Route path="/marketplace" element={isLogin? <Marketplace /> : <Navigate to='/' />} />
              <Route path="/collection" element={isLogin? <Collection /> : <Navigate to='/' />} />
              <Route path="/marketplace/:id" element={isLogin? <Detail setLoader={setLoader}/> : <Navigate to='/' />} />
              <Route path="/collection/:id" element={isLogin? <Detail setLoader={setLoader}/> : <Navigate to='/' />} /> */}
              {/* <Route path="/collection-nft/:id" element={<CollectionNft />} /> */}
            </Routes>
            <Footer />
          </div>
          <ScrollUpButton />
        </BrowserRouter>
      </MainContext.Provider>
    </RefreshContextProvider>
  );
}

export default App;
