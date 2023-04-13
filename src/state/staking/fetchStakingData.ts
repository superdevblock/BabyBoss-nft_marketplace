import { GRAPH_API_URL, NFT_NUM, NULL_ADDRESS } from "config/nfts"
import { getStakingAddress } from "utils/addressHelpers"
import stakingABI from 'config/abis/nftStaking.json'
import {multicall3} from "utils/multicall"
import BigNumber from "bignumber.js"

// export const fetchStakingData = async () => {
//     const calls = []
//     const stakingAddress = getStakingAddress()
//     for (let i = 0; i < NFT_NUM; i ++) {
//       const callData =  {
//         address: stakingAddress,
//         name: 'stakeInfo',
//         params: [i],
//       }
//       calls.push(callData)
//     }
    
//     const rawStakingData = await multicall3(stakingABI, calls)
//     const parsedStakingData = rawStakingData.map((item: any, ind: number) => {
//       return {
//         id: ind,
//         owner: item[0], 
//         startTime: Number(new BigNumber(item[1]._hex).toJSON()),
//         stakedDays: Number(new BigNumber(item[2]._hex).toJSON()),
//     }
//     })
//     return parsedStakingData
// }


import { createClient } from 'urql'
import { getStakingInfo } from 'queries/query'

export const fetchStakingData = async () => {
  let stakinglists1 = [], stakinglists2 = [], stakinglists3 = []
  const client = createClient({url: GRAPH_API_URL})
  let data = await client.query(getStakingInfo, {first: 1000, skip: 0}).toPromise()
  stakinglists1 = data.data.stakings.map((item: any, ind: number) => {
    return {
      id: item.tokenId,
      owner: item.owner,
      startTime: Number(item.startTime),
      stakedDays: Number(item.stakedDays)
    }
  })
  console.log("sniper: stakinglist: ", stakinglists1)
  if(stakinglists1.length == 1000) {
    data = await client.query(getStakingInfo, {first: 1000, skip: 1000}).toPromise()
    stakinglists2 = data.data.stakings.map((item: any, ind: number) => {
      return {
        id: item.tokenId,
        owner: item.owner,
        startTime: Number(item.startTime),
        stakedDays: Number(item.stakedDays)
      }
    })
    if(stakinglists2.length == 1000) {
      data = await client.query(getStakingInfo, {first: 1000, skip: 2000}).toPromise()
      stakinglists3 = data.data.stakings.map((item: any, ind: number) => {
        return {
          id: item.tokenId,
          owner: item.owner,
          startTime: Number(item.startTime),
          stakedDays: Number(item.stakedDays)
        }
      })
    }
  }
  
  let stakinglists = [...stakinglists1, ...stakinglists2, ...stakinglists3]
  for(var i = 0; i < NFT_NUM; i++) {
    const validate = stakinglists.filter((item: any) => item.id == i)
    if(validate.length > 0) continue
    const newItem = {
      id: i,
      owner: NULL_ADDRESS,
      startTime: 0,
      stakedDays: 0
    }
    stakinglists = [...stakinglists, newItem]
  }
  stakinglists.sort((a: any, b: any) => Number(a.id) - Number(b.id))
  return stakinglists
}
