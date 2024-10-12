const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const multer = require("multer");
const multipart = multer().none();

const indexRouter = require('./routes/index');
const signupRouter = require('./routes/signup.route');
const loginRouter = require('./routes/login.route');
const userRouter = require('./routes/user.route');
const logoutRouter = require('./routes/logout.route');
const companyRouter = require('./routes/company.route');
const profileRouter = require('./routes/profile.route');
const allClientRouter = require('./routes/allClient.route');
const teamRouter = require('./routes/teams.route');
const tokenService = require('./services/token.services');
const AuthController = require('./controller/authController');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(multipart);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/signup', signupRouter);
app.use('/api/login', loginRouter);


//implementing api request
app.use((request,response,next)=>{
  const token = tokenService.verifyToken(request);
  if(token.isVerified)
  {
    //is user valid
    next();
  }
  else
  {
    response.clearCookie('authToken'); 
    response.status(401);
    response.redirect('/');
  }
});

const autoLogger = ()=>{
  return async(request,response,next)=>{
    const isLogged = await AuthController.checkUserLog(request,response);
    if(isLogged)
    {
      next();
    }else{
      response.clearCookie('authToken'); 
      response.status(401);
      response.redirect('/');
    }
  }
}

app.use('/api/private/company', companyRouter);
app.use('/api/private/user', userRouter);
app.use('/logout', logoutRouter);
app.use('/allClient', allClientRouter);
app.use('/teams', teamRouter);
app.use('/profile',autoLogger(),profileRouter);

//catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
