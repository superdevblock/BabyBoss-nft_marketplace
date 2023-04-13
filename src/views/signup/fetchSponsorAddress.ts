import RegisterAbi from 'config/abis/register.json'
import { getRegisterAddress } from 'utils/addressHelpers'
import {multicall3} from 'utils/multicall'

export const fetchSponsorAddressFormAccount = async (account: string) => {
  const registerAddress = getRegisterAddress()
  const calls = [
    {
      address: registerAddress,
      name: 'sponsorAdd',
      params: [account],
    },
  ]

  const rawSponsor = await multicall3(RegisterAbi, calls)
  const sponsor = rawSponsor[0][0]
  return sponsor
}

export const fetchRegisterState = async (account: string) => {
    const registerAddress = getRegisterAddress()
    const calls = [
      {
        address: registerAddress,
        name: 'registerAdd',
        params: [account],
      },
    ]
  
    const rawRegisterInfo = await multicall3(RegisterAbi, calls)
    const isRegister = rawRegisterInfo[0][0]
    return isRegister
  }