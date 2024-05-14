const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
class Rating extends Model { }
Rating.init(
    {
        id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
        },
        rating: {
        type: DataTypes.INTEGER,
        allowNull: false
        },
        user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'user',
            key: 'id'
        }
        },
        // might have to change to song id
        music_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'music',
            key: 'id'
        },
        },
        // artist_id: {
        //     type: DataTypes.INTEGER,
        //     references: {
        //         model: 'artist',
        //         key: 'id'
        //     },
        // },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'rating'
    }
);
module.exports = Rating;