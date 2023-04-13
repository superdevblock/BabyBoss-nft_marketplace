import React from 'react'
import styled from 'styled-components'
import { useWeb3Context } from 'hooks/useWeb3Context'

const StyledConnectPage = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  max-width: 1400px;
  align-items: center;
  justify-content: space-between;
  margin: auto;
`

const StyledLogo = styled.img`
  height: 120px;
`

const StyledBoxImage = styled.img`
  height: 100vh;
`

const StyledConnectButton = styled.div`
  background-image: url(/images/connect.png);
  background-size: 230px 230px;
  width: 230px;
  height: 230px;
  font-size: 35px;
  align-items: center;
  justify-content: center;
  display: flex;
  text-align: center;
  cursor: pointer;
  font-weight: bold;
`

const ConnectPage = () => {
  const web3Context = useWeb3Context()
  
  return (
    <StyledConnectPage>      
      <StyledLogo src="images/unboxlabs.png" alt="logo" />
      <StyledBoxImage src="images/box.png" alt="box" />
      <StyledConnectButton onClick={web3Context?.connectWallet}>Connect Wallet</StyledConnectButton>
    </StyledConnectPage>
  )
}

export default ConnectPage