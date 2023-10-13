const {
  Model,
  DataTypes
} = require("sequelize");
const sequelize = require("../sequelize-client");

class Question extends Model {}

Question.init({
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  anecdote: {
    type: DataTypes.STRING
  },
  wiki: {
    type: DataTypes.STRING
  },
}, {
  sequelize,
  tableName: "question"
});

module.exports = Question;