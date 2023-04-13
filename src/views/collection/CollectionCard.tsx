import React, { useState } from 'react'
import { AiFillCheckCircle } from "react-icons/ai"
import { Link } from 'react-router-dom'
import GlobModal from 'components/GlobModal'
import { NFTData } from 'state/marketplace'
import { CancelListingModal, ClaimModal, EditModal, SellModal, StakeModal, UnStakeModal } from '../modals/Modals'
import { AUTHOR, getIpfsUrl } from 'config/nfts'
import { useDetailDataById } from 'state/detail/hooks'

interface EmployeeProps {
    stake: boolean;
    data: NFTData
}

function CollectionCard({ stake, data }: EmployeeProps) {
    const [claimModal, setclaimModal] = useState(false)
    const [unstake, setUnstake] = useState(false)
    const [stakemodal, setStakemodal] = useState(false)
    const [sellModal, setSellModal] = useState(false)
    const [cancelListingModal, setCancelListingModal] = useState(false)
    const[editModal, setEditModal] = useState(false)

    const detail = useDetailDataById(Number(data.id))

    return (
        <div className=' bg-br  rounded-2xl overflow-hidden relative ani_parent'>
            <GlobModal size="xl" open={sellModal} setOpen={setSellModal} >
                <SellModal setSellModal={setSellModal} data={detail}/>
            </GlobModal>
            <GlobModal size="xl" open={claimModal} setOpen={setclaimModal} >
                <ClaimModal  setclaimModal={setclaimModal} data={detail} />
            </GlobModal>
            <GlobModal size="xl" open={unstake} setOpen={setUnstake} >
                <UnStakeModal  setUnstake={setUnstake} data={detail} />
            </GlobModal>
            <GlobModal size="xl" open={stakemodal} setOpen={setStakemodal} >
                <StakeModal  setStake={setStakemodal} data={detail}/>
            </GlobModal>
            <GlobModal size="xl" open={cancelListingModal} setOpen={setCancelListingModal} >
                <CancelListingModal  setCancelListingModal={setCancelListingModal} data={detail}/>
            </GlobModal>
            <GlobModal size="xl" open={editModal} setOpen={setEditModal} >
                <EditModal  setEditModal={setEditModal} data={detail}/>
            </GlobModal>

            
            <Link to={"/collection/" + data.id}>
                <div className="p-3 w-full">
                    <div className=' w-full rounded-2xl overflow-hidden'>
                        <img src={getIpfsUrl(data.id)} className=' h-72 w-full object-cover' alt="" />
                    </div>
                </div>
                <div className=' py-2 px-3'>
                    <h6 className=' text-lg text-white font-medium'>{data.name}</h6>
                    <div className='w-full flex items-center justify-between'>
                        <p className=' text-gray-500 text-sm pt-1 flex items-center gap-1'>{AUTHOR} <AiFillCheckCircle className='text-pr' /></p>
                        {/* <p className=' text-gray-500 text-sm pt-1 flex items-center gap-1'>{`Token Id: ${data.id}`}</p> */}
                    </div>
                </div>
                <div className=' w-full bg-sr py-3 px-3 flex items-center justify-between'>
                    <p className=' text-xs text-gray-500'>Price</p>
                    <div className=' flex items-center gap-1 text-white '>
                        <img src="/images/BNB.png" className='w-5 h-5 object-contain' alt="" />
                        {data.price == 0? "Not listed" : `${data.price} BNB`}
                    </div>
                </div>
            </Link>
            {/* {stake ? <div className=' absolute left-0 w-full px-2 z-10 animation_bottom grid grid-cols-2 gap-2'>
                <button onClick={() => {setUnstake(true)}} className=' w-full border-2 border-pr text-pr bg-sr py-3 text-sm rounded-3xl font-bold'>
                    Unstake
                </button>
                <button onClick={() => setclaimModal(true)} className=' w-full bg-pr text-sr py-3 text-sm rounded-3xl font-bold'>
                    Claim Rewards
                </button>
            </div> : data.price > 0 ?
                <div className=' absolute left-0 w-full px-2 z-10 animation_bottom grid grid-cols-2 gap-2'>
                    <button onClick={()=>setCancelListingModal(true)} className=' w-full border-2 border-pr text-pr bg-sr py-3 text-sm rounded-3xl font-bold'>
                        Cancel Listing
                    </button>
                    <button onClick={() => setEditModal(true)} className=' w-full bg-pr text-sr py-3 text-sm rounded-3xl font-bold'>
                        Edit
                    </button>
                </div> : 
                <div className=' absolute left-0 w-full px-2 z-10 animation_bottom grid grid-cols-2 gap-2'>
                    <button onClick={()=>setStakemodal(true)} className=' w-full border-2 border-pr text-pr bg-sr py-3 text-sm rounded-3xl font-bold'>
                        Stake
                    </button>
                    <button onClick={() => setSellModal(true)} className=' w-full bg-pr text-sr py-3 text-sm rounded-3xl font-bold'>
                        Sell
                    </button>
                </div>
            } */}
        </div>
    )
}

export default CollectionCard