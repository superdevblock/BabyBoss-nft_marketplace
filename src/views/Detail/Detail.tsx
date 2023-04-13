import GlobModal from 'components/GlobModal'
import Sidebar from 'components/Sidebar'
import Topbar from 'components/Topbar'
import { useState, useEffect } from 'react'
import { AiFillCheckCircle } from "react-icons/ai"
import { useDetailData, useNFTDetailData } from 'state/detail/hooks'
import { useParams } from 'react-router-dom'
import { BuyModal, ClaimModal, EditModal, SellModal, StakeModal, UnStakeModal, CancelListingModal } from '../modals/Modals'
import { useMarketplaceDataFromDB } from 'state/marketplace/hooks'
import { useSelector } from 'react-redux'
import { useWeb3Context } from 'hooks/useWeb3Context'
import { getNFTContract } from 'utils/contractHelpers'
import { getStakingAddress } from 'utils/addressHelpers'
import { CHAIN } from 'config'
import { toast } from 'react-toastify'
import { DAY_SECOND, getIpfsUrl, REWARD_PER_DAY } from 'config/nfts'
import useRegisterState from 'hooks/useRegisterState'
import { useStakingDataFromStore } from 'state/staking/hooks'
import { StakingItemData } from 'state/staking'

const Detail = ({setLoader} : any) => {
    const web3Context = useWeb3Context()
    const [active, setActive] = useState(true)

    const [buyModal, setBuyModal] = useState(false)
    const [claimModal, setclaimModal] = useState(false)
    const [unstake, setUnstake] = useState(false)
    const [stake, setStake] = useState(false)
    const [sellModal, setSellModal] = useState(false)
    const [cancelListingModal, setCancelListingModal] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const [price, setPrice] = useState(Number(0))
    const [totalVolume, setTotalVolume] = useState(0)
    const [isOwner, setIsOwner] = useState(false)
    const [ownerAddress, setOwnerAddress] = useState("")

    const isRegistered = useRegisterState(web3Context?.account)

    const {id} = useParams()
    useNFTDetailData(Number(id))
    const detail = useDetailData()
    const nfts = useMarketplaceDataFromDB()
    const nftsOnStaking: StakingItemData[] = useStakingDataFromStore(web3Context?.account)

    const loadingMarketplaceData = useSelector((state: any) => state.marketplace.status)
    const loadingStakingData = useSelector((state: any) => state.staking.status)
    const loadingDetailData = useSelector((state: any) => state.detail.status)

    useEffect(() => {
        if(loadingDetailData === 'loading')
            setLoader(true)
        else
            setLoader(false)
    }, [loadingDetailData])

    useEffect(() => {
        const fetchOwnerOfNFT =async () => {
            if(detail.isStake) {
                const filtered = nftsOnStaking.filter((item: any) => {return Number(item.id) === Number(detail.id)})
                if(filtered.length > 0) setIsOwner(true)
                else setIsOwner(false)
                setOwnerAddress(getStakingAddress())
            } else {
                const nftContract = getNFTContract(web3Context?.provider)
                const _owner = await nftContract.methods.ownerOf(detail.id).call()
                setIsOwner(_owner.toLowerCase() === web3Context?.account.toLowerCase())
                setOwnerAddress(_owner)
            }
        }

        if(detail && loadingMarketplaceData === 'fulfilled' && nfts && loadingStakingData === 'fulfilled' && nftsOnStaking && web3Context?.provider && web3Context?.account) {
            setPrice(nfts[detail.id].price)
            setTotalVolume(nfts[detail.id].totalVolume)
            
            if(web3Context?.chainId !== CHAIN) {
                // toast.error('Invalid Network.', {
                //     position: "top-right",
                //     autoClose: 5000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: true,
                //     draggable: true,
                //     progress: undefined,
                // });
            } else {
                fetchOwnerOfNFT()
            }
        }
    }, [nfts, nftsOnStaking, web3Context, detail, loadingMarketplaceData, loadingStakingData])
    
    const check = () => {        
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
            return false
        }
        if(!isRegistered) {
            toast.error('You are not registered.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return false
        }
        return true;
    }

    const handleStakeModal = () => {
        if(check())
            setStake(true)
    }
    const handleUnStakeModal = () => {
        if(!check()) return
        if(Math.floor(detail.stakingTime/DAY_SECOND)*REWARD_PER_DAY > 0) {
            toast.warning('Claim rewards first.', {
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
        setUnstake(true)
    }
    const handleSellModal = () => {
        if(check())
            setSellModal(true)
    }
    const handleBuyModal = () => {
        if(check())
            setBuyModal(true)
    }
    const handleEditModal = () => {
        if(check())
            setEditModal(true)
    }
    const handleCancelListingModal = () => {
        if(check())
            setCancelListingModal(true)
    }
    const handleClaimModal = () => {
        if(check())
            setclaimModal(true)
    }



    return (
        <div className=' w-full flex items-center gap-5'>
            <GlobModal size="xl" open={sellModal} setOpen={setSellModal} >
                <SellModal setSellModal={setSellModal} data={detail}/>
            </GlobModal>
            <GlobModal size="xl" open={buyModal} setOpen={setBuyModal} >                
                <BuyModal setBuyModal={setBuyModal} data={detail}/>
            </GlobModal>
            <GlobModal size="xl" open={claimModal} setOpen={setclaimModal} >
                <ClaimModal  setclaimModal={setclaimModal} data={detail} />
            </GlobModal>
            <GlobModal size="xl" open={unstake} setOpen={setUnstake} >
                <UnStakeModal  setUnstake={setUnstake} data={detail} />
            </GlobModal>
            <GlobModal size="xl" open={stake} setOpen={setStake} >
                <StakeModal  setStake={setStake} data={detail}/>
            </GlobModal>
            <GlobModal size="xl" open={cancelListingModal} setOpen={setCancelListingModal} >
                <CancelListingModal  setCancelListingModal={setCancelListingModal} data={detail}/>
            </GlobModal>
            <GlobModal size="xl" open={editModal} setOpen={setEditModal} >
                <EditModal  setEditModal={setEditModal} data={detail}/>
            </GlobModal>

            <div className='relative z-50'>
                <Sidebar />
            </div>
            <div className=' lg:ml-56 pr-5 w-full'>
                <Topbar />

                <div className=' w-full px-4 mt-16 gap-6 items-start grid grid-cols-1 lg:grid-cols-2'>

                    <div className=' w-full h-full'>
                        <img src={getIpfsUrl(detail.id)} className=' w-full object-cover' alt="" />
                    </div>
                    <div>
                        <h1 className=' text-3xl text-white font-semibold'>{detail.name}</h1>
                        <div className=' grid grid-cols-2 lg:grid-cols-4 gap-5 mt-5'>
                            <div>
                                <p className=' text-gray-500 text-sm'>Minter</p>
                                <p className=' text-white text-lg flex items-center gap-1'>{detail.minter} <AiFillCheckCircle className='text-pr' /></p>
                            </div>
                            <div>
                                <p className=' text-gray-500 text-sm'>Owner</p>
                                <a href={`https://testnet.bscscan.com/address/${ownerAddress}`} target='_blank'><p className=' text-pr text-lg '>{ownerAddress.length > 20 ? ownerAddress.substring(0, 4)+"..."+ownerAddress.substring(ownerAddress.length-2,ownerAddress.length) : "Nan"}</p></a>
                            </div>
                            <div>
                                <p className=' text-gray-500 text-sm'>Collection</p>
                                <p className=' text-white text-lg '>{detail.collection}</p>
                            </div>
                            <div>
                                <p className=' text-gray-500 text-sm'>Total Volume</p>
                                <p className=' text-white text-lg '>{`${totalVolume} BNB`}</p>
                            </div>
                        </div>
                        <div className=' grid grid-cols-2 lg:grid-cols-4 gap-5 mt-5'>
                            <div>
                                <p className=' text-gray-500 text-sm'>Total Token</p>
                                <p className=' text-white text-lg flex items-center gap-1'>{`${detail.totalToken} TAU`}</p>
                            </div>
                            <div>
                                <p className=' text-gray-500 text-sm'>Staking Days</p>
                                <p className=' text-white text-lg '>{detail.stakingDays}</p>
                            </div>
                            <div>
                                <p className=' text-gray-500 text-sm'>Minted Tokens</p>
                                <p className=' text-white text-lg '>{`${detail.mintedTokens} TAU`}</p>
                            </div>
                            <div>
                                <p className=' text-gray-500 text-sm'>Clamable Tokens</p>
                                <p className=' text-white text-lg '>{`${detail.claimableTokens} TAU`}</p>
                            </div>
                        </div>

                        <div className=' rounded-2xl bg-br mt-5 w-full p-4'>
                            {Number(price) === Number(0) ? <>
                                <p className=' text-sm'>Not listed</p>
                            </> 
                            : 
                            <>
                                <p className=' text-sm'>Current Price</p>
                                <div className=' flex items-center gap-3 mt-2'>
                                    <img src="/images/BNB.png" className=' w-5 h-5' alt="" />
                                    <h1 className=' text-2xl text-white '>{`${price} BNB`}</h1>
                                    {/* <p className=' text-gray-500 '>($19.817.00) </p> */}
                                </div>
                            </>}
                            <p className=' py-6 w-full text-gray-500'>
                                Julie_Pacino is a collection of Quantum Unlocked originally generated soldiers with hundreds of unique elements.
                            </p>
                            {!isOwner && Number(price) !== Number(0) &&
                                <button onClick={handleBuyModal} className=' w-full rounded-3xl bg-pr py-2 font-bold text-br'>
                                    Buy Now
                                </button>
                            }
                            {isOwner && detail.isStake && <div className=' grid w-full grid-cols-2 gap-2'>
                                <button onClick={handleUnStakeModal} className=' w-full rounded-3xl bg-sr border-2 border-pr py-2 font-bold text-pr'>
                                    Unstake
                                </button>
                                <button onClick={handleClaimModal} className=' w-full rounded-3xl bg-pr py-2 font-bold text-br'>
                                    Claim Rewards
                                </button>
                            </div>
			                }
                            {isOwner && !detail.isStake && Number(price) === Number(0) &&
                                <div className=' grid w-full grid-cols-2 gap-2'>
                                    <button onClick={handleStakeModal} className=' w-full rounded-3xl bg-sr border-2 border-pr py-2 font-bold text-pr'>
                                        Stake
                                    </button>
                                    <button onClick={handleSellModal} className=' w-full rounded-3xl bg-pr py-2 font-bold text-br'>
                                        Sell
                                    </button>
                                </div>
                            }                            
                            {isOwner && !detail.isStake && Number(price) !== Number(0) &&
                                <div className=' grid w-full grid-cols-2 gap-2'>
                                    <button onClick={handleCancelListingModal} className=' w-full rounded-3xl bg-sr border-2 border-pr py-2 font-bold text-pr'>
                                        Cancel Listing
                                    </button>
                                    <button onClick={handleEditModal} className=' w-full rounded-3xl bg-pr py-2 font-bold text-br'>
                                        Edit
                                    </button>
                                </div>
                            }
                        </div>
                        <div className=' mt-6 mb-4 flex items-center gap-4'>
                            <p onClick={() => setActive(true)} className={active ? ' text-white border-b border-pr pb-1  cursor-pointer' : ' text-gray-500 border-b border-transparent pb-1  cursor-pointer'}>Details</p>
                            {/* <p onClick={() => setActive(false)} className={!active ? ' text-white border-b border-pr pb-1  cursor-pointer' : ' text-gray-500 border-b border-transparent pb-1  cursor-pointer'}>History</p> */}
                        </div>

                        {active ?
                            <div className=' mt-6 bg-br rounded-2xl p-4'>
                                <div>
                                    <p className=' text-gray-500 text-sm'>NFT ID</p>
                                    <h6 className=' text-white text-lg'>{detail.id}</h6>
                                </div>
                                <div className=' my-3'>
                                    <p className=' text-gray-500 text-sm'>MINT TRANSACTION</p>
                                    <a href={`https://testnet.bscscan.com/tx/${detail.mintTransaction}`} target='_blank'><h6 className=' text-pr text-lg'>{`${detail.mintTransaction.substring(0,6)}...${detail.mintTransaction.substring(detail.mintTransaction.length-6,detail.mintTransaction.length)}`}</h6></a>
                                </div>
                                <div >
                                    <p className=' text-gray-500 text-sm'>CONTRACT ADDRESS</p>
                                    <a href={`https://testnet.bscscan.com/address/${detail.contractAddress}`} target='_blank'><h6 className=' text-pr  text-lg'>{`${detail.contractAddress.substring(0,6)}...${detail.contractAddress.substring(detail.contractAddress.length-6,detail.contractAddress.length)}`}</h6></a>
                                </div>
                            </div>
                            :
                            <div className='w-full overflow-hidden rounded-2xl bg-br'>
                                <div className='grid grid-cols-5 gap-3 bg-sr pt-10 pb-3 px-4'>
                                    <p className=' text-sm text-gray-500 text-center'>Unit Price</p>
                                    <p className=' text-sm text-gray-500 text-center'>USD Unit Price </p>
                                    <p className=' text-sm text-gray-500 text-center'>Quantity</p>
                                    <p className=' text-sm text-gray-500 text-center'>Expiration</p>
                                    <p className=' text-sm text-gray-500 text-center'>From</p>
                                </div>
                                <div className=' w-full h-96 overflow-y-scroll'>

                                    <div className='grid grid-cols-5 gap-3 border-b cursor-pointer border-gray-800 pt-3 pb-3 px-4 relative histry_parent'>
                                        <p className=' text-sm text-gray-100 text-center'>0.69 BUSD</p>
                                        <p className=' text-sm text-gray-100 text-center'>$200.09</p>
                                        <p className=' text-sm text-gray-100 text-center'>1</p>
                                        <p className=' text-sm text-gray-100 text-center'>1 month</p>
                                        <p className=' text-sm text-gray-100 text-center'>Farah</p>
                                        <button onClick={() => setBuyModal(true)} className=' px-5 absolute right-8 top-0 z-10 py-2 text-sr bg-pr rounded-3xl font-semibold'>
                                            Buy
                                        </button>
                                    </div>
                                    <div className='grid grid-cols-5 gap-3 border-b cursor-pointer border-gray-800 pt-3 pb-3 px-4 relative histry_parent'>
                                        <p className=' text-sm text-gray-100 text-center'>0.69 BUSD</p>
                                        <p className=' text-sm text-gray-100 text-center'>$200.09</p>
                                        <p className=' text-sm text-gray-100 text-center'>1</p>
                                        <p className=' text-sm text-gray-100 text-center'>1 month</p>
                                        <p className=' text-sm text-gray-100 text-center'>Farah</p>
                                        <button onClick={() => setBuyModal(true)} className=' px-5 absolute right-8 top-0 z-10 py-2 text-sr bg-pr rounded-3xl font-semibold'>
                                            Buy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Detail
