const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRouter = require('./src/routes/auth');
const userRouter = require('./src/routes/users');
const productRouter = require('./src/routes/product');
const categoryRouter = require('./src/routes/category');
const voucherRouter = require('./src/routes/voucher');
const orderRouter = require('./src/routes/order');
const uploadRouter = require('./src/routes/upload');

dotenv.config();
const app = express();

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/vouchers', voucherRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouter);

app.use('/api/v1/upload', uploadRouter);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

