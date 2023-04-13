import { useWeb3Context } from "hooks/useWeb3Context";
import { useNFTPurchased, useReferralNFTPurchased } from "state/referral/hooks";

const NftPurchsed = () => {
    const web3Context = useWeb3Context()
    useNFTPurchased(web3Context?.account)
    const nftPurchsed = useReferralNFTPurchased()

    return <div className=' mt-6 w-full'>
        <p className=' text-sm text-white pb-1'>NFTs purchased by Referrals</p>
        <div className=' w-full grid grid-cols-2 gap-5 mt-2'>
            <div className=' h-24 p-3 w-full bg-br rounded-xl shadow-md border border-sr'>
                <p className=' text-xs text-gray-400'>Total NFT purchased on your <span className=' text-pr'>1st Level</span></p>
                <p className=' pt-3 text-white'>{nftPurchsed.firstLevel}</p>
            </div>
            <div className=' h-24 p-3 w-full bg-br rounded-xl shadow-md border border-sr'>
                <p className=' text-xs text-gray-400'>Total NFT purchased on your <span className=' text-pr'>2nd Level</span></p>
                <p className=' pt-3 text-white'>{nftPurchsed.secondLevel}</p>
            </div>
            <div className=' h-24 p-3 w-full bg-br rounded-xl shadow-md border border-sr'>
                <p className=' text-xs text-gray-400'>Total NFT purchased on your <span className=' text-pr'>3rd Level</span></p>
                <p className=' pt-3 text-white'>{nftPurchsed.thirdLevel}</p>
            </div>
            <div className=' h-24 p-3 w-full bg-br rounded-xl shadow-md border border-sr'>
                <p className=' text-xs text-gray-400'>Total NFT purchased on your <span className=' text-pr'>4th Level</span></p>
                <p className=' pt-3 text-white'>{nftPurchsed.forthLevel}</p>
            </div>
            <div className=' h-24 col-span-2 p-3 w-full bg-br rounded-xl shadow-md border border-sr'>
                <p className=' text-xs text-gray-400'>Total NFTs purchased <span className=' text-pr'>by Referrals</span></p>
                <p className=' pt-3 text-white'>{nftPurchsed.totalNFTPurchased}</p>
            </div>
        </div>
    </div>
}

export default NftPurchsed;