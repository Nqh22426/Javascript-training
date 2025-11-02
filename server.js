require('dotenv').config(); // Đọc file .env
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

let todos = [];
let nextId = 1;

// Route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Lấy danh sách tất cả todo
app.get('/todos', (req, res) => {
  res.json(todos);
});

// Thêm todo mới
app.post('/todos', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });

  const newTodo = { id: nextId++, text, done: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Cập nhật todo
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { text, done } = req.body;
  const todo = todos.find(t => t.id === id);

  if (!todo) return res.status(404).json({ error: 'Todo not found' });

  if (text) todo.text = text;
  if (typeof done === 'boolean') todo.done = done;

  res.json(todo);
});

// Xóa todo
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter(t => t.id !== id);
  res.json({ message: 'Deleted successfully' });
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));