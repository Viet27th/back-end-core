/**
 * The goal of this file is create middleware for "routers".
 *
 */

const JWT = require('../services/jwt');
const userMiddleware = require('./api_users');

/**
 * Middleware authenticate
 * Refer:
 * https://medium.com/dev-bits/a-guide-for-adding-jwt-token-based-authentication-to-your-single-page-nodejs-applications-c403f7cf04f4
 * https://medium.com/@siddharthac6/json-web-token-jwt-the-right-way-of-implementing-with-node-js-65b8915d550e
 * https://stackoverflow.com/questions/12921658/use-specific-middleware-in-express-for-all-paths-except-a-specific-one
 */
exports.userAuthenticate = function (req, res, next) {
  
  // let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  // if (typeof token !== 'undefined') {
  //   if (token.startsWith('Bearer ')) {
  //     // Remove Bearer from string
  //     token = token.slice(7, token.length);
  //   }
  //
  //   try {
  //     res.locals.decoded = JWT.verify(token); // res.locals variable is available for the next middleware
  //     next();
  //   } catch (err) {
  //     return res.status(401).json({
  //       requestSuccessfully: false,
  //       message: err.message
  //     });
  //   }
  //
  // } else {
  //   return res.status(401).json({
  //     success: false,
  //     message: 'Auth token is not supplied.'
  //   });
  // }
  
  if(req.cookies.token) {
    try {
      res.locals.decoded = JWT.verify(req.cookies.token); // res.locals.decoded variable is available for the next middleware
      next();
    } catch (err) {
      return res.status(401).json({
        requestSuccessfully: false,
        message: err.message
      });
    }
  } else {
    return res.status(401).json({
      requestSuccessfully: false,
      message: 'Auth token is not supplied. You must be login.'
    });
  }

};

exports.userMiddleware = userMiddleware;
