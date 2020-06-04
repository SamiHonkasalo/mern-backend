import { RequestHandler } from 'express';

import { Place } from '../models/place';
import { HttpError } from '../models/http-error';

const DUMMY_PLACES: Place[] = [];
DUMMY_PLACES.push({
  id: 'p10',
  title: 'Koti',
  description: 'Kiva paikka',
  location: {
    lat: 62.2803635,
    lng: 25.7734192,
  },
  address: 'Heinämutka 5 A 17',
  creator: 'u1',
});

export const getPlaceById: RequestHandler = (req, res, next) => {
  const placeId = req.params.placeId;
  const place = DUMMY_PLACES.find((p) => p.id === placeId);
  if (!place) {
    next(new HttpError('Could not find a place for the provided id', 404));
  } else {
    res.json({ place });
  }
};

export const getPlaceByUserId: RequestHandler = (req, res, next) => {
  const userId = req.params.userId;
  const userPlaces = DUMMY_PLACES.filter((p) => p.creator === userId);
  if (!userPlaces || userPlaces.length === 0) {
    next(new HttpError('Could not find a place for the provided user id', 404));
  } else {
    res.json({ userPlaces });
  }
};
