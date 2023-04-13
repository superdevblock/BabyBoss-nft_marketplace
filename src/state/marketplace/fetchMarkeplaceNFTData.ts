import BigNumber from 'bignumber.js'
import registerABI from 'config/abis/register.json'
import { getRegisterAddress } from 'utils/addressHelpers'
import {multicall1} from 'utils/multicall'
import { GRAPH_API_URL, NFT_NUM } from 'config/nfts'
import { ethers } from 'ethers'

// export const fetchNFTData = async () => {
//     const calls = []
//     const registerAddress = getRegisterAddress()
//     for (let i = 0; i < NFT_NUM; i ++) {
//       const callData =  {
//         address: registerAddress,
//         name: 'sellInfo',
//         params: [i],
//       }
//       calls.push(callData)
//     }
    
//     const rawTokenPrices = await multicall1(registerABI, calls)
//     const parsedTokenPrices = rawTokenPrices.map((item: any, ind: number) => {
//       const collection = Math.floor(ind / 100 + 1)
//       const th =  ind % 100 + 1
//       return {
//         id: ind, 
//         name: "#" + collection + " NFT " + th + " of 100",
//         price: ethers.utils.formatEther(new BigNumber(item[0]._hex).toJSON()),
//         totalVolume: ethers.utils.formatEther(new BigNumber(item[1]._hex).toJSON()),
//     }
//     })
//     return parsedTokenPrices
// }


import { createClient } from 'urql'
import { getSaleLists } from 'queries/query'
export const fetchNFTData = async () => {
  let salelists1 = [], salelists2 = [], salelists3 = []
  const client = createClient({url: GRAPH_API_URL})
  let data = await client.query(getSaleLists, {first: 1000, skip: 0}).toPromise()
  salelists1 = data.data.saleLists.map((item: any, ind: number) => {
    const collection = Math.floor(item.tokenId / 100 + 1)
    const th =  item.tokenId % 100 + 1
    return {
      id: item.tokenId,
      name: "#" + collection + " NFT " + th + " of 100",
      price: ethers.utils.formatEther(item.price),
      totalVolume: ethers.utils.formatEther(item.totalVolume)
    }
  })
  if(salelists1.length == 1000) {
    data = await client.query(getSaleLists, {first: 1000, skip: 1000}).toPromise()
    salelists2 = data.data.saleLists.map((item: any, ind: number) => {
      const collection = Math.floor(item.tokenId / 100 + 1)
      const th =  item.tokenId % 100 + 1
      return {
        id: item.tokenId,
        name: "#" + collection + " NFT " + th + " of 100",
        price: ethers.utils.formatEther(item.price),
        totalVolume: ethers.utils.formatEther(item.totalVolume)
      }
    })
    if(salelists2.length == 1000) {
      data = await client.query(getSaleLists, {first: 1000, skip: 2000}).toPromise()
      salelists3 = data.data.saleLists.map((item: any, ind: number) => {
        const collection = Math.floor(item.tokenId / 100 + 1)
        const th =  item.tokenId % 100 + 1
        return {
          id: item.tokenId,
          name: "#" + collection + " NFT " + th + " of 100",
          price: ethers.utils.formatEther(item.price),
          totalVolume: ethers.utils.formatEther(item.totalVolume)
        }
      })
    }
  }
  
  let salelists = [...salelists1, ...salelists2, ...salelists3]
  for(var i = 0; i < NFT_NUM; i++) {
    const validate = salelists.filter((item: any) => item.id == i)
    if(validate.length > 0) continue
    const collection = Math.floor(i / 100 + 1)
    const th =  i % 100 + 1
    const newItem = {
      id: i,
      name: "#" + collection + " NFT " + th + " of 100",
      price: 0,
      totalVolume: 0
    }
    salelists = [...salelists, newItem]
  }
  salelists.sort((a: any, b: any) => Number(a.id) - Number(b.id))
  return salelists
}
