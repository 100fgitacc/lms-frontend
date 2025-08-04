import { useState, useEffect } from "react"
import {
  addWallet,
  getUserWallets,
  setPrimaryWallet,
  deleteWallet,
} from "../../../../services/operations/walletApi"
import { useSelector } from "react-redux"
import toast from "react-hot-toast"
import styles from './wallet.module.css'
import {
  MdOutlineAddBox,
  MdDelete,
  MdStar,
  MdStarRate
} from "react-icons/md"
import ConfirmationModal from "../../../common/ConfirmationModal"





export default function Wallet() {
  const [loading, setLoading] = useState(false)
  const token = useSelector((state) => state.auth.token)
  const [primaryWallet, setPrimary] = useState(null)
  const [wallets, setWallets] = useState([])
  const [confirmationModal, setConfirmationModal] = useState(null)
  const [modalKey, setModalKey] = useState(0)
  const handleConnect = async () => {
  if (!window.ethereum || !window.ethereum.isMetaMask) {
    setConfirmationModal({
      text1: "MetaMask is not installed",
      text2: "Would you like to install it?",
      btn1Text: "Install",
      btn2Text: "Cancel",
      btn1Handler: () => window.open("https://metamask.io/download", "_blank"),
      btn2Handler: () => setConfirmationModal(null),
    })
    return
  }

  setLoading(true)

  try {
    const [address] = await window.ethereum.request({ method: "eth_requestAccounts" })

    const message = `Linking wallet to profile (${address})`
    const signature = await window.ethereum.request({
      method: "personal_sign",
      params: [message, address],
    })

    const chainId = await window.ethereum.request({ method: "eth_chainId" })
    const networkMap = {
      "0x1": "Ethereum",
      "0x89": "Polygon",
      "0x5": "Goerli",
      "0x13881": "Mumbai",
    }
    const network = networkMap[chainId] || `Unknown (${chainId})`

    return new Promise((resolve) => {
      setModalKey(prev => prev + 1)
      setConfirmationModal({
        // text1: "Enter a name for this wallet",
        text2: "Enter a name for your wallet",
        showInput: true,
        btn1Text: "Confirm",
        btn2Text: "Cancel",
        inputPlaceholder: "e.g. Main, Test, Trading",
        btn1Handler: async (name) => {
          setConfirmationModal(null)
          if (!name) {
            toast.error("Wallet name is required.")
            setLoading(false)
            return
          }
          try {
            const result = await addWallet({
              address,
              signature,
              message,
              network,
              token,
              name,
            })

            toast.success("Wallet successfully linked!")
            await fetchWallets()
          } catch (err) {
            console.error("Wallet connection error:", err)
            toast.error(err.response?.data?.message || "Failed to link wallet.")
          } finally {
            setLoading(false)
          }
        },
        btn2Handler: () => {
          setConfirmationModal(null)
          setLoading(false)
        },
      })
    })

  } catch (err) {
    console.error("Wallet connection error:", err)
    toast.error("Failed to link wallet. Please try again.")
    setLoading(false)
  }
}


  const fetchWallets = async () => {
    setLoading(true)
    try {
      const res = await getUserWallets(token)
      setPrimary(res.primaryWallet || null)
      setWallets(res.wallets || [])
    } catch (err) {
      console.error("Failed to fetch wallets:", err)
      toast.error("Failed to fetch wallets.")
    } finally {
      setLoading(false)
    }
  }

  const handleSetPrimary = (address) => {
    setConfirmationModal({
      text1: "",
      text2: "Make this wallet your primary?",
      btn1Text: "Yes",
      btn2Text: "Cancel",
      btn1Handler: async () => {
        try {
          const res = await setPrimaryWallet(address, token)
          setPrimary(res.primaryWallet)
          setWallets(res.wallets || [])
          toast.success("Primary wallet updated.")
        } catch (err) {
          console.error("Failed to set primary wallet:", err)
          toast.error("Failed to set primary wallet.")
        } finally {
          setConfirmationModal(null)
        }
      },
      btn2Handler: () => setConfirmationModal(null),
    })
  }


  const handleDelete = (address) => {
    setConfirmationModal({
      text1: "",
      text2: "Are you sure you want to remove this wallet?",
      btn1Text: "Delete",
      btn2Text: "Cancel",
      btn1Handler: async () => {
        try {
          const res = await deleteWallet(address, token)
          setPrimary(res.primaryWallet)
          setWallets(res.wallets || [])
          toast.success("Wallet deleted successfully.")
        } catch (err) {
          console.error("Failed to delete wallet:", err)
          toast.error("Failed to delete wallet.")
        } finally {
          setConfirmationModal(null)
        }
      },
      btn2Handler: () => setConfirmationModal(null),
    })
  }


  useEffect(() => {
    fetchWallets()
  }, [])

  function shorten(addr) {
    return addr?.slice(0, 6) + "..." + addr?.slice(-4)
  }

   
  return (
    <div className={styles.wrapper}>
        
      <div className={styles.heading}>
        <h2 className={`${styles.title} secondary-title`}>Your wallets</h2>
          <button onClick={handleConnect} disabled={loading} className={`${styles['edit-btn']}`}>
            {loading ? "Connecting..." : "Connect Wallet"} <MdOutlineAddBox  className='btn-icon'/>
          </button>
        </div>
      {loading ? (
        <p>Loading wallets... Open your metamask browser extension</p>
      ) : wallets.length === 0 ? (
        <p>No wallets linked yet.</p>
      ) : (
        <>
          <h4>Connected Wallets:</h4>
      <div className="table-wrapper">
        <table
          className={styles['wallet-table']}
        >
          <thead>
            <tr>
              <th className={styles.walletTableColName}>Name</th>
              <th className={styles.walletTableColAddress}>Address</th>
              <th className={styles.walletTableColNetwork}>Network</th>
              <th className={styles.walletTableColStatus}>Status</th>
              <th className={styles.walletTableColActions}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {primaryWallet && (
              <tr className={styles.primaryRow}>
                <td>{primaryWallet.name}</td>
                <td>{shorten(primaryWallet.address)}</td>
                <td>{primaryWallet.network}</td>
                <td className={styles.statusPrimary}>Primary
                </td>
                <td>
                  <button
                    className={`${styles.actionBtn} ${styles.deleteButton}`}
                    onClick={() => handleDelete(primaryWallet.address)}
                  >
                    <MdDelete size={16} /> Delete
                  </button>
                </td>
              </tr>
            )}

            {wallets
              .filter(wallet => wallet.address.toLowerCase() !== primaryWallet?.address?.toLowerCase())
              .map((wallet) => (
                <tr key={wallet.address}>
                  <td>{wallet.name}</td>
                  <td>{shorten(wallet.address)}</td>
                  <td>{wallet.network}</td>
                  <td className={styles.statusSecondary}>Additional</td>
                  <td>
                    <button
                      className={`${styles.actionBtn} ${styles.deleteButton}`}
                      onClick={() => handleDelete(wallet.address)}
                    >
                      <MdDelete size={13} /> Delete
                    </button>
                    <button
                      className={styles.actionBtn}
                      onClick={() => handleSetPrimary(wallet.address)}
                    >
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
