import React, { useState, useMemo, useCallback } from 'react';
import TodoContext from './context/TodoContext';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';
import useLocalStorage from './hooks/useLocalStorage';
import './styles.css';

function App() {
  const [todos, setTodos] = useLocalStorage('todos_v2', []);
  const [filter, setFilter] = useState('all');

  // useCallback
  const toggleDone = useCallback((id) => {
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ));
  }, [setTodos]);

  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, [setTodos]);

  const editTodo = useCallback((id, newText) => {
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, text: newText } : t
    ));
  }, [setTodos]);

  // useMemo
  const filteredTodos = useMemo(() => {
    if (filter === 'active') {
      return todos.filter(t => !t.done);
    }
    if (filter === 'done') {
      return todos.filter(t => t.done);
    }
    return todos;
  }, [todos, filter]);

  // Context Provider
  return (
    <TodoContext.Provider value={{ setTodos }}>
      <div className="app">
        <header>
          <h2>TODO List</h2>
        </header>

        <TodoForm />

        <div className="filters">
          <button
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'active' : ''}
          >
            All ({todos.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={filter === 'active' ? 'active' : ''}
          >
            Unfinished ({todos.filter(t => !t.done).length})
          </button>
          <button
            onClick={() => setFilter('done')}
            className={filter === 'done' ? 'active' : ''}
          >
            Done ({todos.filter(t => t.done).length})
          </button>
        </div>

        <div className="todo-list">
          {filteredTodos.length === 0 ? (
            <div className="empty">
              {filter === 'all' && 'No tasks yet. Add one above!'}
              {filter === 'active' && 'No unfinished tasks!'}
              {filter === 'done' && 'No completed tasks!'}
            </div>
          ) : (
            filteredTodos.map(item => (
              <TodoItem
                key={item.id}
                item={item}
                onToggle={toggleDone}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))
          )}
        </div>
      </div>
    </TodoContext.Provider>
  );
}

export default App;