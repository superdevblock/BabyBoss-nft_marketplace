import { CHAIN } from 'config'
import addresses from 'config/contracts'
import { Address } from 'config/types'

export const getAddress = (address: Address): string => {
  const chainId = CHAIN
  return address[chainId]
}

export const getNFTAddress = () => {
  return getAddress(addresses.nft)
}
export const getStakingAddress = () => {
  return getAddress(addresses.staking)
}
export const getRewardAddress = () => {
  return getAddress(addresses.reward)
}
export const getMulticallAddress1 = () => {
  return getAddress(addresses.multicall1)
}
export const getMulticallAddress2 = () => {
  return getAddress(addresses.multicall2)
}
export const getMulticallAddress3 = () => {
  return getAddress(addresses.multicall3)
}
export const getRegisterAddress = () => {
  return getAddress(addresses.register)
}
export const getRouterAddress = () => {
  return getAddress(addresses.pancakeRouter)
}
export const getWBNBAddress = () => {
  return getAddress(addresses.WBMB)
}