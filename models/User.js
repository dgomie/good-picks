const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');
class User extends Model {
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [8],
            },
        },
        profileId: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isAlpha: true,
            },
        },
    },
    {
        hooks: {
            beforeCreate: async (newUserData) => {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                // const firstLetter = newUserData.name[0].toLowerCase();
                newUserData.profileId = newUser.name[0].toLowerCase();
            //     const alphabet =  ['a', 'b','c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's','t', 'u', 'v', 'w', 'x', 'y', 'z'];
            //     const firstLetter = newUser.name[0].toLowerCase();
            //     const position = alphabet.indexOf(firstLetter);
            //   if(position === 0){

            //   }else if(position === 1){

            //   }else if(position === 2){

            //   }else if(position === 3){

            //   }else if(position === 4){

            //   }else if(position === 5){

            //   }else if(position === 6){

            //   }else if(position === 7){

            //   }else if(position === 8){

            //   }else if(position === 9){

            //   }else if(position === 10){

            //   }else if(position === 11){

            //   }else if(position === 12){

            //   }else if(position === 13){

            //   }else if(position === 14){

            //   }else if(position === 15){

            //   }else if(position ===16){

            //   }else if(position === 17){

            //   }
                return newUserData;
            },
        },
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'user',
    }
);
module.exports = User;















