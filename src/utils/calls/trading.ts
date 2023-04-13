import { ethers } from 'ethers'
import { getRegisterContract } from '../contractHelpers'

export const callSell = async (provider: any, address: string, id: number, price: number) => {
    const registerContract = getRegisterContract(provider)
    // return new Promise(async(resolve, reject) => {
    //   await registerContract.methods
    //     .sell(id, ethers.utils.parseEther(price.toString()))
    //     .send({ from: address }, (err: any, data: any) => {
    //       if (err) {
    //         reject(err)
    //       }
    //       resolve(data)
    //     })
    // })    
    // return new Promise(async(resolve, reject) => {
     return await registerContract.methods
        .sell(id, ethers.utils.parseEther(price.toString()))
        .send({ from: address })
  }

  export const callBuy = async (provider: any, address: string, id: number, price: number) => {
    const registerContract = getRegisterContract(provider)
    // return new Promise(async(resolve, reject) => {
    //   await registerContract.methods
    //     .buy(id)
    //     .send({ from: address, value: ethers.utils.parseEther(price.toString()) }, (err: any, data: any) => {
    //       if (err) {
    //         reject(err)
    //       }
    //       resolve(data)
    //     })
    // })
    return await registerContract.methods
        .buy(id)
        .send({ from: address, value: ethers.utils.parseEther(price.toString()) })
  }

  export const callEdit = async (provider: any, address: string, id: number, price: number) => {
    const registerContract = getRegisterContract(provider)
    return await registerContract.methods
        .edit(id, ethers.utils.parseEther(price.toString()))
        .send({ from: address })
  }
    
  export const callCancelSell = async (provider: any, address: string, id: number) => {
    const registerContract = getRegisterContract(provider)
    // return new Promise(async(resolve, reject) => {
    //   await registerContract.methods
    //     .cancelSell(id)
    //     .send({ from: address }, (err: any, data: any) => {
    //       if (err) {
    //         reject(err)
    //       }
    //       resolve(data)
    //     })
    // })    
    return await registerContract.methods
        .cancelSell(id)
        .send({ from: address })
  }
    