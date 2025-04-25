import { useState } from "react";
import { FiTrash2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import ConfirmationModal from './../../../common/ConfirmationModal';
import { deleteProfile } from "../../../../services/operations/SettingsAPI"

export default function DeleteAccount() {

  const [confirmationModal, setConfirmationModal] = useState(null);
  const [check, setCheck] = useState(false);

  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()



  return (
    <>
      <div className="my-10 flex flex-row gap-x-5 rounded-md border-[1px] border-white bg-pink-100 p-8 px-6 sm:px-12">
        <div className="flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-pink-900">
          <FiTrash2 className="text-3xl text-pink-200" />
        </div>

        <div className="flex flex-col ">
          <h2 className="text-lg font-semibold text-white "> Delete Account</h2>

          <div className="sm:w-4/5 text-pink-25 flex flex-col gap-3 mt-1 sm:text-lg text-sm">
            <p>Would you like to delete account ?</p>
            <p className="text-pink-25 flex flex-col gap-3 mt-1 text-[14px] font-thin">
              This account may contain Paid Courses. Deleting your account is
              permanent and will remove all the contain associated with it.
            </p>
          </div>


          <div className="flex items-center gap-3 mt-4">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-indigo-600 rounded-full form-style cursor-pointer"
              checked={check}
              onChange={() => setCheck(prev => !prev)}
            />

            <button
              type="button"
              className="w-fit text-pink-300 underline font-thin"
              onClick={() => check &&
                setConfirmationModal({
                  text1: "Are you sure ?",
                  text2: "Delete my account...!",
                  btn1Text: "Delete",
                  btn2Text: "Cancel",
                  btn1Handler: () => dispatch(deleteProfile(token, navigate)),
                  btn2Handler: () => { setConfirmationModal(null); setCheck(false) },
                })
              }
            >
              I want to delete my account( select and confirm )
            </button>
          </div>

        </div>
      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}