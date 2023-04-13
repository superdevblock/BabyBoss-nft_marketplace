import { AUTHOR, MINT_TRANSACTION, REWARD_PER_DAY } from "config/nfts"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useAppDispatch } from "state/hooks"
import { getNFTAddress } from "utils/addressHelpers"
import getNFTNameFromId from "utils/getNFTNameFromId"
import { fetchNFTDetailDataSync } from "."

export const useNFTDetailData = (id: number) => {
    const dispatch = useAppDispatch()
    
    useEffect(() => {
        dispatch(fetchNFTDetailDataSync({id}))
    }, [dispatch])
}


export const useDetailData = () => {
    const detail = useSelector((state: any) => state.detail)
    return detail
}


export const useDetailDataById = (id: number) => {
    const stakingData = useSelector((state: any) => state.staking.stakingNFTs[id])
    const priceData = useSelector((state: any) => state.marketplace.nfts[id])
    const [detailData, setDetailData] = useState({})
    useEffect(() => {
        const fetchDetailData = async (id : number) => {
            const _startTime = stakingData.startTime
            const _stakedDays = stakingData.stakedDays
            console.log("sniper a: ", id, " :", stakingData)
            const stakingDays = _stakedDays
            let _stakingTime = 0
            if(_startTime !== 0) {
            const currentTime = Math.floor(Date.now() / 1000)
            const duration = currentTime - _startTime + 120
            if(duration > 0)
                _stakingTime = duration
            }
            const _detailData = {
                id: id,
                name: getNFTNameFromId(id),
                price: priceData.price,
                minter: AUTHOR,
                collection: "#" + Math.floor(id/100+1) + " Lambo Collection",
                totalToken: 365 * REWARD_PER_DAY,
                stakingDays: stakingDays,
                mintedTokens: _stakedDays * 5,
                claimableTokens: (365 - _stakedDays) * REWARD_PER_DAY,
                mintTransaction: MINT_TRANSACTION,
                contractAddress: getNFTAddress(),
                isStake: _startTime === 0 ? false : true,
                stakingTime: _stakingTime
            }
            setDetailData(_detailData)
        }
        if(id != undefined) {
            fetchDetailData(id)
        }
    }, [id, stakingData, priceData])
    return detailData
}