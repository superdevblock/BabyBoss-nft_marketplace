import { useEffect, useState } from "react";
import { SLIP_PAGE } from 'config'
import { ethers } from 'ethers'
import { VscChromeClose } from "react-icons/vsc";
import { AiFillCheckCircle, AiFillBug } from "react-icons/ai";
import { callApproveForAll, callClaim, callStakeNFT, callUnstakeNFT, callSell, callBuy, callCancelSell, callEdit, callApproveForErc20 } from "utils/calls";
import { useWeb3Context } from 'hooks/useWeb3Context'
import { getRegisterAddress, getRewardAddress, getRouterAddress, getStakingAddress, getWBNBAddress } from "utils/addressHelpers";
import { DAO_FEE, REWARD_PER_DAY, DAY_SECOND, NULL_ADDRESS, getIpfsUrl } from "config/nfts";
import { toast } from 'react-toastify'
import { useMarketplaceDataFromDB } from "state/marketplace/hooks";
import { getNFTContract, getRewardContract } from 'utils/contractHelpers'

import { useAppDispatch } from "state/hooks"
import { updateMarketplaceItemPrice } from "state/marketplace"
import { fetchNFTDetailDataSync } from "state/detail";
import axios from "axios";
import { URI } from "api-control/api";
import { callSellIn, callSellOut, callBuyIn, callBuyOut } from "utils/calls/swap";
import encryptParams from "utils/encryption";
import getDisplayStringFromNumber from "utils/getDisplayStringFromNumber";
import { updateOwner } from "state/owners";
import { updateStakingItem } from "state/staking";

export const SellModal = ({ setSellModal, data }) => {
  const [price, setPrice] = useState(10)
  const [pendingApproval, setPendingApproval] = useState(false)
  const [proceed, setProceed] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)
  const [successTx, setSuccessTx] = useState(false)
  const [hash, setHash] = useState("")
  const web3Context = useWeb3Context()
  const [isApproved, setIsApproved] = useState(false)

  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchApproveState = async () => {      
      const nftContract = getNFTContract(web3Context?.provider)
      const _isApproved = await nftContract.methods.isApprovedForAll(web3Context?.account, getRegisterAddress()).call()
      setIsApproved(_isApproved)
    }
    if(web3Context?.provider && web3Context?.account) {
      fetchApproveState()
    }
  }, [web3Context, pendingApproval])

  const handleSell = async () => {
    setProceed(true);
    try {
      if (web3Context?.provider && web3Context?.account) {
        setPendingTx(true)
        // await callApproveForAll(web3Context?.provider, web3Context?.account, getStakingAddress(), true)
        const _hash = await callSell(web3Context?.provider, web3Context?.account, data.id, price)
        dispatch(updateMarketplaceItemPrice({id: data.id, price: price, tradingVolume: 0}))
        dispatch(fetchNFTDetailDataSync({id: data.id}))
        setHash(_hash.transactionHash)
        setPendingTx(false)
        setSuccessTx(true)
      } else {
        toast.error('Confirm the wallet connected.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        setPendingTx(false)
      }
    } catch (error) {
      setPendingTx(false)
    }
    // setTimeout(() => {
    //   setTime(true);
    // }, 1000);
    
  }

  const handleApprove = async () => {
    try {
      if (web3Context?.provider && web3Context?.account) {
        setPendingApproval(true)
        // await callApproveForAll(web3Context?.provider, web3Context?.account, getStakingAddress(), true)
        await callApproveForAll(web3Context?.provider, web3Context?.account, getRegisterAddress(), true)
        setIsApproved(true)
        setPendingApproval(false)
      }                  
    } catch (error) {
      setPendingApproval(false)
    }
  }

  return (
    <div>
      <div className=" w-full flex items-center justify-between px-3 py-2 border-gray-800 mb-4 border-b">
        <h1 className=" text-xl text-white">
          Sell <span className=" text-pr">{data.name}</span>
        </h1>
        <VscChromeClose
          onClick={() => setSellModal(false)}
          className=" w-5 h-5 cursor-pointer text-white "
        />
      </div>
      {proceed == false ? (
        <>
          <div className=" py-3 flex items-center gap-3">
            <img
              className=" w-28 rounded-2xl h-24 object-cover"
              src={getIpfsUrl(data.id)}
              alt=""
            />
            <div>
              <h1 className=" text-2xl text-white font-bold">{data.name}</h1>
              <p className=" text-gray-500">
                By <span className=" text-pr">{data.minter}</span>
              </p>
            </div>
          </div>
          {/* <div className=" py-3">
            <p className=" text-gray-500 text-sm">Contract address</p>
            <p className=" text-pr">0x2E47d5f8d3C760381B96DF03fe96690..</p>
          </div> */}
          <p className=" text-gray-100">Set Price</p>
          <div className=" my-2 w-full rounded-3xl  bg-sr py-3 px-3 flex items-center justify-between">
            {/* <p className=" text-white">{price}</p> */}
            <input value={price} onChange={(e) => {setPrice(e.target.value)}} type="text" placeholder='Input the price to sell.' className='text-sm w-full px-3 lg:w-5/6 bg-sr outline-none border-sr' />
            <div className=" flex items-center gap-1">
              <img
                src="/images/BNB.png"
                className=" w-7 h-7 object-contain"
                alt=""
              />
            </div>
          </div>
          <p className=" text-sm text-gray-500 p">Fee</p>
          <div className="  flex items-cente gap-1 pb-4">
            <p className=" text-white mx-2">{`${(price * 20) / 100} BNB`}</p>
            <div className=" flex items-center gap-1">
              <img
                src="/images/BNB.png"
                className=" w-5 h-5 object-contain"
                alt=""
              />
            </div>
          </div>
          <p className=" text-sm text-white py-3">
            20% on the total sale will be paid to DAO to develop the projects and
            support them in the long term
          </p>
          <div className=" pt-8 w-full border-t border-gray-800">
            <button
              onClick={isApproved? handleSell : handleApprove}
              className=" py-3 w-full border-none outline-none rounded-3xl text-br flex items-center justify-center  bg-pr font-bold"
              disabled={pendingApproval}
            >
              {pendingApproval ? 
                <svg aria-hidden="true" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-pr" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg> 
                : 
                <p className=" text-br font-bold">{isApproved? "Sell" : "Approve"}</p>}              
            </button>
          </div>
        </>
      ) : (
        <>
          <div className=" py-3 flex items-center justify-center w-full flex-col gap-3">
            <img
              className=" w-28 rounded-2xl h-24 object-cover"
              src={getIpfsUrl(data.id)}
              alt=""
            />
          </div>
          <>
            {pendingTx === true ? (
              <>
                <div className=" w-full bg-sr  rounded-xl my-3 py-1">
                  <div className=" w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                    <p className=" text-white">Status</p>
                    <svg
                      aria-hidden="true"
                      className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-pr"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
                  <div className="  w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                    <p className=" text-white">Transaction Hash</p>
                    <p className=" text-pr">...</p>
                  </div>
                </div>
                <div className=" pt-8 w-full flex items-center justify-center  gap-5 border-t border-gray-800">
                  <button className=" py-3 px-10 border-2 w-full opacity-40 bg-gray-500 border-none  outline-none rounded-3xl text-white flex items-center justify-center   font-bold">
                    <p className="  font-bold">OK</p>
                  </button>
                </div>
              </>
            ) : (
              successTx ? (
                <>
                  <div className=" w-full bg-sr  rounded-xl my-3 py-1">
                    <div className=" w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                      <p className=" text-white">Status</p>
                      <div className="flex ">
                        <AiFillCheckCircle  className="text-green-500 w-5 h-5 mx-2" />
                        <p className=" text-white">Completed</p>
                      </div>
                    </div>
                    <div className="  w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                      <p className=" text-white">Transaction Hash</p>
                      <a href={`https://testnet.bscscan.com/tx/${hash}`} target="_blank">
                        <p className=" text-pr">{`${hash.substring(0, 6)}...${hash.substring(hash.length - 6, hash.length)}`}</p>
                      </a>
                    </div>
                  </div>
                  <div className=" pt-8 w-full flex items-center justify-center  gap-5 border-t border-gray-800">
                    <button onClick={()=>setSellModal(false)} className=" py-3 px-10 border-2 w-full  bg-pr border-none  outline-none rounded-3xl text-sr flex items-center justify-center   font-bold">
                      <p className="  font-bold">OK</p>
                    </button>
                  </div>
                </>) : (
              <>
                <div className=" w-full bg-sr  rounded-xl my-3 py-1">
                  <div className=" w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                    <p className=" text-white">Status</p>
                    <div className="flex ">
                      <AiFillBug  className="text-green-500 w-5 h-5 mx-2" />
                      <p className=" text-white">Faild</p>
                    </div>
                  </div>
                  <div className="  w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                    <p className=" text-white">Transaction Hash</p>
                    <p className=" text-pr">...</p>
                  </div>
                </div>
                <div className=" pt-8 w-full flex items-center justify-center  gap-5 border-t border-gray-800">
                  <button onClick={()=>setSellModal(false)} className=" py-3 px-10 border-2 w-full  bg-pr border-none  outline-none rounded-3xl text-sr flex items-center justify-center   font-bold">
                    <p className="  font-bold">OK</p>
                  </button>
                </div>
              </>)
            )}
          </>
        </>)}
      
    </div>
  );
};

export const BuyModal = ({ setBuyModal, data }) => {
  const [proceed, setProceed] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)
  const [successTx, setSuccessTx] = useState(false)
  const [hash, setHash] = useState("")
  const web3Context = useWeb3Context()
  const nfts = useMarketplaceDataFromDB()
  const price = nfts[data.id].price

  const dispatch = useAppDispatch()

  const handleBuy = async () => {
    setProceed(true);
    try {
      if (web3Context?.provider && web3Context?.account) {
        setPendingTx(true)
        // await callApproveForAll(web3Context?.provider, web3Context?.account, getStakingAddress(), true)
        const _hash = await callBuy(web3Context?.provider, web3Context?.account, data.id, price)
        dispatch(updateMarketplaceItemPrice({id: data.id, price: 0, tradingVolume: price}))
        dispatch(updateOwner({id: data.id, owner: web3Context?.account}))
        dispatch(fetchNFTDetailDataSync({id: data.id}))
        setHash(_hash.transactionHash)
        setPendingTx(false)
        setSuccessTx(true)
        const body = {
          public_key: web3Context?.account.toLowerCase(),
          typeN: "buy",
          desc: price,
          id: data.id,
          transaction: _hash.transactionHash
        };
        axios.post(`${URI}/notification/add`, {params: encryptParams(body)}).then((res) => {
          console.log(res);
        });
      } else {
        toast.error('Confirm the wallet connected.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        setPendingTx(false)
      }          
    } catch (error) {
      setPendingTx(false)
    }
    // setTimeout(() => {
    //   setTime(true);
    // }, 1000);
    
  }

  return (
    <div >
        <div className=' w-full flex items-center justify-between px-3 py-2 border-gray-800 mb-4 border-b'>
            <h1 className=' text-xl text-white'>Complete checkout</h1> <VscChromeClose onClick={() => setBuyModal(false)} className=' w-5 h-5 cursor-pointer text-white ' />
        </div>
        {proceed === false ? (
          <>
            <div className=' py-3 flex items-center gap-3'>
                <img className=' w-28 rounded-2xl h-24 object-cover' src={getIpfsUrl(data.id)} alt="" />
                <div>
                    <h1 className=' text-2xl text-white font-bold'>{data.name}</h1>
                    <p className=' text-gray-500'>By <span className=' text-pr'>{data.minter}</span></p>
                    <p className=' text-gray-500'>DAO Fees: <span className=' text-pr'>{`${DAO_FEE}%`}</span></p>
                </div>
            </div>

            <div className=' my-2 w-full rounded-3xl mb-8  bg-sr py-3 px-3 flex items-center justify-between'>
                <p className=' text-gray-500'>Price</p>
                <div className=' flex items-center gap-1'>
                    <img src="/images/BNB.png" className=' w-7 h-7 object-contain' alt="" />
                    <p className='text-white'>{price} 
                      {/* <span className=' text-gray-500'>{price}</span> */}
                    </p>
                </div>
            </div>

            <div className=' pt-8 w-full border-t border-gray-800'>
                <button onClick={() => {
                  handleBuy()
                }} className=' py-3 w-full border-none outline-none rounded-3xl text-br flex items-center justify-center  bg-pr font-bold'>
                    <p className=' text-br font-bold'>Checkout</p>
                </button>
            </div>
          </>        
        ) : (
          // <>
          //   <div >
          //       <>
          //           {
          //               pendingTx === true ?
          //                   <>
          //                       <h1 className=' text-xl text-white text-center py-3'>Your purchase is processing!</h1>
          //                       <p className=' text-gray-500 text-center px-4 w-full border-b border-gray-800 pb-3'>You just purchased #11Karinio Piras. it should be confirmed on the blockchain shortly.</p>
          //                       <div className=' py-5 flex items-center gap-3 justify-center'>
          //                           <img className=' w-28 rounded-2xl h-28 object-cover' src={getIpfsUrl(data.id)} alt="" />

          //                       </div>
          //                   </>
          //                   :
          //                   <div>
          //                       <h1 className=' text-2xl text-center text-white '>You have successfully bought #11karinio Piras NFT</h1>
          //                       <p className=' text-gray-500 py-2 text-center border-gray-800 border-b'>Congratulations! You have successfully bought #11karinio Piras NFT on NFT Lambo club.</p>
          //                       <div className='py-4 flex items-center justify-center'>
          //                           <img className=' w-28 rounded-2xl h-28 object-cover' src={getIpfsUrl(data.id)} alt="" />
          //                       </div>
          //                   </div>
          //           }
          //       </>
          //       {pendingTx ? <div className=' px-4 bg-sr rounded-2xl p-3'>
          //           <div className=' flex items-center justify-between border-b border-gray-800 py-2'>
          //               <p className=' text-white'>Status</p>
          //               <div className=' flex items-center gap-1'>
          //                   <svg aria-hidden="true" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-pr" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          //                       <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          //                       <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          //                   </svg>
          //                   <p className=' text-white'>Processing</p>
          //               </div>
          //           </div>
          //           <div className=' flex items-center justify-between py-2'>
          //               <p className=' text-white'>Transaction Hash</p>
          //               <p className=' text-pr'>0x1204...23b350</p>
          //           </div>
          //       </div>
          //           :
          //           <div className=' pt-8 w-full border-t border-gray-800'>
          //               <button onClick={() => setBuyModal(false)} className=' py-3 w-full border-none outline-none rounded-3xl text-br  bg-pr font-bold'>View item</button>
          //           </div>
          //       }
          //   </div>
          // </>
          
        <>
        <div className=" py-3 flex items-center justify-center w-full flex-col gap-3">
          <img
            className=" w-28 rounded-2xl h-24 object-cover"
            src={getIpfsUrl(data.id)}
            alt=""
          />
        </div>
        <>
          {pendingTx === true ? (
            <>
              <div className=" w-full bg-sr  rounded-xl my-3 py-1">
                <div className=" w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                  <p className=" text-white">Status</p>
                  <svg
                    aria-hidden="true"
                    className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-pr"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </div>
                <div className="  w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                  <p className=" text-white">Transaction Hash</p>
                  <p className=" text-pr">...</p>
                </div>
              </div>
              <div className=" pt-8 w-full flex items-center justify-center  gap-5 border-t border-gray-800">
                <button className=" py-3 px-10 border-2 w-full opacity-40 bg-gray-500 border-none  outline-none rounded-3xl text-white flex items-center justify-center   font-bold">
                  <p className="  font-bold">OK</p>
                </button>
              </div>
            </>
          ) : (
            successTx ? (
              <>
                <div className=" w-full bg-sr  rounded-xl my-3 py-1">
                  <div className=" w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                    <p className=" text-white">Status</p>
                    <div className="flex ">
                      <AiFillCheckCircle  className="text-green-500 w-5 h-5 mx-2" />
                      <p className=" text-white">Completed</p>
                    </div>
                  </div>
                  <div className="  w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                    <p className=" text-white">Transaction Hash</p>
                    <a href={`https://testnet.bscscan.com/tx/${hash}`} target="_blank">
                      <p className=" text-pr">{`${hash.substring(0, 6)}...${hash.substring(hash.length - 6, hash.length)}`}</p>
                    </a>
                  </div>
                </div>
                <div className=" pt-8 w-full flex items-center justify-center  gap-5 border-t border-gray-800">
                  <button onClick={()=>setBuyModal(false)} className=" py-3 px-10 border-2 w-full  bg-pr border-none  outline-none rounded-3xl text-sr flex items-center justify-center   font-bold">
                    <p className="  font-bold">OK</p>
                  </button>
                </div>
              </>) : (
            <>
              <div className=" w-full bg-sr  rounded-xl my-3 py-1">
                <div className=" w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                  <p className=" text-white">Status</p>
                  <div className="flex ">
                    <AiFillBug  className="text-green-500 w-5 h-5 mx-2" />
                    <p className=" text-white">Faild</p>
                  </div>
                </div>
                <div className="  w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                  <p className=" text-white">Transaction Hash</p>
                  <p className=" text-pr">...</p>
                </div>
              </div>
              <div className=" pt-8 w-full flex items-center justify-center  gap-5 border-t border-gray-800">
                <button onClick={()=>setBuyModal(false)} className=" py-3 px-10 border-2 w-full  bg-pr border-none  outline-none rounded-3xl text-sr flex items-center justify-center   font-bold">
                  <p className="  font-bold">OK</p>
                </button>
              </div>
            </>)
          )}
        </>
      </>
        )}
    </div>
  );
};

export const ClaimModal = ({ setclaimModal, data }) => {
  const [proceed, setProceed] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)
  const [successTx, setSuccessTx] = useState(false)
  const [hash, setHash] = useState("")
  const web3Context = useWeb3Context()

  const dispatch = useAppDispatch()

  var difference = data.stakingTime
  var daysDifference = Math.floor(difference/60/60/24);
  difference -= daysDifference*60*60*24

  var hoursDifference = Math.floor(difference/60/60);
  difference -= hoursDifference*60*60

  var minutesDifference = Math.floor(difference/60);

  const handleClaim = async () => {
    setProceed(true);
    try {
      if (web3Context?.provider && web3Context?.account) {
        setPendingTx(true)
        // await callApproveForAll(web3Context?.provider, web3Context?.account, getStakingAddress(), true)
        const _hash = await callClaim(web3Context?.provider, web3Context?.account, data.id)
        dispatch(updateStakingItem({id: data.id, owner: web3Context?.account, startTime: data.stakingTime, stakedDays: data.stakedDays + Math.floor(data.stakingTime/DAY_SECOND)*REWARD_PER_DAY}))
        dispatch(fetchNFTDetailDataSync({id: data.id}))
        setHash(_hash.transactionHash)
        setPendingTx(false)
        setSuccessTx(true)
        const body = {
          public_key: web3Context?.account.toLowerCase(),
          typeN: "claim",
          desc: Math.floor(data.stakingTime/DAY_SECOND)*REWARD_PER_DAY,
          id: data.id,
          transaction: _hash.transactionHash
        };
        axios.post(`${URI}/notification/add`, {params: encryptParams(body)}).then((res) => {
          console.log(res);
        });
      } else {
        toast.error('Confirm the wallet connected.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        setPendingTx(false)
      }
    } catch (error) {
      setPendingTx(false)
    }
    // setTimeout(() => {
    //   setTime(true);
    // }, 1000);
    
  }

  return (
    <div>
      <div className=" w-full flex items-center justify-between px-3 py-2 border-gray-800 mb-4 border-b">
        <h1 className=" text-xl text-white">Claim rewards for your item</h1>
        <VscChromeClose
          onClick={() => setclaimModal(false)}
          className=" w-5 h-5 cursor-pointer text-white "
        />
      </div>
      {proceed === false ? (
        <>
          <div className=" py-3 flex items-center gap-3">
            <img
              className=" w-28 rounded-2xl h-24 object-cover"
              src={getIpfsUrl(data.id)}
              alt=""
            />
            <div>
              <h1 className=" text-2xl text-white font-bold">
                {data.name}
              </h1>
              <p className=" text-gray-500">
                By <span className=" text-pr">{data.minter}</span>
              </p>
              {/* <p className=" text-white">
                Token: <span className=" text-pr">55c345C3UV</span>
              </p> */}
            </div>
          </div>

          <div className=" my-2 w-full rounded-xl  bg-sr py-3 px-4 flex items-center justify-between">
            <p className=" text-gray-500">Token ID</p>
            <p className=" text-white">{data.id}</p>
          </div>
          <div className=" w-full bg-sr  rounded-xl my-3 py-1">
            <div className=" w-full rounded-xl   py-2 px-4 flex items-center justify-between">
              <p className=" text-gray-500">Total Staking time</p>
              <p className=" text-white">{`${daysDifference} days ${hoursDifference} hours ${minutesDifference} minutes`}</p>
            </div>
            <div className="  w-full rounded-xl   py-2 px-4 flex items-center justify-between">
              <p className=" text-gray-500">Rewards</p>
              <p className=" text-white">{`${Math.floor(data.stakingTime/DAY_SECOND)*REWARD_PER_DAY} TAU`}</p>
            </div>
            {/* <div className="  w-full rounded-xl   py-2 px-4 flex items-center justify-between">
              <p className=" text-gray-500">Total Fee</p>
              <p className=" text-white">0.03 BNB</p>
            </div> */}
          </div>
          <div className=" pt-8 w-full grid grid-cols-2 gap-5 border-t border-gray-800">
            <button
              onClick={() => setclaimModal(false)}
              className=" py-3 w-full border-2 border-pr outline-none rounded-3xl text-pr flex items-center justify-center   font-bold"
            >
              <p className="  font-bold">Go back</p>
            </button>
            <button
              onClick={() => handleClaim()}
              className=" py-3 w-full border-none outline-none rounded-3xl text-br flex items-center justify-center  bg-pr font-bold"
              disabled={Math.floor(data.stakingTime/DAY_SECOND) === 0}
            >
              <p className=" text-br font-bold">Proceed</p>
            </button>
          </div>
        </>
      ) : (
        <>
          <div className=" py-3 flex items-center justify-center w-full flex-col gap-3">
            <img
              className=" w-28 rounded-2xl h-24 object-cover"
              src={getIpfsUrl(data.id)}
              alt=""
            />
          </div>
          <>
            {pendingTx === true ? (
              <>
                <div className=" w-full bg-sr  rounded-xl my-3 py-1">
                  <div className=" w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                    <p className=" text-white">Status</p>
                    <svg
                      aria-hidden="true"
                      className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-pr"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
                  <div className="  w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                    <p className=" text-white">Transaction Hash</p>
                    <p className=" text-pr">...</p>
                  </div>
                </div>
                <div className=" pt-8 w-full flex items-center justify-center  gap-5 border-t border-gray-800">
                  <button className=" py-3 px-10 border-2 w-full opacity-40 bg-gray-500 border-none  outline-none rounded-3xl text-white flex items-center justify-center   font-bold">
                    <p className="  font-bold">OK</p>
                  </button>
                </div>
              </>
            ) : (
              successTx ? (
                <>
                  <div className=" w-full bg-sr  rounded-xl my-3 py-1">
                    <div className=" w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                      <p className=" text-white">Status</p>
                      <div className="flex ">
                        <AiFillCheckCircle  className="text-green-500 w-5 h-5 mx-2" />
                        <p className=" text-white">Completed</p>
                      </div>
                    </div>
                    <div className="  w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                      <p className=" text-white">Transaction Hash</p>
                      <a href={`https://testnet.bscscan.com/tx/${hash}`} target="_blank">
                        <p className=" text-pr">{`${hash.substring(0, 6)}...${hash.substring(hash.length - 6, hash.length)}`}</p>
                      </a>
                    </div>
                  </div>
                  <div className=" pt-8 w-full flex items-center justify-center  gap-5 border-t border-gray-800">
                    <button onClick={()=>setclaimModal(false)} className=" py-3 px-10 border-2 w-full  bg-pr border-none  outline-none rounded-3xl text-sr flex items-center justify-center   font-bold">
                      <p className="  font-bold">OK</p>
                    </button>
                  </div>
                </>) : (
              <>
                <div className=" w-full bg-sr  rounded-xl my-3 py-1">
                  <div className=" w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                    <p className=" text-white">Status</p>
                    <div className="flex ">
                      <AiFillBug  className="text-green-500 w-5 h-5 mx-2" />
                      <p className=" text-white">Faild</p>
                    </div>
                  </div>
                  <div className="  w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                    <p className=" text-white">Transaction Hash</p>
                    <p className=" text-pr">...</p>
                  </div>
                </div>
                <div className=" pt-8 w-full flex items-center justify-center  gap-5 border-t border-gray-800">
                  <button onClick={()=>setclaimModal(false)} className=" py-3 px-10 border-2 w-full  bg-pr border-none  outline-none rounded-3xl text-sr flex items-center justify-center   font-bold">
                    <p className="  font-bold">OK</p>
                  </button>
                </div>
              </>)
            )}
          </>
        </>
      )}
    </div>
  );
};

export const UnStakeModal = ({ setUnstake, data }) => {
  const [proceed, setProceed] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)
  const [successTx, setSuccessTx] = useState(false)
  const [hash, setHash] = useState("")
  const web3Context = useWeb3Context()

  const dispatch = useAppDispatch()

  const handleUnStake = async () => {
    setProceed(true);
    try {
      if (web3Context?.provider && web3Context?.account) {
        setPendingTx(true)
        // await callApproveForAll(web3Context?.provider, web3Context?.account, getStakingAddress(), true)
        const _hash = await callUnstakeNFT(web3Context?.provider, web3Context?.account, data.id)
        dispatch(updateOwner({id: data.id, owner: web3Context?.account}))
        dispatch(updateStakingItem({id: data.id, owner: NULL_ADDRESS, startTime: 0, stakedDays: data.stakedDays}))
        dispatch(fetchNFTDetailDataSync({id: data.id}))
        setHash(_hash.transactionHash)
        setPendingTx(false)
        setSuccessTx(true)
        const body = {
          public_key: web3Context?.account.toLowerCase(),
          typeN: "unstake",
          desc: "",
          id: data.id,
          transaction: _hash.transactionHash
        };
        axios.post(`${URI}/notification/add`, {params: encryptParams(body)}).then((res) => {
          console.log(res);
        });
      } else {
        toast.error('Confirm the wallet connected.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        setPendingTx(false)
      }
    } catch (error) {
      setPendingTx(false)
    }
    // setTimeout(() => {
    //   setTime(true);
    // }, 1000);
    
  }

  return (
    <div>
      <div className=" w-full flex items-center justify-between px-3 py-2 border-gray-800 mb-4 border-b">
        <h1 className=" text-xl text-white">Unstake your NFT</h1>
        <VscChromeClose
          onClick={() => setUnstake(false)}
          className=" w-5 h-5 cursor-pointer text-white "
        />
      </div>
      {proceed === false ? (
        <>
          <div className=" py-3 flex items-center gap-3">
            <img
              className=" w-28 rounded-2xl h-24 object-cover"
              src={getIpfsUrl(data.id)}
              alt=""
            />
            <div>
              <h1 className=" text-2xl text-white font-bold">
                {data.name}
              </h1>
              <p className=" text-gray-500">
                By <span className=" text-pr">{data.minter}</span>
              </p>
              {/* <p className=" text-white">
                Token: <span className=" text-pr">55c345C3UV</span>
              </p> */}
            </div>
          </div>

          <div className=" my-2 w-full rounded-xl  bg-sr py-3 px-4 flex items-center justify-between">
            <p className=" text-gray-500">Token ID</p>
            <p className=" text-white">{data.id}</p>
          </div>
          <div className=" w-full bg-sr  rounded-xl my-3 py-1">
            <div className=" w-full rounded-xl   py-2 px-4 flex items-center justify-between">
              <p className=" text-gray-500">Total claimed Rewards</p>
              <p className=" text-white">{`${data.mintedTokens} TAU`}</p>
            </div>

            {/* <div className="  w-full rounded-xl   py-2 px-4 flex items-center justify-between">
              <p className=" text-gray-500">Total Fee</p>
              <p className=" text-white">0.03 BNB</p>
            </div> */}
          </div>
          <div className=" pt-8 w-full grid grid-cols-2 gap-5 border-t border-gray-800">
            <button
              onClick={() => setUnstake(false)}
              className=" py-3 w-full border-2 border-pr outline-none rounded-3xl text-pr flex items-center justify-center   font-bold"
            >
              <p className="  font-bold">Go back</p>
            </button>
            <button
              onClick={() => handleUnStake()}
              className=" py-3 w-full border-none outline-none rounded-3xl text-br flex items-center justify-center  bg-pr font-bold"
            >
              <p className=" text-br font-bold">Proceed</p>
            </button>
          </div>
        </>
      ) : (
        <>
          <div className=" py-3 flex items-center justify-center w-full flex-col gap-3">
            <img
              className=" w-28 rounded-2xl h-24 object-cover"
              src={getIpfsUrl(data.id)}
              alt=""
            />
          </div>
          <>
            {pendingTx === true ? (
              <>
                <div className=" w-full bg-sr  rounded-xl my-3 py-1">
                  <div className=" w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                    <p className=" text-white">Status</p>
                    <svg
                      aria-hidden="true"
                      className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-pr"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
                  <div className="  w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                    <p className=" text-white">Transaction Hash</p>
                    <p className=" text-pr">...</p>
                  </div>
                </div>
                <div className=" pt-8 w-full flex items-center justify-center  gap-5 border-t border-gray-800">
                  <button className=" py-3 px-10 border-2 w-full opacity-40 bg-gray-500 border-none  outline-none rounded-3xl text-white flex items-center justify-center   font-bold">
                    <p className="  font-bold">OK</p>
                  </button>
                </div>
              </>
            ) : (
              successTx ? (
                <>
                  <div className=" w-full bg-sr  rounded-xl my-3 py-1">
                    <div className=" w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                      <p className=" text-white">Status</p>
                      <div className="flex ">
                        <AiFillCheckCircle  className="text-green-500 w-5 h-5 mx-2" />
                        <p className=" text-white">Completed</p>
                      </div>
                    </div>
                    <div className="  w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                      <p className=" text-white">Transaction Hash</p>
                      <a href={`https://testnet.bscscan.com/tx/${hash}`} target="_blank">
                        <p className=" text-pr">{`${hash.substring(0, 6)}...${hash.substring(hash.length - 6, hash.length)}`}</p>
                      </a>
                    </div>
                  </div>
                  <div className=" pt-8 w-full flex items-center justify-center  gap-5 border-t border-gray-800">
                    <button onClick={()=>setUnstake(false)} className=" py-3 px-10 border-2 w-full  bg-pr border-none  outline-none rounded-3xl text-sr flex items-center justify-center   font-bold">
                      <p className="  font-bold">OK</p>
                    </button>
                  </div>
                </>) : (
              <>
                <div className=" w-full bg-sr  rounded-xl my-3 py-1">
                  <div className=" w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                    <p className=" text-white">Status</p>
                    <div className="flex ">
                      <AiFillBug  className="text-green-500 w-5 h-5 mx-2" />
                      <p className=" text-white">Faild</p>
                    </div>
                  </div>
                  <div className="  w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                    <p className=" text-white">Transaction Hash</p>
                    <p className=" text-pr">...</p>
                  </div>
                </div>
                <div className=" pt-8 w-full flex items-center justify-center  gap-5 border-t border-gray-800">
                  <button onClick={()=>setUnstake(false)} className=" py-3 px-10 border-2 w-full  bg-pr border-none  outline-none rounded-3xl text-sr flex items-center justify-center   font-bold">
                    <p className="  font-bold">OK</p>
                  </button>
                </div>
              </>)
            )}
          </>
        </>
      )}
    </div>
  );
};

export const StakeModal = ({ setStake, data }) => {
  const [pendingApproval, setPendingApproval] = useState(false)
  const [proceed, setProceed] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)
  const [successTx, setSuccessTx] = useState(false)
  const [hash, setHash] = useState("")
  const web3Context = useWeb3Context()
  const [isApproved, setIsApproved] = useState(false)

  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchApproveState = async () => {      
      const nftContract = getNFTContract(web3Context?.provider)
      const _isApproved = await nftContract.methods.isApprovedForAll(web3Context?.account, getStakingAddress()).call()
      setIsApproved(_isApproved)
    }
    if(web3Context?.provider && web3Context?.account) {
      fetchApproveState()
    }
  }, [web3Context, pendingApproval])

  const handleStake = async () => {
    setProceed(true);
    try {
      if (web3Context?.provider && web3Context?.account) {
        setPendingTx(true)
        // await callApproveForAll(web3Context?.provider, web3Context?.account, getStakingAddress(), true)
        const _hash = await callStakeNFT(web3Context?.provider, web3Context?.account, data.id)
        dispatch(updateOwner({id: data.id, owner: getStakingAddress()}))
        dispatch(updateStakingItem({id: data.id, owner: web3Context?.account, startTime: new Date() + 120, stakedDays: data.stakedDays}))
        dispatch(fetchNFTDetailDataSync({id: data.id}))
        setHash(_hash.transactionHash)
        setPendingTx(false)
        setSuccessTx(true)
        const body = {
          public_key: web3Context?.account.toLowerCase(),
          typeN: "stake",
          desc: "",
          id: data.id,
          transaction: _hash.transactionHash
        };
        axios.post(`${URI}/notification/add`, {params: encryptParams(body)}).then((res) => {
          console.log(res);
        });
      } else {
        toast.error('Confirm the wallet connected.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        setPendingTx(false)
      }
    } catch (error) {
      setPendingTx(false)
    }
    // setTimeout(() => {
    //   setTime(true);
    // }, 1000);
    
  }

  const handleApprove = async () => {
    try {
      if (web3Context?.provider && web3Context?.account) {
        setPendingApproval(true)
        // await callApproveForAll(web3Context?.provider, web3Context?.account, getStakingAddress(), true)
        await callApproveForAll(web3Context?.provider, web3Context?.account, getStakingAddress(), true)
        setIsApproved(true)
        setPendingApproval(false)
      }                  
    } catch (error) {
      setPendingApproval(false)
    }
  }

  return (
    <div>
      <div className=" w-full flex items-center justify-between px-3 py-2 border-gray-800 mb-4 border-b">
        <h1 className=" text-xl text-white">
          Stake <span className=" text-pr">{data.name}</span>
        </h1>
        <VscChromeClose
          onClick={() => setStake(false)}
          className=" w-5 h-5 cursor-pointer text-white "
        />
      </div>
      {proceed === false ? (
        <>
          <div className=" py-3 flex items-center justify-center w-full flex-col gap-3">
            <img
              className=" w-28 rounded-2xl h-24 object-cover"
              src={getIpfsUrl(data.id)}
              alt=""
            />
            <p>
              Do you want to stake{" "}
              <span className=" text-pr">{data.name}</span>
            </p>
          </div>

          <div className=" pt-8 w-full grid grid-cols-2 gap-5 border-t border-gray-800">
            <button
              onClick={() => setStake(false)}
              className=" py-3 w-full border-2 border-pr outline-none rounded-3xl text-pr flex items-center justify-center   font-bold"
            >
              <p className="  font-bold">Cancel</p>
            </button>
            <button
              onClick={isApproved? handleStake : handleApprove}
              className=" py-3 w-full border-none outline-none rounded-3xl text-br flex items-center justify-center  bg-pr font-bold"
              disabled={pendingApproval}
            >
              {pendingApproval ? 
                <svg aria-hidden="true" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-pr" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg> 
                : 
                <p className=" text-br font-bold">{isApproved? "Stake" : "Approve"}</p>}              
            </button>
          </div>
        </>
      ) : (
        <>
          <div className=" py-3 flex items-center justify-center w-full flex-col gap-3">
            <img
              className=" w-28 rounded-2xl h-24 object-cover"
              src={getIpfsUrl(data.id)}
              alt=""
            />
          </div>
          <>
            {pendingTx === true ? (
              <>
                <div className=" w-full bg-sr  rounded-xl my-3 py-1">
                  <div className=" w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                    <p className=" text-white">Status</p>
                    <svg
                      aria-hidden="true"
                      className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-pr"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
                  <div className="  w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                    <p className=" text-white">Transaction Hash</p>
                    <p className=" text-pr">...</p>
                  </div>
                </div>
                <div className=" pt-8 w-full flex items-center justify-center  gap-5 border-t border-gray-800">
                  <button className=" py-3 px-10 border-2 w-full opacity-40 bg-gray-500 border-none  outline-none rounded-3xl text-white flex items-center justify-center   font-bold">
                    <p className="  font-bold">OK</p>
                  </button>
                </div>
              </>
            ) : (
              successTx ? (
                <>
                  <div className=" w-full bg-sr  rounded-xl my-3 py-1">
                    <div className=" w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                      <p className=" text-white">Status</p>
                      <div className="flex ">
                        <AiFillCheckCircle  className="text-green-500 w-5 h-5 mx-2" />
                        <p className=" text-white">Completed</p>
                      </div>
                    </div>
                    <div className="  w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                      <p className=" text-white">Transaction Hash</p>
                      <a href={`https://testnet.bscscan.com/tx/${hash}`} target="_blank">
                        <p className=" text-pr">{`${hash.substring(0, 6)}...${hash.substring(hash.length - 6, hash.length)}`}</p>
                      </a>
                    </div>
                  </div>
                  <div className=" pt-8 w-full flex items-center justify-center  gap-5 border-t border-gray-800">
                    <button onClick={()=>setStake(false)} className=" py-3 px-10 border-2 w-full  bg-pr border-none  outline-none rounded-3xl text-sr flex items-center justify-center   font-bold">
                      <p className="  font-bold">OK</p>
                    </button>
                  </div>
                </>) : (
              <>
                <div className=" w-full bg-sr  rounded-xl my-3 py-1">
                  <div className=" w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                    <p className=" text-white">Status</p>
                    <div className="flex ">
                      <AiFillBug  className="text-green-500 w-5 h-5 mx-2" />
                      <p className=" text-white">Faild</p>
                    </div>
                  </div>
                  <div className="  w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                    <p className=" text-white">Transaction Hash</p>
                    <p className=" text-pr">...</p>
                  </div>
                </div>
                <div className=" pt-8 w-full flex items-center justify-center  gap-5 border-t border-gray-800">
                  <button onClick={()=>setStake(false)} className=" py-3 px-10 border-2 w-full  bg-pr border-none  outline-none rounded-3xl text-sr flex items-center justify-center   font-bold">
                    <p className="  font-bold">OK</p>
                  </button>
                </div>
              </>)
            )}
          </>
        </>
      )}
    </div>
  );
};

export const EditModal = ({ setEditModal, data }) => {
  const [price, setPrice] = useState(10)
  const [pendingApproval, setPendingApproval] = useState(false)
  const [proceed, setProceed] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)
  const [successTx, setSuccessTx] = useState(false)
  const [hash, setHash] = useState("")
  const web3Context = useWeb3Context()
  const [isApproved, setIsApproved] = useState(false)

  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchApproveState = async () => {      
      const nftContract = getNFTContract(web3Context?.provider)
      const _isApproved = await nftContract.methods.isApprovedForAll(web3Context?.account, getRegisterAddress()).call()
      setIsApproved(_isApproved)
    }
    if(web3Context?.provider && web3Context?.account) {
      fetchApproveState()
    }
  }, [web3Context, pendingApproval])

  const handleEdit = async () => {
    setProceed(true);
    try {
      if (web3Context?.provider && web3Context?.account) {
        setPendingTx(true)
        // await callApproveForAll(web3Context?.provider, web3Context?.account, getStakingAddress(), true)
        const _hash = await callEdit(web3Context?.provider, web3Context?.account, data.id, price)
        dispatch(updateMarketplaceItemPrice({id: data.id, price: price, tradingVolume: 0}))
        setHash(_hash.transactionHash)
        setPendingTx(false)
        setSuccessTx(true)
      } else {
        toast.error('Confirm the wallet connected.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        setPendingTx(false)
      }
    } catch (error) {
      setPendingTx(false)
    }
    // setTimeout(() => {
    //   setTime(true);
    // }, 1000);
    
  }

  const handleApprove = async () => {
    try {
      if (web3Context?.provider && web3Context?.account) {
        setPendingApproval(true)
        // await callApproveForAll(web3Context?.provider, web3Context?.account, getStakingAddress(), true)
        await callApproveForAll(web3Context?.provider, web3Context?.account, getRegisterAddress(), true)
        setIsApproved(true)
        setPendingApproval(false)
      }                  
    } catch (error) {
      setPendingApproval(false)
    }
  }

  return (
    <div>
      <div className=" w-full flex items-center justify-between px-3 py-2 border-gray-800 mb-4 border-b">
        <h1 className=" text-xl text-white">
          Edit <span className=" text-pr">{data.name}</span>
        </h1>{" "}
        <VscChromeClose
          onClick={() => setEditModal(false)}
          className=" w-5 h-5 cursor-pointer text-white "
        />
      </div>
      {proceed == false ? (
        <>
          <div className=" py-3 flex items-center gap-3">
            <img
              className=" w-28 rounded-2xl h-24 object-cover"
              src={getIpfsUrl(data.id)}
              alt=""
            />
            <div>
              <h1 className=" text-2xl text-white font-bold">{data.name}</h1>
              <p className=" text-gray-500">
                By <span className=" text-pr">{data.minter}</span>
              </p>
            </div>
          </div>
          {/* <div className=" py-3">
            <p className=" text-gray-500 text-sm">Contract address</p>
            <p className=" text-pr">0x2E47d5f8d3C760381B96DF03fe96690..</p>
          </div> */}
          <p className=" text-gray-100">Set Price</p>
          <div className=" my-2 w-full rounded-3xl  bg-sr py-3 px-3 flex items-center justify-between">
            {/* <p className=" text-white">{price}</p> */}
            <input value={price} onChange={(e) => {setPrice(e.target.value)}} type="text" placeholder='Input the price to sell.' className='text-sm w-full px-3 lg:w-5/6 bg-sr outline-none border-sr' />
            <div className=" flex items-center gap-1">
              <img
                src="/images/BNB.png"
                className=" w-7 h-7 object-contain"
                alt=""
              />
            </div>
          </div>
          <p className=" text-sm text-gray-500 p">Fee</p>
          <div className="  flex items-cente gap-1 pb-4">
            <p className=" text-white mx-2">{`${price * 20 / 100} BNB`}</p>
            <div className=" flex items-center gap-1">
              <img
                src="/images/BNB.png"
                className=" w-5 h-5 object-contain"
                alt=""
              />
            </div>
          </div>
          <p className=" text-sm text-white py-3">
            20% on the total sale will be paid to DAO to develop the projects and
            support them in the long term
          </p>
          <div className=" pt-8 w-full border-t border-gray-800">
            <button
              onClick={isApproved? handleEdit : handleApprove}
              className=" py-3 w-full border-none outline-none rounded-3xl text-br flex items-center justify-center  bg-pr font-bold"
            >
              {pendingApproval ? 
                <svg aria-hidden="true" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-pr" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg> 
                : 
                <p className=" text-br font-bold">{isApproved? "Update" : "Approve"}</p>}              
            </button>
          </div>
        </>
      ) : (
        <>
          <div className=" py-3 flex items-center justify-center w-full flex-col gap-3">
            <img
              className=" w-28 rounded-2xl h-24 object-cover"
              src={getIpfsUrl(data.id)}
              alt=""
            />
          </div>
          <>
            {pendingTx === true ? (
              <>
                <div className=" w-full bg-sr  rounded-xl my-3 py-1">
                  <div className=" w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                    <p className=" text-white">Status</p>
                    <svg
                      aria-hidden="true"
                      className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-pr"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
                  <div className="  w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                    <p className=" text-white">Transaction Hash</p>
                    <p className=" text-pr">...</p>
                  </div>
                </div>
                <div className=" pt-8 w-full flex items-center justify-center  gap-5 border-t border-gray-800">
                  <button className=" py-3 px-10 border-2 w-full opacity-40 bg-gray-500 border-none  outline-none rounded-3xl text-white flex items-center justify-center   font-bold">
                    <p className="  font-bold">OK</p>
                  </button>
                </div>
              </>
            ) : (
              successTx ? (
                <>
                  <div className=" w-full bg-sr  rounded-xl my-3 py-1">
                    <div className=" w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                      <p className=" text-white">Status</p>
                      <div className="flex ">
                        <AiFillCheckCircle  className="text-green-500 w-5 h-5 mx-2" />
                        <p className=" text-white">Completed</p>
                      </div>
                    </div>
                    <div className="  w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                      <p className=" text-white">Transaction Hash</p>
                      <a href={`https://testnet.bscscan.com/tx/${hash}`} target="_blank">
                        <p className=" text-pr">{`${hash.substring(0, 6)}...${hash.substring(hash.length - 6, hash.length)}`}</p>
                      </a>
                    </div>
                  </div>
                  <div className=" pt-8 w-full flex items-center justify-center  gap-5 border-t border-gray-800">
                    <button onClick={()=>setEditModal(false)} className=" py-3 px-10 border-2 w-full  bg-pr border-none  outline-none rounded-3xl text-sr flex items-center justify-center   font-bold">
                      <p className="  font-bold">OK</p>
                    </button>
                  </div>
                </>) : (
              <>
                <div className=" w-full bg-sr  rounded-xl my-3 py-1">
                  <div className=" w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                    <p className=" text-white">Status</p>
                    <div className="flex ">
                      <AiFillBug  className="text-green-500 w-5 h-5 mx-2" />
                      <p className=" text-white">Faild</p>
                    </div>
                  </div>
                  <div className="  w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                    <p className=" text-white">Transaction Hash</p>
                    <p className=" text-pr">...</p>
                  </div>
                </div>
                <div className=" pt-8 w-full flex items-center justify-center  gap-5 border-t border-gray-800">
                  <button onClick={()=>setEditModal(false)} className=" py-3 px-10 border-2 w-full  bg-pr border-none  outline-none rounded-3xl text-sr flex items-center justify-center   font-bold">
                    <p className="  font-bold">OK</p>
                  </button>
                </div>
              </>)
            )}
          </>
        </>)}
      
    </div>
  );
};

export const CancelListingModal = ({ setCancelListingModal, data }) => {
  const [proceed, setProceed] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)
  const [successTx, setSuccessTx] = useState(false)
  const [hash, setHash] = useState("")
  const web3Context = useWeb3Context()

  const dispatch = useAppDispatch()

  const handleCancelListing = async () => {
    setProceed(true);
    try {
      if (web3Context?.provider && web3Context?.account) {
        setPendingTx(true)
        // await callApproveForAll(web3Context?.provider, web3Context?.account, getStakingAddress(), true)
        const _hash = await callCancelSell(web3Context?.provider, web3Context?.account, data.id)
        dispatch(updateMarketplaceItemPrice({id: data.id, price: 0, tradingVolume: 0}))
        setHash(_hash.transactionHash)
        setPendingTx(false)
        setSuccessTx(true)
      } else {
        toast.error('Confirm the wallet connected.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        setPendingTx(false)
      }
    } catch (error) {
      setPendingTx(false)
    }
    // setTimeout(() => {
    //   setTime(true);
    // }, 1000);
    
  }

  return (
    <div>
      <div className=" w-full flex items-center justify-between px-3 py-2 border-gray-800 mb-4 border-b">
        <h1 className=" text-xl text-white">Cancel listing your NFT</h1>
        <VscChromeClose
          onClick={() => setCancelListingModal(false)}
          className=" w-5 h-5 cursor-pointer text-white "
        />
      </div>
      {proceed === false ? (        <>
          <div className=" py-3 flex items-center justify-center w-full flex-col gap-3">
            <img
              className=" w-28 rounded-2xl h-24 object-cover"
              src={getIpfsUrl(data.id)}
              alt=""
            />
            <p>
              Do you want to cancel listing to sell {" "}
              <span className=" text-pr">{data.name}</span>
            </p>
          </div>

          <div className=" pt-8 w-full grid grid-cols-2 gap-5 border-t border-gray-800">
            <button
              onClick={() => setCancelListingModal(false)}
              className=" py-3 w-full border-2 border-pr outline-none rounded-3xl text-pr flex items-center justify-center   font-bold"
            >
              <p className="  font-bold">No</p>
            </button>
            <button
              onClick={handleCancelListing}
              className=" py-3 w-full border-none outline-none rounded-3xl text-br flex items-center justify-center  bg-pr font-bold"
            >
                <p className=" text-br font-bold">Yes</p>          
            </button>
          </div>
        </>
      ) : (
        <>
          <div className=" py-3 flex items-center justify-center w-full flex-col gap-3">
            <img
              className=" w-28 rounded-2xl h-24 object-cover"
              src={getIpfsUrl(data.id)}
              alt=""
            />
          </div>
          <>
            {pendingTx === true ? (
              <>
                <div className=" w-full bg-sr  rounded-xl my-3 py-1">
                  <div className=" w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                    <p className=" text-white">Status</p>
                    <svg
                      aria-hidden="true"
                      className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-pr"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
                  <div className="  w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                    <p className=" text-white">Transaction Hash</p>
                    <p className=" text-pr">...</p>
                  </div>
                </div>
                <div className=" pt-8 w-full flex items-center justify-center  gap-5 border-t border-gray-800">
                  <button className=" py-3 px-10 border-2 w-full opacity-40 bg-gray-500 border-none  outline-none rounded-3xl text-white flex items-center justify-center   font-bold">
                    <p className="  font-bold">OK</p>
                  </button>
                </div>
              </>
            ) : (
              successTx ? (
                <>
                  <div className=" w-full bg-sr  rounded-xl my-3 py-1">
                    <div className=" w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                      <p className=" text-white">Status</p>
                      <div className="flex ">
                        <AiFillCheckCircle  className="text-green-500 w-5 h-5 mx-2" />
                        <p className=" text-white">Completed</p>
                      </div>
                    </div>
                    <div className="  w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                      <p className=" text-white">Transaction Hash</p>
                      <a href={`https://testnet.bscscan.com/tx/${hash}`} target="_blank">
                        <p className=" text-pr">{`${hash.substring(0, 6)}...${hash.substring(hash.length - 6, hash.length)}`}</p>
                      </a>
                    </div>
                  </div>
                  <div className=" pt-8 w-full flex items-center justify-center  gap-5 border-t border-gray-800">
                    <button onClick={()=>setCancelListingModal(false)} className=" py-3 px-10 border-2 w-full  bg-pr border-none  outline-none rounded-3xl text-sr flex items-center justify-center   font-bold">
                      <p className="  font-bold">OK</p>
                    </button>
                  </div>
                </>) : (
              <>
                <div className=" w-full bg-sr  rounded-xl my-3 py-1">
                  <div className=" w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                    <p className=" text-white">Status</p>
                    <div className="flex ">
                      <AiFillBug  className="text-green-500 w-5 h-5 mx-2" />
                      <p className=" text-white">Faild</p>
                    </div>
                  </div>
                  <div className="  w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                    <p className=" text-white">Transaction Hash</p>
                    <p className=" text-pr">...</p>
                  </div>
                </div>
                <div className=" pt-8 w-full flex items-center justify-center  gap-5 border-t border-gray-800">
                  <button onClick={()=>setCancelListingModal(false)} className=" py-3 px-10 border-2 w-full  bg-pr border-none  outline-none rounded-3xl text-sr flex items-center justify-center   font-bold">
                    <p className="  font-bold">OK</p>
                  </button>
                </div>
              </>)
            )}
          </>
        </>
      )}
    </div>
  );
};

export const TaurusModal = ({ setTaurusModal, isBuy, inputState, bnbAmount, lmbAmount, setBNBAmount, setLmbAmount }) => {
  const [proceed, setProceed] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)
  const [pendingApproval, setPendingApproval] = useState(false)
  const [successTx, setSuccessTx] = useState(false)
  const [allowance, setAllowance] = useState(0)
  const [hash, setHash] = useState("")
  const web3Context = useWeb3Context()
  
  useEffect(() => {
    const fetchApproveState = async () => {      
      const rewardContract = getRewardContract(web3Context?.provider)
      const allowance = await rewardContract.methods.allowance(web3Context?.account, getRouterAddress()).call()
      setAllowance(ethers.utils.formatEther(allowance))
    }
    if(web3Context?.provider && web3Context?.account) {
      fetchApproveState()
    }
  }, [web3Context, pendingApproval])

  const buyProcess = async () => {
    // const blocknumber = await ethers.getDefaultProvider(RPC_URL).getBlockNumber()
    // const timestamp = await (await ethers.getDefaultProvider(RPC_URL).getBlock(blocknumber)).timestamp
    const deadline = Math.floor(Date.now() / 1000) + 120 + 30
    let _hash = ''
    if(inputState) {
      const lmbAmountOut = lmbAmount * (100 - SLIP_PAGE) / 100
      _hash = await callBuyIn(web3Context?.provider, web3Context?.account, bnbAmount, lmbAmountOut, [getWBNBAddress(), getRewardAddress()], web3Context?.account, deadline)
    } else {
      const bnbAmountIn = bnbAmount * (100 + SLIP_PAGE) / 100
      _hash = await callBuyOut(web3Context?.provider, web3Context?.account, bnbAmountIn, lmbAmount, [getWBNBAddress(), getRewardAddress()], web3Context?.account, deadline)
    }
    setHash(_hash.transactionHash)
    const body = {
        public_key: web3Context?.account.toLowerCase(),
        typeN: "buylambo",
        desc: lmbAmount,
        transaction: _hash.transactionHash
      };
      axios.post(`${URI}/notification/add`, {params: encryptParams(body)}).then((res) => {
        console.log(res);
      });
  }

  const sellProcess = async () => {
    // const blocknumber = await ethers.getDefaultProvider(RPC_URL).getBlockNumber()
    // const timestamp = await (await ethers.getDefaultProvider(RPC_URL).getBlock(blocknumber)).timestamp
    const deadline = Math.floor(Date.now() / 1000) + 120 + 30
    let _hash = ''
    if(inputState) {
      const bnbAmountOut = bnbAmount * (100 - SLIP_PAGE) / 100
      _hash = await callSellIn(web3Context?.provider, web3Context?.account, lmbAmount, bnbAmountOut, [getRewardAddress(), getWBNBAddress()], web3Context?.account, deadline)
    } else {
      const lmbAmountOut = lmbAmount * (100 + SLIP_PAGE) / 100
      _hash = await callSellOut(web3Context?.provider, web3Context?.account, bnbAmount, lmbAmountOut, [getRewardAddress(), getWBNBAddress()], web3Context?.account, deadline)
    }
    setHash(_hash.transactionHash)
    const body = {
        public_key: web3Context?.account.toLowerCase(),
        typeN: "selllambo",
        desc: lmbAmount,
        transaction: _hash.transactionHash
      };
      axios.post(`${URI}/notification/add`, {params: encryptParams(body)}).then((res) => {
        console.log(res);
      });
  }

  const handleSwap = async () => {
    setProceed(true);
    try {
      if (web3Context?.provider && web3Context?.account) {
        setPendingTx(true)
        if(isBuy) {
          await buyProcess()
        } else {
          await sellProcess()
        }
        setBNBAmount(0)
        setLmbAmount(0)
        setPendingTx(false)
        setSuccessTx(true)
      } else {
        toast.error('Confirm the wallet connected.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        setPendingTx(false)
      }
    } catch (error) {
      console.error(error)
      setPendingTx(false)
    }
  }

  const handleApprove = async () => {
    try {
      if (web3Context?.provider && web3Context?.account) {
        setPendingApproval(true)
        // await callApproveForAll(web3Context?.provider, web3Context?.account, getStakingAddress(), true)
        await callApproveForErc20(web3Context?.provider, web3Context?.account, getRouterAddress())
        setIsApproved(true)
        setPendingApproval(false)
      }                  
    } catch (error) {
      setPendingApproval(false)
    }
  }

  return (
    <div>
      <div className=" w-full flex items-center justify-between px-3 py-2 border-gray-800 mb-4 border-b">
        <h1 className=" text-xl text-white">
          {`${isBuy? "Buy" : "Sell"} Taurus Tokens`}
        </h1>
        <VscChromeClose
          onClick={() => setTaurusModal(false)}
          className=" w-5 h-5 cursor-pointer text-white "
        />
      </div>
      {proceed === false ? (
        <>
        {isBuy && <div className=" py-3 flex items-center justify-center w-full flex-col gap-3">
          <p>Do you want to buy {getDisplayStringFromNumber(lmbAmount)} TAU?</p>
          <p>You have to pay {getDisplayStringFromNumber(bnbAmount)} BNB</p>
        </div>}
          {!isBuy && <div className=" py-3 flex items-center justify-center w-full flex-col gap-3">
            <p>Do you want to sell {getDisplayStringFromNumber(lmbAmount)} TAU?</p>
            <p>You might get {getDisplayStringFromNumber(bnbAmount)} BNB</p>
          </div>}

          <div className=" pt-8 w-full grid grid-cols-2 gap-5 border-t border-gray-800">
            <button
              onClick={() => setTaurusModal(false)}
              className=" py-3 w-full border-2 border-pr outline-none rounded-3xl text-pr flex items-center justify-center   font-bold"
            >
              <p className="  font-bold">Cancel</p>
            </button>
            <button
              onClick={isBuy? handleSwap :allowance > lmbAmount? handleSwap : handleApprove}
              className=" py-3 w-full border-none outline-none rounded-3xl text-br flex items-center justify-center  bg-pr font-bold"
              disabled={pendingApproval}
            >                
              {pendingApproval ? 
                <svg aria-hidden="true" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-pr" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg> 
                : 
                <p className=" text-br font-bold">{isBuy? "Buy" :allowance > lmbAmount? "Sell" : "Approve"}</p>}   
            </button>
          </div>
        </>
      ) : (
        <>
          <div className=" py-3 flex items-center justify-center w-full flex-col gap-3">
            <img
              className=" w-28 rounded-2xl h-24 object-cover"
              src={getIpfsUrl(data.id)}
              alt=""
            />
          </div>
          <>
            {pendingTx === true ? (
              <>
                <div className=" w-full bg-sr  rounded-xl my-3 py-1">
                  <div className=" w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                    <p className=" text-white">Status</p>
                    <svg
                      aria-hidden="true"
                      className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-pr"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
                  <div className="  w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                    <p className=" text-white">Transaction Hash</p>
                    <p className=" text-pr">...</p>
                  </div>
                </div>
                <div className=" pt-8 w-full flex items-center justify-center  gap-5 border-t border-gray-800">
                  <button className=" py-3 px-10 border-2 w-full opacity-40 bg-gray-500 border-none  outline-none rounded-3xl text-white flex items-center justify-center   font-bold">
                    <p className="  font-bold">OK</p>
                  </button>
                </div>
              </>
            ) : (
              successTx ? (
                <>
                  <div className=" w-full bg-sr  rounded-xl my-3 py-1">
                    <div className=" w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                      <p className=" text-white">Status</p>
                      <div className="flex ">
                        <AiFillCheckCircle  className="text-green-500 w-5 h-5 mx-2" />
                        <p className=" text-white">Completed</p>
                      </div>
                    </div>
                    <div className="  w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                      <p className=" text-white">Transaction Hash</p>
                      <a href={`https://testnet.bscscan.com/tx/${hash}`} target="_blank">
                        <p className=" text-pr">{`${hash.substring(0, 6)}...${hash.substring(hash.length - 6, hash.length)}`}</p>
                      </a>
                    </div>
                  </div>
                  <div className=" pt-8 w-full flex items-center justify-center  gap-5 border-t border-gray-800">
                    <button onClick={()=>setTaurusModal(false)} className=" py-3 px-10 border-2 w-full  bg-pr border-none  outline-none rounded-3xl text-sr flex items-center justify-center   font-bold">
                      <p className="  font-bold">OK</p>
                    </button>
                  </div>
                </>) : (
              <>
                <div className=" w-full bg-sr  rounded-xl my-3 py-1">
                  <div className=" w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                    <p className=" text-white">Status</p>
                    <div className="flex ">
                      <AiFillBug  className="text-green-500 w-5 h-5 mx-2" />
                      <p className=" text-white">Faild</p>
                    </div>
                  </div>
                  <div className="  w-full rounded-xl   py-2 px-4 flex items-center justify-between">
                    <p className=" text-white">Transaction Hash</p>
                    <p className=" text-pr">...</p>
                  </div>
                </div>
                <div className=" pt-8 w-full flex items-center justify-center  gap-5 border-t border-gray-800">
                  <button onClick={()=>setTaurusModal(false)} className=" py-3 px-10 border-2 w-full  bg-pr border-none  outline-none rounded-3xl text-sr flex items-center justify-center   font-bold">
                    <p className="  font-bold">OK</p>
                  </button>
                </div>
              </>)
            )}
          </>
        </>
      )}
    </div>
  );
};
