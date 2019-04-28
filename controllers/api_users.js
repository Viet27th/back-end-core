const Users = require('../models/users');
const JWT = require('../services/jwt');
const regex = require('../services/regular-expression');
const expireTokenAndCookieLogin = 7*24*60*60*1000;

/**
 * Create a new user
 * @param req
 * @param res
 * @returns {*|Promise<any>}
 */
exports.addUser = (req, res) => {
  let userInfo = req.body;
  if (regex.regexEmail(userInfo.email)) {
    Users.findOne().where('email').equals(userInfo.email).select({
      password: false
    }).lean().exec((error, user) => {
      if (error) {
        console.log('Our err:', error);
        res.status(200).json({
          requestSuccessfully: false,
          message: error.message,
        });
      }
      // user is null if not found or is object if have a match result.
      if (user) {
        res.status(200).json({
          requestSuccessfully: false,
          message: 'Email is existed.',
        });
      } else {
        // Create a new user.
        let userDocument = {...userInfo};
        
        let user = new Users(userDocument);
        user.save(error => {
          if (error) {
            console.log('Our err:', error);
            return res.status(200).json({
              requestSuccessfully: false,
              message: error.message,
            });
          }
          
          res.status(200).json({
            requestSuccessfully: true,
            message: 'Created is successfully'
          });
          
        });
      }
      
    });
    
  } else {
    res.status(200).json({
      requestSuccessfully: false,
      message: 'Email is invalid.',
    });
  }
};

/**
 * Get an user not include password
 * lean(): increase performance. https://mongoosejs.com/docs/api.html#query_Query-lean
 * @param req
 * @param res
 */
exports.getUserById = (req, res) => {
  const id = req.params.id;
  
  Users.findById(id).select({
    password: false  // projection:  don't get password field.
  }).lean().exec((error, user) => {
    if (error) {
      console.log('Our err:', error);
      return res.status(200).json({
        requestSuccessfully: false,
        message: error.message
      });
    }
    if (user) {
      res.status(200).json({
        requestSuccessfully: true,
        message: 'Get user successfully.',
        data: user
      });
    } else {
      res.status(200).json({
        requestSuccessfully: false,
        message: 'User not found.'
      });
    }
    
  });
};

/**
 *
 * @param req
 * @param res
 */
exports.getAllUser = async (req, res) => {
  Users.paginate({}, {
    page: req.query.page,
    limit: req.query.limit,
    select: {password: false}
  }).then(result => {
    res.status(200).json({
      requestSuccessfully: true,
      message: 'Request is Successfully.',
      data: result
    });
  }).catch(error => {
    console.log('Our err:', error);
    res.status(200).json({
      requestSuccessfully: false,
      message: error.message
    });
  });
  
};

/**
 * Update user by Id and return user has been updated.
 * Options:
 * new: bool - true to return the modified document rather than the original.
 * runValidators: true - Default is false, do not validation with update action. https://stackoverflow.com/questions/15627967/why-mongoose-doesnt-validate-on-update
 * @param req
 * @param res
 */
exports.updateUserById = (req, res) => {
  const userInfo = req.body;
  // Don't change email, createdAt
  delete userInfo.email;
  delete userInfo.createdAt;
  
  Users.findOneAndUpdate({_id: userInfo.id}, userInfo, {new: true, runValidators: true}, (error, userUpdated) => {
    if (error) {
      console.log('Our err:', error);
      return res.status(200).json({
        requestSuccessfully: false,
        message: error.message
      });
    }
    
    if (userUpdated) {
      // Can't delete property of Object, which is generate from Prototype. Because, Object doesn't have property of itself.
      userUpdated = JSON.stringify(userUpdated);
      userUpdated = JSON.parse(userUpdated);
      delete userUpdated.password;
      
      res.status(200).json({
        requestSuccessfully: true,
        message: 'Updated successfully',
        data: userUpdated
      });
    } else {
      res.status(200).json({
        requestSuccessfully: false,
        message: 'User not found.'
      });
    }
  });
};

/**
 * Delete an user.
 * @param req
 * @param res
 */
exports.deleteUserById = (req, res) => {
  const id = req.params.id;
  Users.deleteOne().where('_id').equals(id).setOptions({single: true}).exec((error, user) => {
    if (error) {
      console.log('Our err:', error);
      return res.status(200).json({
        requestSuccessfully: false,
        message: error.message
      });
    }
    if (user.deletedCount) {
      return res.status(200).json({
        requestSuccessfully: true,
        message: 'Deleted Successfully.',
      });
    } else {
      return res.status(200).json({
        requestSuccessfully: false,
        message: `User doesn't exist.`,
      });
    }
    
  });
};

/**
 * Soft delete.
 * Just update "soft_deleted" field = true
 * @param req
 * @param res
 */
exports.softDeleteUserById = (req, res) => {
  const userId = req.body.id;
  Users.findOneAndUpdate({_id: userId}, {soft_deleted: true}, {
    new: true,
    runValidators: true
  }, (error, userUpdated) => {
    if (error) {
      console.log('Our err:', error);
      return res.status(200).json({
        requestSuccessfully: false,
        message: error.message
      });
    }
    
    if (userUpdated) {
      // Can't delete property of Object, which is generate from Prototype. Because, Object doesn't have property of itself.
      userUpdated = JSON.stringify(userUpdated);
      userUpdated = JSON.parse(userUpdated);
      delete userUpdated.password;
      
      res.status(200).json({
        requestSuccessfully: true,
        message: 'Soft delete successfully',
        data: userUpdated
      });
    } else {
      res.status(200).json({
        requestSuccessfully: false,
        message: 'User not found.'
      });
    }
  });
};

/**
 * Undo Soft delete.
 * Just update "soft_deleted" field = false
 * @param req
 * @param res
 */
exports.undoSoftDeleteUserById = (req, res) => {
  const userId = req.body.id;
  Users.findOneAndUpdate({_id: userId}, {soft_deleted: false}, {
    new: true,
    runValidators: true
  }, (error, userUpdated) => {
    if (error) {
      console.log('Our err:', error);
      return res.status(200).json({
        requestSuccessfully: false,
        message: error.message
      });
    }
    
    if (userUpdated) {
      // Can't delete property of Object, which is generate from Prototype. Because, Object doesn't have property of itself.
      userUpdated = JSON.stringify(userUpdated);
      userUpdated = JSON.parse(userUpdated);
      delete userUpdated.password;
      
      res.status(200).json({
        requestSuccessfully: true,
        message: 'Undo soft delete successfully',
        data: userUpdated
      });
    } else {
      res.status(200).json({
        requestSuccessfully: false,
        message: 'User not found.'
      });
    }
  });
};

/**
 * User login successfully -> token for this user generated and stored on cookie
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.webLoginTraditional = async (req, res) => {
  let userInfo = req.body;
  if (regex.regexEmail(userInfo.email)) {
    try {
      let query = Users.findOne(
        {
          email: userInfo.email.toLowerCase()
        }
      );
      let user_data = await query.exec(); // Will be "null" if query do not have any match result.
      
      if (user_data) {
        if (user_data.comparePassword(userInfo.password)) {
          if (!user_data.soft_deleted) {
            user_data = JSON.stringify(user_data);
            user_data = JSON.parse(user_data);
            delete user_data.password;
            
            // Create payload
            let payload = {
              user_data,
            };
            
            //
            let token = JWT.sign(payload, {expiresIn: `${expireTokenAndCookieLogin}`});
            // Clear and set new token on cookie. Clear cookie will set a new cookie expire but never remove cookie.
            res.clearCookie('token').cookie(
              'token', token, { maxAge: expireTokenAndCookieLogin, httpOnly: true, secure: false, encode: String } // If cookie expired, it will never being sent to server
            ).json({
              requestSuccessfully: true,
              message: 'Login successfully.',
              data: user_data
            });
            
          } else {
            res.json({
              requestSuccessfully: false,
              message: 'User has been soft deleted. Please contact us!'
            });
          }
        } else {
          res.json({
            requestSuccessfully: false,
            message: `Password doesn't match.`
          });
        }
      } else {
        res.json({
          requestSuccessfully: false,
          message: `User not found. Email doesn't exist.`
        });
      }
    } catch (error) {
      res.json({
        requestSuccessfully: false,
        message: error.message
      });
    }
    
  } else {
    res.status(200).json({
      requestSuccessfully: false,
      message: 'Email is invalid.',
    });
  }
};

exports.webLogoutTraditional = (req, res) => {
  res.clearCookie('token').json({
    requestSuccessfully: true,
    message: 'Logout is successfully.'
  });
};

exports.webRefreshTokenTraditional = async (req, res) => {
  if(req.cookies.token) {
    try {
      let decoded = JWT.verify(req.cookies.token);
      let query = Users.findById(decoded.user_data._id).select({
        password: false  // projection:  don't get password field.
      });
      let user_data = await query.lean().exec(); // Will be "null" if query do not have any match result.
      if(user_data) {
        // Create payload
        let payload = {
          user_data,
        };
  
        //
        let token = JWT.sign(payload, {expiresIn: `${expireTokenAndCookieLogin}`});
        res.clearCookie('token').cookie(
          'token', token, { maxAge: expireTokenAndCookieLogin, httpOnly: true, secure: false, encode: String } // If cookie expired, it will never being sent to server
        ).json({
          requestSuccessfully: true,
          message: 'Refresh token successfully.',
          data: user_data
        });
      } else {
        res.clearCookie('token')
          .clearCookie('isLogin')
          .json({
            requestSuccessfully: false,
            message: `User does't exist. May be deleted on system.`
          });
      }
    } catch (err) {
      res.json({
        requestSuccessfully: false,
        message: err.message
      });
    }
  } else {
    res.json({
      requestSuccessfully: false,
      message: 'Header Cookies.token is not supply. You must be login again.',
    });
  }
};
