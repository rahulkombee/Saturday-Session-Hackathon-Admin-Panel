import { Router } from 'express';
import { registerController } from '../controller/registerController.js';

const router = Router();

router.post('/', registerController);

export default router;
