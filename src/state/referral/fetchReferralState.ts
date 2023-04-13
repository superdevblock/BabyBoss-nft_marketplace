import BigNumber from 'bignumber.js'
import RegisterAbi from 'config/abis/register.json'
import { ethers } from 'ethers'
import { getRegisterAddress } from 'utils/addressHelpers'
import {multicall1} from 'utils/multicall'

export const fetchNetworkDownlineState = async (account: string) => {
  const registerAddress = getRegisterAddress()
  const calls = [
    {
      address: registerAddress,
      name: 'getDownline',
      params: [account],
    },
  ]

  const downlineInfo = await multicall1(RegisterAbi, calls)
  const downline = downlineInfo[0].map((item: any) => {
    return new BigNumber(item._hex).toNumber()
  })
  return downline
}

export const fetchNFTPurchasedData = async (account: string) => {
  const calls = []
  const registerAddress = getRegisterAddress()
  for (let i = 0; i < 4; i ++) {
    const callData =  {
      address: registerAddress,
      name: 'purchasedNFT',
      params: [account, i],
    }
    calls.push(callData)
  }
  
  const nftPurchasedInfo = await multicall1(RegisterAbi, calls)
  const nftPurchased = nftPurchasedInfo.map((item: any) => {
    return new BigNumber(item).toJSON()
  })
  return nftPurchased
}

export const fetchBNBEarnedData = async (account: string) => {
  const calls = []
  const registerAddress = getRegisterAddress()
  for (let i = 0; i < 4; i ++) {
    const callData =  {
      address: registerAddress,
      name: 'earnedBNB',
      params: [account, i],
    }
    calls.push(callData)
  }
  
  const bnbEarnedInfo = await multicall1(RegisterAbi, calls)
  const bnbEarned = bnbEarnedInfo.map((item: any) => {
    return ethers.utils.formatEther(new BigNumber(item).toJSON())
  })
  return bnbEarned
}


export const fetchGenealogicalTree = async (account: string) => {
  const registerAddress = getRegisterAddress()
  const calls = [
    {
      address: registerAddress,
      name: 'getGenealogicalTree',
      params: [account],
    },
  ]

  const genealogicalTreeInfo = await multicall1(RegisterAbi, calls)
  // const genealogicalTree = genealogicalTreeInfo[0].map((item: any, index: any) => {
    
  //   item.map((item1: any) => {
  //       return {
  //         publicKey : item1.toString(),
  //         level: index
  //       }
  //   })
  // })
  const genealogicalTree = genealogicalTreeInfo[0]
  let tree = []
  for (let i = 0; i < genealogicalTree.length; i++) {
    const element = genealogicalTree[i];
    for (let j = 0; j < element.length; j++) {
      const element1 = element[j];
      tree.push({
        publicKey: element1,
        level: i + 1
      })
    }
  }
  return tree
}
