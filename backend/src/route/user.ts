import { Router } from 'express';
import { authMiddleware } from '../middleware/index.js';
import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controller/userController.js';

const router = Router();
router.use(authMiddleware);

router.get('/', listUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
