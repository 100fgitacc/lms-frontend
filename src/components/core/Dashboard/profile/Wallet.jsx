import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchWallets,
  linkWallet,
  removeWallet,
  makePrimary,
} from "../../../../slices/walletSlice"
import ConfirmationModal from "../../../common/ConfirmationModal"
import { MdOutlineAddBox, MdDelete, MdStar, MdContentCopy } from "react-icons/md"
import styles from "./wallet.module.css"
import toast from "react-hot-toast"

import { useAccount, useConnect, useSignMessage, useNetwork } from 'wagmi'
import { mainnet, polygon, goerli, polygonMumbai } from 'wagmi/chains'
import { disconnect } from 'wagmi/actions'
const supportedChains = [mainnet, polygon, goerli, polygonMumbai]
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

  const injectedConnector = new InjectedConnector({ chains: supportedChains })
  const walletConnectConnector = new WalletConnectConnector({
    options: {
      projectId: '513f3c82afd39ff840ce3f9fd24ab649',
      showQrModal: true,
      chains: supportedChains,
    },
  })

  const networkMap = {
    1: "Ethereum",
    137: "Polygon",
    5: "Goerli",
    80001: "Mumbai",
  }

export default function Wallet() {
  const dispatch = useDispatch()
  const { wallets, primaryWallet, loading } = useSelector(state => state.wallet)
  const token = useSelector(state => state.auth.token)

  const [confirmationModal, setConfirmationModal] = useState(null)
  const [modalKey, setModalKey] = useState(0)

  const { address, isConnected } = useAccount()
  const { connectAsync } = useConnect()
  const { signMessageAsync } = useSignMessage()
  const { chain } = useNetwork()

  useEffect(() => {
    if (token) {
      dispatch(fetchWallets(token))
    }
  }, [dispatch, token])

  function shorten(addr) {
    return addr?.slice(0, 6) + "..." + addr?.slice(-4)
  }

  const handleConnect = async () => {
  try {
    await disconnect()
    const connector = window.ethereum ? injectedConnector : walletConnectConnector

    const { account } = await connectAsync({ connector })

    const message = `Linking wallet to profile (${account})`
    const signature = await signMessageAsync({ message })

    const networkName = networkMap[chain?.id] || `Unknown (${chain?.id})`

    setConfirmationModal({
      text2: "Enter a name for your wallet",
      showInput: true,
      btn1Text: "Confirm",
      btn2Text: "Cancel",
      inputPlaceholder: "e.g. Main, Test, Trading",
      btn1Handler: async name => {
        if (!name?.trim()) {
          toast.error("Wallet name is required.")
          return
        }
        setConfirmationModal(null)
        try {
          await dispatch(
            linkWallet({
              walletData: { address: account, signature, message, network: networkName, name },
              token,
            })
          ).unwrap()
          toast.success("Wallet successfully linked!")
        } catch (err) {
          toast.error(err?.message || "Failed to link wallet.")
        }
      },
      btn2Handler: () => setConfirmationModal(null),
    })
  } catch (err) {
    console.error("handleConnect error:", err)
    toast.error("Wallet connection failed. Please try again.")
  }
}

  const handleSetPrimary = address => {
    setConfirmationModal({
      text2: "Make this wallet your primary?",
      btn1Text: "Yes",
      btn2Text: "Cancel",
      btn1Handler: async () => {
        try {
          await dispatch(makePrimary({ address, token })).unwrap()
          toast.success("Primary wallet updated.")
        } catch {
          toast.error("Failed to set primary wallet.")
        } finally {
          setConfirmationModal(null)
        }
      },
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  const handleDelete = address => {
    setConfirmationModal({
      text2: "Are you sure you want to remove this wallet?",
      btn1Text: "Delete",
      btn2Text: "Cancel",
      btn1Handler: async () => {
        try {
          await dispatch(removeWallet({ address, token })).unwrap()
          toast.success("Wallet deleted successfully.")
        } catch {
          toast.error("Failed to delete wallet.")
        } finally {
          setConfirmationModal(null)
        }
      },
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  const handleCopy = address => {
    navigator.clipboard.writeText(address)
      .then(() => toast.success("Address copied to clipboard!"))
      .catch(() => toast.error("Failed to copy!"))
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.heading}>
        <h2 className={`${styles.title} secondary-title`}>Your wallets</h2>
        <button onClick={handleConnect} disabled={loading} className={styles["edit-btn"]}>
          {loading ? "Connecting..." : "Connect Wallet"} <MdOutlineAddBox className="btn-icon" />
        </button>
      </div>

      {loading ? (
        <p>Loading wallets... Please complete connection.</p>
      ) : wallets.length === 0 ? (
        <p>No wallets linked yet.</p>
      ) : (
        <>
          <h4>Connected Wallets:</h4>
          <div className="table-wrapper">
            <table className={styles["wallet-table"]}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Network</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {primaryWallet && (
                  <tr className={styles.primaryRow}>
                    <td>{primaryWallet.name}</td>
                    <td>
                      {shorten(primaryWallet.address)}
                      <button onClick={() => handleCopy(primaryWallet.address)} className={styles['copy-address']}>
                        <MdContentCopy size={12} />
                      </button>
                    </td>
                    <td>{primaryWallet.network}</td>
                    <td className={styles.statusPrimary}>Primary</td>
                    <td>
                      <button className={`${styles.actionBtn} ${styles.deleteButton}`} onClick={() => handleDelete(primaryWallet.address)}>
                        <MdDelete size={16} /> Delete
                      </button>
                    </td>
                  </tr>
                )}
                {wallets.filter(w => w.address.toLowerCase() !== primaryWallet?.address?.toLowerCase()).map(wallet => (
                  <tr key={wallet.address}>
                    <td>{wallet.name}</td>
                    <td>
                      {shorten(wallet.address)}
                      <button onClick={() => handleCopy(wallet.address)} className={styles['copy-address']}>
                        <MdContentCopy size={12} />
                      </button>
                    </td>
                    <td>{wallet.network}</td>
                    <td className={styles.statusSecondary}>Additional</td>
                    <td>
                      <button className={`${styles.actionBtn} ${styles.deleteButton}`} onClick={() => handleDelete(wallet.address)}>
                        <MdDelete size={13} /> Delete
                      </button>
                      <button className={styles.actionBtn} onClick={() => handleSetPrimary(wallet.address)}>
                        <MdStar size={13} /> Set as Primary
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {confirmationModal && <ConfirmationModal key={modalKey} modalData={confirmationModal} />}
    </div>
  )
}