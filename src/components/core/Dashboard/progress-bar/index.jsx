import React from 'react';
import styles from './index.module.css';

const ProgressBar = ({progress, context, total}) => {
    return(
        <div className={`${styles.wrapper} ${context === 'green' && styles['green']}`}>
            <div className={styles['progress-bar']}>
                <span className={styles['progress-bar-status']} 
                style={{ width: `${progress}%` }}
                ></span>
            </div>
            <div className={styles['progress-percentage']}>
                <p><span>{progress} %</span> completed</p>
                {total && (<p className={styles.total}>3,454</p>)}
            </div>
    </div>
    );
}

export default ProgressBar;