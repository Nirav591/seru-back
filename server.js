const express = require('express');
const cors = require('cors');
const app = express();

// Your secret access key
const accessKey = 'solid-black';

// CORS: allow only your frontend
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-key']
}));

app.use(express.json());

// ✅ Access Key Middleware
app.use('/api', (req, res, next) => {
  const clientKey = req.headers['x-access-key'];
  if (!clientKey || clientKey !== accessKey) {
    return res.status(403).json({ message: 'Forbidden: Invalid access key' });
  }
  next();
});

// ✅ Routes
const chapterRoutes = require('./routes/chapter.routes');
const questionRoutes = require('./routes/question.routes');
const examRoutes = require('./routes/exam.routes');

app.use('/api', chapterRoutes);
app.use('/api', questionRoutes);
app.use('/api', examRoutes);

// ✅ Server Start
const PORT = 6340;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));