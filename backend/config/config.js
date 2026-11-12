require('dotenv').config();

module.exports = {
    development: {
        username: 'root',
        password: process.env.DB_PASSWORD,
        database: 'users',
        host: 'localhost',
        dialect: 'mysql',
        logging: false
    }
};
