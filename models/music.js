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
    // TODO: make a beforeCreate that pulls the album art url and sets it to albumImg
    // hooks: {
    //   beforeCreate: async (newUserData) => {
    //     newUserData.password = await bcrypt.hash(newUserData.password, 10);
    //     if (/^[a-zA-Z]$/.test(newUserData.name[0])) {
    //       newUserData.profileImg = newUserData.name[0].toLowerCase();
    //     } else {
    //       newUserData.profileImg = "default";
    //     }
    //     return newUserData;
    //   },
    // },
    sequelize,
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    modelName: "music",
  }
);
module.exports = Music;