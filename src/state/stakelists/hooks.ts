import { AUTHOR, MINT_TRANSACTION, REWARD_PER_DAY } from "config/nfts"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useAppDispatch } from "state/hooks"
import { getNFTAddress } from "utils/addressHelpers"
import getNFTNameFromId from "utils/getNFTNameFromId"
// import { fetchNFTStakeData } from "./fetchNFTStakeData"
import { fetchNFTStakeDataSync } from "."

// get nft list
export const useNFTStakeData = () => {   
    const dispatch = useAppDispatch()
    
    useEffect(() => {
        dispatch(fetchNFTStakeDataSync())
    }, [dispatch])
}

export const useNFTData = () => {
    const Stake = useSelector((state: any) => state.stakelists)
    console.log(Stake);
    return Stake
}

