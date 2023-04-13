import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie';
import tw from 'tw-tailwind'
import { useWeb3Context } from 'hooks/useWeb3Context'
import { useIsRegistered, useRegisterState } from 'state/register/hooks'
import GlobModal from 'components/GlobModal'
import { VscChromeClose } from "react-icons/vsc"
import { AiFillCheckCircle } from "react-icons/ai"
import { useSelector } from 'react-redux'
import { URI } from 'api-control/api'
import axios from 'axios'
import encryptParams from 'utils/encryption';
import backgroundLayer1 from '../../assets/img/background-layer-1.png';
import backgroundLayer2 from '../../assets/img/background-layer-2.png';
import backgroundLayer3 from '../../assets/img/background-layer-3.png';

const OpenseaBtn = tw.a`
	shadow-2xl	
	w-48 m-3 rounded-2xl p-3 font3 
	hover:bg-blue-600 
	bg-blue-700
	text-white
	text-center
	cursor-pointer
`;

const Main = (setLoader: any) => {
	const navigation = useNavigate()
	const web3Context = useWeb3Context()

	const [cookies, setCookie] = useCookies(['token', 'public_key']);

	const [wallet, setWallet] = useState<string | undefined>("")

	const [modalOpen1, setModalOpen1] = useState<any>(false)
	const [modalOpen2, setModalOpen2] = useState<any>(false)
	const [errorModal, setErrorModal] = useState(false)
	const [message, setMessage] = useState<String>("")

	useIsRegistered(web3Context?.account)
	const registerState = useRegisterState()
	const loading = useSelector((state: any) => state.register.status)



	useEffect(() => {
		setWallet(web3Context?.account.toLowerCase())
	}, [web3Context])

	const login = () => {
		// setModalOpen1(true)
		if(registerState) {
				// const body = {
				//     public_key: web3Context?.account,
				//     token: cookies.token
				// }
				// axios.post(`${URI}/auth/login`, {params: encryptParams(body)})
				//     .then((res) => {
								// console.log("sniper: res: ", res)
								// setCookie('token', res.data.token)
								// setCookie('public_key', res.data.public_key)

								setModalOpen2(true)
				
								setTimeout(() => {
										navigation("/referral-program")
										// window.location.reload()
								}, 2000);
						// })
						// .catch((err) => {
						//     console.log("sniper: err: ", err)
						//     setMessage(err.response.data.message)
						//     setErrorModal(true)
						// })
						// .finally(() => setModalOpen1(false))
		} else { 
				setMessage("User With Public Key Not Found")
				setErrorModal(true)
		}
	}

	return (
		<div className=' w-full'>
			<div className='w-full'>
				<img className='w-full h-full' src="/images/marketplace.png" alt="" />
			</div>
			<div className='bg-white-100 lg:pt-28 pt-6'>
				<img src='/images/banner_icon.png' alt='' className='m-auto py-6 lg:w-80 w-60'/>
				<p className='px-1 pt-16 text-2xl m-auto text-center max-w-4xl'>
					Baby Boos S3L Club, is a collection of 3690 + 9 
					colaboration 1/1 art super adorable pixelated baby 
					NFT's that were born on the Ehtereum blockchain.
				</p>
				<p className='px-1 pt-16 text-2xl m-auto text-center	max-w-4xl	'>
					We want to represent a healthy and positive vibes 
					community and build a long lasting prsence in the 
					meatberse
				</p>
			</div>
			<div className='bg-white-100 pt-24 py-24'>
				<img src='/images/small_title.png' alt='' className='m-auto p-6'/>
				<div>
					<div className='flex lg:m-16 justify-center'>
						<img src="/images/imgs/avatar/avatar1.png" className='w-20 mx-3 hidden lg:block' />
						<div className='w-60 mt-4 text-center' >3699 NFT</div>
						<div className='w-60 mt-4 text-center border-l border-r border-indigo-600' >113 UNIQUE<br/>TRAITS</div>
						<div className='w-60 mt-4 text-center' >91 / 1 <br />ARTIST</div>
						<img src="/images/imgs/avatar/avatar2.png" className='w-20 mx-3 hidden lg:block' />
					</div>
					<div className='flex mt-16 justify-center'>
						<img src="/images/imgs/avatar/avatar3.png" className='w-20 mx-3 hidden lg:block' />
						<div className='w-60 mt-4 text-center' >TOTAL SUPPLY: <br/>3699</div>
						<div className='w-60 mt-4 text-center border-l border-r border-indigo-600' >MINT PRICE<br/>FREE MINT</div>
						<div className='w-60 mt-4 text-center' >RELEASE DATE: <br />9th-12th OF <br />APPIL 2022</div>
						<img src="/images/imgs/avatar/avatar4.png" className='w-20 mx-3 hidden lg:block' />
					</div>
					<div className='flex lg:m-16 mt-6 justify-center'>
						<button className='w-48 text-center m-3 rounded-2xl p-3' style={{ backgroundColor: "#ff06f5", color:"#FFFFFF" }}>TOTAL SUPPLY <br/>3699</button>
						<button className='w-48 text-center m-3 rounded-2xl p-3' style={{ backgroundColor: "#ff06f5", color:"#FFFFFF" }}>ROYALTY FEES: <br/>7.5%</button>
						<button className='w-48 text-center m-3 rounded-2xl p-3' style={{ backgroundColor: "#ff06f5", color:"#FFFFFF" }}>FILE HOSTING<br/>IPFS</button>
					</div>
				</div>
			</div>
			<div className='bg-white-100 pt-20 py-6' style={{ backgroundColor: "#ff06f5", color:"#FFFFFF" }}>
				<h1 className='text-center py-6 font3 text-3xl '>CHECK OUT OUR COLLECTION OPENSEA!</h1>
				<div className='flex justify-center'>
					<OpenseaBtn style={{ boxShadow :"3px 3px #791093" }}>OpenSea</OpenseaBtn>
				</div>
				<div className='w-full' >
					<div className='flex w-2/3 m-auto justify-center'>
						<div className="grid grid-cols-4 gap-5">
							<div className='bg-white-100, w-28 p-2'>
								<img src="/images/imgs/avatar/avatar4.png" className='w-20 mx-3 w-full h-full' />
							</div>
							<div className='bg-white-100, w-28 p-2'>
								<img src="/images/imgs/avatar/avatar4.png" className='w-20 mx-3 w-full h-full' />
							</div>
							<div className='bg-white-100, w-28 p-2'>
								<img src="/images/imgs/avatar/avatar4.png" className='w-20 mx-3 w-full h-full' />
							</div>												
							<div className='bg-white-100, w-28 p-2'>
								<img src="/images/imgs/avatar/avatar4.png" className='w-20 mx-3 w-full h-full' />							
							</div>
						</div>
					</div>
				</div>			
				<div className='w-full' >
					<div className='flex w-2/3 m-auto justify-center'>
						<div className="grid grid-cols-4 gap-5">
							<div className='bg-white-100, w-28 p-2'>
								<img src="/images/imgs/avatar/avatar4.png" className='w-20 mx-3 w-full h-full' />
							</div>
							<div className='bg-white-100, w-28 p-2'>
								<img src="/images/imgs/avatar/avatar4.png" className='w-20 mx-3 w-full h-full' />
							</div>
							<div className='bg-white-100, w-28 p-2'>
								<img src="/images/imgs/avatar/avatar4.png" className='w-20 mx-3 w-full h-full' />
							</div>												
							<div className='bg-white-100, w-28 p-2'>
								<img src="/images/imgs/avatar/avatar4.png" className='w-20 mx-3 w-full h-full' />							
							</div>
						</div>
					</div>
				</div>							
			</div>	
			
			<div className='w-full h-full grid grid-cols-1 lg:grid-cols-2 items-center gap-5' style={{ backgroundImage: `url(${backgroundLayer1})`, backgroundSize: 'cover'}}>
				<div className=' hidden lg:block w-full	h-full ' style={{ height: '90vh' }}></div>
				<div>
					<h1 className=' ml-10 mt-5 text-6xl lg:text-9xl text-white sm:text-center lg:text-left ' style={{ fontFamily: 'Myriad Pro' }}>MECHA</h1>
					<h1 className=' ml-10 mt-5 text-4xl text-white sm:text-center lg:text-left ' style={{ fontFamily: 'Myriad Pro' }}>BABY BOSS</h1>
					<p className=' pl-10 text-white w-full lg:w-5/6 py-2 sm:text-center lg:text-left '>New BabyBoss AI NFT collection. Available for all BabyBoss NFTholders</p>
					<div className=' text-left md:text-center lg:text-left'>
						<button className='ml-10 my-5 mr-10 text-white px-6 pt-2 py-2 mt-4 rounded-full text-center font3 lg:text-2xl ' style={{ backgroundColor: '#98d7db' }}>CHECKOUT NOW!</button>
					</div>
        </div>
			</div>
			<div className='w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-5' style={{ backgroundImage: `url(${backgroundLayer2})`, backgroundSize: 'cover'}}>
				<img className=' hidden lg:block w-5/6 object-cover mt-24 pl-32' src="/images/image-layer2.png" alt=""  />
				<div>
					<h1 className=' ml-10 mt-5 text-6xl lg:text-8xl text-white sm:text-center lg:text-left font3'>MERCH</h1>
					<h1 className=' ml-10 text-6xl lg:text-8xl text-white sm:text-center lg:text-left font3 '>STORE</h1>
					<p className=' pl-10 text-white w-full lg:w-5/6 py-2 sm:text-center lg:text-left '>
						Check out the coolest Baby Boss exclusive <br/> 
						merch and more, available to order today.
					</p>
					<div className=' text-left md:text-center lg:text-left'>
						<button className='ml-10 my-5 mr-10 bg-red-100 w-60 pt-2 py-2 mt-4 rounded-full text-center font3 lg:text-2xl ' style={{ color: '#bd4f9d' }}>SHOW NOW!</button>
					</div>
        </div>
			</div>
			<div className='bg-white-100 lg:pt-24 pt-10 pb-20'>
				<div className='text-center text-6xl font3' style={{ color: "#ff06f5" }}>MEET OUR TEAM</div>
				<div>
					<div className='flex lg:m-16 justify-center'>
						<img src="/images/imgs/members/left-1.png" className='mt-24 h-36 mx-3 hidden lg:block' />
						<div className='w-60 m-2 text-center' >
							<img src='/images/imgs/members/member1.png' />
							APLUTO
						</div>
						<div className='w-60 m-2 text-center' >
							<img src='/images/imgs/members/member2.png' />
							NICK
						</div>
						<div className='w-60 m-2 text-center' >
							<img src='/images/imgs/members/member3.png' />
							AKIBOI
						</div>
						<img src="/images/imgs/members/right-1.png" className='mt-24 h-36 mx-3 hidden lg:block' />
					</div>
					<div className='flex justify-center'>
						<img src="/images/imgs/members/left-2.png" className='mt-24 h-36 mx-3 hidden lg:block' />
						<div className='w-60 m-2 text-center' >
							<img src='/images/imgs/members/member4.png' />
							KARIM
						</div>
						<div className='w-60 m-2 text-center' >
							<img src='/images/imgs/members/member5.png' />
							SLUSHY
						</div>
						<div className='w-60 m-2 text-center' >
							<img src='/images/imgs/members/member6.png' />
							AKMAL
						</div>
						<img src="/images/imgs/members/right-2.png" className='mt-24 h-36 mx-3 hidden lg:block' />
					</div>
				</div>
			</div>
			<div className='relative'>
				<img className='lg:w-full lg:h-full ' src="/images/imgs/image-layer3.png" alt="" />
				<div className=' w-full	h-full lg:absolute lg:top-5 md:absolute md:top-1 sm: absolute sm: top-0' >
					<p className='pt-4 md:pt-10 lg:pt-20 text-white w-full pb-2 lg:pb-20 text-center lg:text-4xl md:text-base sm:text-sm justify-center font3'>
							Join Our<br/>
							Community!
					</p>		
					<div className=' text-center text-3xl text-white' >
						<button className='pt-2 py-2 pl-6 pr-6 rounded-full text-center bg-purple-700 hover:bg-purple-600 font3' style={{ boxShadow :"3px 3px #2687de" }}>
							discord
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Main