const { EntitySchema } = require("typeorm");

const Action = new EntitySchema({
    name: "Action",
    tableName: "actions",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        userId: {
            type: "int",
        },
        actionType: {
            type: "varchar",
        },
        createdAt: {
            type: "timestamp",
            createDate: true,
        },
        updatedAt: {
            type: "timestamp",
            updateDate: true,
        },
    },
});

module.exports = Action;
