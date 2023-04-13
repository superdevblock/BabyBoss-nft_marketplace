import { ethers } from 'ethers'
import Web3 from 'web3'
import { simpleRpcProvider } from 'utils/providers'

// Addresses
import {
  getNFTAddress,
  getStakingAddress,
  getRewardAddress,
  getMulticallAddress1,
  getMulticallAddress2,
  getMulticallAddress3,
  getRegisterAddress,
  getRouterAddress,
} from 'utils/addressHelpers'

// ABI
import nft from 'config/abis/nft.json'
import reward from 'config/abis/reward.json'
import NFTStaking from 'config/abis/nftStaking.json'
import MultiCallAbi from 'config/abis/multicall.json'
import RegisterAbi from 'config/abis/register.json'
import RouterABI from 'config/abis/router.json'

const getContract = (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  const signerOrProvider = signer ?? simpleRpcProvider
  return new ethers.Contract(address, abi, signerOrProvider)
}

export function getContractWithWeb3(abi: any, address: string, provider: any) {
  const web3 = new Web3(provider)

  return new web3.eth.Contract(abi, address)
}

export const getNFTContract = (provider: any) => {
  return getContractWithWeb3(nft, getNFTAddress(), provider)
}

export const getRewardContract = (provider: any) => {
  return getContractWithWeb3(reward, getRewardAddress(), provider)
}

export const getStakingContract = (provider: any) => {
  return getContractWithWeb3(NFTStaking, getStakingAddress(), provider)
}

export const getMulticallContract1 = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(MultiCallAbi, getMulticallAddress1(), signer) as any
}

export const getMulticallContract2 = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(MultiCallAbi, getMulticallAddress2(), signer) as any
}

export const getMulticallContract3 = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(MultiCallAbi, getMulticallAddress3(), signer) as any
}

export const getRegisterContract = (provider: any) => {
  return getContractWithWeb3(RegisterAbi, getRegisterAddress(), provider)
}

export const getRouterContract = (provider: any) => {
  return getContractWithWeb3(RouterABI, getRouterAddress(), provider)
}