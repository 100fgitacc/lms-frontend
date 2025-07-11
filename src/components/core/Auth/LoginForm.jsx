import { useEffect, useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../../../services/operations/authAPI"
import styles from './index.module.css'

const LoginForm = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)

  const { email, password } = formData

  // useEffect(() => {
  //   const script = document.createElement("script")
  // script.src = `https://www.google.com/recaptcha/api.js?render=${import.meta.env.VITE_APP_RECAPTCHA_SITE_KEY}`
  //   script.async = true
  //   document.body.appendChild(script)

  //   return () => {
  //     document.body.removeChild(script)
  //   }
  // }, [])

  const handleOnChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()

    // if (!window.grecaptcha) {
    //   alert("reCAPTCHA not loaded")
    //   return
    // }

    // const recaptcha = await window.grecaptcha.execute(
    //   import.meta.env.VITE_APP_RECAPTCHA_SITE_KEY,
    //   { action: "login" }
    // )

    // dispatch(login(email, password, navigate, recaptcha))
    dispatch(login(email, password, navigate))
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleOnSubmit} className={styles.form}>
        <h2 className={styles['form-heading']}>Login</h2>

        <div className={styles.inner}>
          <label className={styles.label}>
            <p className={styles['label-text']}>
              Email Address <sup className={styles.required}>*</sup>
            </p>
            <input
              required
              type="email"
              name="email"
              value={email}
              onChange={handleOnChange}
              placeholder="Enter email address"
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            <p className={styles['label-text']}>
              Password <sup className={styles.required}>*</sup>
            </p>
            <div className={styles.passwordWrapper}>
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="Enter Password"
                className={styles.input}
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className={styles.eyeIcon}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#4d4d4d" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#4d4d4d" />
                )}
              </span>
            </div>
            <Link to="/forgot-password" className={styles['forgot-link']}>
              <p>Forgot Password</p>
            </Link>
          </label>

          <button type="submit" className={styles.button}>
            Sign In
          </button>

          <Link to="/signup">
            <button type="button" className={styles['button-secondary']}>
              Create Account
            </button>
          </Link>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
