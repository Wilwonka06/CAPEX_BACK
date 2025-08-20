const Client = require('./Client');
const User = require('../users/User');

// Define associations
Client.belongsTo(User, {
  foreignKey: 'id_user',
  as: 'user'
});

User.hasOne(Client, {
  foreignKey: 'id_user',
  as: 'client'
});

module.exports = {
  Client,
  User
};
