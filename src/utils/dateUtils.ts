import { format, parseISO, differenceInCalendarDays, addDays, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Todo } from '../types/todo';

export function getToday(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function formatDateShort(dateStr: string): string {
  return format(parseISO(dateStr), 'M/d');
}

export function formatDateWithDay(dateStr: string): string {
  return format(parseISO(dateStr), 'M/d (EEE)', { locale: ko });
}

export function isWeekend(dateStr: string): boolean {
  const day = parseISO(dateStr).getDay();
  return day === 0 || day === 6;
}

export function isToday(dateStr: string): boolean {
  return dateStr === getToday();
}

export function getTimelineRange(todos: Todo[]): { start: string; end: string; days: string[] } {
  const today = getToday();

  if (todos.length === 0) {
    const start = format(subDays(new Date(), 3), 'yyyy-MM-dd');
    const end = format(addDays(new Date(), 10), 'yyyy-MM-dd');
    return { start, end, days: generateDays(start, end) };
  }

  const allDates = todos.flatMap((t) => [t.startDate, t.endDate]);
  allDates.push(today);

  const sorted = allDates.sort();
  const minDate = sorted[0];
  const maxDate = sorted[sorted.length - 1];

  const start = format(subDays(parseISO(minDate), 2), 'yyyy-MM-dd');
  const end = format(addDays(parseISO(maxDate), 3), 'yyyy-MM-dd');

  return { start, end, days: generateDays(start, end) };
}

function generateDays(start: string, end: string): string[] {
  const days: string[] = [];
  const total = differenceInCalendarDays(parseISO(end), parseISO(start));
  for (let i = 0; i <= total; i++) {
    days.push(format(addDays(parseISO(start), i), 'yyyy-MM-dd'));
  }
  return days;
}

export function dayIndex(days: string[], dateStr: string): number {
  return days.indexOf(dateStr);
}
