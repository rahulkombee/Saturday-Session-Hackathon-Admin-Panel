import { Router } from 'express';
import { refreshController } from '../controller/refreshController.js';

const router = Router();
router.post('/', refreshController);
export default router;
