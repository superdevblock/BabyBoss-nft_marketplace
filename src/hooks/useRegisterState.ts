import { useState, useEffect } from 'react'
import { fetchIsRegistered } from 'state/register/fetchRegisterUser'

const useRegisterState = (account: any) => {
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect( () => {

    const fetchRegisterState = async (account: string) => {
        const _isRegistered = await fetchIsRegistered(account)
        setIsRegistered(_isRegistered)
    }

    if(account) {
        fetchRegisterState(account)
    }
  }, [account])

  return isRegistered
}

export default useRegisterState