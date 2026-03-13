import { useState } from 'react';
import { useTodos } from '../../state/TodoContext';
import { getToday } from '../../utils/dateUtils';
import styles from './AddTodoModal.module.css';

interface AddTodoModalProps {
  onClose: () => void;
}

export function AddTodoModal({ onClose }: AddTodoModalProps) {
  const { dispatch } = useTodos();
  const today = getToday();

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('할일 이름을 입력해주세요.');
      return;
    }
    if (!startDate) {
      setError('시작일을 선택해주세요.');
      return;
    }
    if (!endDate) {
      setError('종료일을 선택해주세요.');
      return;
    }
    if (endDate < startDate) {
      setError('종료일은 시작일 이후여야 합니다.');
      return;
    }

    dispatch({
      type: 'ADD_TODO',
      payload: { title: title.trim(), startDate, endDate },
    });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>할일 추가</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>할일 이름</label>
            <input
              type="text"
              className={styles.input}
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(''); }}
              placeholder="무엇을 해야 하나요?"
              autoFocus
              maxLength={100}
            />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>시작일</label>
              <input
                type="date"
                className={styles.input}
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setError(''); }}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>종료일</label>
              <input
                type="date"
                className={styles.input}
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setError(''); }}
                min={startDate}
              />
            </div>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.buttons}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              취소
            </button>
            <button type="submit" className={styles.submitBtn}>
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
