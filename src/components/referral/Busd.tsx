import { useWeb3Context } from "hooks/useWeb3Context";
import { useBNBEarned, useReferralBNBEarned } from "state/referral/hooks";

const BUSD = () => {
    const web3Context = useWeb3Context()
    useBNBEarned(web3Context?.account)
    const bnbEarned = useReferralBNBEarned()
    
    return <div className=' mt-6 w-full'>
        <p className=' text-sm text-white pb-1'>BNB earned by Referrals</p>
        <div className=' w-full grid grid-cols-2  gap-5 mt-2'>
            <div className=' h-24 p-3 w-full bg-br rounded-xl shadow-md border border-sr'>
                <p className=' text-xs text-gray-400'>Total BNB earnings on your  <span className=' text-pr'>1st Level</span></p>
                <p className=' pt-3 text-white'>{bnbEarned.firstLevel}</p>
            </div>
            <div className=' h-24 p-3 w-full bg-br rounded-xl shadow-md border border-sr'>
                <p className=' text-xs text-gray-400'>Total BNB earnings on your  <span className=' text-pr'>2nd Level</span></p>
                <p className=' pt-3 text-white'>{bnbEarned.secondLevel}</p>
            </div>
            <div className=' h-24 p-3 w-full bg-br rounded-xl shadow-md border border-sr'>
                <p className=' text-xs text-gray-400'>Total BNB earnings on your  <span className=' text-pr'>3rd Level</span></p>
                <p className=' pt-3 text-white'>{bnbEarned.thirdLevel}</p>
            </div>
            <div className=' h-24 p-3 w-full bg-br rounded-xl shadow-md border border-sr'>
                <p className=' text-xs text-gray-400'>Total BNB earnings on your  <span className=' text-pr'>4th Level</span></p>
                <p className=' pt-3 text-white'>{bnbEarned.forthLevel}</p>
            </div>
            <div className=' h-24 col-span-2 p-3 w-full bg-br rounded-xl shadow-md border border-sr'>
                <p className=' text-xs text-gray-400'>Total BNB earned  <span className=' text-pr'>by Referrals</span></p>
                <p className=' pt-3 text-white'>{bnbEarned.totalBNBEarned}</p>
            </div>
        </div>
    </div>
}

export default BUSD;