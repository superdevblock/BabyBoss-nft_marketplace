import Sidebar from 'components/Sidebar'
import Topbar from 'components/Topbar'
import CollectionCard from './CollectionCard'
import { useEffect, useState } from 'react'
import { NFTData } from 'state/marketplace'
import { useMarketplaceDataFromDB } from 'state/marketplace/hooks'
import { useSelector } from 'react-redux'
import { useStakingData, useStakingDataFromStore } from 'state/staking/hooks'
import { useWeb3Context } from 'hooks/useWeb3Context'
import { useOwnerDataByAccount } from 'state/owners/hooks'
import { OwnerData } from 'state/owners'
import { StakingItemData } from 'state/staking'


const SCROLL_COUNT = 20

const Collection = () => {
  const web3Context = useWeb3Context()
  const [active, setActive] = useState(true)
  const [scrollBottomCount, setScrollBottomCount] = useState(1)
  const [displayNftsOnWallet, setDisplayNftsOnWallet] = useState<OwnerData[]>([])
  
  // useStakingData()

  const nfts: NFTData[] = useMarketplaceDataFromDB()
  // const nftsOnWallet: number[] = useNFT()
  const nftsOnWallet: OwnerData[] = useOwnerDataByAccount(web3Context?.account)
  // const nftsOnStaking = useStakedNFT()
  const nftsOnStaking: StakingItemData[] = useStakingDataFromStore(web3Context?.account)

  const loading = useSelector((state: any) => state.marketplace.status)
  
  useEffect(() => {
    if(loading === 'fulfilled' && nftsOnWallet) {
      const _displayNFTs = nftsOnWallet.slice(0, SCROLL_COUNT * scrollBottomCount)
      setDisplayNftsOnWallet(_displayNFTs)
    }
    window.removeEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, scrollBottomCount, nftsOnWallet.length])

  const handleScroll = (e: any) => {
    
    var scrollTop = Number(document.scrollingElement?.scrollTop);
    var scrollHeight = Number(document.scrollingElement?.scrollHeight); // added
    var clientHeight = Number(document.scrollingElement?.clientHeight);
    var contentHeight = scrollHeight - clientHeight; // added
    if (contentHeight <= scrollTop) // modified
    {
        let maxCountScroll = nftsOnWallet.length / SCROLL_COUNT
        if(nftsOnWallet.length % SCROLL_COUNT != 0) maxCountScroll++
        if(scrollBottomCount + 1 <= maxCountScroll)
          setScrollBottomCount(scrollBottomCount + 1)
    }
  }


  return (
    <div className=' w-full flex items-center gap-5'>
         
      <div className='relative z-50'>
        <Sidebar />
      </div>
      <div className=' lg:ml-56 pr-5 w-full'>
        <Topbar />
        <h1 className=' text-5xl pl-8 font-medium text-white mt-16'>My NFT Collection</h1>
        <div className=' my-7 pl-8 flex items-center gap-3'>
          <button onClick={() => setActive(true)} className={active ? ' px-8 py-3 bg-pr text-sr rounded-3xl font-medium' : ' px-8 py-3 text-gray-200 rounded-3xl font-medium'}>
            My Collections
          </button>
          <button onClick={() => setActive(false)} className={!active ? ' px-8 py-3 bg-pr text-sr rounded-3xl font-medium' : ' px-8 py-3 text-gray-200 rounded-3xl font-medium'}>
            NFT Staking
          </button>
        </div>
        {loading === 'fulfilled' && !active && <div className=' mt-4 w-full px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 my-7'>
          {
            nftsOnStaking.map((item: any, ind: any) => (
              <CollectionCard stake={true} data={nfts[Number(item.id)]} key={ind}/>
            ))
          }
        </div> 
        }
        {loading === 'fulfilled' && active &&
          <div className=' mt-4 w-full px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 my-7'>
            {
              displayNftsOnWallet.map((item: any, ind: any) => (
                <CollectionCard stake={false} data={nfts[Number(item.id)]} key={ind}/>
              ))
            }
          </div>
        }
      </div>
    </div>
  )
}

export default Collection