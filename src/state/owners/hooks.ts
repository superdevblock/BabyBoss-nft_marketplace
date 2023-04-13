import { useEffectOnce } from "hooks/useEffectOnce"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useAppDispatch } from "state/hooks"
import { fetchOwnersAsync } from "."

export const useOwnerData = () => {
  const dispatch = useAppDispatch()
  
  useEffectOnce(() => {
    dispatch(fetchOwnersAsync())
  })

  // useEffect(() => {
  //   dispatch(fetchOwnersAsync())
  // }, [dispatch])
}


export function useOwnerDataByAccount(account: string | undefined) {
  const ownerData = useSelector((state: any) => state.owner.owners)
  return ownerData.filter((item: any) => item.owner == account)
}

export function useOwnerDataById(id: number | undefined) {
  const ownerData = useSelector((state: any) => state.owner.owners)
  return ownerData.filter((item: any) => item.id == id)
}
