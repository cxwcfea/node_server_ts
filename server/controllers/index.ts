import * as express from 'express';
const data = require('../../data');

export default {
  ping(req: express.Request, res: express.Response) {
    res.json({
      message: 'the server is working',
      data,
    });
  },
};
