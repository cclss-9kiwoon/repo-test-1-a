export type TodoStatus = 'waiting' | 'in-progress' | 'paused' | 'done';

export interface Todo {
  id: string;
  title: string;
  startDate: string;       // 'YYYY-MM-DD'
  endDate: string;          // 'YYYY-MM-DD'
  status: TodoStatus;
  pausedAtDate: string | null;
  createdAt: string;
}

export type TodoAction =
  | { type: 'ADD_TODO'; payload: { title: string; startDate: string; endDate: string } }
  | { type: 'PLAY'; payload: { id: string } }
  | { type: 'PAUSE'; payload: { id: string; currentDate: string } }
  | { type: 'RESUME'; payload: { id: string } }
  | { type: 'COMPLETE'; payload: { id: string } }
  | { type: 'AUTO_COMPLETE'; payload: { ids: string[] } }
  | { type: 'DELETE_TODO'; payload: { id: string } }
  | { type: 'LOAD'; payload: Todo[] };
