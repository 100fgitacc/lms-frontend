import { useEffect, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"
import { useSelector } from "react-redux"

import "video-react/dist/video-react.css"
import { Player } from "video-react"

import styles from '../profile.module.css'

export default function Upload({ name, label, register, setValue, errors, video = false, viewData = null, editData = null, }) {
  // const { course } = useSelector((state) => state.course)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(viewData ? viewData : editData ? editData : "")
  const inputRef = useRef(null)

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      previewFile(file)
      setSelectedFile(file)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: !video
      ? { "image/*": [".jpeg", ".jpg", ".png"] }
      : { "video/*": [".mp4"] },
    onDrop,
  })

  const previewFile = (file) => {
    // console.log(file)
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
    <div className={styles['thumbnail-container']}>
      <label className="" htmlFor={name}>
        {label} {!viewData && <sup>*</sup>}
      </label>

      <div className={`${isDragActive ? "" : ""}`}>
        {previewSource ? (
          <div className="">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className={styles['thumbnail-img']}
              />
            ) : (
              <Player aspectRatio="16:9" playsInline src={previewSource} />
            )}

            {!viewData && (
              <button
                type="button"
                onClick={() => {
                  setPreviewSource("")
                  setSelectedFile(null)
                  setValue(name, null)
                }}
                className={`${styles['button']} ${styles['cancel-button']}`}
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div
            className=""
            {...getRootProps()}
          >
            <input {...getInputProps()} ref={inputRef} />
            <div className="">
              <FiUploadCloud className="" />
            </div>
            <p className="">
              Drag and drop an {!video ? "image" : "video"}, or click to{" "}
              <span className="">Browse</span> a
              file
            </p>
            <ul className="">
              <li>Aspect ratio 16:9</li>
              <li>Recommended size 1024x576</li>
            </ul>
          </div>
        )}
      </div>
      {errors[name] && (
        <span className="required">
          {label} is required
        </span>
      )}
    </div>
  )
}