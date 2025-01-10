const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("farmer_db", "farmer_user", "ZXC123#zxc", {
    host: "localhost",
    dialect: "postgres",
});

sequelize
    .authenticate()
    .then(() => console.log("Connected to PostgreSQL database."))
    .catch((err) => console.error("Unable to connect:", err));

module.exports = sequelize;
