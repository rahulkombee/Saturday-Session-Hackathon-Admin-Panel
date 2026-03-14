import { Router } from 'express';
import { authMiddleware } from '../middleware/index.js';
import {
  listBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../controller/brandController.js';

const router = Router();
router.use(authMiddleware);

router.get('/', listBrands);
router.get('/:id', getBrand);
router.post('/', createBrand);
router.patch('/:id', updateBrand);
router.delete('/:id', deleteBrand);

export default router;
