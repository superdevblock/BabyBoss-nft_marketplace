import { AiFillCheckCircle } from "react-icons/ai"
import { Link } from 'react-router-dom'
import { NFTData } from 'state/marketplace'
import { AUTHOR, getIpfsUrl } from 'config/nfts'
import { useOwnerDataById } from 'state/owners/hooks'

interface MarketCardParams {
    account: any
    data: NFTData
}

const MarketCard = ({account, data}: MarketCardParams) => {
    const owners = useOwnerDataById(data.id)
    return (
        <Link to={`/marketplace/${data.id}`} className=' bg-br  rounded-2xl overflow-hidden relative ani_parent'>
            <div className="p-3 w-full">
                <div className=' w-full rounded-2xl overflow-hidden'>
                    <img src={getIpfsUrl(data.id)} className=' h-72 w-full object-cover' alt="" />

                </div>
            </div>
            <div className=' py-2 px-3'>
                <h6 className=' text-lg text-white font-medium'>{data.name}</h6>
                <p className=' text-gray-500 text-sm pt-1 flex items-center gap-1'>{AUTHOR}<AiFillCheckCircle className='text-pr'/></p>
            </div>
            <div className=' w-full bg-sr py-3 px-3 flex items-center justify-between'>
                <p className=' text-xs text-gray-500'>Price</p>
                <div className=' flex items-center gap-1 text-white '>
                    <img src="/images/BNB.png" className='w-5 h-5 object-contain' alt="" />
                    {data.price == 0 ? "Not listed" : `${data.price} BNB`}
                </div>
            </div>
            {/* {owners && owners[0].owner != account && data.price != 0 &&
                <div className=' absolute left-0 w-full px-2 z-10 animation_bottom'>
                    <button className=' w-full bg-pr text-sr py-3 text-xl rounded-3xl font-bold'>
                        Buy now
                    </button>
                </div>
            } */}
            
        </Link>
    )
}

export default MarketCard