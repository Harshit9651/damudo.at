const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

 const Constants = require('./helper/constent.js');
 const authenticateToken = require('./Auth/auth.js')
const path = require('path');
const cors = require('cors');
require('./server/databaseconnection.js');
dotenv.config();

const app = express();
const { SESSION_SECRET, PORT } = process.env;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/styles', express.static(path.join(__dirname, 'style')));
app.use('/lib', express.static(path.join(__dirname, 'lib')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: Constants.Cookie_max_age, // 1 day
  },
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: Constants.LIMIT_MAX_LIMIT,
  message: Constants.LIMITER_NOTIFICATION,
});
app.use(limiter);

// Start the server
app.listen(PORT, () => {
  console.log(Constants.serverConnection_status,PORT);
});

app.get('/',(req,res)=>{
    res.render('index.ejs')
})