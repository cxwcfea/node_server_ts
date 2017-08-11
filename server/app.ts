// import morgan from 'morgan';
// import cors from 'cors';
import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import routes from './routes/index';

const app: express.Application = express();
app.set('port', process.env.PORT || 7777);
// app.use(morgan(':date[iso] :method :url HTTP/:http-version :status - :response-time ms'));
app.use(helmet());

app.use(express.static('public', { dotfiles: 'deny' }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes);
// app.use(cors());

export default app;
