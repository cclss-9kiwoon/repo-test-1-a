import { Todo } from '../../types/todo';
import { getCharacterPosition, isPausedDatePast } from '../../utils/positionUtils';
import { Standing } from './poses/Standing';
import { Running } from './poses/Running';
import { Sitting } from './poses/Sitting';
import styles from './Character.module.css';

interface CharacterProps {
  todo: Todo;
  color: string;
}

export function Character({ todo, color }: CharacterProps) {
  const position = getCharacterPosition(todo);
  const pastPaused = isPausedDatePast(todo);

  const getAnimationClass = () => {
    switch (todo.status) {
      case 'waiting': return styles.breathing;
      case 'in-progress': return styles.running;
      case 'paused': return pastPaused ? styles.sitting : styles.breathing;
      case 'done': return styles.landed;
    }
  };

  const renderPose = () => {
    switch (todo.status) {
      case 'waiting':
        return <Standing color={color} />;
      case 'in-progress':
        return <Running color={color} />;
      case 'paused':
        return pastPaused ? <Sitting color={color} showCheck={false} /> : <Standing color={color} />;
      case 'done':
        return <Sitting color={color} showCheck={true} />;
    }
  };

  return (
    <div
      className={`${styles.characterWrapper} ${getAnimationClass()}`}
      style={{ left: `${position}%` }}
    >
      {renderPose()}
    </div>
  );
}
