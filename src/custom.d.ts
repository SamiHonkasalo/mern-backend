import { PlaceDocument } from './models/place';

declare module 'express-serve-static-core' {
  interface Request {
    userData: {
      userId: PlaceDocument['creator'];
    };
  }
}
