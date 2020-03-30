import { Sequelize } from 'sequelize-typescript';

// for connecting to databases in mysql workbunch
export { };

import { User } from './User';
import { UserInfo } from './UserInfo';
export const sequelize = new Sequelize({
    database: 'BoushabaMohamedProject',
    // dialect: 'sqlite',
    username: 'BoushabaMohamedProject',
    password: 'BoushabaMohamed',
    //storage: ':memory:',
    dialect: "mysql",
    host: 'localhost',
    //logging: false,
    //timestamps: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    models: [User, UserInfo],
});