import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';

import placesRoutes from './routes/places-routes';
import usersRoutes from './routes/users-routes';
import { HttpError } from './models/http-error';

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

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
