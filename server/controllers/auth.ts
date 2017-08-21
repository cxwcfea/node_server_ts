import * as express from 'express';
import auth from '../libs/UserAuth';

export default {
  register(req: express.Request, res: express.Response): void {
    auth
      .register(req.body.name, req.body.password)
      .then((token) => {
        res.json({ token });
      })
      .catch((err) => {
        res.status(500).json({ msg: err.message });
      });
  },
};
