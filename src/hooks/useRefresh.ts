import { useContext } from 'react'
import { FastRefresh, SlowRefresh, VeryFastRefresh } from 'contexts/RefreshContext'

export const useFastFresh = () => {
  return useContext(FastRefresh.Context)
}
export const useVeryFastFresh = () => {
  return useContext(VeryFastRefresh.Context)
}
export const useSlowFresh = () => {
  return useContext(SlowRefresh.Context)
}
