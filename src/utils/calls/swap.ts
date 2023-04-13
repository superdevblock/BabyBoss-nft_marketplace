import { ethers } from 'ethers'
import { getRouterContract } from '../contractHelpers'

export const callBuyIn = async (provider: any, address: string, bnbAmount: number, lmbAmountOut: number, path: string[], to: string, deadline: number) => {
    const routerContract = getRouterContract(provider)
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
     return await routerContract.methods
        .swapExactETHForTokens(ethers.utils.parseEther(lmbAmountOut.toString()), path, to, deadline)
        .send({ from: address, value: ethers.utils.parseEther(bnbAmount.toFixed(18)) })
  }

export const callBuyOut = async (provider: any, address: string, bnbAmount: number, lmbAmountOut: number, path: string[], to: string, deadline: number) => {
    const routerContract = getRouterContract(provider)
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
     return await routerContract.methods
        .swapETHForExactTokens(ethers.utils.parseEther(lmbAmountOut.toString()), path, to, deadline)
        .send({ from: address, value: ethers.utils.parseEther(bnbAmount.toFixed(18)) })
  }

export const callSellIn = async (provider: any, address: string, lmbAmount: number, bnbAmountOut: number, path: string[], to: string, deadline: number) => {
    const routerContract = getRouterContract(provider)
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
     return await routerContract.methods
        .swapExactTokensForETH(ethers.utils.parseEther(lmbAmount.toFixed(18)), ethers.utils.parseEther(bnbAmountOut.toFixed(18)), path, to, deadline)
        .send({ from: address })
  }

export const callSellOut = async (provider: any, address: string, bnbAmount: number, lmbAmountInMax: number, path: string[], to: string, deadline: number) => {
    const routerContract = getRouterContract(provider)
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
     return await routerContract.methods
        .swapTokensForExactETH(ethers.utils.parseEther(bnbAmount.toFixed(18)), ethers.utils.parseEther(lmbAmountInMax.toFixed(18)), path, to, deadline)
        .send({ from: address })
  }
