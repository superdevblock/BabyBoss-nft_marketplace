import { NFT_IPFS } from 'config'

const getMetadatas = async (ids: number[]) => {
  const ipfsUrl = NFT_IPFS
  let results: any[] = [];
  for (let i = 0; i < ids.length; i ++) {
    await fetch(`${ipfsUrl}${ids[i]}.json`)
    .then((res) => res.json())
    .then((json) => {
      results.push(json)
    })
  }  
  
  return results
}

export const getImageUrl = (metadataImageUri: string) => {
  const image = `https://ipfs.io/ipfs/${metadataImageUri.substring(7)}`
  return image
}

export default getMetadatas