import * as express from 'express';

export default {
  ping(req: express.Request, res: express.Response) {
    res.json({
      message: 'the server is working',
    });
  },
};
