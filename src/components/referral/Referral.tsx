import React,{useEffect, useState} from 'react'
import { FiCopy } from "react-icons/fi"
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify';
import { useWeb3Context } from 'hooks/useWeb3Context';
import { useSponsorAddress, useSponsorState } from 'state/register/hooks';
import { NULL_ADDRESS } from 'config/nfts';

const Referral = () => {
    const web3Context = useWeb3Context()
    const [wallet, setWallet] = useState<string | undefined>("")

    useSponsorAddress(`${web3Context?.account}`)
    const sponsor = useSponsorState()

    useEffect(() => {
        setWallet(web3Context?.account)
    }, [web3Context])

    return <>
        <h1 className=' mt-5 text-3xl text-white font-semibold'>My Networks</h1>
        <div className=' mt-4 w-full grid grid-cols-1 lg:grid-cols-2 gap-5'>
            <div className=' w-full'>
                <p className=' text-sm text-white pb-1'>My Referral ID</p>

                <div className='  h-11 px-4 text-sm w-full border border-sr shadow-md bg-br rounded-xl flex items-center justify-between  '>
                   {wallet ? wallet : ""}
                    <FiCopy onClick={() => {
                        copy(wallet ? wallet : "")
                        toast.success('Referral Id Copied To Clipboard', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    }} className='w-5 h-5 cursor-pointer text-white' />
                </div>
            </div>
            <div className=' w-full'>
                <p className=' text-sm text-white pb-1'>Sponsor ID</p>
                <div className='  h-11 px-4 text-sm w-full border border-sr shadow-md bg-br rounded-xl flex items-center  '>
                {sponsor === NULL_ADDRESS ? "" : sponsor}
                </div>
            </div>
        </div>
    </>

}

export default Referral