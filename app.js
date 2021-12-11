'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const LoginController = require('./controllers/loginController');
const sessionAuth = require('./lib/sessionAuthMiddleware');
const jwtAuth = require('./lib/jwtAuthMiddleware');
const MongoStore = require('connect-mongo');
const controller = require('./controllers/upload')



// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   }
// })

// const upload = multer({ storage });


/* jshint ignore:start */
const db = require('./lib/connectMongoose');
/* jshint ignore:end */

// Cargamos las definiciones de todos nuestros modelos
require('./models/Anuncio');

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
// app.use(upload.array());
app.use(express.static('public'));
app.use(express.json());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Setup de i18n
const i18n = require('./lib/i18nConfigure');
const jwtAuthMiddleware = require('./lib/jwtAuthMiddleware');
app.use(i18n.init);
// Global Template variables
app.locals.title = 'NodePop';


//Setup de sesiones del Website
app.use(session({
  name: 'nodepop-session',
  secret: '`8#4>+P`kU<yK67D]Qr-"ACNcU^vRyJDzSRB{SWZm{Zf7,;X=9EqTZJ$jk.8.e+',
  saveUninitialized: true,
  resave: false,
  cookie: {
    maxAge: 100 * 60 * 60 * 24 * 2 // dos dias de inactividad
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_CONNECTION_STRING
  })

}));

//hacemos disponible la sesión en todas las vistas
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
})


// Rutas Website
const loginController = new LoginController();
app.use('/', require('./routes/index'));
app.use('/anuncios', sessionAuth, require('./routes/anuncios'));
app.use('/change-locale', require('./routes/change-locale'));


//Utilizamos concepto de controladores
app.get('/login', loginController.index);
app.post('/login', loginController.post);
app.get('/logout', loginController.logout);


// API 
app.use('/api/anuncios', jwtAuth, require('./routes/api/anuncios'));
// app.post('/api/anuncios', controller.upload, controller.uploadFile, require('./routes/api/anuncios'))
// app.use('/api/anuncios', jwtAuth, controller.upload,controller.uploadFile, require('./routes/api/anuncios'));
// app.post('/api/anuncios', jwtAuth, require('./routes/api/anuncios'),upload.single('foto'),(req, res) => {
//    if (!req.file) res.status(404).send({
//     success: false,
//     error: 'file not found'
//   });
//   return res.status(200).send({
//     success: true,
//     error: 'file uploaded'
//   })
// });
app.post('/api/authenticate', loginController.postJWT);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  
  if (err.array) { // validation error
    err.status = 422;
    const errInfo = err.array({ onlyFirstError: true })[0];
    err.message = isAPI(req) ?
      { message: 'not valid', errors: err.mapped()}
      : `not valid - ${errInfo.param} ${errInfo.msg}`;
  }

  // establezco el status a la respuesta
  err.status = err.status || 500;
  res.status(err.status);

  // si es un 500 lo pinto en el log
  if (err.status && err.status >= 500) console.error(err);
  
  // si es una petición al API respondo JSON...
  if (isAPI(req)) {
    res.json({ success: false, error: err.message });
    return;
  }

  // ...y si no respondo con HTML...

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('error');
});

function isAPI(req) {
  return req.originalUrl.indexOf('/api') === 0;
}

module.exports = app;
