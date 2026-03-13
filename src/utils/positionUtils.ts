import { differenceInCalendarDays, parseISO } from 'date-fns';
import { Todo } from '../types/todo';
import { getToday } from './dateUtils';

export function getCharacterPosition(todo: Todo): number {
  const start = parseISO(todo.startDate);
  const end = parseISO(todo.endDate);
  const totalSpan = differenceInCalendarDays(end, start);

  if (totalSpan <= 0) return 100;

  switch (todo.status) {
    case 'waiting':
      return 0;

    case 'in-progress': {
      const today = parseISO(getToday());
      const elapsed = differenceInCalendarDays(today, start);
      return Math.min(Math.max((elapsed / totalSpan) * 100, 0), 100);
    }

    case 'paused': {
      if (!todo.pausedAtDate) return 0;
      const pausedDate = parseISO(todo.pausedAtDate);
      const elapsed = differenceInCalendarDays(pausedDate, start);
      return Math.min(Math.max((elapsed / totalSpan) * 100, 0), 100);
    }

    case 'done':
      return 100;
  }
}

export function isPausedDatePast(todo: Todo): boolean {
  if (todo.status !== 'paused' || !todo.pausedAtDate) return false;
  return todo.pausedAtDate < getToday();
}
