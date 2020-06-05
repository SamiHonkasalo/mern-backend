import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';

import placesRouter from './routes/places-routes';
import { HttpError } from './models/http-error';

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new HttpError('Unknown route', 404));
});

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred' });
});

app.listen(5000);
