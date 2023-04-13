import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state/hooks'
import register, { fetchIsRegisteredAsync, updateRegister, updateSponsor } from '.'
import { fetchIsRegistered, fetchSponsorAddress } from './fetchRegisterUser'
import { stat } from 'fs'

export const useRegisterState = () => {
  const registerState = useSelector((state: any) => state.register.isRegister)
  return registerState
}

export const useSponsorState = () => {
  const sponsor = useSelector((state: any) => state.register.sponsor)
  return sponsor
}

export const useIsRegistered = (_account: string | undefined) => {
  const dispatch = useAppDispatch()
  
  useEffect(() => {
    const fetchRegistered = async (_account: string) => {
      dispatch(fetchIsRegisteredAsync({account: _account}))
    }
    if (_account) {
      fetchRegistered(_account)
    }
  }, [_account, dispatch])
}

export const useSponsorAddress = (_account: string | undefined) => {
  const dispatch = useAppDispatch()
  
  useEffect(() => {
    const fetchSponsor = async (_account: string) => {
      const status = await fetchSponsorAddress(_account)
      dispatch(updateSponsor({sponsor: status}))
    }
    if (_account) {
      fetchSponsor(_account)
    }
  }, [_account, dispatch])
}
