import { useEffect, useState } from "react";
import { createNewCategory, deleteCategory, fetchCourseCategories } from "../../../services/operations/courseDetailsAPI";
import IconBtn from '../../common/IconBtn';

import { IoIosAdd } from "react-icons/io";
import { useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";

import styles from './profile.module.css'


// loading skeleton
const LoadingSkeleton = () => {
  return (<div className="flex  flex-col gap-6 ">
    <p className="h-7 w-full sm:w-1/2 rounded-xl skeleton"></p>
    <p className="h-7 w-full sm:w-1/2 rounded-xl skeleton"></p>
    <p className="h-7 w-full sm:w-1/2 rounded-xl skeleton"></p>
    <p className="h-7 w-full sm:w-1/2 rounded-xl skeleton"></p>
  </div>)
}


const CreateCategory = () => {

  const { token } = useSelector((state) => state.auth);
  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [description, setDescription] = useState('');


  const fetchSublinks = async () => {
    try {
      setLoading(true)
      const res = await fetchCourseCategories();
      setSubLinks(res);
    }
    catch (error) {
      console.log("Could not fetch the category list = ", error);
    }
    setLoading(false)
  }


  useEffect(() => {
    fetchSublinks();
  }, [])

  // create new category
  const handleCreateCategory = async () => {
    await createNewCategory(newCategory, description, token)
    setNewCategory('')
    setDescription('')
  };

  const handleDeleteCategory = async (categoryId) => {
    await deleteCategory(categoryId, token)
  }


  return (
    <div className={`${styles.wrapper} ${styles['create-category']}`}>
      <div className={styles.heading}>
          <h2 className={`${styles.title} secondary-title`}>Create Category</h2>
      </div>
      <div className={styles.row}>
        <div className={`${styles.col} ${styles.wrapper}`}>
          <h3 className={styles['third-title']}>
            Add new category:
          </h3>
          <div className={styles['form-input']}>
            <input
              type='text'
              value={newCategory}
              placeholder="Enter new category name"
              onChange={(e) => setNewCategory(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles['form-input']}>
            <textarea
              type='text'
              value={description}
              placeholder="Enter description of category"
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
            />
          </div>
          <div>
            <IconBtn
            text="Add"
            onclick={handleCreateCategory}
            disabled={!newCategory || !description}
          >
            <IoIosAdd />
          </IconBtn>
          </div>
        </div>
          <div className={`${styles.col} ${styles.wrapper}`}>
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <div>
                <h3 className={styles['third-title']}>
                  Current categories:
                </h3>
                <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Category Name</th>
                        <th>Description</th>
                        <th>Manage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subLinks?.map((subLink, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{subLink.name}</td>
                          <td>{subLink.description}
                          </td>
                          <td>
                            <button onClick={() => handleDeleteCategory(subLink._id)}>
                              <RiDeleteBin6Line className="" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            )}
          </div>
      </div>
     


    </div>
  )
}

export default CreateCategory