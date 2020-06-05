import { RequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { Place } from '../models/place';
import { HttpError } from '../models/http-error';

let DUMMY_PLACES: Place[] = [];
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

export const getPlacesByUserId: RequestHandler = (req, res, next) => {
  const userId = req.params.userId;
  const userPlaces = DUMMY_PLACES.filter((p) => p.creator === userId);
  if (!userPlaces || userPlaces.length === 0) {
    next(new HttpError('Could not find places for the provided user id', 404));
  } else {
    res.json({ userPlaces });
  }
};

export const createPlace: RequestHandler = (req, res, next) => {
  const { title, description, location, address, creator } = req.body;
  const createdPlace: Place = {
    id: uuidv4(),
    title,
    description,
    location,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

export const updatePlace: RequestHandler = (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.placeId;

  let placeToUpdate: Place;
  const place = DUMMY_PLACES.find((p) => p.id === placeId);
  if (!place) {
    next(new HttpError('Unable to find a place with the id', 404));
  } else {
    placeToUpdate = { ...place };
    const placeInd = DUMMY_PLACES.findIndex((p) => p.id === placeId);
    placeToUpdate.title = title;
    placeToUpdate.description = description;

    DUMMY_PLACES[placeInd] = placeToUpdate;
    res.status(200).json({ place: placeToUpdate });
  }
};

export const deletePlace: RequestHandler = (req, res, next) => {
  const placeId = req.params.placeId;
  const place = DUMMY_PLACES.find((p) => p.id === placeId);
  if (!place) {
    next(new HttpError('Unable to find a place with the id', 404));
  } else {
    DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
    res.status(200).json({ message: `Deleted place with id: ${placeId}` });
  }
};
