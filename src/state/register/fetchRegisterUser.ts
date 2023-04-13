import BigNumber from 'bignumber.js'
import RegisterAbi from 'config/abis/register.json'
import { getRegisterAddress } from 'utils/addressHelpers'
import {multicall2} from 'utils/multicall'

export const fetchIsRegistered = async (account: string) => {
  const registerAddress = getRegisterAddress()
  const calls = [
    {
      address: registerAddress,
      name: 'registerAdd',
      params: [account],
    },
  ]

  const rawRegisterInfo = await multicall2(RegisterAbi, calls)
  const isRegistered = rawRegisterInfo[0][0]
  return isRegistered
}

export const fetchSponsorAddress = async (account: string) => {
  const registerAddress = getRegisterAddress()
  const calls = [
    {
      address: registerAddress,
      name: 'sponsorAdd',
      params: [account],
    },
  ]

  const rawSponsor = await multicall2(RegisterAbi, calls)
  const sponsor = rawSponsor[0][0]
  return sponsor
}