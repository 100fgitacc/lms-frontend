import { useEffect, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"

import styles from '../../../../pages/coursePage.module.css'

export default function UploadDocs({
  type = "image", 
  viewData = null,
  editData = null,
}) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(viewData ? viewData : editData ? editData : "")
  const inputRef = useRef(null)

  const getAcceptedTypes = () => {
    switch (type) {
      case "video":
        return { "video/*": [".mp4"] }
      case "text":
        return {
          "text/plain": [".txt"],
          "application/pdf": [".pdf"],
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
          "text/csv": [".csv"],
        }
      default:
        return { "image/*": [".jpeg", ".jpg", ".png"] }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: getAcceptedTypes(),
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file) {
        previewFile(file)
        setSelectedFile(file)
      }
    },
  })

  const previewFile = (file) => {
    if (type === "text") {
      setPreviewSource(file.name)
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  return (
   <div className={styles['thumbnail-container']}>
    
      <div className={``}>
        {previewSource ? (
          <div className="">
            {type === "image" && (
              <img
                src={previewSource}
                alt="Preview"
                className={styles['thumbnail-img']}
              />
            )}
            {type === "video" && (
              <Player aspectRatio="16:9" playsInline src={previewSource} />
            )}
            {type === "text" && (
              <p className="">{previewSource}</p>
            )}

            {!viewData && (
              <button
                type="button"
                onClick={() => {
                  setPreviewSource("")
                  setSelectedFile(null)
                }}
                className={`button ${styles['cancel-button']}`}
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
              Drag and drop a {type} file, or click to{" "}
              <span className="">Browse</span>
            </p>
            {type === "text" && (
              <ul className="">
                <li>Supported: TXT, PDF, DOCX, CSV</li>
              </ul>
            )}
          </div>
        )}
      </div>

    
    </div>
  )
}
