import { createWeb3Modal } from '@web3modal/wagmi/react'
import { mainnet, polygon, goerli, polygonMumbai } from 'wagmi/chains'
import { configureChains, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { walletConnectProvider } from '@web3modal/wagmi'

const projectId = 'твой_projectId_из_web3modal'

const chains = [mainnet, polygon, goerli, polygonMumbai]

const { publicClient } = configureChains(chains, [
  walletConnectProvider({ projectId }),
  publicProvider(),
])

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [],
  publicClient,
})

createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeMode: 'light',
})
