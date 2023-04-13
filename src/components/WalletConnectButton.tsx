import React from 'react'
import styled from 'styled-components'
import { useWeb3Context } from 'hooks/useWeb3Context'

const StyledConnectButton = styled.button`
  background-color: #ff06f5;
  color: #FFFFFF;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 15px;  
`

const WalletConnectButton = () => {
  const web3Context = useWeb3Context()
  const displayAddress =  `${web3Context?.account.substring(0, 5)}...${web3Context?.account.substring(web3Context?.account.length - 3)}`
  
  return (
    <div className='font3'>
      { web3Context?.account ?
        <StyledConnectButton  className='lg:pt-2 pt-0'  onClick={web3Context?.disconnect}>
          Disconnect
          <br/>
          {displayAddress}
        </StyledConnectButton>
        :
        <StyledConnectButton className='lg:py-2 mt-1' onClick={web3Context?.connectWallet}>Connect</StyledConnectButton>
      }
    </div>
  )
}

export default WalletConnectButton