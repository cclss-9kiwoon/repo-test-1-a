import { useCallback } from 'react';
import { formatDateShort, isToday, isWeekend } from '../../utils/dateUtils';
import styles from './TimelineHeader.module.css';

interface TimelineHeaderProps {
  days: string[];
  dayWidth: number;
  todayRef: React.MutableRefObject<HTMLDivElement | null>;
}

export function TimelineHeader({ days, dayWidth, todayRef }: TimelineHeaderProps) {
  const setTodayRef = useCallback(
    (el: HTMLDivElement | null) => {
      todayRef.current = el;
    },
    [todayRef]
  );

  return (
    <div className={styles.header}>
      {days.map((day) => {
        const today = isToday(day);
        const weekend = isWeekend(day);
        return (
          <div
            key={day}
            ref={today ? setTodayRef : undefined}
            className={`${styles.cell} ${today ? styles.today : ''} ${weekend ? styles.weekend : ''}`}
            style={{ width: dayWidth, minWidth: dayWidth }}
          >
            <span className={styles.date}>{formatDateShort(day)}</span>
          </div>
        );
      })}
    </div>
  );
}
