import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { todoAPI } from '../services/api';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';

function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { user, logout } = useContext(AuthContext);

  // Fetch todos từ API
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const res = await todoAPI.getAll();
      setTodos(res.data);
    } catch (err) {
      console.error('Error loading todos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add todo
  const addTodo = async (task) => {
    try {
      const res = await todoAPI.create({ task });
      setTodos([res.data, ...todos]);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create todo');
    }
  };

  // Toggle done
  const toggleDone = useCallback(async (id, currentDone) => {
    try {
      const res = await todoAPI.update(id, { done: !currentDone });
      setTodos(prev => prev.map(t => t._id === id ? res.data : t));
    } catch (err) {
      alert('Failed to update todo');
    }
  }, []);

  // Edit todo
  const editTodo = useCallback(async (id, newTask) => {
    try {
      const res = await todoAPI.update(id, { task: newTask });
      setTodos(prev => prev.map(t => t._id === id ? res.data : t));
    } catch (err) {
      alert('Failed to update todo');
    }
  }, []);

  // Delete todo
  const deleteTodo = useCallback(async (id) => {
    try {
      await todoAPI.delete(id);
      setTodos(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      alert('Failed to delete todo');
    }
  }, []);

  // Filter todos
  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.done;
    if (filter === 'done') return t.done;
    return true;
  });

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <header>
        <h2>TODO List</h2>
        <div className="user-info">
          <span>Welcome, {user?.name}!</span>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </header>

      <TodoForm onAdd={addTodo} />

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
          Active ({todos.filter(t => !t.done).length})
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
            {filter === 'active' && 'No active tasks!'}
            {filter === 'done' && 'No completed tasks!'}
          </div>
        ) : (
          filteredTodos.map(item => (
            <TodoItem
              key={item._id}
              item={item}
              onToggle={toggleDone}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TodoPage;