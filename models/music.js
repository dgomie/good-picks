const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
class Music extends Model {}
Music.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    artist_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "artist",
        key: "id",
      },
    },
    album: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Genre",
    },
    albumImg: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },

  {
    sequelize,
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    modelName: "music",
    indexes: [
      {
        unique: true,
        fields: ["title", "album"],
      },
    ],
  }
);
module.exports = Music;
