import express from 'express';
import {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} from '../controllers/places-controllers';
import { check } from 'express-validator';

let router = express.Router();

router.get('/:placeId', getPlaceById);

router.get('/user/:userId', getPlacesByUserId);

router.post(
  '/',
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').not().isEmpty(),
  ],
  createPlace
);

router.patch(
  '/:placeId',
  [check('title').not().isEmpty(), check('description').isLength({ min: 5 })],
  updatePlace
);

router.delete('/:placeId', deletePlace);

export default router;
