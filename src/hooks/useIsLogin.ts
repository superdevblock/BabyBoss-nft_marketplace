import { URI } from "api-control/api"
import axios from "axios"
import { useEffect, useState } from "react"
import encryptParams from "utils/encryption"

export const useIsLogin = (_account: string | undefined, token: any) => {
    const [isLogin, setIsLogin] = useState(false)

    useEffect(() => {
      const fetchLoginState = async (_account: string, token: any) => {
        const body = {
          public_key: _account,
          token: token
        }
        try {
          const res = await axios.post(`${URI}/auth/islogin`, {params: encryptParams(body)})

          setIsLogin(res.data.status)
          useIsLogin(token, _account)
          console.log("sniper: res.data.status: ", res.data)
        } catch (error) {
          console.log(error)          
        }
      }
      console.log("sniper: _account: ", _account)
      if (_account && token) {
        fetchLoginState(_account, token)
      }
    }, [_account, token])

    return isLogin
  }
  
  export default useIsLogin