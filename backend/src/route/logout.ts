import { Router } from 'express';
import { logoutController } from '../controller/logoutController.js';

const router = Router();
router.post('/', logoutController);
export default router;
