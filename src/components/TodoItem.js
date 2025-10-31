import React, { useState, useEffect, useRef } from 'react';

function TodoItem({ item, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(item.text);
  const inputRef = useRef();

  // useEffect
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleSave = () => {
    const trimmedText = text.trim();
    if (trimmedText) {
      onEdit(item.id, trimmedText);
      setEditing(false);
    }
  };

  const handleCancel = () => {
    setText(item.text); // Reset về text cũ
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
        onChange={() => onToggle(item.id)}
      />
      
      <div className="text">
        {editing ? (
          <input
            type="text"
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        ) : (
          <span style={{ textDecoration: item.done ? 'line-through' : 'none' }}>
            {item.text}
          </span>
        )}
        <div className="timestamp">
          Created: {new Date(item.createdAt).toLocaleString()}
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
            <button onClick={() => onDelete(item.id)} className="btn-delete">
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TodoItem;