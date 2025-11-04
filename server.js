require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Import models
const User = require('./models/User');
const Todo = require('./models/Todo');

// Import middleware
const { auth, isAdmin } = require('./middleware/auth');

const app = express();

// SECURITY MIDDLEWARE
// Helmet
app.use(helmet());

// CORS
app.use(cors());

// Rate Limiting: Giới hạn requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Giới hạn 100 requests/15 phút
  message: 'Too many requests, please try again later'
});
app.use('/api/', limiter);

app.use(express.json());

// DATABASE CONNECTION
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/todoapp';

mongoose.connect(MONGO_URI, { family: 4 })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// PUBLIC ROUTES
app.get('/', (req, res) => {
  res.json({ 
    message: 'Todo API with Authentication',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      todos: {
        getAll: 'GET /api/todos (protected)',
        create: 'POST /api/todos (protected)',
        update: 'PUT /api/todos/:id (protected)',
        delete: 'DELETE /api/todos/:id (protected)'
      }
    }
  });
});

// AUTH ROUTES
// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide all fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Tạo user mới (middleware sẽ tự động hash password)
    const user = new User({ name, email, password });
    await user.save();

    // Tạo JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT,
      { expiresIn: '7d' } // Token hết hạn sau 7 ngày
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Tìm user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Kiểm tra password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Lấy thông tin user đang login
app.get('/api/auth/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// TODO ROUTES
// Lấy tất cả todos của user hiện tại
app.get('/api/todos', auth, async (req, res) => {
  try {
    // Chỉ lấy todos của user đang login
    const todos = await Todo.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Tạo todo mới
app.post('/api/todos', auth, async (req, res) => {
  try {
    const { task } = req.body;
    if (!task) return res.status(400).json({ error: 'Task is required' });

    // Tạo todo với userId của user đang login
    const todo = new Todo({ 
      task, 
      userId: req.user.id 
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Cập nhật todo
app.put('/api/todos/:id', auth, async (req, res) => {
  try {
    const { task, done } = req.body;
    
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user.id });
    if (!todo) return res.status(404).json({ error: 'Todo not found' });

    if (task !== undefined) todo.task = task;
    if (done !== undefined) todo.done = done;
    await todo.save();

    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Xóa todo
app.delete('/api/todos/:id', auth, async (req, res) => {
  try {
    // Chỉ cho phép xóa todo của chính mình
    const todo = await Todo.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ADMIN ROUTES
// Lấy tất cả users (chỉ admin)
app.get('/api/admin/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Xóa user (chỉ admin)
app.delete('/api/admin/users/:id', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Xóa tất cả todos của user đó
    await Todo.deleteMany({ userId: req.params.id });
    
    res.json({ message: 'User and their todos deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Authentication enabled`);
  console.log(`Security: Helmet + Rate Limiting`);
});