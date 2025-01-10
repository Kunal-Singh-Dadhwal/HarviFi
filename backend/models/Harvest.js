const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Harvest = sequelize.define("Harvest", {
    tokenId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    produceType: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.FLOAT, allowNull: false },
    expectedDeliveryDate: { type: DataTypes.DATE, allowNull: false },
    pricePerUnit: { type: DataTypes.FLOAT, allowNull: false },
    farmerAddress: { type: DataTypes.STRING, allowNull: false },
    buyerAddress: { type: DataTypes.STRING },
    metadataURI: { type: DataTypes.STRING, allowNull: false },
    isDelivered: { type: DataTypes.BOOLEAN, defaultValue: false },
});

module.exports = Harvest;
