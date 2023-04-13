import { useEffect, useState } from 'react';
import NftItem from './nftItem';

type Props = {
  nftlists: any
};

function TabWidget({ nftlists }: Props) {
  const [selectedTab, setSelectedTab] = useState(0);
	const [nftItems, setNftItems] = useState([]);
  const [stakeCnt, setStakeCnt] = useState(0);
  const [unStakeCnt, setUnStakeCnt] = useState(0);  

  let tabs = [
    { label: 'STAKING' },
    { label: 'COLLECTION' },
  ];

  useEffect(() => {
    setNftItems(nftlists);
  }, [nftlists]);

  const clickhandle = (nft_state: any) => {
    console.log("clickhandle")
    console.log(nft_state);

    if (selectedTab === 0 ) { // unstaked
      let val = (nft_state === true) ? (unStakeCnt + 1) : (unStakeCnt - 1);
      setUnStakeCnt(val);
    }
    else if (selectedTab === 1 ) { // staked
      let val = (nft_state === true) ? (stakeCnt + 1) : (stakeCnt - 1);
      setStakeCnt(val);
    }
  }

  const handleStake = () => {
    console.log("---------------------");
  }

  return (
    <div>
      {(() => {
        if (selectedTab === 0 && unStakeCnt !== 0)
          return (
            <div className='float-right cursor-pointer hover:text-red-400' onClick={ handleStake }>
              UNSTAKE
            </div>
          )
        else if (selectedTab === 1 && stakeCnt !== 0)
          return (
            <div className='float-right cursor-pointer hover:text-red-400' onClick={ handleStake }>
              STAKE
            </div>
          ) 
      })()}
      {/* Tab headers */}
      <div className="flex">
        <div className='flex'>
        {tabs.map((tab, index) => (
          <div 
          key={index} 
          className={`py-2 px-4 cursor-pointer rounded-t-md ${selectedTab === index ? 'text-white' : 'text-black'}`} 
          style={{ backgroundColor: `${selectedTab === index ? '#ff06f5' : '#e6e6e6'}` }}
          onClick={() => setSelectedTab(index)}
          >
            {tab.label}
          </div>
        ))}
        </div>       
      </div>     
      {/* Tab content */}
      <div className='py-6'>
        <div id="nft-lists" className='flex grid lg:grid-cols-4 grid-cols-2 cursor-pointer relative ' style={{ height: "800px", overflowY: "auto" }}>
				{
          nftItems?.map((item, index) => (
            (item['stake'] === true && selectedTab === 0 ) ? (
              <NftItem 
                key={index} 
                id={ item['tokenId'] } 
                imgSrc="/images/imgs/stake/nfts/nft1.png" 
                amount="200" owner={ '' } staked={ item['stake'] } 
                clickhandle={ clickhandle }
              /> ) : ''
          ))
        }

        {
          nftItems?.map((item, index) => (
            (item['stake'] === false && selectedTab === 1 ) ? (
              <NftItem 
                key={index} 
                id={ item['tokenId'] } 
                imgSrc="/images/imgs/stake/nfts/nft1.png" 
                amount="200" owner={ '' } 
                staked={ item['stake'] }
                clickhandle={ clickhandle }
              /> ) : ''
          ))
        }

				</div>
      </div>
    </div>
  )
}


export default TabWidget;
