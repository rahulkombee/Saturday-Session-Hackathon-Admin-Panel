import { Router } from 'express';
import registerRoutes from './register.js';
import loginRoutes from './login.js';
import logoutRoutes from './logout.js';
import refreshRoutes from './refresh.js';
import userRoutes from './user.js';
import roleRoutes from './role.js';
import brandRoutes from './brand.js';

const router = Router();

router.use('/register', registerRoutes);
router.use('/login', loginRoutes);
router.use('/logout', logoutRoutes);
router.use('/refresh', refreshRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/brands', brandRoutes);

export default router;
