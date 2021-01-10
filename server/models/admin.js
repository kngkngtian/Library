const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    AdminAccount: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "AdminAccount"
    },
    AdminPwd: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "AdminPwd"
    }
  };
  const options = {
    tableName: "admin",
    comment: "",
    indexes: []
  };
  const AdminModel = sequelize.define("admin_model", attributes, options);
  return AdminModel;
};