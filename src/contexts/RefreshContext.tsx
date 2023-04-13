import useInterval from 'hooks/useInterval'
import React, { useState, ReactNode } from 'react'

export const VERY_FAST_INTERVAL = 4000
export const FAST_INTERVAL = 10000
export const SLOW_INTERVAL = 60000

const createRefreshContext = (interval: number) => {
  const RefreshContext = React.createContext(0)

  return {
    Context: RefreshContext,
    // @ts-ignore
    Provider: ({ children }) => {
      const [count, setCount] = useState(0)

      useInterval(
        () => {
          setCount((c) => c + 1)
        },
        interval,
        false,
      )

      return <RefreshContext.Provider value={count}>{children}</RefreshContext.Provider>
    },
  }
}

export const SlowRefresh = createRefreshContext(SLOW_INTERVAL)
export const FastRefresh = createRefreshContext(FAST_INTERVAL)
export const VeryFastRefresh = createRefreshContext(VERY_FAST_INTERVAL)

interface Props {
    children?: ReactNode
    // any props that come into the component
}

const RefreshContextProvider: React.FC<Props> = ({ children }) => {
  return (
    <SlowRefresh.Provider >
      <FastRefresh.Provider><VeryFastRefresh.Provider>{children}</VeryFastRefresh.Provider></FastRefresh.Provider>
    </SlowRefresh.Provider>
  )
}

export { RefreshContextProvider }
