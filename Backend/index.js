require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const connectDB = require('./DB/Db.js');
const { errorHandler } = require('./middleware/errorHandler.js');

const userRouter = require("./Routes/UserRoute.js");
const adminRouter = require("./Routes/AdminRoute.js");
const orderRouter = require('./Routes/OrderRoute.js');
const serviceRouter = require('./Routes/serviceRoute.js');

// We will connect to MongoDB before starting the server below

app.use(cors({
    origin: function (origin, callback) {
        callback(null, origin || true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
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

// Start Server after connecting to DB
connectDB().then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});