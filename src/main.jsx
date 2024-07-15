import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import '@rainbow-me/rainbowkit/styles.css';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { bscTestnet  } from 'wagmi/chains'
import { WalletProvider } from './WalletContext.jsx'

const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    bscTestnet
  ],
  ssr: true,
});

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <WalletProvider>
        <WagmiProvider config={config}>
          <QueryClientProvider client={client}>
            <RainbowKitProvider>
              <App />
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </WalletProvider>
    </React.StrictMode>
)
