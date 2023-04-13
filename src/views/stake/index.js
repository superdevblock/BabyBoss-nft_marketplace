import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie';
import { useWeb3Context } from 'hooks/useWeb3Context'
import { useIsRegistered, useRegisterState } from 'state/register/hooks'
import GlobModal from 'components/GlobModal'
import { VscChromeClose } from "react-icons/vsc"
import { AiFillCheckCircle } from "react-icons/ai"
import { useSelector } from 'react-redux'
import { URI } from 'api-control/api'
import axios from 'axios'
import encryptParams from 'utils/encryption';


import TabWidget from 'components/tabWidget';
import backgroundStake1 from '../../assets/img/stake/layer.png';
import { useNFTData, useNFTStakeData } from 'state/stakelists/hooks'


const Stake = () => {
	useNFTStakeData();

	const [nftlist, setNftlist] = useState([]);
	const nfts = useSelector((state: any) => state.stakelists.nfts);

	useEffect(() => {
		setNftlist(nfts);
	}, [nfts]);

	console.log(nftlist);
	
	return (
		<div>
			<div className='w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-5' style={{ backgroundImage: `url(${backgroundStake1})`, backgroundSize: 'cover'}}>
				<div className='lg:flex'>
					<img className='hidden lg:block w-3/6 object-cover mb-0 lg:pl-32 sm:pl-5 mt-16' src="/images/imgs/stake/shop.png" alt=""  />			
					<p className='text-white pl-4 mt-40 text-3xl '>
						STAKE YOUR
						<br/>
						BABY BOSS
					</p>
				</div>
				<div className=''>
					<div className="lg:float-right lg:mr-32 p-8 lg:rounded-xl mt-5" style={{ backgroundColor: '#8c55bc' }}>
						<div className=' text-3xl text-white pb-5 '>Current Earning:</div>
						<div className=' text-4xl text-green-500 pb-5 '>1000$ BBOSS</div>
						<div className=' text-white text-center text-2xl p-3 rounded-xl' style={{ backgroundColor: "#ff06f5" }}>CLAIM ALL</div>
					</div>
				</div>
			</div>
			<div className='px-4 lg:px-32 py-4 lg:py-20'>
				{
					nftlist && nftlist?.length > 0 && 
					<TabWidget nftlists = { nftlist } /> 
				}
			</div>
		</div>
	)
}

export default Stake