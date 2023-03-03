const Sequelize = require("sequelize");
const db = require("../config/database");

class Favorites extends Sequelize.Model {}

Favorites.init(
  {
    mediaId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "favorites",   
  }
);

module.exports = Favorites;
