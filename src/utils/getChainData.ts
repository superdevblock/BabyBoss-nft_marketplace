import { INFURA_ID } from 'config'
import supportedChains from 'config/chains'
import { IChainData } from 'config/types'

export function getChainData(chainId: number): IChainData {
  const chainData = supportedChains.filter(
    (chain: any) => chain.chain_id === chainId
  )[0];

  if (!chainData) {
    throw new Error("ChainId missing or not supported");
  }

  const API_KEY = INFURA_ID

  if (
    chainData.rpc_url.includes("infura.io") &&
    chainData.rpc_url.includes("%API_KEY%") &&
    API_KEY
  ) {
    const rpcUrl = chainData.rpc_url.replace("%API_KEY%", API_KEY)

    return {
      ...chainData,
      rpc_url: rpcUrl
    }
  }
  
  return chainData
}