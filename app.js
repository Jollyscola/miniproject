var connect = require("./dbConnect");
const port = 3006
var bodyParser = require('body-parser');
connect(require("./settings").DEV_DB_URI);




var loginfades = require("./facades/loginfades");
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const featureCollection = require("./allowedArea");
const polygon = featureCollection.features[0].geometry;

const gju = require("geojson-utils");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.get('/api/login/:username/:password/:longitude/:latitude/:distance', function (req, res) {

  console.log("i start")
  const username = req.params.username;
  const password = req.params.password;
  const longitude = req.params.longitude;
  const latitude = req.params.latitude;
  const distance = req.params.distance;
  loginfades.login(username, password, longitude, latitude, distance).then((s) => {
    res.json(s);
  })
})
app.post('/geoapi', function(req, res) {
  const location = req.body;
  console.log(location);
  let isInside = gju.pointInPolygon(location,polygon);
  let result = {};
  result.status = isInside;
  let msg = isInside ? "Point was inside the tested polygon":
                       "Point was NOT inside tested polygon";
  result.msg = msg;
  res.json(result);
});

polygonForClient = {};
polygonForClient.coordinates = polygon.coordinates[0].map(point => {
  return {latitude: point[1],longitude: point[0]}
})
app.get("/geoapi/allowedarea",(req,res)=>{
  res.json(polygonForClient);
});


/* app.get('api/getGameArea', function(req,res){


  
}) */

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app;
