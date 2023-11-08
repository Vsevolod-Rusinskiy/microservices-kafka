const express = require("express");
const router = express.Router();

const actionService = require("../services/actionService");

router.get("/actions", async (req, res) => {
    const { userId, page, limit } = req.query;
    try {
        const paginatedActions = await actionService.getPaginatedActions({
            userId,
            page,
            limit,
        });
        res.json(paginatedActions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
