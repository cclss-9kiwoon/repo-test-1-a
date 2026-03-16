import { useState } from 'react';
import { AddTodoModal } from '../AddTodoModal/AddTodoModal';
import styles from './Header.module.css';

export function Header() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.logo}>🏃</span>
          <h1 className={styles.title}>Todo Runner</h1>
          <span className={styles.subtitle}>달려라 할일!</span>
        </div>
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
          + 할일 추가
        </button>
      </header>
      {showModal && <AddTodoModal onClose={() => setShowModal(false)} />}
    </>
  );
}
