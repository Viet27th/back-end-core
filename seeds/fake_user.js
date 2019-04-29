const Users = require('../models/users');

exports.createAdminUser = () => {
  let userInfo = {
    name: 'Xuan Viet',
    email: 'tobecool@gmail.com',
    password: '123456',
    role: 'super'
  };
  Users.findOne().where('email').equals(userInfo.email).select({
    password: false
  }).lean().exec((error, user) => {
    if (error) {
      console.log('Our err:', error);
    }
    // user is null if not found or is object if have a match result.
    if (user) {
      console.log(`Id: ${user._id}. Super Admin is already. It's time to sleep!`);
    } else {
      // Create a new user.
      let user = new Users(userInfo);
      user.save((error, user) => {
        if (error) {
          console.log('Our err:', error);
        }
        console.log(`Id: ${user._id}. Created Supper Admin is successfully. It's time to sleep!`);
      });
    }
  });
};
