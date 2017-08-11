import * as express from 'express';
import ctrl from '../controllers/index';

const router = express.Router();

router.get('/ping', ctrl.ping);

export default router;
