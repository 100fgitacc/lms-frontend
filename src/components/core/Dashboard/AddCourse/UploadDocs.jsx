import { useEffect, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"

import styles from '../../../../pages/coursePage.module.css'

export default function UploadDocs({
  type = "image",
  viewData = null,
  editData = null,
  name,
  register,
  setValue,
  errors,
  disabled = false,
  homeworkFile
}) {

  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(
    viewData ? viewData : editData ? editData : ""
  )
  const inputRef = useRef(null)

  useEffect(() => {
    if (register && name) {
      register(name)
    }
  }, [register, name])

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
          "application/zip": [".zip"],
          "application/vnd.ms-powerpoint": [".ppt"],
          "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
        }
      default:
        return { "image/*": [".jpeg", ".jpg", ".png"] }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: getAcceptedTypes(),
    multiple: false,
    disabled,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file) {
        previewFile(file)
        setSelectedFile(file)
        if (setValue && name) {
          setValue(name, file, { shouldValidate: true, shouldDirty: true })
        }
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
  function decodeFileName(filename) {
    try {
      return decodeURIComponent(filename);
    } catch {
      return filename;
    }
  }
  function downloadFile(url, filename) {
    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(link.href);
      })
      .catch(() => {
        window.open(url, '_blank');
      });
  }
  useEffect(() => {
      if (!homeworkFile) {
        setSelectedFile(null);
        setPreviewSource("");
      }
    }, [homeworkFile]);

  return (
    <div className={styles['thumbnail-container']}>
      <div>
        {previewSource ? (
          <div>
            {type === "image" && (
              <img
                src={previewSource}
                alt="Preview"
                className={styles['thumbnail-img']}
              />
            )}
            {type === "video" && (
              <video
                controls
                src={previewSource}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            )}
            {type === "text" && (
              typeof previewSource === "string" ? (
                previewSource.startsWith("http") ? (
                  <p
                    onClick={() => downloadFile(previewSource, decodeFileName(previewSource.split('/').pop()))}
                    style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                  >
                    {decodeFileName(previewSource.split('/').pop())}
                  </p>
                ) : (
                  <p>{previewSource}</p>
                )
              ) : (
                previewSource && typeof previewSource === "object" ? (
                  <p
                    onClick={() => downloadFile(previewSource.url, decodeFileName(previewSource.filename))}
                    style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                  >
                    {decodeFileName(previewSource.filename)}
                  </p>
                ) : null
              )
            )}

            {!disabled && (
              <button
                type="button"
                onClick={() => {
                  setPreviewSource("")
                  setSelectedFile(null)
                  if (setValue && name) {
                    setValue(name, null, { shouldValidate: true, shouldDirty: true })
                  }
                }}
                className={`button ${styles['cancel-button']}`}
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div
            {...getRootProps()}
            style={{
              border: "2px dashed #888",
              padding: 20,
              textAlign: "center",
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          >
            <input {...getInputProps()} ref={inputRef} name={name} />
            <FiUploadCloud size={40} color="#888" />
            <p>
              Drag and drop a {type} file, or click to <span>Browse</span>
            </p>
            {type === "text" && (
              <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                <li>Supported: TXT, PDF, DOCX, CSV, PPT, PPTX, ZIP</li>
              </ul>
            )}
            {errors && errors[name] && (
              <p style={{ color: "red", marginTop: 8 }}>{errors[name].message || "File is required"}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
