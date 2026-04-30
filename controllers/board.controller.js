import { Board } from "../schema/board.model.js";

const createBoard = async (req, res) => {
  const { workspaceId } = req.params;
  const { name } = req.body;

  const board = await Board.create({
    name,
    workspaceId,
  });

  res.json(board);
};

const getBoards = async (req, res) => {
  const { workspaceId } = req.params;

  const boards = await Board.find({ workspaceId });

  res.json(boards);
};

export { createBoard, getBoards };
