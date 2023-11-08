const Action = require("../entity/Action");
const dataSource = require("../../dataSource");

const actionService = {
    createAction: async (userData) => {
        const actionRepo = dataSource.getRepository(Action);
        const action = actionRepo.create(userData);
        await actionRepo.save(action);
        console.log("Action created:", action);
    },

    updateAction: async (updateData) => {
        const actionRepo = dataSource.getRepository(Action);
        const actionToUpdate = await actionRepo.findOneBy({
            id: updateData.id,
        });
        if (actionToUpdate) {
            actionRepo.merge(actionToUpdate, updateData);
            await actionRepo.save(actionToUpdate);
            console.log("Action updated:", actionToUpdate);
        } else {
            console.log("Action not found for update:", updateData.id);
        }
    },

    getPaginatedActions: async ({ userId, page = 1, limit = 10 }) => {
        const actionRepo = dataSource.getRepository(Action);
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 5);

        const [actions, total] = await actionRepo.findAndCount({
            where: userId ? { userId } : undefined,
            take: pageSize,
            skip: (pageNumber - 1) * pageSize,
        });

        return {
            data: actions,
            total,
            currentPage: pageNumber,
            totalPages: Math.ceil(total / pageSize),
        };
    },
};

module.exports = actionService;
