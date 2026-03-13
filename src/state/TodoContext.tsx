import { createContext, useContext, useReducer, useEffect, type ReactNode, type Dispatch } from 'react';
import { Todo, TodoAction } from '../types/todo';
import { todoReducer } from './todoReducer';

const STORAGE_KEY = 'animated-todo-list';

function loadTodos(): Todo[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Todo[];
  } catch {
    return [];
  }
}

interface TodoContextType {
  todos: Todo[];
  dispatch: Dispatch<TodoAction>;
}

const TodoContext = createContext<TodoContextType | null>(null);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, dispatch] = useReducer(todoReducer, [], loadTodos);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  return (
    <TodoContext.Provider value={{ todos, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
}
