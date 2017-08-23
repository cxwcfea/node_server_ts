import * as Sequelize from 'sequelize';
import User from './models/User';

/*
interface DbConnection {
  User: Sequelize.Model<any, any>;
}
*/

class MysqlConnector {
  public sequelize: Sequelize.Sequelize;
  public models: any;

  constructor() {
    this.sequelize = new Sequelize(
      process.env.MysqlDB,
      process.env.MysqlName,
      process.env.MysqlPass,
      {
        host: process.env.MysqlHost,
        port: Number.parseInt(process.env.MysqlPort, 10),
        dialect: 'mysql',
        dialectOptions: {
          socketPath: '/tmp/mysql.sock',
        },
        define: {
          underscored: true,
        },
        logging: false,
      },
    );

    this.models = {
      User: User(this.sequelize, Sequelize),
    };

    Object.keys(this.models).forEach(key => {
      this.models[key].associate(this.models);
    });
  }
}

export default new MysqlConnector();
