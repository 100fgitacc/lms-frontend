import IconBtn from "./IconBtn"

export default function ConfirmationModal({ modalData }) {
    return (
        <div className="modal-wrapper">
            <div className="modal-box">
                <p className="modal-title">{modalData?.text1}</p>
                <p className="modal-subtitle">{modalData?.text2}</p>
                <div className="modal-actions">
                    <IconBtn
                        onclick={modalData?.btn1Handler}
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
