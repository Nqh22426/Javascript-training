import React, { useState, useRef } from 'react';

function TodoForm({ onAdd }) {
  const [task, setTask] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const trimmed = task.trim();
    
    // Validation
    if (!trimmed) {
      setError('Task cannot be empty!');
      return;
    }
    
    if (trimmed.length < 3) {
      setError('Task must be at least 3 characters!');
      return;
    }

    // Add todo
    onAdd(trimmed);
    
    // Reset
    setTask('');
    setError('');
    inputRef.current.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="form-row">
        <input
          type="text"
          ref={inputRef}
          placeholder="Type your task..."
          value={task}
          onChange={(e) => {
            setTask(e.target.value);
            setError('');
          }}
          className={error ? 'error' : ''}
        />
        <button type="submit">Add</button>
      </div>
      {error && <div className="error-message">{error}</div>}
    </form>
  );
}

export default TodoForm;