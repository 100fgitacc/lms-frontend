import { useState } from "react"
import { toast } from "react-hot-toast"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { useNavigate, matchPath, Link } from "react-router-dom"

import { sendOtp } from "../../../services/operations/authAPI"
import { setSignupData } from "../../../slices/authSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import Tab from "../../common/Tab"
import styles from './index.module.css';

 const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname);
    }

function SignupForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // student or instructor
  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { firstName, lastName, email, password, confirmPassword } = formData;

  // Handle input fields, when some value changes
  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));

    // console.log('signup form data - ', formData);
  };

  // Handle Form Submission
  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords Do Not Match")
      return;
    }
    const signupData = {
      ...formData,
      accountType,
    };

    // Setting signup data to state
    // To be used after otp verification
    dispatch(setSignupData(signupData));
    // Send OTP to user for verification
    dispatch(sendOtp(formData.email, navigate));

    // Reset form data
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
    setAccountType(ACCOUNT_TYPE.STUDENT);
  };

  // data to pass to Tab component
  const tabData = [
    {
      id: 1,
      tabName: "Student",
      type: ACCOUNT_TYPE.STUDENT,
    },
    {
      id: 2,
      tabName: "Instructor",
      type: ACCOUNT_TYPE.INSTRUCTOR,
    },
  ];

  return (
  <div  className={styles.container}>
    {/* <Tab tabData={tabData} field={accountType} setField={setAccountType} /> */}
    {/* Form */}
    <form onSubmit={handleOnSubmit} className={styles.form}>
      <h2 className={styles['form-heading']}>Create account</h2>
      <div className={styles.inner}>
        {/* First Name */}
        <label className={styles.label}>
          <p className={styles['label-text']}>
            First Name <sup className={styles.required}>*</sup>
          </p>
          <input
            required
            type="text"
            name="firstName"
            value={firstName}
            onChange={handleOnChange}
            placeholder="Enter first name"
            className={styles.input}
          />
        </label>

        {/* Last Name */}
        <label className={styles.label}>
          <p className={styles['label-text']}>
            Last Name <sup className={styles.required}>*</sup>
          </p>
          <input
            required
            type="text"
            name="lastName"
            value={lastName}
            onChange={handleOnChange}
            placeholder="Enter last name"
            className={styles.input}
          />
        </label>
      </div>

      {/* Email Address */}
      <label className={styles.label}>
        <p className={styles['label-text']}>
          Email Address <sup className={styles.required}>*</sup>
        </p>
        <input
          required
          type="text"
          name="email"
          value={email}
          onChange={handleOnChange}
          placeholder="Enter email address"
          className={styles.input}
        />
      </label>

      <div style={{ display: 'flex', gap: '1rem' }}>
        {/* Create Password */}
        <label className={styles.label}>
          <p className={styles['label-text']}>
            Create Password <sup className={styles.required}>*</sup>
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
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </div>
        </label>

        {/* Confirm Password */}
        <label className={styles.label}>
          <p className={styles['label-text']}>
            Confirm Password <sup className={styles.required}>*</sup>
          </p>
          <div className={styles.passwordWrapper}>
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleOnChange}
              placeholder="Confirm Password"
              className={styles.input}
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className={styles.eyeIcon}
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </div>
        </label>
      </div>

      {/* Submit Button */}
      <button type="submit" className={styles.button}>
        Create Account
      </button>

      <Link to="/login">
        <button
          className={`${styles['button-secondary']} ${
            matchRoute("/login") ? "border-[2.5px]" : ""
          }`}
        >
          Log in
        </button>
      </Link>
    </form>
  </div>
)
}

export default SignupForm