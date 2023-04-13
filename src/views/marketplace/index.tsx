import Sidebar from 'components/Sidebar'
import Topbar from 'components/Topbar'
import { FaFacebookF } from "react-icons/fa"
import { BsTwitter, BsThreeDots } from "react-icons/bs"
import { AiFillCheckCircle } from "react-icons/ai"
import MarketCard from 'components/marketplace/MarketCard'
import { NFTData } from 'state/marketplace'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { AUTHOR } from 'config/nfts'
import getDisplayStringFromNumber from 'utils/getDisplayStringFromNumber'
import { useWeb3Context } from 'hooks/useWeb3Context'

const SCROLL_COUNT = 20
const SCROLL_BOTTOM_COUNT = 130

const Marketplace = () => {
  const web3Context = useWeb3Context()
  const [selected, setSelected] = useState("")
  const marketplaceData = useSelector((state: any) => state.marketplace)
  const ownerCount = useSelector((state: any) => state.owner.count)
  const [sortedNFTs, setSortedNFTs] = useState<NFTData[]>([])
  const [scrollBottomCount, setScrollBottomCount] = useState(1)

  useEffect(() => {
    if(marketplaceData.status === 'fulfilled') {
      // const _sortedNFTs = marketplaceData.nfts.slice(0, SCROLL_COUNT * scrollBottomCount)
      // setSortedNFTs(_sortedNFTs)
      sortNFTId()
    }
    window.removeEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll);
  }, [marketplaceData.status, scrollBottomCount])


  const sortNFTId = () => {
    let _sortedNFTs: NFTData[] = marketplaceData.nfts.slice()
    _sortedNFTs.sort((a: NFTData, b: NFTData) => a.id - b.id)
    setSortedNFTs(_sortedNFTs.slice(0, SCROLL_COUNT * scrollBottomCount))
  }

  const sortPriceUp = () => {
    let _sortedNFTs: NFTData[] = marketplaceData.nfts.slice()
    _sortedNFTs.sort((a: NFTData, b: NFTData) => b.price - a.price)
    setSortedNFTs(_sortedNFTs.slice(0, SCROLL_COUNT * scrollBottomCount))
  }

  const sortPriceDown = () => {
    let _sortedNFTs: NFTData[] = marketplaceData.nfts.slice()
    _sortedNFTs.sort((a: NFTData, b: NFTData) => a.price - b.price)
    setSortedNFTs(_sortedNFTs.slice(0, SCROLL_COUNT * scrollBottomCount))
  }

  const handleChangeSelected = (e: any) => {
    if(e.target.value === 'NFT id') {
      sortNFTId()
    }
    if(e.target.value === 'Lowest Price') {
      sortPriceDown()
    }
    if(e.target.value === 'Highest Price') {
      sortPriceUp()
    }
    setSelected(e.target.value)
  }

  const handleScroll = (e: any) => {
    
    var scrollTop = Number(document.scrollingElement?.scrollTop);
    var scrollHeight = Number(document.scrollingElement?.scrollHeight); // added
    var clientHeight = Number(document.scrollingElement?.clientHeight);
    var contentHeight = scrollHeight - clientHeight; // added
    if (contentHeight <= scrollTop) // modified
    {
        if(scrollBottomCount + 1 <= SCROLL_BOTTOM_COUNT)
          setScrollBottomCount(scrollBottomCount + 1)
    }
  }

  return (
    <div className=' w-full flex items-center gap-5 relative'>
      <div className='relative z-50'>
        <Sidebar />
      </div>
      <div className=' lg:ml-56 pr-5 w-full'>
        <Topbar />
        <div className=' w-full relative mt-4'>
          <img src="/images/cover.png" className=' w-full ' alt="" />
          <div className=' w-36 absolute rounded-3xl overflow-hidden -bottom-12  left-6 z-10 h-36 '>
            <img src="/images/profile.png" className=' w-full h-full ' alt="" />
          </div>
          <div className='absolute bottom-3 gap-3 flex items-center   right-6 z-10'>
            <div className='flex items-center gap-4 bg-sr rounded-xl px-3 py-3'>
              <FaFacebookF className=' text-white' />
              <BsTwitter className=' text-white' />
            </div>
            <div className='flex items-center gap-3 bg-sr rounded-xl px-3 py-3'>
              <BsThreeDots className=' text-white' />

            </div>
          </div>
        </div>
        <div className=' mt-20 w-full lg:w-5/6 flex-col lg:flex-row justify-between flex items-start gap-4 px-6'>
          <div>
            <h1 className=' text-white text-2xl font-bold'>{AUTHOR}</h1>
            <p className=' text-white text-sm flex items-center gap-2'><span className=' text-gray-500'>By</span> {AUTHOR} <AiFillCheckCircle className='text-pr' /></p>
          </div>
          <div className=' p-4 rounded-2xl bg-br grid grid-cols-2  lg:flex items-center gap-10'>
            <div>
              <p className=' text-gray-500 text-sm'>Items</p>
              <h1 className=' text-white text-lg'>{marketplaceData.items}</h1>
            </div>
            <div>
              <p className=' text-gray-500 text-sm'>Owner</p>
              <h1 className=' text-white text-lg'>{ownerCount}</h1>
            </div>
            <div>
              <p className=' text-gray-500 text-sm'>Floor Price</p>
              <h1 className=' text-white text-lg'>{`${getDisplayStringFromNumber(Number(marketplaceData.floorPrice))} BNB`}</h1>
            </div>
            {/* <div>
              <p className=' text-gray-500 text-sm'>Market Price</p>
              <h1 className=' text-white text-lg'>{`${marketplaceData.marketPrice} BNB`}</h1>
            </div> */}
            <div>
              <p className=' text-gray-500 text-sm'>Total Volume</p>
              <h1 className=' text-white text-lg'>{`${getDisplayStringFromNumber(Number(marketplaceData.totalVolume))} BNB`}</h1>
            </div>
          </div>

        </div>
        <p className=' w-full pt-3 px-6 lg:w-5/6 text-sm text-gray-500'>MetaHero Identities are a collection of heroes, villains, and mutants native to the MetaHero Universe. The Core Collection consists of 146 fully-matched MetaHero concept characters, including two special mints, collaboratively designed by project creatives</p>
        <div className=' mt-4'>
          <div className=' flex items-center justify-end'>
            <div className=' bg-br pr-2 rounded-xl'>
              <select className=' px-3 py-3 rounded-xl text-white bg-br text-sm border-none outline-none' name="" id="" value={selected} onChange={handleChangeSelected}>
                <option >NFT id</option>
                <option >Lowest Price</option>
                <option>Highest Price</option>
              </select>
            </div>
          </div>
        </div>
        <div className=' mt-4 w-full px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 my-7'>
          {
            sortedNFTs.map((item, ind)=>(
              <MarketCard data={item} account={web3Context?.account} key={ind} />
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Marketplace