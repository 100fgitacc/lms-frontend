import { useState } from "react";
import { FiTrash2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import ConfirmationModal from './../../../common/ConfirmationModal';
import { deleteProfile } from "../../../../services/operations/SettingsAPI"


import styles from '../profile.module.css'

export default function DeleteAccount() {

  const [confirmationModal, setConfirmationModal] = useState(null);
  const [check, setCheck] = useState(false);

  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()



  return (
    <div className={styles['delete-account']}>
      <div className={styles.wrapper}>
          <div className={styles['settings-heading']}>
            <h3>
              Delete Account
            </h3>
          </div>
          <div className="">
            <p>Would you like to delete account ?</p>
            <p className="">
              This account may contain Paid Courses. Deleting your account is
              permanent and will remove all the contain associated with it.
            </p>
          </div>
          <div className={styles['delete-confirmation']}>
            <div className="checkbox-container">
              <input 
              type="checkbox" 
              id="customCheckbox" 
              className={styles['custom-checkbox']} 
              checked={check}
              onChange={() => setCheck(prev => !prev)}/>
             <label for="customCheckbox"></label>
            </div>
            <button
              type="button"
              className={`${styles['delete-acc-btn']}`}
              onClick={() => check &&
                setConfirmationModal({
                  text1: "Are you sure ?",
                  text2: "Delete my account...!",
                  btn1Text: "Delete",
                  btn2Text: "Cancel",
                  btn1Handler: () => dispatch(deleteProfile(token, navigate)),
                  btn2Handler: () => { setConfirmationModal(null); setCheck(false) },
                })
              }
            >
              I want to delete my account( select and confirm )
            </button>
          </div>
      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  )
}