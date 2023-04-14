var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//--------------------------------------------------------------------------------------------------------------------------------

// you need to add port address. 
// Just keep the code, only change the port number If you need.

var server = app.listen(8000)  

//---------------------------------------------------------------------------------------------------------------------------------

// Route 1 : localhost:8000/home
//---> get request route: home will sends the form page Page1.html

app.get('/home', (req, res) => {
  // res.sendFile will locate the file name 
  // And sends the Page1.html respond to the /home route request.
  res.sendFile('Page1.html', { root: __dirname });
});

//----------------------------------------------------------------------------------------------------------------------------------

// Route 2 : localhost:8000/store 
//---> this Post request route will store our values in the SQL Database
app.post('/store', (req, res) => {


  // step 1: JSON TO STRING
  // Converting incoming JSON VALUES TO JAVASCRIPT String objects

  const json = req.body;
  const obj = JSON.stringify(json);
  const obj_string = JSON.parse(obj);
  const obj_string1 = JSON.parse(obj);
  res.send(obj_string1.Name);

  // step 2:
  // SQLconnection
  
  var mysql = require('mysql');
  var con = mysql.createConnection({
      host: "127.0.0.1",
      user: "Your database_Username",
      password: "Your_Password",
      database: "Your database_name"
  });


  // step 3: SQL QUERY TO STORE THE DATA...
  // Updating Values using SQL Queries...

  con.connect(function (err) {
      if (err) throw err;
      console.log("Connected!");

      //The following Query will insert the values into TABLE named names... 
      //Note: values are Unknown. empty parameters name, value
      var sql = "INSERT INTO names (name, value) VALUES ?";
      
      // Already, input JSON values converted to strings , (refer STEP:1)
      // Now converted values Name & Petname are grouped into "values"
      var values = [[obj_string.Name, obj_string.Nickname]];

      //now the values are assigned into the Table
      con.query(sql, [values], function (err, result) {
          if (err) throw err;
          console.log("Successfully stored");
      });

      // You can also try all other SQL queries CRUD functions

  });

  });


//-----------------------------------------------------------------------------------------------------------------------



// catch 404 and forward to error handler
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
