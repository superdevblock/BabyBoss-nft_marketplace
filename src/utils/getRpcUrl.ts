import sample from 'lodash/sample'
import { RPC_URL } from 'config'

// Array of available nodes to connect to
export const nodes = [RPC_URL]

const getNodeUrl = () => {
  return sample(nodes)
}

export default getNodeUrl
