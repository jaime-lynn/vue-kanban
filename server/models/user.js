let mongoose = require('mongoose')
mongoose.Promise = global.Promise;
let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId
let bcrypt = require('bcryptjs')
const SALT_FACTOR = 10
import { models } from '../config/constants'

let schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, dropDups: true },
  password: { type: String, required: true },
  created: { type: Number, required: true, default: Date.now() },
  // Relations
  // boards: [{ type: ObjectId, ref: models.board }],
  // lists: [{ type: ObjectId, ref: models.list }],
  // tasks: [{ type: ObjectId, ref: models.task }],
  // comments: [{ type: ObjectId, ref: models.comment }],
  // teams: [{ type: ObjectId, ref: models.team }]
})

schema.pre('save', function (next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
    if (err) {
      return next(err);
    } else {
      bcrypt.hash(user.password, salt, function (err, hash) {
        user.password = hash;
        next();
      });
    }
  });
});

schema.methods.validatePassword = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, function (err, isMatch) {
      if (err || !isMatch) {
        return reject(err);
      }
      return resolve(isMatch);
    });
  })
};




module.exports = mongoose.model(models.user.name, schema)