import { BIG_TEN } from 'utils/bigNumber'
import { parseUnits } from 'ethers/lib/utils'

export const INFURA_ID = 'PkSg__OS-7f9zA6VGKy5UDEx1V28aD5-'
// export const RPC_URL = 'https://eth-mainnet.alchemyapi.io/v2/PkSg__OS-7f9zA6VGKy5UDEx1V28aD5-' //ethereum
// export const RPC_URL = 'https://bsc-dataseed1.binance.org' //BSC Mainnet
// export const RPC_URL = 'https://eth-rinkeby.alchemyapi.io/v2/PkSg__OS-7f9zA6VGKy5UDEx1V28aD5-' // rinkeby
export const RPC_URL = 'https://eth-goerli.alchemyapi.io/v2/PkSg__OS-7f9zA6VGKy5UDEx1V28aD5-' // goerli
// export const RPC_URL = 'https://data-seed-prebsc-1-s1.binance.org:8545/' //BSC Testnet
export const CHAIN = 5 // 4 // 97 //56

export const NFT_IPFS = 'https://newgate.mypinata.cloud/ipfs/Qma3pitoFVPR8AvP2UepPjvn6wLwG6q4KioV1ULQ5sHRcA/'

export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18)
export const DEFAULT_GAS_LIMIT = 200000


export enum GAS_PRICE {
  default = '5',
  fast = '6',
  instant = '7',
  testnet = '10',
}

export const GAS_PRICE_GWEI = {
  default: parseUnits(GAS_PRICE.default, 'gwei').toString(),
  fast: parseUnits(GAS_PRICE.fast, 'gwei').toString(),
  instant: parseUnits(GAS_PRICE.instant, 'gwei').toString(),
  testnet: parseUnits(GAS_PRICE.testnet, 'gwei').toString(),
}

export const SLIP_PAGE = 1