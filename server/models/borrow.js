const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    borId: {
      type: DataTypes.INTEGER(15).UNSIGNED.ZEROFILL,
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "borId"
    },
    borBook: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "borBook",
      references: {
        key: "bookId",
        model: "book_model"
      }
    },
    borCard: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "borCard",
      references: {
        key: "cardId",
        model: "card_model"
      }
    },
    borStart: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "borStart"
    },
    borEnd: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "borEnd"
    },
    borRealtime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "borRealtime"
    },
    borIsBeyond: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "borIsBeyond"
    },
    borIsRenew: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "borIsRenew"
    },
    borIsReturn: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "borIsReturn"
    },
    borIsBorrowApprove: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "borIsBorrowApprove"
    },
    borIsReturnApprove: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "borIsReturnApprove"
    },
    borRenewTime: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "borRenewTime"
    }
  };
  const options = {
    tableName: "borrow",
    comment: "",
    indexes: [{
      name: "book12312",
      unique: false,
      type: "BTREE",
      fields: ["borBook"]
    }, {
      name: "user123",
      unique: false,
      type: "BTREE",
      fields: ["borCard"]
    }]
  };
  const BorrowModel = sequelize.define("borrow_model", attributes, options);
  return BorrowModel;
};