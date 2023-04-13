import { URI } from "api-control/api";
import { MainContext } from "App";
import axios from "axios";
import { useCookies } from 'react-cookie';
import { useVeryFastFresh } from "hooks/useRefresh";
import { useWeb3Context } from "hooks/useWeb3Context";
import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import encryptParams from "utils/encryption";

const Sidebar = () => {
  const { toggle } = useContext(MainContext);
  const navigation = useNavigate()
  const [unreed, setUnreed] = useState(0);
  const web3Context = useWeb3Context()
  const veryFastRefresh = useVeryFastFresh()
  const [cookies, setCookie] = useCookies(['token'])

  useEffect(() => {
    const body = {
      public_key: (web3Context?.account)
    }
    axios.post(`${URI}/notification/unseen`, {params: encryptParams(body)})
        .then((res) => {
          setUnreed(res.data?.unseen)
        })
  }, [veryFastRefresh]);

  const handleLogout = async () => {
    
    const body = {
      public_key: cookies.public_key,
      token: cookies.token
    }
    axios.post(`${URI}/auth/logout`, {params: encryptParams(body)})
        .then((res) => {
            console.log("sniper: res in logout: ", res)
            navigation("/")
        })
        .catch((err) => {
            navigation("/")
            console.error(err)
        })
  }

  return (
    <div
      className={
        toggle
          ? " min-h-screen fixed w-60 top-0 left-0 z-50 bg-br shadow-md"
          : "  min-h-screen hidden lg:block fixed w-60 top-0 left-0 z-10 bg-br shadow-md"
      }
    >
      <div className=" flex items-center justify-center">
        <Link className=" w-full px-3" to="/">
          <img
            className=" w-full object-contain -ml-5"
            src="/images/main-logo.png"
            alt=""
          />
        </Link>
      </div>

      <p className=" text-gray-700 mt-10 pl-9 text-sm font-semibold">
        NFT LAMBO BIZ
      </p>

      <NavLink
        className={({ isActive }) =>
          isActive
            ? "flex items-center justify-between  w-full mt-5  pl-8 pr-3 text-gray-200 font-semibold py-2 bg-sr"
            : "flex items-center justify-between  w-full mt-5  pl-8 pr-3 text-gray-500   py-2"
        }
        to="/notifications"
      >
        <div className=" flex items-center gap-2 text-sm">
          <img src="/images/notification.png" alt="" />
          Notifications
        </div>
      {unreed !== 0 &&  <p className="  px-2 rounded-md bg-pr text-br text-xs font-bold">{unreed}</p>}
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive
            ? "flex items-center justify-between mt-2  w-full pl-8 pr-3 text-gray-200 font-semibold py-2 bg-sr"
            : "flex items-center justify-between mt-2  w-full  pl-8 pr-3 text-gray-500   py-2"
        }
        to="/marketplace"
      >
        <div className=" flex items-center gap-2 text-sm">
          <img src="/images/Explore.png" alt="" />
          NFT Markeplace
        </div>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive
            ? "flex items-center justify-between mt-2  w-full  pl-8 pr-3 text-gray-200 font-semibold py-2 bg-sr"
            : "flex items-center justify-between mt-2  w-full  pl-8 pr-3 text-gray-500   py-2"
        }
        to="/collection"
      >
        <div className=" flex items-center gap-2 text-sm">
          <img src="/images/NFT.png" alt="" />
          My NFT Collection
        </div>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive
            ? "flex items-center justify-between mt-2  w-full  pl-8 pr-3 text-gray-200 font-semibold py-2 bg-sr"
            : "flex items-center justify-between mt-2  w-full  pl-8 pr-3 text-gray-500   py-2"
        }
        to="/referral-Program"
      >
        <div className=" flex items-center gap-2 text-sm">
          <img src="/images/Network.png" alt="" />
          Referral Program
        </div>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive
            ? "flex items-center justify-between mt-2  w-full  pl-8 pr-3 text-gray-200 font-semibold py-2 bg-sr"
            : "flex items-center justify-between mt-2  w-full  pl-8 pr-3 text-gray-500   py-2"
        }
        to="/swap"
      >
        <div className=" flex items-center gap-2 text-sm">
          <img src="/images/staking.png" alt="" />
          Buy Taurus Token
        </div>
      </NavLink>
      <div
        style={{ borderTop: "2px solid #061117" }}
        className="  w-full mt-4 "
      ></div>
      <p className=" text-gray-700 mt-7 pl-8 text-sm">WILL YOU GET OUT?</p>

      <button className=" flex items-center gap-2 text-sm pl-8 mt-4 cursor-pointer w-full text-gray-600" onClick={handleLogout}>
        <img src="/images/logout.png" alt="" />
          Log Out
      </button>
    </div>
  );
};

export default Sidebar;
