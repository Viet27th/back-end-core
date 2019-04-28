const mongoose = require('../services/db_connector');
const examplePlugin = require('./plugins/example');
const bcrypt = require('bcrypt-nodejs');
/**
 * Reference about What is Schema, Model:
 * https://medium.freecodecamp.org/introduction-to-mongoose-for-mongodb-d2a7aa593c57
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User name required.'],
    minlength: 4,
    maxlength: 20,
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'User email required.'],
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'User password required.']
  },
  role: {
    type: String,
    trim: true,
    default: 'guest',
    enum: ['super', 'admin', 'editor', 'guest'],
    required: [true, 'User role required.']
  },
  soft_deleted: {
    type: Boolean,
    default: false
  },
  phone_number: {
    type: String,
    trim: true,
    minlength: 10,
    maxlength: 11,
    validate: {
      validator: function (v) {
        return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
  },
  avatar: {
    type: String,
    trim: true
  },
  meta_data: Object
}, {
  timestamps: true
});

// Use plugin
userSchema.plugin(examplePlugin);

// Use Mongoose Middleware
/**
 * Mongoose middleware (also called pre and post hooks).
 * Middleware execute before "save" an user.
 * Note:
 * Pre and post save() hooks are not executed on update(), findOneAndUpdate(), etc.
 * This hook execute after validate.
 * U may like to write it as a "plugin". Just change a bit: "userSchema.pre" to "schema.pre" in "plugin" function.
 */
userSchema.pre('save', function (next) {
  let err;
  if (this.password.length < 6) {
    err = new Error('Password must be at least 6 characters.');
    return next(err);
  }
  if (this.password.length > 95) {
    err = new Error('Password must not be greater than 95 characters.');
    return next(err);
  }
  this.password = bcrypt.hashSync(this.password);
  return next();
});

/**
 * Mongoose middleware (also called pre and post hooks).
 * Middleware execute before "update" an user.
 * Note:
 * This hook execute before validate => can't validate password length which is bcrypt before.
 */
userSchema.pre('findOneAndUpdate', function (next) {
  let err;
  if(this._update.password) {
    if (this._update.password.length < 6) {
      err = new Error('Password must be at least 6 characters.');
      return next(err);
    }
    if (this._update.password.length > 95) {
      err = new Error('Password must not be greater than 95 characters.');
      return next(err);
    }
  
    this._update.password = bcrypt.hashSync(this._update.password);
  }
  
  return next();
});

/**
 *
 * Create method for instance of Model Users. When execute query, don't user lean().
 * Refer: https://mongoosejs.com/docs/guide.html#methods
 * @type {{comparePassword: (function(string))}}
 */
userSchema.methods = {
  /**
   *
   * @param {string} candidatePassword - Real password which has not been encrypted.
   * @returns {boolean}
   */
  comparePassword: function (candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
  },
  
};

const Users = mongoose.model('Users', userSchema);

module.exports = Users;
