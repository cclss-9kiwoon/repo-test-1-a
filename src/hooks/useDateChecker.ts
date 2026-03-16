import { useEffect, type Dispatch } from 'react';
import { Todo, TodoAction } from '../types/todo';
import { getToday } from '../utils/dateUtils';

export function useDateChecker(todos: Todo[], dispatch: Dispatch<TodoAction>) {
  useEffect(() => {
    const check = () => {
      const today = getToday();
      const idsToComplete = todos
        .filter(
          (t) =>
            (t.status === 'in-progress' || t.status === 'paused') &&
            t.endDate <= today
        )
        .map((t) => t.id);

      if (idsToComplete.length > 0) {
        dispatch({ type: 'AUTO_COMPLETE', payload: { ids: idsToComplete } });
      }
    };

    check();
    const interval = setInterval(check, 60_000);
    return () => clearInterval(interval);
  }, [todos, dispatch]);
}
