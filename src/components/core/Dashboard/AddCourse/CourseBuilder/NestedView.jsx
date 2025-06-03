import { useState } from "react"
import { AiFillCaretDown } from "react-icons/ai"
import { FaPlus } from "react-icons/fa"
import { MdEdit,MdVisibility } from "react-icons/md"
import { RiDeleteBin6Line } from "react-icons/ri"
import { RxDropdownMenu } from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux"

import { deleteSection, deleteSubSection } from "../../../../../services/operations/courseDetailsAPI"
import { setCourse } from "../../../../../slices/courseSlice"

import ConfirmationModal from "../../../../common/ConfirmationModal"
import SubSectionModal from "./SubSectionModal"


import styles from '../../profile.module.css'

export default function NestedView({ handleChangeEditSectionName }) {

  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  // States to keep track of mode of modal [add, view, edit]
  const [addSubSection, setAddSubsection] = useState(null)
  const [viewSubSection, setViewSubSection] = useState(null)
  const [editSubSection, setEditSubSection] = useState(null)
  // to keep track of confirmation modal
  const [confirmationModal, setConfirmationModal] = useState(null)

  // Delele Section
  const handleDeleleSection = async (sectionId) => {
    const result = await deleteSection({ sectionId, courseId: course._id, token, })
    if (result) {
      dispatch(setCourse(result))
    }
    setConfirmationModal(null)
  }

  // Delete SubSection 
  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    const result = await deleteSubSection({ subSectionId, sectionId, token })
    if (result) {
      // update the structure of course - As we have got only updated section details 
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === sectionId ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
    }
    setConfirmationModal(null)
  }

  return (
    <>
      <div
        className={styles['lecture-constructor']}
        id="nestedViewContainer"
      >
        {course?.courseContent?.map((section, index) => (
          <div key={section._id} open className={styles['constructor-item']}>
              <div className={styles['heading']}>
                <div>
                  <h4>
                   {index+1} Section name: 
                  </h4>
                  <p className={styles['section-name']}>
                    {section.sectionName}
                  </p>
                </div>
                <div className={styles['btns-container']}>
                <button
                  onClick={() =>
                    handleChangeEditSectionName(
                      section._id,
                      section.sectionName
                    )
                  }
                  className={`button`}
                >
                  Edit section
                  <MdEdit className="" />
                </button>

                <button
                  onClick={() =>
                    setConfirmationModal({
                      text1: "Delete this Section?",
                      text2: "All the lectures in this section will be deleted",
                      btn1Text: "Delete",
                      btn2Text: "Cancel",
                      btn1Handler: () => handleDeleleSection(section._id),
                      btn2Handler: () => setConfirmationModal(null),
                    })
                  }
                  className={`button cancel-button`}
                >
                  Delete section
                  <RiDeleteBin6Line className="" />
                </button>
              </div>
              </div>
              
            <div>
              {/* Render All Sub Sections Within a Section */}
              {section.subSection.map((data, index) => (
                <div
                  key={data?._id}
                  className=""
                >
                  <div className={styles['lecture-wrapper']}>
                    <div>
                      <MdVisibility className={styles['view-lecture']} onClick={() => setViewSubSection(data)}/>
                      <div>
                        <h5 >
                        {index+1} Lecture  name: 
                        </h5>
                        <p className={styles['lecture-name']}>
                          {data.title}
                        </p>
                      </div>
                    </div>
                    <div className={styles['btns-container']}>
                      <button
                        onClick={() =>
                          setEditSubSection({ ...data, sectionId: section._id })
                        }
                        className={`button`}
                      >
                        Edit lecture
                        <MdEdit className="" />
                      </button>
                      <button
                        onClick={() =>
                          setConfirmationModal({
                            text1: "Delete this Sub-Section?",
                            text2: "This lecture will be deleted",
                            btn1Text: "Delete",
                            btn2Text: "Cancel",
                            btn1Handler: () =>
                              handleDeleteSubSection(data._id, section._id),
                            btn2Handler: () => setConfirmationModal(null),
                          })
                        }
                        className={`button cancel-button`}
                      >
                        Delete lecture
                        <RiDeleteBin6Line className="" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles['add-lecture']}>
                <button
                  onClick={() => setAddSubsection(section._id)}
                >
                  <FaPlus  className={styles['add-lecture-btn']} />
                  <p>Add Lecture</p>
                </button>
              </div>
             
                {addSubSection ? (
                  <SubSectionModal
                    modalData={addSubSection}
                    setModalData={setAddSubsection}
                    add={true}
                  />
                ) : viewSubSection ? (
                  <SubSectionModal
                    modalData={viewSubSection}
                    setModalData={setViewSubSection}
                    view={true}
                  />
                ) : editSubSection ? (
                  <SubSectionModal
                    modalData={editSubSection}
                    setModalData={setEditSubSection}
                    edit={true}
                  />
                ) : (
                  <></>
                )}
                {confirmationModal ? (
                  <ConfirmationModal modalData={confirmationModal} />
                ) : (
                  <></>
                )}
          </div>
        ))}
      </div>



      
    </>
  )
}