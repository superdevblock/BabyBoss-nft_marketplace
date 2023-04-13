import BUSD from 'components/referral/Busd'
import Geneological from 'components/referral/Geneological'
import Network from 'components/referral/Network'
import NftPurchsed from 'components/referral/NftPurchased'
import Percentage from 'components/referral/Percentage'
import Referral from 'components/referral/Referral'
import Sidebar from 'components/Sidebar'
import Topbar from 'components/Topbar'

const ReferralProgramme = () => {
  
    return (
        <div className=' w-full flex items-center gap-5'>
            <div className='relative'>
                <Sidebar />
            </div>
            <div className=' lg:ml-60 pr-5 w-full'>
                <Topbar />
                <Referral />
                <Network />
                <NftPurchsed />
                <Percentage />
                <BUSD/>
                <Geneological/>
            </div>
        </div>
    )
}








export default ReferralProgramme