import nftABI from 'config/abis/nft.json'
import { getNFTAddress } from 'utils/addressHelpers'
import {multicall2} from 'utils/multicall'
import { GRAPH_API_URL, NFT_NUM, NULL_ADDRESS } from 'config/nfts'


// export const fetchOwnerData = async () => {
//   const calls = []
//   const nftAddress = getNFTAddress()
//   for (let i = 0; i < NFT_NUM; i ++) {
//     const callData =  {
//       address: nftAddress,
//       name: '_ownerships',
//       params: [i],
//     }
//     calls.push(callData)
//   }
//   const rawOwners = await multicall2(nftABI, calls)
  
//   let count = 0;
//   type TypeValidater = {
//       [key: string]: boolean
//   }
//   let validater: TypeValidater = {}
//   let startOwner = ''
//   const parsedOwners = rawOwners.map((item: any, ind: number) => {
//     let owner = item[0].toLowerCase()
//     if(owner != NULL_ADDRESS) {
//       if(!validater[owner]) {
//         validater[owner] = true
//         count++;
//       }
//       startOwner = owner;
//     } else 
//       owner = startOwner
//     return {id: ind, owner: owner}
//   })
//   return {owners: parsedOwners, count: count}
// }

import { createClient } from 'urql'
import { getLamboNFTHolders } from 'queries/query'
export const fetchOwnerData = async () => {
  
  const client = createClient({url: GRAPH_API_URL})
  let data = await client.query(getLamboNFTHolders, {first: 1000, skip: 0}).toPromise()
  const owners1 = data.data.lamboNFTHolders.map((item: any, ind: number) => {
    return {
      id: item.tokenId,
      owner: item.owner
    }
  })
  data = await client.query(getLamboNFTHolders, {first: 1000, skip: 1000}).toPromise()
  const owners2 = data.data.lamboNFTHolders.map((item: any, ind: number) => {
    return {
      id: item.tokenId,
      owner: item.owner
    }
  })
  data = await client.query(getLamboNFTHolders, {first: 1000, skip: 2000}).toPromise()
  const owners3 = data.data.lamboNFTHolders.map((item: any, ind: number) => {
    return {
      id: item.tokenId,
      owner: item.owner.toLowerCase()
    }
  })
  
  const owners = [...owners1, ...owners2, ...owners3]

  let count = 0
  type TypeValidater = {
      [key: string]: boolean
  }
  let validater: TypeValidater = {}
  owners.map((item: any, ind: number) => {
    let owner = item.owner.toLowerCase()
    if(owner != NULL_ADDRESS) {
      if(!validater[owner]) {
        validater[owner] = true
        count++;
      }
    } 
  })
  return {owners: owners, count: count}
}
