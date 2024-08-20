const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false, // Disable logging if needed
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Necessary for some cloud providers
    }
  }
});

module.exports = sequelize;