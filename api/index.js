const express = require('express');
const app = express();
// const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const port = process.env.PORT;

const categoryRoutes = require('./src/routes/category');
const customerRoutes = require('./src/routes/customer');
const vendorRoutes = require('./src/routes/vendor');
const productRoutes = require('./src/routes/product');
const staffRoutes = require('./src/routes/staff');
const expenseRoutes = require('./src/routes/expense');
const userRoutes = require('./src/routes/user');

mongoose.connect('mongodb+srv://santosh2686:Santosh@2686c@cluster0.qsr8p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
    useFindAndModify: false
});

// mongoose.set('useCreateIndex', true)

// app.use(morgan('dev')); //Request Logging
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.json()); // Make sure it comes back as json

// Handling CORS requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  // instead of * we can specify the domain for which we need access. (* means global)
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === 'OPTIONS') {
    res.header("Access-Control-Allow-Methods",
      "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next()
});

//Routes which should handle requests
app.use('/category', categoryRoutes);
app.use('/customer', customerRoutes);
app.use('/product', productRoutes);
app.use('/vendor', vendorRoutes);
app.use('/staff', staffRoutes);
app.use('/expense', expenseRoutes)
app.use('/user', userRoutes);

// Error Handling
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json(error)
});

app.listen(port, () => {
  console.log('Application Running on port: ' + port);
});

// mongodb+srv://santosh2686:<password>@manage-store-qsr8p.mongodb.net/test?retryWrites=true&w=majority