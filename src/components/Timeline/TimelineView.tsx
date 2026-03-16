import { useRef, useEffect } from 'react';
import { useTodos } from '../../state/TodoContext';
import { getTimelineRange, isToday } from '../../utils/dateUtils';
import { TodoLane } from '../TodoLane/TodoLane';
import { TimelineHeader } from './TimelineHeader';
import styles from './TimelineView.module.css';

const DAY_WIDTH = 100;

export function TimelineView() {
  const { todos } = useTodos();
  const scrollRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLDivElement>(null);
  const { days } = getTimelineRange(todos);

  useEffect(() => {
    if (todayRef.current) {
      todayRef.current.scrollIntoView({ inline: 'center', behavior: 'smooth' });
    }
  }, []);

  const todayIndex = days.findIndex(isToday);

  return (
    <div className={styles.timelineContainer}>
      {/* Fixed sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>할일</div>
        {todos.map((todo) => (
          <div key={todo.id} className={styles.sidebarLane}>
            <TodoLane todo={todo} mode="sidebar" days={days} dayWidth={DAY_WIDTH} />
          </div>
        ))}
        {todos.length === 0 && (
          <div className={styles.emptyHint}>할일을 추가해보세요!</div>
        )}
      </div>

      {/* Scrollable timeline */}
      <div className={styles.scrollArea} ref={scrollRef}>
        <div className={styles.timelineGrid} style={{ width: days.length * DAY_WIDTH }}>
          <TimelineHeader days={days} dayWidth={DAY_WIDTH} todayRef={todayRef} />

          {/* Today vertical line */}
          {todayIndex >= 0 && (
            <div
              className={styles.todayLine}
              style={{ left: todayIndex * DAY_WIDTH + DAY_WIDTH / 2 }}
            />
          )}

          {/* Todo lanes */}
          {todos.map((todo) => (
            <div key={todo.id} className={styles.laneRow}>
              <TodoLane todo={todo} mode="track" days={days} dayWidth={DAY_WIDTH} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
