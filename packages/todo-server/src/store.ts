import { Todo } from "./types.js";

// 간단한 인메모리 저장소
// 실제 서비스라면 DB를 사용하겠지만, 학습 목적으로 메모리에 저장합니다.
class TodoStore {
  private todos: Map<string, Todo> = new Map();
  private nextId: number = 1;

  private generateId(): string {
    return `todo-${this.nextId++}`;
  }

  list(): Todo[] {
    return Array.from(this.todos.values());
  }

  get(id: string): Todo | undefined {
    return this.todos.get(id);
  }

  create(title: string, description: string = ""): Todo {
    const now = new Date().toISOString();
    const todo: Todo = {
      id: this.generateId(),
      title,
      description,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    this.todos.set(todo.id, todo);
    return todo;
  }

  update(
    id: string,
    updates: { title?: string; description?: string; completed?: boolean }
  ): Todo | null {
    const todo = this.todos.get(id);
    if (!todo) return null;

    const updatedTodo: Todo = {
      ...todo,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.todos.set(id, updatedTodo);
    return updatedTodo;
  }

  delete(id: string): boolean {
    return this.todos.delete(id);
  }

  listByStatus(completed: boolean): Todo[] {
    return this.list().filter((todo) => todo.completed === completed);
  }

  getSummary(): { total: number; completed: number; pending: number } {
    const all = this.list();
    const completed = all.filter((t) => t.completed).length;
    return {
      total: all.length,
      completed,
      pending: all.length - completed,
    };
  }
}

// 싱글톤 인스턴스 (서버가 살아있는 동안 유지)
export const todoStore = new TodoStore();
