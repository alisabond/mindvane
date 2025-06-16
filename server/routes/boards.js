const express = require('express');
const router = express.Router();
const BoardService = require('../services/boardService');

// GET /api/boards - get all boards
router.get('/', async (req, res) => {
    try {
        const boards = await BoardService.getAllBoards();
        res.json(boards);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/boards - create board
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        const board = await BoardService.createBoard(name);
        res.status(201).json(board);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /api/boards/:id - delete board
router.delete('/:id', async (req, res) => {
    try {
        await BoardService.deleteBoard(req.params.id);
        res.json({ message: 'Board deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/boards/:id - rename board
router.put('/:id', async (req, res) => {
    try {
        const { name } = req.body;
        const board = await BoardService.renameBoard(req.params.id, name);
        res.json(board);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
