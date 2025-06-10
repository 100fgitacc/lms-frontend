import { Triangle } from 'react-loader-spinner'
import styles from './loader.module.css'
const Loader = ({ type }) => {
  return (
    <div
      className={`${styles.wrapper} ${type === 'fullscreen' ? styles.fullscreen : ''}`}
    >
      <Triangle
        height={80}
        width={80}
        color="#2033af"
        ariaLabel="triangle-loading"
        visible={true}
      />
      <span className={styles.typing}>Loading . . .</span>
    </div>
  )
}

export default Loader
