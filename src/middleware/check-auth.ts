import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { HttpError } from '../models/http-error';
import HttpStatusCode from '../models/http-status-code';
import config from '../util/config';
import { PlaceDocument } from '../models/place';

interface Token {
  userId: PlaceDocument['creator'];
  email: string;
}

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token =
      req && req.headers && req.headers.authorization
        ? req.headers.authorization.split(' ')[1]
        : null;
    if (!token) {
      return next(
        new HttpError('Authentication failed', HttpStatusCode.FORBIDDEN)
      );
    }
    const decodedToken = jwt.verify(token, config.TOKEN_CODE);
    req.userData = { userId: (decodedToken as Token).userId };
    next();
  } catch (e) {
    return next(
      new HttpError('Authentication failed', HttpStatusCode.FORBIDDEN)
    );
  }
};

export default checkAuth;
