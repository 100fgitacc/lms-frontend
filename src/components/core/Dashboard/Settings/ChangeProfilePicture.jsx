import { useEffect, useRef, useState } from "react"
import { FiUpload } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"

import { updateUserProfileImage } from "../../../../services/operations/SettingsAPI"
import IconBtn from "../../../common/IconBtn"
import Img from './../../../common/Img';
import styles from '../profile.module.css'


export default function ChangeProfilePicture() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [previewSource, setPreviewSource] = useState(null)

  const fileInputRef = useRef(null)

  const handleClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    // console.log(file)
    if (file) {
      setProfileImage(file)
      previewFile(file)
    }
  }

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  const handleFileUpload = () => {
    try {
      // console.log("uploading...")
      setLoading(true)
      const formData = new FormData()
      formData.append("profileImage", profileImage)

      dispatch(updateUserProfileImage(token, formData)).then(() => {
        setLoading(false)
      })
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  useEffect(() => {
    if (profileImage) {
      previewFile(profileImage)
    }
  }, [profileImage])


  return (
    <>
      <div className={`${styles.wrapper} ${styles['profile-picture']}`}>
       <div className={styles['settings-heading']}>
         <h3>Change Profile Picture</h3>
       </div>
        
        <div className={styles['settings-config']}>
          <div className={styles.avatar}>
              <img
                src={previewSource || user?.image}
                alt={`profile-${user?.firstName}`}
              />
          </div>
          <div>
           <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className={styles.hidden}
              accept="image/png, image/gif, image/jpeg, image/jpg"
            />
            <p>
              Select custom photo from your device, then click on Update:
            </p>
            <div  className={styles['btns-container']}>
            <button
              onClick={handleClick}
              disabled={loading}
              className={`${styles['button']} ${styles['select-btn']}`}
            >
              Select photo
            </button>
            <button
              onClick={handleFileUpload}
              className={styles['button']}
            >
              {loading ? "Updating..." : "Update photo"}
            </button>
            </div>
           
          </div>
        </div>
      </div>
    </>
  )
}