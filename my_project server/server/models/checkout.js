'use strict'

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    orderid: {
      type: DataTypes.STRING,
      required: true
    },
    user_id: {
        type: DataTypes.UUID,
        required: true 
      },
    product_id: {
        type: DataTypes.UUID,
        required: true 
      },
      total: {
        type: DataTypes.UUID,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        required: true,
        defaultValue: "Pending"
      },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    paranoid: true,
    underscored: true
  });
  return Order;
};