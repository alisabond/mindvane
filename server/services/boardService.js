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

    // TODO: tasks methods
}

module.exports = BoardService;
