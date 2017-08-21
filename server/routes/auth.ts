import * as express from 'express';
import ctrl from '../controllers/auth';

const router = express.Router();

router.post('/register', ctrl.register);

export default router;
