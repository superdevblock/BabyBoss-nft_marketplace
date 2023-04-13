import stakingABI from 'config/abis/nftStaking.json'
import { getNFTAddress, getStakingAddress } from 'utils/addressHelpers'
import {multicall3} from 'utils/multicall'
import { AUTHOR, MINT_TRANSACTION, REWARD_PER_DAY } from 'config/nfts'
import getNFTNameFromId from 'utils/getNFTNameFromId'

export const fetchNFTDetailData = async (id: number) => {
    const stakingAddress = getStakingAddress()
    const calls = [
      {
        address: stakingAddress,
        name: 'stakeInfo',
        params: [id],
      }
    ]
    
    const rawData = await multicall3(stakingABI, calls)
    const _startTime = rawData[0][1].toNumber()
    const _stakedDays = rawData[0][2].toNumber()
    const stakingDays = _stakedDays
    let _stakingTime = 0
    if(_startTime !== 0) {
      const currentTime = Math.floor(Date.now() / 1000)
      const duration = currentTime - _startTime + 120
      if(duration > 0)
        _stakingTime = duration
    }
    return {
        id: id,
        name: getNFTNameFromId(id),
        minter: AUTHOR,
        collection: "#" + Math.floor(id/100+1) + " Lambo Collection",
        totalToken: 365 * REWARD_PER_DAY,
        stakingDays: stakingDays,
        mintedTokens: _stakedDays * 5,
        claimableTokens: (365 - _stakedDays) * REWARD_PER_DAY,
        mintTransaction: MINT_TRANSACTION,
        contractAddress: getNFTAddress(),
        isStake: _startTime === 0 ? false : true,
        stakingTime: _stakingTime
    }
}
