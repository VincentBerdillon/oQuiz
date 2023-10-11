const { DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize-client");

class Tag extends Model {}

Tag.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  tableName: "tag"
});

module.exports = Tag;
