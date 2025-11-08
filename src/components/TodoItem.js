import React, { useState, useEffect, useRef } from 'react';

function TodoItem({ item, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [task, setTask] = useState(item.task);
  const inputRef = useRef();

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleSave = () => {
    const trimmed = task.trim();
    if (trimmed && trimmed !== item.task) {
      onEdit(item._id, trimmed);
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setTask(item.task);
    setEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="todo">
      <input
        type="checkbox"
        checked={item.done}
        onChange={() => onToggle(item._id, item.done)}
      />
      
      <div className="text">
        {editing ? (
          <input
            type="text"
            ref={inputRef}
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        ) : (
          <span style={{ textDecoration: item.done ? 'line-through' : 'none' }}>
            {item.task}
          </span>
        )}
        <div className="timestamp">
          {new Date(item.createdAt).toLocaleString()}
        </div>
      </div>

      <div className="actions">
        {editing ? (
          <>
            <button onClick={handleSave} className="btn-save">
              Save
            </button>
            <button onClick={handleCancel} className="btn-cancel">
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setEditing(true)} className="btn-edit">
              Edit
            </button>
            <button onClick={() => onDelete(item._id)} className="btn-delete">
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TodoItem;