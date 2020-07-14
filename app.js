const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const colors = require('colors');
const path = require('path');
const cors = require('cors');

// Load ENV variable
dotenv.config({ path: './config/config.env' });

// MongoDB FIle Import
const connectDB = require('./config/db');
// MongoDB connected
connectDB();

// Load Route Files
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/user');

const { adminAuth } = require('./middleware/check-auth');

const app = express();

// CORS
app.use(cors());

// Body Parser
app.use(express.json());

// Cookie parser middleware
app.use(cookieParser());

// Dev Logging Middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
const errorHandler = require('./middleware/error');

// File Upload

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

module.exports = app;
