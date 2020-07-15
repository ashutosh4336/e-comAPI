const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const colors = require('colors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const hpp = require('hpp');
const fs = require('fs');
const Razorpay = require('razorpay');
const mongoSanitize = require('express-mongo-sanitize');

// Load ENV variable
dotenv.config({ path: './config/config.env' });

// MongoDB FIle Import
const connectDB = require('./config/db');
// MongoDB connected
connectDB();

// Load Route Files
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/user');

const { adminAuth } = require('./middleware/check-auth');

const app = express();

// CORS
app.use(cors());

// Sanitize Data
app.use(mongoSanitize());

// Prevent HTTP Parameter Poluution Attack
app.use(hpp());

// Rate Limiting per 10 min
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 80, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

const razorPay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post('/razorpay', (req, res) => {
  razorPay.orders.create({
    amount,
    currency,
    receipt,
    payment_capture,
  });
});

// Body Parser
app.use(express.json());

// Cookie parser middleware
app.use(cookieParser());

// Dev Logging Middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Detailed Logging in Production
// const accessLogStream = fs.createWriteStream({
//     path.join(__dirname, 'log/access.log'),
//     {flag: 'a'}
// })
// if (process.env.NODE_ENV === 'production') app.use(morgan('combined', {
//     stream: accessLogStream
// }));

const errorHandler = require('./middleware/error');

// File Upload
app.use(fileupload());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

module.exports = app;
