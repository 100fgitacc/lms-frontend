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
import Web3Modal from "web3modal";
import { ethers } from "ethers";

export default function Wallet() {
  const dispatch = useDispatch()
  const { wallets, primaryWallet, loading } = useSelector((state) => state.wallet)
  const token = useSelector((state) => state.auth.token)

  const [confirmationModal, setConfirmationModal] = useState(null)
  const [modalKey, setModalKey] = useState(0)

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
    console.log("Starting wallet connection...");

    const web3Modal = new Web3Modal({
      cacheProvider: true,
    });

    console.log("Opening web3 modal...");
    const connection = await web3Modal.connect();
    console.log("Wallet connected", connection);

    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const address = await signer.getAddress();
    console.log("Wallet address:", address);

    const message = `Linking wallet to profile (${address})`;
    console.log("Signing message:", message);

    const signature = await signer.signMessage(message);
    console.log("Signature:", signature);

    const network = await provider.getNetwork();
    console.log("Network info:", network);

    const networkMap = {
      1: "Ethereum",
      137: "Polygon",
      5: "Goerli",
      80001: "Mumbai",
    };
    const networkName = networkMap[network.chainId] || `Unknown (${network.chainId})`;
    console.log("Network name:", networkName);

    setConfirmationModal({
      text2: "Enter a name for your wallet",
      showInput: true,
      btn1Text: "Confirm",
      btn2Text: "Cancel",
      inputPlaceholder: "e.g. Main, Test, Trading",
      btn1Handler: async (name) => {
        if (!name || name.trim() === "") {
          toast.error("Wallet name is required.");
          return;
        }
        setConfirmationModal(null);
        try {
          console.log("Dispatching linkWallet with:", {
            address,
            signature,
            message,
            network: networkName,
            name,
          });
          await dispatch(
            linkWallet({
              walletData: {
                address,
                signature,
                message,
                network: networkName,
                name,
              },
              token,
            })
          ).unwrap();
          toast.success("Wallet successfully linked!");
        } catch (err) {
          console.error("Error linking wallet:", err);
          toast.error(err?.message || "Failed to link wallet.");
        }
      },
      btn2Handler: () => setConfirmationModal(null),
    });
  } catch (err) {
    console.error("Wallet connection failed:", err);
    toast.error("Wallet connection failed. Please try again.");
  }
};



  const handleSetPrimary = (address) => {
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

  const handleDelete = (address) => {
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
  const handleCopy = (address) => {
      if (!address) return;
      navigator.clipboard.writeText(address).then(() => {
        toast.success("Address copied to clipboard!");
      }).catch(() => {
        toast.error("Failed to copy!");
      });
    };
  return (
    <div className={styles.wrapper}>
      <div className={styles.heading}>
        <h2 className={`${styles.title} secondary-title`}>Your wallets</h2>
        <button
          onClick={handleConnect}
          disabled={loading}
          className={styles["edit-btn"]}
        >
          {loading ? "Connecting..." : "Connect Wallet"}{" "}
          <MdOutlineAddBox className="btn-icon" />
        </button>
      </div>

      {loading ? (
        <p>Loading wallets... Open your MetaMask</p>
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
                      <button 
                        onClick={()=>handleCopy(primaryWallet.address)} 
                        aria-label="Copy address"
                        className={styles['copy-address']}
                      >
                        <MdContentCopy size={12} />
                      </button>
                    </td>
                    <td>{primaryWallet.network}</td>
                    <td className={styles.statusPrimary}>Primary</td>
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
                  .filter(
                    (w) =>
                      w.address.toLowerCase() !==
                      primaryWallet?.address?.toLowerCase()
                  )
                  .map((wallet) => (
                    <tr key={wallet.address}>
                      <td>{wallet.name}</td>
                      <td>
                        {shorten(wallet.address)}
                        <button 
                        onClick={()=>handleCopy(wallet.address)} 
                        aria-label="Copy address"
                        className={styles['copy-address']}
                      >
                        <MdContentCopy size={12} />
                      </button>
                      </td>
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

      {confirmationModal && (
        <ConfirmationModal key={modalKey} modalData={confirmationModal} />
      )}
    </div>
  )
}
