const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    payId: {
      type: DataTypes.INTEGER(15).UNSIGNED.ZEROFILL,
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "payId"
    },
    payCard: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "payCard",
      references: {
        key: "cardId",
        model: "card_model"
      }
    },
    payMoney: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "payMoney"
    },
    payBook: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "payBook",
      references: {
        key: "bookId",
        model: "book_model"
      }
    },
    payIsPay: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "payIsPay"
    },
    payTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "payTime"
    },
    payBor: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "payBor"
    }
  };
  const options = {
    tableName: "payment",
    comment: "",
    indexes: [{
      name: "book1123",
      unique: false,
      type: "BTREE",
      fields: ["payBook"]
    }, {
      name: "user1",
      unique: false,
      type: "BTREE",
      fields: ["payCard"]
    }]
  };
  const PaymentModel = sequelize.define("payment_model", attributes, options);
  return PaymentModel;
};