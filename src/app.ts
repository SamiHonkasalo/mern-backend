import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

import placesRoutes from './routes/places-routes';
import usersRoutes from './routes/users-routes';
import { HttpError } from './models/http-error';
import config from './util/config';
import HttpStatusCode from './models/http-status-code';

const app = express();

app.use(bodyParser.json());
app.use('/uploads/images', express.static(path.join('uploads', 'images')));
app.use(cors());

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new HttpError('Unknown route', 404));
});

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headersSent) {
    return next(error);
  }
  let defaultCode = error.code || 500;
  // If code is found in httpstatus codes, add it as the status, otherwise add 500
  if (Object.values(HttpStatusCode).includes(defaultCode.toString())) {
    res.status(defaultCode);
  } else {
    res.status(500);
  }
  res.json({ message: error.message || 'An unknown error occurred' });
});
mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => app.listen(config.PORT))
  .catch((err) => console.log(err));
