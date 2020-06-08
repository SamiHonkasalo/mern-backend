import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { HttpError } from '../models/http-error';
import HttpStatusCode from '../models/http-status-code';
import config from '../util/config';

interface Token {
  userId: string;
  email: string;
}

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req && req.headers && req.headers.authorization
        ? req.headers.authorization.split(' ')[1]
        : null;
    if (!token) {
      return next(
        new HttpError('Authentication failed', HttpStatusCode.UNAUTHORIZED)
      );
    }
    const decodedToken = jwt.verify(token, config.TOKEN_CODE);
    // @ts-ignore
    req.userData = { userId: (decodedToken as Token).userId };
    next();
  } catch (e) {
    return next(
      new HttpError('Authentication failed', HttpStatusCode.UNAUTHORIZED)
    );
  }
};

export default checkAuth;
