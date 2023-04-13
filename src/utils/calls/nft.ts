import { getNFTContract, getRewardContract } from '../contractHelpers'
import { getRewardAddress, getStakingAddress } from '../addressHelpers'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'

export const callApproveForAll = async (provider: any, address: string, approveAddress:string, approved: boolean) => {
  const nftContract = getNFTContract(provider)
  // return new Promise(async(resolve, reject) => {
  //   await nftContract.methods
  //     .setApprovalForAll(approveAddress, approved)
  //     .send({ from: address }, (err: any, data: any) => {
  //       if (err) {
  //         reject(err)
  //       }
  //       resolve(data)
  //     })
  // })
    return await nftContract.methods
      .setApprovalForAll(approveAddress, approved)
      .send({ from: address })
}

export const callApproveForErc20 = async (provider: any, address: string, approveAddress:string) => {
  const rewardContract = getRewardContract(provider)
  // return new Promise(async(resolve, reject) => {
  //   await nftContract.methods
  //     .setApprovalForAll(approveAddress, approved)
  //     .send({ from: address }, (err: any, data: any) => {
  //       if (err) {
  //         reject(err)
  //       }
  //       resolve(data)
  //     })
  // })
    return await rewardContract.methods
      .approve(approveAddress, ethers.constants.MaxUint256)
      .send({ from: address })
}