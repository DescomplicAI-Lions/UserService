const { Sequelize } = require('sequelize');

//não conecta de verdade
const sequelize = new Sequelize('example_db', 'user', 'password', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;
