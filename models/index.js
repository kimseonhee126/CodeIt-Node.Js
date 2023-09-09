const Sequelize = require('sequelize');
const config = require('../config/config.json');

// const { username, password, database, host, dialect } = config.development;
const sequelize = new Sequelize('####', 'root', '####', {
  host: '127.0.0.1',
  dialect: 'mysql',
  port: "####",
});

const Member = require('./member')(sequelize, Sequelize.DataTypes);

const db = {};
db.Member = Member;

module.exports = db;
