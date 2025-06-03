import styles from './index.module.css';

export default function Tab({ tabData, field, setField }) {
  return (
    <div className={styles.container}>
      {tabData.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setField(tab.type)}
          className={`${styles.button} ${field === tab.type ? styles.active : ''}`}
        >
          {tab.tabName}
        </button>
      ))}
    </div>
  );
}
