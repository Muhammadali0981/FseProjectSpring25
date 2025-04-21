const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

// Load environment variables
dotenv.config();

// Validate environment variables
try {
  const validateEnv = require('./config/validateEnv');
  validateEnv();
} catch (error) {
  console.warn('Environment validation skipped:', error.message);
}

// Import routes
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const requestRoutes = require('./routes/requests');
const adminRoutes = require('./routes/admin');
const studentRoutes = require('./routes/student');
const generalRoutes = require('./routes/general');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing and sanitization
app.use(express.json());
app.use(mongoSanitize());

// Connect to MongoDB with proper options
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/library', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api', generalRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 