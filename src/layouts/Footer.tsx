import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import footerLayer from '../assets/footer.png'

const Footer = () => {
  
  return (
    <div className='footer-main' >
      <div className='body'>
        <div className='lg:float-left md:float-none sm:float-none lg:flex mb-10'>
          <div className='flex'>
            <Link to="/" style={{ float: 'left' }}>  
              <img src="/images/main-logo.png" alt="" />
            </Link>
            <img src="/images/imgs/icons/icon1.png" alt="" />
          </div>
        </div>
        <div className='category-footer sm:justify-center lg:float-right md:float-none sm:float-none'>
          <div className='flex'>
            <div className='footer-icons'>
            </div>
            <div className='footer-icons'>
            </div>
            <div className='footer-icons'>
            </div>
            <div className='footer-icons'>
            </div>
            <div className='footer-icons'>
            </div>
          </div>
          <div style={{ paddingLeft: '10px', color: '#FFFFFF', paddingTop: '20px' }}>
            Built by BabyBoss. All Rights Reserved © 2022 
          </div>
        </div>
      </div>
      <div className='description'>
        <p>
          DISCLAIMER
        </p>
        <p>
          Nothing here is investment advice. NFTs do not necessarily have any intrinsic value. They also might be illiquid. If you buy an NFT, you are not necessarily going to be able to sell it for         much later, or gain any specific utility from it. You are welcome to buy NFTs if it would make you happy to own them! But there is no implied economic return associated with doing so. There are no refunds for NFTs, and we will not field customer complaints. Please only buy NFTs if you understand that doing so does not necessarily give any direct economic value. We do not         recommend purchasing any NFTs for speculative investment purposes. NFTs may lose value or have no value and may have no market. Note that if applicable law does not allow all or any part of the above limitation of liability to apply to you, the limitations will apply to you only to the maximum extent permitted by applicable law.
        </p>
      </div>
    </div>
  )
}

export default Footer