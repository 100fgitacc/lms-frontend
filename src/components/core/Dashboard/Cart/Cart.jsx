import { useSelector } from "react-redux"

import RenderCartCourses from "./RenderCartCourses"
import RenderTotalAmount from "./RenderTotalAmount"

import styles from '../profile.module.css'

export default function Cart() {
  const { total, totalItems } = useSelector((state) => state.cart)
  
  return (
    <div className={styles.cart}>
      <div className={styles.heading}>
        <h2 className={`${styles.title} secondary-title`}>Cart</h2>
        <strong>{totalItems} Courses in Cart</strong>
      </div>
      {totalItems > 0 ? (
        <div className={`${styles['cart-wrapper']}`}>
          <RenderCartCourses />
          <RenderTotalAmount />
        </div>
      ) : (
        <div className={styles.wrapper}>
          Your cart is empty
        </div>
      )}
    </div>
  )
}