import { apiConnector } from "../apiConnector"
import { walletEndpoints } from "../apis"

const {
  ADD_WALLET_API,
  GET_USER_WALLETS_API,
  SET_PRIMARY_WALLET,
  DELETE_WALLET_API,
} = walletEndpoints

export async function addWallet({ address, signature, message, network, name, token }) {
  try {
    const response = await apiConnector("POST", ADD_WALLET_API, {
      address,
      signature,
      message,
      network,
      name
    }, {
      Authorization: `Bearer ${token}`,
    })

    return response?.data
  } catch (error) {
    console.error("ADD_WALLET_API ERROR >>>", error)
    throw error 
  }
}

export async function getUserWallets(token) {
  try {
    const response = await apiConnector("GET", GET_USER_WALLETS_API, null, {
      Authorization: `Bearer ${token}`,
    })
    
    return response?.data
  } catch (error) {
    console.error("GET_USER_WALLETS_API ERROR >>>", error)
    throw error
  }
}

export async function setPrimaryWallet(address, token) {
  try {
    const response = await apiConnector("POST", SET_PRIMARY_WALLET, {
      address,
    }, {
      Authorization: `Bearer ${token}`,
    })

    return response?.data
  } catch (error) {
    console.error("SET_PRIMARY_WALLET ERROR >>>", error)
    throw error
  }
}

export async function deleteWallet(address, token) {
  try {
    const response = await apiConnector("DELETE", DELETE_WALLET_API, {
      address,
    }, {
      Authorization: `Bearer ${token}`,
    })

    return response?.data
  } catch (error) {
    console.error("DELETE_WALLET_API ERROR >>>", error)
    throw error
  }
}
