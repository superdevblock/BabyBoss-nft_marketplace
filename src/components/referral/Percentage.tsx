import { useWeb3Context } from "hooks/useWeb3Context"
import { useBNBEarned, useReferralBNBEarned } from "state/referral/hooks"

const Percentage = () => {
    const web3Context = useWeb3Context()
    useBNBEarned(web3Context?.account)
    const bnbEarned = useReferralBNBEarned()

    return <div className=' mt-6 w-full'>
        <p className=' text-sm text-white pb-1'>Percentage earned by Sales</p>
        <div className=' w-full grid grid-cols-2 gap-5 mt-2'>
            <div className=' h-24 p-3 w-full bg-br rounded-xl shadow-md border border-sr'>
                <p className=' text-xs text-gray-400'>Percentage on sales on your  <span className=' text-pr'>1st Level</span></p>
                <p className=' pt-3 text-white'>{bnbEarned.totalBNBEarned != 0? `${bnbEarned.firstLevel/bnbEarned.totalBNBEarned*100}%` : "0%"}</p>
            </div>
            <div className=' h-24 p-3 w-full bg-br rounded-xl shadow-md border border-sr'>
                <p className=' text-xs text-gray-400'>Percentage on sales on your  <span className=' text-pr'>2nd Level</span></p>
                <p className=' pt-3 text-white'>{bnbEarned.totalBNBEarned != 0? `${bnbEarned.secondLevel/bnbEarned.totalBNBEarned*100}%` : "0%"}</p>
            </div>
            <div className=' h-24 p-3 w-full bg-br rounded-xl shadow-md border border-sr'>
                <p className=' text-xs text-gray-400'>Percentage on sales on your  <span className=' text-pr'>3rd Level</span></p>
                <p className=' pt-3 text-white'>{bnbEarned.totalBNBEarned != 0? `${bnbEarned.thirdLevel/bnbEarned.totalBNBEarned*100}%` : "0%"}</p>
            </div>
            <div className=' h-24 p-3 w-full bg-br rounded-xl shadow-md border border-sr'>
                <p className=' text-xs text-gray-400'>Percentage on sales on your  <span className=' text-pr'>4th Level</span></p>
                <p className=' pt-3 text-white'>{bnbEarned.totalBNBEarned != 0? `${bnbEarned.forthLevel/bnbEarned.totalBNBEarned*100}%` : "0%"}</p>
            </div>
            <div className=' h-24 col-span-2 p-3 w-full bg-br rounded-xl shadow-md border border-sr'>
                <p className=' text-xs text-gray-400'>Total Percentage on <span className=' text-pr'>NFT Sales</span></p>
                <p className=' pt-3 text-white'>{bnbEarned.totalBNBEarned != 0? `${bnbEarned.totalBNBEarned/bnbEarned.totalBNBEarned*100}%` : "0%"}</p>
            </div>
        </div>
    </div>
}
export default Percentage