
import { configureChains, createConfig } from 'wagmi'
import { w3mProvider, w3mConnectors, EthereumClient } from '@web3modal/ethereum'
import { mainnet, polygon, goerli, polygonMumbai } from 'wagmi/chains'

const chains = [mainnet, polygon, goerli, polygonMumbai]
const projectId = '513f3c82afd39ff840ce3f9fd24ab649'

const { publicClient } = configureChains(chains, [
  w3mProvider({ projectId }),
])

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
})

export const ethereumClient = new EthereumClient(wagmiConfig, chains)
