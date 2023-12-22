var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose')
var secrets = require('docker-secret').secrets;
var passport = require('passport')

// ROUTES:
// ??????

var db_url = "mongodb+srv://"+secrets.MONGO_USER+":"+secrets.MONGO_PASSWORD+"@"+secrets.MONGO_CLUSTER+".mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(db_url, {dbName: secrets.MONGO_DB_NAME , useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('open', function(){console.log("Conexão do Servidor de Autenticação ao MongoDB realizada com sucesso...")});
db.on('error', function(){console.log("Erro de conexão ao MongoDB...")});

// Configuração do passport
var Login = require('./models/login')
passport.use(Login.createStrategy())
passport.serializeLogin(Login.serializeLogin())
passport.deserializeLogin(Login.deserializeLogin())

var authRouter = require('./routes/auth');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', authRouter);

// catch 404 and forward to error handler
app.use('*', function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.jsonp({error: err.message});
});

module.exports = app;
