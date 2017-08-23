import * as _ from 'lodash';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import * as jwt from 'jsonwebtoken';
import * as Sequelize from 'sequelize';

/*
export interface IUserAttributes {
  name: string;
  password: string;
  role: string;
};

export interface IUserInstance extends Sequelize.Instance<IUserAttributes> {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  associate(any): void;
  generateJwt(): any;
  authenticate(string): any;
}
*/
function hashPassword(password) {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): any => {
  const User: any = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'USER',
    },
  }, {
    hooks: {
      beforeCreate(user: any) {
        user.password = hashPassword(user.password);
      },
      beforeUpdate(user, options: any) {
        const fields = options.fields;
        if (_.includes(fields, 'password')) {
          user.password = hashPassword(user.password);
        }
      },
    },
  });

  /* class methods */
  User.associate = function (models) {
    console.log(models);
  };

  /* instance methods */
  User.prototype.authenticate = function (password) {
    return bcrypt.compareSync(password, this.password);
  }
  User.prototype.generateJwt = function () {
    return jwt.sign({
      role: this.role,
      sub: this.id,
      iss: 'default.cxwcfea.com',
      iat: moment().unix(),
      exp: moment().add(7, 'days').unix(),
    }, process.env.JwtSecret);
  }

  return User;
};
