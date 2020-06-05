import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

import { HttpError } from '../models/http-error';
import getCoordsForAddress from '../util/location';
import { Place, PlaceDocument } from '../models/place';
import HttpStatusCode from '../models/http-status-code';
import { User, UserDocument } from '../models/user';

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

  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate('places');
  } catch (e) {
    return next(new HttpError('Error finding places from database', 500));
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      new HttpError('Could not find places for the provided user id', 404)
    );
  }
  res.json({
    // @ts-ignore
    places: userWithPlaces.places.map((p) => p.toObject({ getters: true })),
  });
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

  let user;
  try {
    user = await User.findById(creator);
  } catch (e) {
    return next(
      new HttpError(
        'Could not find user for the provided id',
        HttpStatusCode.INTERNAL_SERVER_ERROR
      )
    );
  }

  if (!user) {
    return next(
      new HttpError(
        'Could not find user for the provided id',
        HttpStatusCode.NOT_FOUND
      )
    );
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace.id);
    await user.save({ session: sess });
    sess.commitTransaction();
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

  let place;
  let user;
  try {
    place = await Place.findById(placeId);
  } catch (e) {
    return next(new HttpError('Error finding place from database', 500));
  }
  if (!place) {
    return next(
      new HttpError('Could not find a place with the provided id', 404)
    );
  }
  try {
    user = await User.findById(place.creator);
  } catch (e) {
    return next(
      new HttpError('Could not find a user with the creator id', 500)
    );
  }
  if (!user) {
    return next(
      new HttpError('Could not find a user with the creator id', 404)
    );
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    // @ts-ignore
    await place.remove({ session: sess });
    user.places.pull(place);
    await user.save({ session: sess });
    sess.commitTransaction();
  } catch (e) {
    return next(
      new HttpError('Error removing the place from the database', 500)
    );
  }
  res.status(200).json({ message: `Deleted place with id: ${placeId}` });
};
