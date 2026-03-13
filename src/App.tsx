import { TodoProvider, useTodos } from './state/TodoContext';
import { useDateChecker } from './hooks/useDateChecker';
import { Header } from './components/Header/Header';
import { TimelineView } from './components/Timeline/TimelineView';
import './index.css';

function AppContent() {
  const { todos, dispatch } = useTodos();
  useDateChecker(todos, dispatch);

  return (
    <div className="app">
      <Header />
      <main className="main">
        <TimelineView />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <TodoProvider>
      <AppContent />
    </TodoProvider>
  );
}
