const express = require('express');
const router = express.Router();
const BoardService = require('../services/boardService');
const Board = require('../models/Board');

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

// GET /api/boards/tasks/:boardId - get tasks for a specific board
router.get('/tasks/:boardId', async (req, res) => {
    const boardId = req.params.boardId;
    console.log(`Tasks for board with id: ${boardId}`);

    try {
        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({ error: 'Board not found' });
        }

        // Return tasks in JSON format
        const tasks = board.tasks.map(task => ({
            _id: task._id,
            title: task.title,
            description: task.description || '',
            estimates: task.estimates || 0,
            priority: task.priority || 'medium',
            status: task.status || 'To Do',
            createdAt: task.createdAt || new Date()
        }));

        console.log(`Tasks for board with id ${boardId}:`, tasks);
        res.json(tasks);
    } catch (err) {
        console.error('Error processing task request:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/boards/tasks - creating task for board
router.post('/tasks', async (req, res) => {
    const { boardId, title, description, priority, status, estimates } = req.body;

    if (!boardId || !title || !status) {
        return res.status(400).json({ error: 'BoardId, Title, and Status are required' });
    }

    try {
        const taskData = {
            title,
            description,
            priority: priority || 'medium',
            status: status || 'To Do',
            estimates: estimates || 0
        };

        // Use the createTask method to create a task in the board
        const task = await BoardService.createTask(boardId, taskData);

        res.status(201).json(task); // return created task
    } catch (err) {
        console.error('error during creating task:', err);
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/boards/tasks/:taskId - update task
router.put('/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const { title, description, priority, status, estimates } = req.body;

    // Remove strict validation of title - it may not be transmitted when updating only the status
    if (title !== undefined && !title.trim()) {
        return res.status(400).json({ error: 'Title cannot be empty' });
    }

    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }

    try {
        const taskData = {};

        if (title !== undefined) taskData.title = title;
        if (description !== undefined) taskData.description = description;
        if (priority !== undefined) taskData.priority = priority;
        if (status !== undefined) taskData.status = status;
        if (estimates !== undefined) taskData.estimates = estimates;

        const updatedTask = await BoardService.updateTask(taskId, taskData);

        res.json(updatedTask);
    } catch (err) {
        console.error('Error during updating task:', err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/boards/tasks/:taskId - delete task
router.delete('/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;

    try {
        const board = await BoardService.deleteTaskFromBoard(taskId);
        res.json({ message: 'Task deleted', board });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/boards/tasks/task/:taskId - get single task details
router.get('/tasks/task/:taskId', async (req, res) => {
    const { taskId } = req.params;

    try {
        const board = await Board.findOne({ 'tasks._id': taskId });
        if (!board) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const task = board.tasks.id(taskId);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(task);
    } catch (err) {
        console.error('Error during getting task:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
