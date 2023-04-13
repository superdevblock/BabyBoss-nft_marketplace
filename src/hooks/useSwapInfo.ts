import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import { getRewardAddress, getWBNBAddress } from 'utils/addressHelpers'
import { getRouterContract } from 'utils/contractHelpers'

const useSwapInfo = (web3Context: any, isBuy: boolean, inputState: boolean, bnbAmount: number, setBNBAmount: any, lmbAmount: number, setLMBamount: any) => {
  const [success, setSuccess] = useState(false)
  const routerContract = getRouterContract(web3Context?.provider)

  useEffect( () => {
    const fetchEstimateOutAmount = async (routerContract: any, amount: number, setAmount: any, path: any) => {
        try {
            const _estimateOutAmount = await routerContract.methods.getAmountsOut(ethers.utils.parseEther(amount.toString()), path).call()
            setAmount(Number(ethers.utils.formatEther(_estimateOutAmount[_estimateOutAmount.length - 1])))
            setSuccess(true)
        } catch (error) {
            setAmount(0)
            setSuccess(false)
        }
    }
    const fetchEstimateInAmount = async (routerContract: any, amount: number, setAmount: any, path: any) => {
        try {
            const _estimateInAmount = await routerContract.methods.getAmountsIn(ethers.utils.parseEther(amount.toString()), path).call()
            setAmount(Number(ethers.utils.formatEther(_estimateInAmount[0])))
            setSuccess(true)
        } catch (error) {
            setAmount(0)
            setSuccess(false)
        }
    }

    if(web3Context && isBuy == true && inputState == true) {
        if(bnbAmount != 0)
            fetchEstimateOutAmount(routerContract, bnbAmount, setLMBamount, [getWBNBAddress(), getRewardAddress()])
        else 
            setLMBamount(0)
    }
    if(web3Context && isBuy == true && inputState == false) {
        if(lmbAmount != 0)
            fetchEstimateInAmount(routerContract, lmbAmount, setBNBAmount, [getWBNBAddress(), getRewardAddress()])
        else 
            setBNBAmount(0)
    }
    
    if(web3Context && isBuy == false && inputState == true) {
        if(lmbAmount != 0)
            fetchEstimateOutAmount(routerContract, lmbAmount, setBNBAmount, [getRewardAddress(), getWBNBAddress()])
        else 
            setBNBAmount(0)
    }
    if(web3Context && isBuy == false && inputState == false) {
        if(bnbAmount != 0)
            fetchEstimateInAmount(routerContract, bnbAmount, setLMBamount, [getRewardAddress(), getWBNBAddress()])
        else 
            setLMBamount(0)
    }
  }, [inputState, web3Context, bnbAmount, lmbAmount])

  return success
}

export default useSwapInfo