const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    cardId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "cardId"
    },
    cardPwd: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "cardPwd"
    },
    cardUser: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "cardUser",
      references: {
        key: "userId",
        model: "user_model"
      }
    },
    cardTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: "5",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "cardTotal"
    },
    cardAllowance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: "5",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "cardAllowance"
    },
    cardAvatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "cardAvatar"
    }
  };
  const options = {
    tableName: "card",
    comment: "",
    indexes: [{
      name: "cuser",
      unique: false,
      type: "BTREE",
      fields: ["cardUser"]
    }]
  };
  const CardModel = sequelize.define("card_model", attributes, options);
  return CardModel;
};