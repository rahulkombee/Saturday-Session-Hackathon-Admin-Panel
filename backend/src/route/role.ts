import { Router } from 'express';
import { authMiddleware } from '../middleware/index.js';
import {
  listRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
} from '../controller/roleController.js';

const router = Router();
router.use(authMiddleware);

router.get('/', listRoles);
router.get('/:id', getRole);
router.post('/', createRole);
router.patch('/:id', updateRole);
router.delete('/:id', deleteRole);

export default router;
