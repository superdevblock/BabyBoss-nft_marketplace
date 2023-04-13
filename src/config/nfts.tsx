import { Address } from './types'

export interface NFTConfig {
  nftSymbol: string
  address: Address
}

export const NFT_NUM = 2600
export const REWARD_PER_DAY = 5
export const DAY_SECOND = 15 * 60 // 86400
export const AUTHOR = 'NFT Lambo Club'
export const DAO_FEE = 20
export const MINT_TRANSACTION = '0x175a9bb843c271b135a4ee8316a2affac586e3fe08f005f5415c111b49926fc4'
export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'
// export const GRAPH_API_URL = 'https://api.studio.thegraph.com/query//nftlamboclub/'
// export const GRAPH_API_URL = 'https://api.studio.thegraph.com/query/34591/nftlamboclub/v0.0.8'
export const GRAPH_API_URL = 'https://api.studio.thegraph.com/query/45015/babyboss/v0.0.2'
export const IPFS_URL = 'https://lambonft.mypinata.cloud/ipfs/'
export const IPFS_HASHS = [
  'QmUPvcuj9vRrbBLEyCFDkzVqQirJ76JoRzcbMgNy2MtHvd',
  'QmbTroPN3jsXr6HYpiUXFpitRqNTwDLWx5veUfLTvn2qcH',
  'QmWXZpHKdcrmmRb2upazs8T28n6YCRDKXnK2Vn1Jq1fPXz',
  'QmbHq8w6zsRfHrBDEn1XFiwpVxTTbJcTuE3y8FPUrjz4o9',
  'QmSt2wLrD2bqc5wHoxou149QJ14yjdbMudUV6bM6RsBza1', //5
  'QmbUUTFsnG8Rpp84q4A3z8HaxFhjtqRBK71xXxAqGnKC98',
  'QmUiXJac2TffvmnAKtNX9KUUhHb4FVxeCFdqcb3pPZinaL',
  'QmedN6RyfPZ9PaUm9ALovgyKC5xwgsv8x4bVRbGdKjmGos',
  'QmSKbdAkhqHWnZxjpMdgzbW2BjozoQ3VvyVD2CmoU548GY',
  'QmV1dU1NDBPAgtoXgQ3YVWKEgqNMUGy7DUviv9d37PKUqW', //10
  'QmcqT5JoqY4HDPY4W4HQYwrkMChykQP7RQGGj5WQZDDnUH',
  'QmULcZukmpGtNbXpWhK1XpKo6uNW2B4owDEmK9jsHQ7jBm',
  'QmXPL3kJqMhWStbQmWomXgpY62LCUR8bM1cGjNEyhMbMmt',
  'QmZkfDWhDScdn2UhMAARVmYru86A3ah6Pz4ZGTFgKQcujo',
  'QmYBaYeJT8tMufiL2ZBPbsp8vuTR177kR4Yi2tTwqbehdn', //15
  'QmXCRhpFh7NQWgnngt5jMnvGwae8RVAmi1UcySNQdfF3eB',
  'QmaZ5xb4faFbn4tXiPGkjxQtDHod3BUwz3djjyDKc41yho',
  'QmaZPVX9YyMELo563jU17CzsVALvobuQfWH4Jodv1SiNnH',
  'QmYxwSa4QC4FzMsELUBgjgpF7KSigNQHq4gX9NoZMZrALw',
  'QmSkJoivPrGuNyQj5c5ccYoC4ZHCAt1XPUtFWACTqNHZ38', //20
  'QmX5JUsxhwYm21hNXbb8FCrtttT1D5VWauWnE9BtBzgdV5',
  'QmX2k6P1mWvRybunU2DJTXZjSU77hLGEFcR6RH6cdf3hFz',
  'QmTMcF7tNBJFiQaSF1m7s893L5tA28pSU8daqZWks5SN9J',
  'QmPvV5KJHsNAAW2FGqqhHDNWAZQxPvFW6Vv7dAquD8XeZX',
  'QmdUntthWn9DUqxL9eQxB53j9GAVoy9D29yHqJscugTdpf', //25
  'QmWuHSG4gYkKBZPDTt54mtY6dbSZiqBKhXkrWfmnDSuEps',
]

export const getIpfsUrl = (id: number): string => {
  const collectionId = Math.floor(id / 100)
  const subId = (id + 1) % 100 == 0 ? '100' : `${(id + 1) % 100}`
  const padding = collectionId == 0 ? 3 : 4
  return `${IPFS_URL}${IPFS_HASHS[collectionId]}/${subId.padStart(padding,'0')}.png`
}