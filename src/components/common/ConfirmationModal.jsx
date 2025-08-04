import { useState, useEffect } from "react"
import IconBtn from "./IconBtn"

import styles from './index.module.css'

export default function ConfirmationModal({ modalData }) {
    const [inputValue, setInputValue] = useState("")
    
    useEffect(() => {
        setInputValue("")
    }, [modalData])

    return (
        <div className="modal-wrapper">
            <div className="modal-box">
                <p className="modal-title">{modalData?.text1}</p>
                {modalData.text2 && <p className="modal-subtitle">{modalData?.text2}</p>}
                <p className="modal-text">{modalData?.text3}</p>
                {modalData?.showInput && (
                    <input
                        type="text"
                        className={styles.input}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={modalData?.inputPlaceholder || "Enter value"}
                    />
                )}

                <div className="modal-actions">
                    <IconBtn
                        onclick={() => modalData?.btn1Handler?.(inputValue)}
                        text={modalData?.btn1Text}
                    />

                    <button
                        className="cancel-btn"
                        onClick={modalData?.btn2Handler}
                    >
                        {modalData?.btn2Text}
                    </button>
                </div>
            </div>
        </div>
    )
}
