const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');


const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const municipalityRouter = require('./routes/municipioRoutes');
const placeRouter = require('./routes/viviendaRoutes');
const departmentRouter = require('./routes/departamentoRoutes');
const viewRouter = require('./routes/viewRoutes');



const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// 1) GLOBAL MIDDLEWARES
// Implement CORS
app.use(cors());

app.options('*', cors());

// Serving static files
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

// app.use(express.json({ limit: '10kb' }));
app.use(express.json());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/municipalities', municipalityRouter);
app.use('/api/v1/departments', departmentRouter);
app.use('/api/v1/places', placeRouter);


app.all('*', (req, res, next) => {
  next(new AppError(`No se pudo encontrar ${req.originalUrl} en este servidor!`, 404));
});


app.use(globalErrorHandler);

module.exports = app;