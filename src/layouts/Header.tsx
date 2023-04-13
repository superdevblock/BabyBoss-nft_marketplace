import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import WalletConnectButton from 'components/WalletConnectButton'
import { Link, useNavigate } from 'react-router-dom'
import GlobModal from 'components/GlobModal'
import { VscChromeClose } from "react-icons/vsc"
import { AiFillCheckCircle } from "react-icons/ai"

const StyledHeader = styled.div`
  display: flex;
  width: 100%;
  height: 110px;
  max-width: 1400px;
  align-items: center;
  justify-content: space-between;
  margin: auto;
`

const StyledLogo = styled.img`
  height: 90px;
`

const Header = () => {
  const [modalOpen1, setModalOpen1] = useState<any>(false)
	const [modalOpen2, setModalOpen2] = useState<any>(false)
	const [errorModal, setErrorModal] = useState(false)
  const [message, setMessage] = useState<String>("")
  
  return (
    // <StyledHeader>
    //   <a href="/">
    //     <StyledLogo src="images/logo.png" alt="logo" />
    //   </a>
    //   <WalletConnectButton />
    // </StyledHeader>
    <div className='header-main'>
	    <GlobModal size="sm" open={modalOpen1} setOpen={setModalOpen1} >
				<div >
					<div className=' w-full flex items-center justify-between px-3 py-2 border-b'>
						<h1 className=' text-xl text-white'>Login</h1> <VscChromeClose onClick={() => setModalOpen1(false)} className=' w-5 h-5 cursor-pointer text-white ' />
					</div>
					<div className=' flex items-center justify-center w-full pt-10 pb-5'>
						<svg aria-hidden="true" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-pr" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
							<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
						</svg>
					</div>
					<p className=' text-sm text-center text-white py-2'>{message}</p>

					<div className=' flex items-center justify-center py-3'>
						<button onClick={() => setModalOpen1(false)} className=' px-16 py-2 text-sm rounded-3xl text-pr border-2 border-pr'>Cancel</button>
					</div>
				</div>
			</GlobModal>
			<GlobModal size="sm" open={errorModal} setOpen={setErrorModal} >
				<div >
					<div className=' w-full flex items-center justify-between px-3 py-2 border-b'>
						<h1 className=' text-xl text-white'>Login</h1> <VscChromeClose onClick={() => setErrorModal(false)} className=' w-5 h-5 cursor-pointer text-white ' />
					</div>
					<p className=' text-sm text-center text-white py-8'>{message}</p>
					<div className=' flex items-center justify-center'>
						<button onClick={() => setErrorModal(false)} className=' px-16 py-2 text-sm rounded-3xl text-pr border-2 border-pr'>Close</button>
					</div>
				</div>
			</GlobModal>
			<GlobModal size="sm" open={modalOpen2} setOpen={setModalOpen2} >
				<div>
					<div className=' w-full flex items-center justify-between px-3 py-2 border-b'>
						<h1 className=' text-xl text-white'>Login</h1> <VscChromeClose onClick={() => setModalOpen2(false)} className=' w-5 h-5 cursor-pointer text-white ' />
					</div>
					<div className=' mt-8 flex items-center justify-center'>
									<AiFillCheckCircle className=' text-green-500 w-7 h-7' />
							</div>
							<p className=' text-sm text-center text-white pt-3 pb-8'>Login Successfully!</p>

							<div className=' flex items-center justify-center gap-2 py-3'>
									<button onClick={() => setModalOpen2(false)} className=' px-16 py-2 text-sm rounded-3xl text-pr border-2 border-pr'>OK</button>

							</div>
					</div>
			</GlobModal>

      <Link to="/">  
        <img src="/images/main-logo.png" className='' alt="" />
      </Link>
      <div className='category'>
        <Link to="/" className='font3'>HOME</Link>
        <Link to="/stake" className='font3'>STAKE</Link>		
				<Link to="/signup" className='font3'>SHOP</Link>		
				<WalletConnectButton />
      </div>
    </div>
  )
}

export default Header