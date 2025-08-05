import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducer/index'
import { Toaster } from 'react-hot-toast'

// Wagmi & Web3Modal imports
import { WagmiConfig } from 'wagmi'
import { Web3Modal } from '@web3modal/react'
import { wagmiConfig, ethereumClient } from './web3modalConfig'

// Создаем Redux store
const store = configureStore({
  reducer: rootReducer,
})

// Рендер приложения
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      {/* Прокидываем WagmiConfig */}
      <WagmiConfig config={wagmiConfig}>
        <App />
        <Toaster />
        {/* Web3Modal для подключения кошельков */}
        <Web3Modal projectId="513f3c82afd39ff840ce3f9fd24ab649" ethereumClient={ethereumClient} />
      </WagmiConfig>
    </Provider>
  </BrowserRouter>
)
