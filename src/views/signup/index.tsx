import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useWeb3Context } from 'hooks/useWeb3Context'
import axios from 'axios'
import { URI } from 'api-control/api'
import GlobModal from 'components/GlobModal'
import { VscChromeClose } from "react-icons/vsc"
import { AiFillCheckCircle } from "react-icons/ai"
import { registerWithSponsor, registerWithoutSponsor } from 'utils/calls'

import { fetchRegisterState } from './fetchSponsorAddress'
import { useIsRegistered, useRegisterState } from 'state/register/hooks'
import { CHAIN } from 'config'
import { toast } from 'react-toastify'
import encryptParams from 'utils/encryption'
import { updateRegister } from 'state/register'
import { useAppDispatch } from 'state/hooks'

const Signup = () => {
    const web3Context = useWeb3Context()
    const navigation = useNavigate()
    const [wallet, setWallet] = useState<string | undefined>("")
    const [referralCode, setReferralCode] = useState<string>("")
    const [modalOpen1, setModalOpen1] = useState<any>(false)
    const [modalOpen2, setModalOpen2] = useState<any>(false)
    const [modalOpen3, setModalOpen3] = useState<any>(false)
    const [modalOpen4, setModalOpen4] = useState<any>(false)
    const [errorModal, setErrorModal] = useState(false)
    const [message, setMessage] = useState<String>("")

    const dispatch = useAppDispatch()
    
    useIsRegistered(web3Context?.account)
    const registerState = useRegisterState()

    useEffect(() => {
        setWallet(web3Context?.account)
    }, [web3Context])

    // sign up with reference
    const singupWithRef = async () => {
        console.log("sniper: signup: ")
        if(web3Context?.chainId !== CHAIN) {
            toast.error('Invalid Network.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return
        }
        
        setMessage("Please do not close or refresh page.");
        setModalOpen1(true)
        if (web3Context?.provider && web3Context?.account) {
            try {
                await registerWithSponsor(web3Context?.provider, web3Context?.account, referralCode)
                const body = {
                    public_key: web3Context?.account.toLowerCase(),
                    sponsor_key: referralCode.toLowerCase()
                }
                console.log("sniper: signup: ")
                axios.post(`${URI}/auth/signp-with-ref`, {params: encryptParams(body)})
                    .then((res) => {
                        setModalOpen1(false)
                        setModalOpen4(true)
                        console.log("sniper: signup: ")
                        // dispatch(updateRegister({isRegister: true}))
                        setTimeout(() => {
                            setModalOpen4(false)
                            navigation("/")
                        }, 2000);
                    })
                    .catch((err) => {
                        setMessage(err.response.data.message)
                        setErrorModal(true)
                    })
                    .finally(() => setModalOpen1(false))

            } catch (error) {
                setMessage("Transaction Faild.");
                setErrorModal(true)
            }
        }
        setModalOpen1(false)



    }



    // sign up without ref
    const singupWithoutRef = async () => {
        console.log("sniper: singupWithoutRef")
        if(web3Context?.chainId !== CHAIN) {
            toast.error('Invalid Network.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return
        }
        
        if(registerState) {
            setMessage("This public key is already in the database.")
            setErrorModal(true)
            return
        }

        setMessage("Please do not close or refresh page.");
        setModalOpen1(true)
        if (web3Context?.provider && web3Context?.account) {
            try {
                await registerWithoutSponsor(web3Context?.provider, web3Context?.account)
                const body = {
                    public_key:  web3Context?.account.toLowerCase()
                }
                axios.post(`${URI}/auth/signup-without-ref`, {params: encryptParams(body)})
                    .then((res) => {
                        setModalOpen4(true)
                        dispatch(updateRegister({isRegister: true}))
                        setTimeout(() => {
                            navigation("/")
                        }, 2000);
                    })
                    .catch((err) => {
        
                        setMessage(err.response.data.message)
                        setErrorModal(true)
                    })
                    .finally(() => setModalOpen1(false))
                    
            } catch (error) {
                setMessage("Transaction Faild.");
                setErrorModal(true)
            }
        }
        setModalOpen1(false)

    }


    // checking the reference code
    const checkRef = async () => {
        
        if(registerState) {
            setMessage("This public key is already in the database.")
            setErrorModal(true)
            return
        }

        setMessage("Checking sponsor");
        setModalOpen1(true)
        const registered = await fetchRegisterState(referralCode)
        setModalOpen1(false)

        if(registered) {
            setModalOpen3(true)
        } else {
            setModalOpen2(true)
        }
        // const body = {
        //     ref_code: referralCode,
        // }

        // axios.post(`${URI}/auth/checkref`, body)
        //     .then((res) => {
        //         if (res?.data?.find === 1) {
        //             setModalOpen3(true)
        //         }
        //         else {
        //             setModalOpen2(true)
        //         }
        //     })
        //     .catch((err) => {
        //         console.log(err)
        //     })
        //     .finally(() => setModalOpen1(false))
    }



    // sign up check
    const signup = () => {
        if (referralCode === "") {
            
            if(registerState) {
                setMessage("This public key is already in the database.")
                setErrorModal(true)
                return
            }
    
            setModalOpen2(true)
        }
        if (referralCode !== "") {
            checkRef()
        }

    }

    return (
        <div className=' w-full'>
            <GlobModal size="sm" open={modalOpen1} setOpen={setModalOpen1} >
                <div >
                    <div className=' w-full flex items-center justify-between px-3 py-2 border-b'>
                        <h1 className=' text-xl text-white'>Registration</h1> <VscChromeClose onClick={() => setModalOpen1(false)} className=' w-5 h-5 cursor-pointer text-white ' />
                    </div>
                    <div className=' flex items-center justify-center w-full pt-10 pb-5'>
                        <svg aria-hidden="true" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-pr" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                    </div>
                    <p className=' text-sm text-center text-white py-2'>{message}</p>

                    <div className=' flex items-center justify-center py-3'>
                        <button onClick={() => setModalOpen1(false)} className=' px-16 py-2 text-sm rounded-3xl text-pr border-2 border-pr'>Cancel</button>
                    </div>
                </div>
            </GlobModal>
            <GlobModal size="sm" open={modalOpen2} setOpen={setModalOpen2} >
                <div >
                    <div className=' w-full flex items-center justify-between px-3 py-2 border-b'>
                        <h1 className=' text-xl text-white'>Registration</h1> <VscChromeClose onClick={() => setModalOpen2(false)} className=' w-5 h-5 cursor-pointer text-white ' />
                    </div>

                    <p className=' text-sm text-center text-white py-8'>Invalid Sponsor or Sponsor not provided.  Please pay <span className=' text-pr'>0.18 BNB</span> for Registration.</p>

                    <div className=' grid grid-cols-2 gap-2 py-3'>
                        <button onClick={() => setModalOpen2(false)} className=' w-full py-2 text-sm rounded-3xl text-pr border-2 border-pr'>Cancel</button>
                        <button onClick={() => {
                            setModalOpen2(false)
                            singupWithoutRef()
                        }} className=' w-full bg-pr  py-2 text-sm rounded-3xl text-br border-2 border-pr'>Pay</button>
                    </div>
                </div>
            </GlobModal>
            <GlobModal size="sm" open={modalOpen3} setOpen={setModalOpen3} >
                <div >
                    <div className=' w-full flex items-center justify-between px-3 py-2 border-b'>
                        <h1 className=' text-xl text-white'>Registration</h1> <VscChromeClose onClick={() => setModalOpen3(false)} className=' w-5 h-5 cursor-pointer text-white ' />
                    </div>

                    <p className=' text-sm text-center text-white py-8'>Sponsor Validate Successfully. Please pay <span className=' text-pr'>0.06 BNB</span> for Registration.</p>

                    <div className=' grid grid-cols-2 gap-2 py-3'>
                        <button onClick={() => setModalOpen3(false)} className=' w-full py-2 text-sm rounded-3xl text-pr border-2 border-pr'>Cancel</button>
                        <button onClick={() => {
                            setModalOpen3(false)
                            singupWithRef()
                        }} className=' w-full bg-pr  py-2 text-sm rounded-3xl text-br border-2 border-pr'>Pay</button>
                    </div>
                </div>
            </GlobModal>
            <GlobModal size="sm" open={modalOpen4} setOpen={setModalOpen4} >
                <div >
                    <div className=' w-full flex items-center justify-between px-3 py-2 border-b'>
                        <h1 className=' text-xl text-white'>Registration</h1> <VscChromeClose onClick={() => setModalOpen4(false)} className=' w-5 h-5 cursor-pointer text-white ' />
                    </div>
                    <div className=' mt-8 flex items-center justify-center'>
                        <AiFillCheckCircle className=' text-green-500 w-7 h-7' />
                    </div>
                    <p className=' text-sm text-center text-white pt-3 pb-8'>Transaction done successfully. Registering user on platform</p>

                    <div className=' flex items-center justify-center gap-2 py-3'>
                        <button onClick={() => setModalOpen4(false)} className=' px-16 py-2 text-sm rounded-3xl text-pr border-2 border-pr'>OK</button>

                    </div>
                </div>
            </GlobModal>
            <GlobModal size="sm" open={errorModal} setOpen={setErrorModal} >
                <div >
                    <div className=' w-full flex items-center justify-between px-3 py-2 border-b'>
                        <h1 className=' text-xl text-white'>Registration</h1> <VscChromeClose onClick={() => setErrorModal(false)} className=' w-5 h-5 cursor-pointer text-white ' />
                    </div>

                    <p className=' text-sm text-center text-white py-8'>{message}</p>

                    <div className=' flex items-center justify-center'>
                        <button onClick={() => setErrorModal(false)} className=' px-16 py-2 text-sm rounded-3xl text-pr border-2 border-pr'>Close</button>

                    </div>
                </div>
            </GlobModal>

            <div className=' container '>
                <div className=' w-full flex flex-col lg:flex-row justify-center items-center lg:justify-between'>
                    <Link to="/">  <img src="/images/main-logo.png" className=' -ml-5 lg:-ml-0' alt="" /></Link>
                    <p className=' text-white hidden lg:block'>Do you already have an account? <Link to="/" className=' text-pr'>Login</Link></p>
                </div>
                <div className=' w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-5'>

                    <img className=' w-full hidden lg:block h-full object-cover mt-32' src="/images/Illustration.png" alt="" />
                    <div>
                        <h1 className=' text-4xl hidden lg:block font-medium text-white mt-20 '>Register your account</h1>
                        <h1 className=' text-4xl block lg:hidden font-medium text-white mt-10 '>Register your <br /> account</h1>
                        <div className=' mt-5'>
                            <p className=' text-white text-sm pb-2'>Referral ID</p>
                            <input onChange={(e) => setReferralCode(e.target.value)} type="text" placeholder='ExampleTx12345xyz' className=' text-sm w-full lg:w-5/6 rounded-xl  bg-br p-4 outline-none  border-sr' />
                        </div>
                        <div className=' mt-5'>
                            <p className=' text-white text-sm pb-2'>My Public Key</p>
                            <input value={wallet ? wallet : ""} readOnly type="text" placeholder='Public key here' className=' text-sm w-full lg:w-5/6 rounded-xl  bg-br p-4 outline-none  border-sr' />
                        </div>
                        <div className=' mt-5 w-full lg:w-5/6 grid grid-cols-1 lg:grid-cols-2 gap-4'>
                            <button onClick={web3Context?.connectWallet} className=' w-full hover:bg-hr hover:text-br border-2 text-pr border-pr bg-br py-3 text-sm rounded-3xl flex items-center justify-center'>
                                {wallet ? "Wallet Connected" : "Connect Wallet"}
                            </button>
                            {!wallet ? <button className='  w-full border-2 text-gray-400 cursor-default border-dr bg-dr py-3 text-sm rounded-3xl flex items-center justify-center'>
                                Create Account
                            </button>
                                :
                                <button onClick={signup} className=' w-full hover:bg-hr border-2 text-br  cursor-pointer border-pr bg-pr py-3 text-sm rounded-3xl flex items-center justify-center'>
                                    Create Account
                                </button>
                            }

                        </div>
                        <div className='w-full lg:w-5/6 mt-16 lg:mt-28'>
                            <p className=' w-full text-center text-sm text-white'>Registering for a NFT Lambo club account means you agree to the <Link to="/privacy-policy" className="text-pr">Privacy Policy</Link> and <Link to="/tos" className="text-pr">Terms of Service.</Link></p>
                        </div>
                    </div>
                </div>
                <p className=' text-white block lg:hidden text-center mt-20'>Do you already have an account? <Link to="/" className=' text-pr'>Login</Link></p>
                <div className=' hidden  lg:flex  items-center justify-center gap-10 flex-wrap w-full mt-28 lg:mt-40'>
                    <img src="/images/metamask.png" alt="" />
                    <img src="/images/wallet-connect.png" alt="" />
                    <img src="/images/Panckake.png" alt="" />
                    <img src="/images/Mask group.png" alt="" />
                    <img src="/images/Binance.png" alt="" />
                </div>
            </div>
        </div>
    )
}

export default Signup