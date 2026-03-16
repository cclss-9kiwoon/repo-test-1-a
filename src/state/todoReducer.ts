import { Todo, TodoAction } from '../types/todo';

export function todoReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          id: crypto.randomUUID(),
          title: action.payload.title,
          startDate: action.payload.startDate,
          endDate: action.payload.endDate,
          status: 'waiting',
          pausedAtDate: null,
          createdAt: new Date().toISOString(),
        },
      ];

    case 'PLAY':
      return state.map((todo) =>
        todo.id === action.payload.id && todo.status === 'waiting'
          ? { ...todo, status: 'in-progress' as const }
          : todo
      );

    case 'PAUSE':
      return state.map((todo) =>
        todo.id === action.payload.id && todo.status === 'in-progress'
          ? { ...todo, status: 'paused' as const, pausedAtDate: action.payload.currentDate }
          : todo
      );

    case 'RESUME':
      return state.map((todo) =>
        todo.id === action.payload.id && todo.status === 'paused'
          ? { ...todo, status: 'in-progress' as const, pausedAtDate: null }
          : todo
      );

    case 'COMPLETE':
      return state.map((todo) =>
        todo.id === action.payload.id && todo.status !== 'done'
          ? { ...todo, status: 'done' as const, pausedAtDate: null }
          : todo
      );

    case 'AUTO_COMPLETE':
      return state.map((todo) =>
        action.payload.ids.includes(todo.id) && todo.status !== 'done'
          ? { ...todo, status: 'done' as const, pausedAtDate: null }
          : todo
      );

    case 'DELETE_TODO':
      return state.filter((todo) => todo.id !== action.payload.id);

    case 'LOAD':
      return action.payload;

    default:
      return state;
  }
}
