import { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"

import styles from "../profile.module.css"

const MAX_IMAGE_SIZE = 500 * 1024 // 500 KB

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  viewData = null,
  editData = null,
}) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(
    viewData ? viewData : editData ? editData : ""
  )
  const [errorMessage, setErrorMessage] = useState("")

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        setErrorMessage("File is too large! Max 500 KB.")
        return
      }

      setErrorMessage("")
      previewFile(file)
      setSelectedFile(file)
    }
  }

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    onDrop,
    noClick: true,
  })

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  useEffect(() => {
    register(name, { required: true })
  }, [register])

  useEffect(() => {
    setValue(name, selectedFile)
  }, [selectedFile, setValue])

  return (
    <div className={styles["thumbnail-container"]}>
      <label htmlFor={name}>
        {label} {!viewData && <sup>*</sup>}
      </label>

      {previewSource ? (
        <>
          <img
            src={previewSource}
            alt="Preview"
            className={styles["thumbnail-img"]}
          />
          {!viewData && (
            <button
              type="button"
              onClick={() => {
                setPreviewSource("")
                setSelectedFile(null)
                setValue(name, null)
              }}
              className={`${styles["button"]} ${styles["cancel-button"]}`}
            >
              Cancel
            </button>
          )}
        </>
      ) : (
        <div {...getRootProps()} className={styles.dropArea}>
          <input {...getInputProps()} />
          <div>
            <FiUploadCloud />
          </div>
          <p>
            Drag and drop an image, or{" "}
            <span
              className={styles.browse}
              onClick={open}
            >
              Browse
            </span>
          </p>
          <ul>
            <li>Allowed formats: JPG, PNG</li>
            <li>Max size: 500 KB</li>
            <li>Min resolution: 200×200 px</li>
          </ul>
        </div>
      )}

      {(errors[name] || errorMessage) && (
        <span className="required">
          {errorMessage || `${label} is required`}
        </span>
      )}
    </div>
  )
}
