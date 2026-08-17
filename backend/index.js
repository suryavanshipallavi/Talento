// import Express
const express = require('express');
const cors = require('cors');
const path = require('path'); // ✅ Don't forget to import this!

// Import Routers
const userRouter = require('./router/userRouter');
const companyRouter = require('./router/companyRouter');
const interviewRouter = require('./router/interviewRouter');
const utilRouter = require('./router/util');
const contactRouter = require('./router/contactRouter');
const feedbackRouter = require('./router/feedbackRouter');
const applyRouter = require('./router/applyRouter');

// Initialize express
const app = express();
const port = 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// ✅ Serve static files from uploads (for resume file access)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/user', userRouter);
app.use('/company', companyRouter);
app.use('/jobpost', interviewRouter);
app.use('/util', utilRouter);
app.use('/feedback', feedbackRouter);
app.use('/contact', contactRouter);
app.use('/apply', applyRouter);

// Test route
app.get('/add', (req, res) => {
  res.send('Response from add');
});

// Start server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
