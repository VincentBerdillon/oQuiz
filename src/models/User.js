const {
  Model,
  DataTypes
} = require("sequelize");
const sequelize = require("../sequelize-client");

class User extends Model {}

User.init({
  firstname: {
    type: DataTypes.STRING
  },
  lastname: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  tableName: "user"
});


module.exports = User;