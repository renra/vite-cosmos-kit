import './App.css'
import { wallets as keplrWallets } from '@cosmos-kit/keplr-extension';
import { wallets as leapWallets } from '@cosmos-kit/leap-extension';
import { chains, assets } from 'chain-registry';
import type { AssetList } from '@chain-registry/types';
import { ChainProvider, useChain } from '@cosmos-kit/react';
import * as SG from '@cosmjs/stargate'
import * as CWSG from '@cosmjs/cosmwasm-stargate'

function ConnectWallet () {
  const { disconnect, address, connect } =
    useChain('osmosis')

  if(address) {
    return <div onClick={() => disconnect()}>Your address is {address}. Click to disconnect</div>
  } else {
    return (
      <div 
        onClick={async () => {
          console.log('Connecting')
          const res = await connect()
          console.log(res)
        }}
      >
        Click to connect
      </div>
    )
  }  
}

function ClientCreators () {
  const { address, getSigningCosmWasmClient, getSigningStargateClient } = useChain('osmosis')

  if(!address) {
    return <></>
  }

  return (
    <>
      <button
        onClick={async () => { console.log(await getSigningStargateClient()) }}
      >
        Click to get stargate client
      </button>

      <button
        onClick={async () => { console.log(await getSigningCosmWasmClient()) }}
      >
        Click to get cosmwasm client
      </button>
    </>
  )
}

function App() {
  const relevant_chains = chains.filter((chain) => chain.chain_id == 'osmosis-1')
  const relevant_assets : AssetList[] = []

  relevant_chains.forEach((relevant_chain) => {
    const asset = assets.find(({ chain_name }) => relevant_chain.chain_name === chain_name)
    if (asset !== undefined) {
      relevant_assets.push(asset)
    }
  })

  const wallets = [...keplrWallets, ...leapWallets]

  return (
    <>
      <h1>Connect Wallet Test</h1>

      <ChainProvider
        chains={relevant_chains}
        assetLists={relevant_assets}
        wallets={wallets}
      >
        <ConnectWallet />
        <ClientCreators />
      </ChainProvider>
    </>
  )
}

export default App
