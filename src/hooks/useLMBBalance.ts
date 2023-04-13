import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import { getRewardContract } from 'utils/contractHelpers'
import {useVeryFastFresh} from './useRefresh'

const useLmbBalance = (provider: any, account: any) => {
  const [lmbBalance, setLmbBalance] = useState(0)
  const veryFastRefresh = useVeryFastFresh()
  const lmbContract = getRewardContract(provider)

  useEffect( () => {
    const fetchLmbBalance = async (lmbContract: any, account: any) => {
        const _balance = await lmbContract.methods.balanceOf(account).call()
        setLmbBalance(Number(ethers.utils.formatEther(_balance)))
    }
    if(provider && account && lmbContract) {
        fetchLmbBalance(lmbContract, account)
    }
  }, [veryFastRefresh, provider, account, lmbContract])

  return lmbBalance
}

export default useLmbBalance