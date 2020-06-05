import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

import { HttpError } from '../models/http-error';
import getCoordsForAddress from '../util/location';
import { Place, PlaceDocument } from '../models/place';
import HttpStatusCode from '../models/http-status-code';

export const getPlaceById: RequestHandler = async (req, res, next) => {
  const placeId = req.params.placeId;
  let place: PlaceDocument | null;
  try {
    place = await Place.findById(placeId);
  } catch (e) {
    return next(new HttpError('Error finding place from database', 500));
  }

  if (!place) {
    return next(
      new HttpError('Could not find a place for the provided id', 404)
    );
  }
  res.json({ place: place.toObject({ getters: true }) });
};

export const getPlacesByUserId: RequestHandler = async (req, res, next) => {
  const userId = req.params.userId;
  let userPlaces: PlaceDocument[] | null;

  try {
    userPlaces = await Place.find({ creator: userId });
  } catch (e) {
    return next(new HttpError('Error finding places from database', 500));
  }

  if (!userPlaces || userPlaces.length === 0) {
    return next(
      new HttpError('Could not find places for the provided user id', 404)
    );
  }
  res.json({ places: userPlaces.map((p) => p.toObject({ getters: true })) });
};

export const createPlace: RequestHandler = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    next(new HttpError('Invalid data', 422));
    return;
  }

  const { title, description, address, creator } = req.body;
  let location;

  try {
    location = await getCoordsForAddress(address);
  } catch (e) {
    next(e);
    return;
  }
  const createdPlace = new Place({
    title,
    description,
    address,
    location,
    image:
      'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
    creator,
  });

  try {
    await createdPlace.save();
  } catch (e) {
    return next(
      new HttpError(
        'Failed to create new place',
        HttpStatusCode.INTERNAL_SERVER_ERROR
      )
    );
  }

  res.status(201).json({ place: createdPlace });
};

export const updatePlace: RequestHandler = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    next(new HttpError('Invalid data', 422));
    return;
  }
  const { title, description } = req.body;
  const placeId = req.params.placeId;

  let place: PlaceDocument | null;
  try {
    place = await Place.findById(placeId);
  } catch (e) {
    return next(new HttpError('Error finding place from database', 500));
  }
  if (!place) {
    return next(
      new HttpError('Could not find a place for the provided id', 404)
    );
  }
  try {
    place.title = title;
    place.description = description;
    await place.save();
  } catch (e) {
    return next(new HttpError('Error updating the place to the database', 500));
  }
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

export const deletePlace: RequestHandler = async (req, res, next) => {
  const placeId = req.params.placeId;

  let place: PlaceDocument | null;
  try {
    place = await Place.findById(placeId);
  } catch (e) {
    return next(new HttpError('Error finding place from database', 500));
  }
  if (!place) {
    return next(
      new HttpError('Could not find a place for the provided id', 404)
    );
  }
  try {
    await place.remove();
  } catch (e) {
    return next(
      new HttpError('Error removing the place from the database', 500)
    );
  }
  res.status(200).json({ message: `Deleted place with id: ${placeId}` });
};
