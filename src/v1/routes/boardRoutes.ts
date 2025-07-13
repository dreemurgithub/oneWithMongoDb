import { Router } from 'express';
import { createBoard,getBoardById,getAllBoards } from "@/v1/controllers/boardController";

const router = Router();
router.post('/', createBoard);

// GET /api/users - Get all users with pagination
router.get('/', getAllBoards);

// GET /api/users/:id - Get user by ID
router.get('/:id', getBoardById);

export default router