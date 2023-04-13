import { useEffectOnce } from "hooks/useEffectOnce"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useAppDispatch } from "state/hooks"
import { fetchStakingDataSync, StakingItemData } from "."


export const useStakingData = () => {
    const dispatch = useAppDispatch()
    
    useEffectOnce(() => {
        dispatch(fetchStakingDataSync())
    })
    // useEffect(() => {
    //     dispatch(fetchStakingDataSync())
    // }, [dispatch])
}

export const useStakingDataFromStore = (account: string | undefined) => {
    const allNftsOnStaking = useSelector((state: any) => state.staking.stakingNFTs)
    return allNftsOnStaking.filter((item: StakingItemData, ind: any) => {
        return item.owner.toLowerCase() == account?.toLowerCase()
    })
}
