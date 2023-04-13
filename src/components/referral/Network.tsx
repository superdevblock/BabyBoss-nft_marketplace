import { URI } from "api-control/api"
import { useWeb3Context } from "hooks/useWeb3Context"
import { useState, useEffect } from "react"
import { useNetworkDownline, useReferralNetworkDownline } from "state/referral/hooks"
const Network = () => {
    const web3Context = useWeb3Context()
    useNetworkDownline(web3Context?.account)
    const networkdownline = useReferralNetworkDownline()

    return <div className=' mt-6 w-full'>
        <p className=' text-sm text-white pb-1'> Network Downline</p>
        <div className=' w-full grid grid-cols-2 gap-5 mt-2'>
            <div className=' h-24 p-3 w-full bg-br rounded-xl shadow-md border border-sr'>
                <p className=' text-xs text-gray-400'>Your Referrals on the <span className=' text-pr'>1st Level</span></p>
                <p className=' pt-3 text-white'>{networkdownline.firstLevel}</p>
            </div>
            <div className=' h-24 p-3 w-full bg-br rounded-xl shadow-md border border-sr'>
                <p className=' text-xs text-gray-400'>Your Referrals on the <span className=' text-pr'>2nd Level</span></p>
                <p className=' pt-3 text-white'>{networkdownline?.secondLevel}</p>
            </div>
            <div className=' h-24 p-3 w-full bg-br rounded-xl shadow-md border border-sr'>
                <p className=' text-xs text-gray-400'>Your Referrals on the <span className=' text-pr'>3rd Level</span></p>
                <p className=' pt-3 text-white'>{networkdownline?.thirdLevel}</p>
            </div>
            <div className=' h-24 p-3 w-full bg-br rounded-xl shadow-md border border-sr'>
                <p className=' text-xs text-gray-400'>Your Referrals on the <span className=' text-pr'>4th Level</span></p>
                <p className=' pt-3 text-white'>{networkdownline?.forthLevel}</p>
            </div>
            <div className=' h-24 col-span-2 p-3 w-full bg-br rounded-xl shadow-md border border-sr'>
                <p className=' text-xs text-gray-400'>Total Referrals in the <span className=' text-pr'>Genealogical Tree</span></p>
                <p className=' pt-3 text-white'>{networkdownline?.firstLevel + networkdownline?.secondLevel + networkdownline?.thirdLevel + networkdownline?.forthLevel}</p>
            </div>
        </div>
    </div>
}

export default Network;