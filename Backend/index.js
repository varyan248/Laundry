require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const connectDB = require('./DB/Db.js');
const { errorHandler } = require('./middleware/errorHandler.js');

const userRouter = require("./Routes/UserRoute.js");
const adminRouter = require("./Routes/AdminRoute.js");
const orderRouter = require('./Routes/orderRoute.js');
const serviceRouter = require('./Routes/serviceRoute.js');

// Connect to MongoDB
connectDB();

app.use(cors({
    origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Middleware
app.use(express.json());

// Router
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);
app.use('/api/orders', orderRouter);
app.use('/api/services', serviceRouter);

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});