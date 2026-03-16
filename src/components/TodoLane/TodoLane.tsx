import { Todo } from '../../types/todo';
import { useTodos } from '../../state/TodoContext';
import { getToday, dayIndex } from '../../utils/dateUtils';
import { Character } from '../Character/Character';
import styles from './TodoLane.module.css';

const LANE_COLORS = [
  '#4A90D9',
  '#E8854A',
  '#50B86C',
  '#D94A6B',
  '#9B59B6',
  '#1ABC9C',
  '#F2C94C',
];

interface TodoLaneProps {
  todo: Todo;
  mode: 'sidebar' | 'track';
  days: string[];
  dayWidth: number;
}

const STATUS_LABELS: Record<string, string> = {
  'waiting': '대기',
  'in-progress': '진행중',
  'paused': '일시정지',
  'done': '완료',
};

export function TodoLane({ todo, mode, days, dayWidth }: TodoLaneProps) {
  const { todos, dispatch } = useTodos();
  const colorIndex = todos.findIndex((t) => t.id === todo.id) % LANE_COLORS.length;
  const color = LANE_COLORS[colorIndex >= 0 ? colorIndex : 0];

  if (mode === 'sidebar') {
    return (
      <div className={styles.sidebar}>
        <div className={styles.info}>
          <span className={styles.title} title={todo.title}>{todo.title}</span>
          <span className={`${styles.badge} ${styles[todo.status]}`}>
            {STATUS_LABELS[todo.status]}
          </span>
        </div>
        <div className={styles.actions}>
          {todo.status === 'waiting' && (
            <button
              className={`${styles.btn} ${styles.btnPlay}`}
              onClick={() => dispatch({ type: 'PLAY', payload: { id: todo.id } })}
              title="시작"
            >
              &#9654;
            </button>
          )}
          {todo.status === 'in-progress' && (
            <>
              <button
                className={`${styles.btn} ${styles.btnPause}`}
                onClick={() => dispatch({ type: 'PAUSE', payload: { id: todo.id, currentDate: getToday() } })}
                title="일시정지"
              >
                &#10074;&#10074;
              </button>
              <button
                className={`${styles.btn} ${styles.btnDone}`}
                onClick={() => dispatch({ type: 'COMPLETE', payload: { id: todo.id } })}
                title="완료"
              >
                &#10003;
              </button>
            </>
          )}
          {todo.status === 'paused' && (
            <>
              <button
                className={`${styles.btn} ${styles.btnPlay}`}
                onClick={() => dispatch({ type: 'RESUME', payload: { id: todo.id } })}
                title="재개"
              >
                &#9654;
              </button>
              <button
                className={`${styles.btn} ${styles.btnDone}`}
                onClick={() => dispatch({ type: 'COMPLETE', payload: { id: todo.id } })}
                title="완료"
              >
                &#10003;
              </button>
            </>
          )}
          {todo.status !== 'done' && (
            <button
              className={`${styles.btn} ${styles.btnDelete}`}
              onClick={() => dispatch({ type: 'DELETE_TODO', payload: { id: todo.id } })}
              title="삭제"
            >
              &#10005;
            </button>
          )}
          {todo.status === 'done' && (
            <button
              className={`${styles.btn} ${styles.btnDelete}`}
              onClick={() => dispatch({ type: 'DELETE_TODO', payload: { id: todo.id } })}
              title="삭제"
            >
              &#10005;
            </button>
          )}
        </div>
      </div>
    );
  }

  // Track mode
  const startIdx = dayIndex(days, todo.startDate);
  const endIdx = dayIndex(days, todo.endDate);

  const trackStart = Math.max(startIdx, 0);
  const trackEnd = Math.min(endIdx, days.length - 1);

  if (trackStart > days.length - 1 || trackEnd < 0) {
    return null;
  }

  const leftPx = trackStart * dayWidth;
  const widthPx = (trackEnd - trackStart + 1) * dayWidth;

  return (
    <div
      className={styles.track}
      style={{
        left: leftPx,
        width: widthPx,
        backgroundColor: `${color}20`,
        borderColor: `${color}60`,
      }}
    >
      <div
        className={styles.trackFill}
        style={{ backgroundColor: `${color}30` }}
      />
      <Character todo={todo} color={color} />
    </div>
  );
}
