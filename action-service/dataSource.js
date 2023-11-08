const { DataSource } = require("typeorm");
const ormConfig = require("./ormconfig");

const dataSource = new DataSource(ormConfig);

dataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });

module.exports = dataSource;
