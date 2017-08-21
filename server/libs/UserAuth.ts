import * as jwt from 'jsonwebtoken';
import { User, IUser } from '../db/mongo/models/User';

interface UserAuth {
  register(name: string, password: string): Promise<string>;
  login(name: string, password: string): Promise<string>;
  isAuthorized(name: string): Promise<any>;
}

class MongoUserAuth implements UserAuth {
  register(name: string, password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!name || !password) {
        reject('Name and password are both required!');
        return;
      }

      User
        .create({ name, password })
        .then((user: IUser) => {
          resolve(user.generateJwt());
        })
        .catch((error) => {
          if (error.code === 11000 && error.name === 'MongoError') {
            reject('Use already exists!');
          } else {
            reject(error.message);
          }
        });
    });
  }

  login(name: string, password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!name || !password) {
        reject('Name or password are both required!');
        return
      }

      User
        .findOne({ name })
        .then((user) => {
          if (!user) {
            reject('User not found!');
            return;
          }
          if (!user.authenticate(password)) {
            reject('Incorrect password!');
            return;
          }
          resolve(user.generateJwt());
        })
        .catch(error => reject(error.message));
    });
  }

  isAuthorized(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JwtSecret, (err, decoded) => {
        if (err) {
          reject('invalid token');
        } else {
          resolve(decoded);
        }
      });
    });
  }
}

export default new MongoUserAuth();

