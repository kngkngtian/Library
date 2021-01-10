const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    bookId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: "书籍编号",
      field: "bookId"
    },
    bookName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "bookName"
    },
    bookPress: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "bookPress"
    },
    bookAuthor: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "bookAuthor"
    },
    bookClass: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "bookClass"
    },
    bookTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "bookTotal"
    },
    bookAllowance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: "余量",
      field: "bookAllowance"
    },
    bookMoney: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "bookMoney"
    }
  };
  const options = {
    tableName: "book",
    comment: "",
    indexes: []
  };
  const BookModel = sequelize.define("book_model", attributes, options);
  return BookModel;
};