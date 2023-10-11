const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize-client");

class Answer extends Model {}

Answer.init({
  description: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  tableName: "answer"
});


module.exports = Answer;
