import * as mongoose from 'mongoose';
import * as moment from 'moment';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import defaultPlugin from '../plugin';

export interface IUser {
  name: string;
  password: string;
  role: Array<string>;
  generateJwt(): any;
  authenticate(string): any;
};

interface IUserModel extends IUser, mongoose.Document {};

function hashPassword(password) {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    set: hashPassword,
    required: true,
  },
  role: {
    type: [String],
    default: ['USER'],
  },
}, {
  toJSON: {
    transform(doc, ret/* , options */) {
      delete ret.password;
    },
  },
});

userSchema.methods.authenticate = function authenticate(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateJwt = function generateJwt() {
  return jwt.sign({
    role: this.role,
    sub: this.id,
    iss: 'default.cxwcfea.com',
    iat: moment().unix(),
    exp: moment().add(7, 'days').unix(),
  }, process.env.JwtSecret);
};

userSchema.plugin(defaultPlugin);

export const User = mongoose.model<IUserModel>('User', userSchema);
