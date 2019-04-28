const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
const userSeeder = require('./seeds/fake_user');

/**
 *  With prefix 'api' before 'users', we know that, this router just using for interact with data known as GET, POST, PUT, DELETE
 *  Otherwise, router using for render HTML
 */
const usersRouter = require('./routes/api_users');

const app = express();
/* This middleware is use for security. It will set header appropriately */
app.use(helmet());
/* This middleware move all data come from client request to req.body to use */
app.use(bodyParser.json());
/* This middleware Parse Cookie header and populate req.cookies */
app.use(cookieParser());
/**
 * https://code.tutsplus.com/tutorials/token-based-authentication-with-angularjs-nodejs--cms-22543
 * Access-Control-Allow-Origin allowed for all domains.
 * You can send POST and GET requests to this service.
 * X-Requested-With and content-type headers are allowed.
 */
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

userSeeder.createAdminUser(); // Create Admin user when first run. You can remove this line after that.

app.use('/api/user', usersRouter);

module.exports = app;
