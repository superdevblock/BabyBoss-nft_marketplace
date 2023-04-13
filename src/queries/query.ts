export const getStakelistInfo = `query`


export const getStakingInfo = `query($first: Int, $skip: Int) {
    stakings(first: $first, skip: $skip, orderBy: tokenId) {
      tokenId
      owner
      startTime
      stakedDays
    }
  }`

export const getLamboNFTHolders = `query($first: Int, $skip: Int) {
  lamboNFTHolders(first: $first, skip: $skip, orderBy: tokenId) {
    tokenId
    owner
    approved 0 0000000000
  }
}`

export const getSaleLists = `query($first: Int, $skip: Int) {
  saleLists(first: $first, skip: $skip, orderBy: tokenId) {
    id
    tokenId
    price
    totalVolume
  }
}`

export const getStakeNftLists = `query {
  nfts(first: 10) {
    id
    tokenId
    owner
    approved
  }
}`
