import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state/hooks'
import { useFastFresh } from 'hooks/useRefresh'
import { updateNFTPurchased, updateNetworkDownline, updateGenealogicalTree, updateBNBEarned } from '.'
import { fetchNetworkDownlineState, fetchNFTPurchasedData, fetchBNBEarnedData, fetchGenealogicalTree } from './fetchReferralState'

export const useReferralNetworkDownline = () => {
  const networkdownline = useSelector((state: any) => state.referral.networkDownline)
  return networkdownline
}

export const useReferralNFTPurchased = () => {
  const nftPurchased = useSelector((state: any) => state.referral.nftPurchased)
  return nftPurchased
}

export const useReferralBNBEarned = () => {
  const nftPurchased = useSelector((state: any) => state.referral.bnbEarned)
  return nftPurchased
}

export const useReferralGenealogicalTree = () => {
  const genealogicalTree = useSelector((state: any) => state.referral.genealogicalTree)
  return genealogicalTree
}

export const useNetworkDownline = (_account: string | undefined) => {
  const dispatch = useAppDispatch()
  const fastRefresh = useFastFresh()
  
  useEffect(() => {
    const fetchNetworkDownline = async (_account: string) => {
      const status = await fetchNetworkDownlineState(_account)
      dispatch(updateNetworkDownline({networkDownline: status}))
    }
    if (_account) {
      fetchNetworkDownline(_account)
    }
  }, [_account, fastRefresh, dispatch])
}

export const useNFTPurchased = (_account: string | undefined) => {
  const dispatch = useAppDispatch()
  const fastRefresh = useFastFresh()
  
  useEffect(() => {
    const fetchNFTPurchased = async (_account: string) => {
      const ret = await fetchNFTPurchasedData(_account)
      dispatch(updateNFTPurchased(ret))
    }
    if (_account) {
      fetchNFTPurchased(_account)
    }
  }, [_account, fastRefresh, dispatch])
}

export const useBNBEarned = (_account: string | undefined) => {
  const dispatch = useAppDispatch()
  const fastRefresh = useFastFresh()
  
  useEffect(() => {
    const fetchBNBEarned = async (_account: string) => {
      const ret = await fetchBNBEarnedData(_account)
      dispatch(updateBNBEarned(ret))
    }
    if (_account) {
      fetchBNBEarned(_account)
    }
  }, [_account, fastRefresh, dispatch])
}

export const useGenealogicalTree = (_account: string | undefined) => {
  const dispatch = useAppDispatch()
  const fastRefresh = useFastFresh()
  
  useEffect(() => {
    const fetchGenealogic = async (_account: string) => {
      const tree = await fetchGenealogicalTree(_account)
      dispatch(updateGenealogicalTree({genealogicalTree: tree}))
    }
    if (_account) {
      fetchGenealogic(_account)
    }
  }, [_account, fastRefresh, dispatch])
}
