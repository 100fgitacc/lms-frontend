import React, { useState } from "react"
import { BiArrowBack } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { getPasswordResetToken } from "../services/operations/authAPI"

import styles from './forgot.module.css'


function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth)

  const handleOnSubmit = (e) => {
    e.preventDefault()
    dispatch(getPasswordResetToken(email, setEmailSent))
  }

  return (
    <div className={styles.container}>
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div>
          <h1 className={styles.content}>
            {!emailSent ? "Reset your password" : "Check email"}
          </h1>
          <div className={styles.subtitle}>
            {!emailSent
              ? "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
              : <p>We have sent the reset email to <span>{email}</span></p>}
          </div>

          <form onSubmit={handleOnSubmit} className={styles.form}>
            {!emailSent && (
              <label className={styles.label}>
                <p className={styles['label-text']}>
                  Email Address <sup className={styles.required}>*</sup>
                </p>
                <input
                  required
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                 className={styles.input}
                />
              </label>
            )}

            <button
              type="submit"
              className={styles.button}
            >
              {!emailSent ? "Submit" : "Resend Email"}
            </button>
            <Link to="/login" className={styles['button-secondary']}>
              <BiArrowBack className={styles.icon} />
              <p>
                 Back To Login
              </p>
            </Link>
          </form>
        </div>
      )}
    </div>
  )
}

export default ForgotPassword