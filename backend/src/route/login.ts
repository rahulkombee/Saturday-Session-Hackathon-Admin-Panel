import { Router } from 'express';
import { loginController } from '../controller/loginController.js';

const router = Router();
router.post('/', loginController);
export default router;
