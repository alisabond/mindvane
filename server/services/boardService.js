const Board = require('../models/Board');

class BoardService {
    static async createBoard(name) {
        if (!name || !name.trim()) {
            throw new Error("Board name cannot be empty");
        }
        const board = new Board({ name: name.trim() });
        return await board.save();
    }

    static async getAllBoards() {
        return await Board.find();
    }

    static async getBoardById(id) {
        return await Board.findById(id);
    }

    static async deleteBoard(id) {
        return await Board.findByIdAndDelete(id);
    }

    static async renameBoard(id, newName) {
        if (!newName || !newName.trim()) {
            throw new Error("Board name cannot be empty");
        }
        const board = await Board.findById(id);
        if (!board) throw new Error("Board not found");
        board.name = newName.trim();
        return await board.save();
    }

    // Tasks methods

    // get tasks for board
    static async getTasksForBoard(boardId) {
        const board = await Board.findById(boardId);
        if (!board) throw new Error('Board not found');
        return board.tasks;
    }

    // Creating task for board
    static async createTask(boardId, taskData) {
        const board = await Board.findById(boardId);
        if (!board) throw new Error('Board not found');

        // Create a task inside the tasks array of the board
        const task = {
            ...taskData,
            boardId,  // add boardId to the task
            createdAt: new Date()
        };

        board.tasks.push(task);  // add task to tasks array
        await board.save();
        return task;  // return created task
    }

    // deleting task from array
    static async deleteTask(taskId) {
        const board = await Board.findOne({ 'tasks._id': taskId });
        if (!board) throw new Error('Board or Task not found');

        const taskIndex = board.tasks.findIndex(task => task._id.toString() === taskId);
        if (taskIndex === -1) throw new Error('Task not found');

        board.tasks.splice(taskIndex, 1);
        await board.save();
        return { message: 'Task deleted' };
    }

    static async updateTask(taskId, taskData) {
        try {
            const board = await Board.findOne({ 'tasks._id': taskId });
            if (!board) {
                throw new Error('Task not found');
            }

            const task = board.tasks.id(taskId);
            if (!task) {
                throw new Error('Task not found');
            }

            Object.keys(taskData).forEach(key => {
                if (taskData[key] !== undefined) {
                    task[key] = taskData[key];
                }
            });

            await board.save();

            return task;
        } catch (err) {
            console.error('Error in updateTask:', err);
            throw err;
        }
    }

    static async getTask(taskId) {
        try {
            const board = await Board.findOne({ 'tasks._id': taskId });
            if (!board) {
                throw new Error('Task not found');
            }

            const task = board.tasks.id(taskId);
            if (!task) {
                throw new Error('Task not found');
            }

            return task;
        } catch (err) {
            console.error('Error in getTask:', err);
            throw err;
        }
    }

    static async deleteTaskFromBoard(taskId) {
        try {
            console.log(`Deleting task with ID: ${taskId}`);

            const board = await Board.findOne({ 'tasks._id': taskId });
            if (!board) {
                throw new Error('Task not found in any board');
            }

            console.log(`Board found ${board.name}`);

            const taskIndex = board.tasks.findIndex(task => task._id.toString() === taskId);
            if (taskIndex === -1) {
                throw new Error('Task not found in board');
            }

            board.tasks.splice(taskIndex, 1);
            await board.save();

            console.log(`Task ${taskId} is deleted`);
            return board;

        } catch (err) {
            console.error('Error during deleting task:', err);
            throw err;
        }
    }

}

module.exports = BoardService;
