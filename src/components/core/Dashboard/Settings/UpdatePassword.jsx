import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { changePassword } from "../../../../services/operations/SettingsAPI"
import IconBtn from "../../../common/IconBtn"


import styles from '../profile.module.css'



export default function UpdatePassword() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitPasswordForm = async (data) => {
    console.log("password Data - ", data)
    try {
      await changePassword(token, data)
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <div className={styles['update-password']}>
      <form onSubmit={handleSubmit(submitPasswordForm)}>
        <div className={styles.wrapper}>
          <div className={styles['settings-heading']}>
            <h3>
              Password update
            </h3>
          </div>
          
          <div className={styles['row']}>
            <div className={styles['form-input']}>
              <label htmlFor="oldPassword" className="lable-style">
                Current Password
              </label>
              <input
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                id="oldPassword"
                placeholder="Enter Current Password"
                className="form-style"
                {...register("oldPassword", { required: true })}
              />
              <span
                onClick={() => setShowOldPassword((prev) => !prev)}
                className={styles['password-icon']}
              >
                {showOldPassword ? (
                  <AiOutlineEyeInvisible fontSize={15} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={15} fill="#AFB2BF" />
                )}
              </span>

              {errors.oldPassword && (
                <span className="">
                  Please enter your Current Password.
                </span>
              )}
            </div>

            <div className={styles['form-input']}>
              <label htmlFor="newPassword" className="lable-style">
                New Password
              </label>

              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                id="newPassword"
                placeholder="Enter New Password"
                className="form-style"
                {...register("newPassword", { required: true })}
              />

              <span
                onClick={() => setShowNewPassword((prev) => !prev)}
                className={styles['password-icon']}
              >
                {showNewPassword ? (
                  <AiOutlineEyeInvisible fontSize={15} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={15} fill="#AFB2BF" />
                )}
              </span>
              {errors.newPassword && (
                <span className="">
                  Please enter your New Password.
                </span>
              )}
            </div>
            <div className={styles['form-input']}>
              <label htmlFor="confirmNewPassword" className="lable-style">
                Confirm New Password
              </label>

              <input
                type={showConfirmNewPassword ? "text" : "password"}
                name="confirmNewPassword"
                id="confirmNewPassword"
                placeholder="Enter Confirm New Password"
                className="form-style"
                {...register("confirmNewPassword", { required: true })}
              />

              <span
                onClick={() => setShowConfirmNewPassword((prev) => !prev)}
                className={styles['password-icon']}
              >
                {showConfirmNewPassword ? (
                  <AiOutlineEyeInvisible fontSize={15} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={15} fill="#AFB2BF" />
                )}
              </span>
              {errors.confirmNewPassword && (
                <span className="">
                  Please enter your Confirm New Password.
                </span>
              )}
            </div>

          </div>
           <div className={styles['btns-container']}>
          <button
            onClick={() => { navigate("/dashboard/my-profile") }}
            className={`${styles['button']} ${styles['delete-btn']}`}
          >
            Cancel
          </button>
          <button
            onClick={() => { navigate("/dashboard/my-profile") }}
            className={`${styles['button']} ${styles['select-btn']}`}
            type="submit"
          >
            Save
          </button>
        </div>
        </div>
      </form>
    </div>
  )
}