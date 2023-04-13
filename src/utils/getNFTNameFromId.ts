const getNFTNameFromId = (id: number) => {
    return `#${Math.floor(id/100+1)} NFT ${id%100+1} of 100`
}

export default getNFTNameFromId