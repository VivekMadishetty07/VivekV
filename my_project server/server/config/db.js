'use strict'

const Sequelize = require('sequelize');
const env = require('./env');
const sequelize = new Sequelize(env.DATABASE_NAME, env.DATABASE_USERNAME, env.DATABASE_PASSWORD, {
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  dialect: env.DATABASE_DIALECT
});
//Checking connection status
sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully to database.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });
// Connect all the models/tables in the database to a db object,
//so everything is accessible via one object
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// //Models/tables
db.users = require('../models/users.js')(sequelize, Sequelize);
db.products = require('../models/products.js')(sequelize, Sequelize);
db.checkout = require('../models/checkout.js')(sequelize, Sequelize);
db.categories = require('../models/categories.js')(sequelize, Sequelize);

//Relations
db.products.belongsTo(db.users);
db.users.hasMany(db.products);
db.products.hasMany(db.checkout,{foreignKey : 'product_id'})
db.checkout.belongsTo(db.products, { as: 'product' });

module.exports = db;