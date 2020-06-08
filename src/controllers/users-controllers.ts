import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

import { HttpError } from '../models/http-error';
import { User, UserDocument } from '../models/user';
import HttpStatusCode from '../models/http-status-code';

export const getUsers: RequestHandler = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (e) {
    return next(new HttpError('Error finding users from database', 500));
  }
  res.json({ users: users.map((u) => u.toObject({ getters: true })) });
};

export const signup: RequestHandler = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    next(new HttpError('Invalid data', 422));
    return;
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (e) {
    return next(new HttpError('Error finding users from database', 500));
  }
  if (existingUser) {
    return next(
      new HttpError('User already exists', HttpStatusCode.UNPROCESSABLE_ENTITY)
    );
  }

  const user = new User({
    name,
    email,
    image:
      'https://images.unsplash.com/photo-1561948955-570b270e7c36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=518&q=80',
    password,
    places: [],
  });

  try {
    user.save();
  } catch (e) {
    return next(
      new HttpError(
        'Error signing up the user',
        HttpStatusCode.INTERNAL_SERVER_ERROR
      )
    );
  }
  res.status(201).json({ user: user.toObject({ getters: true }) });
};
export const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (e) {
    return next(new HttpError('Error finding users from database', 500));
  }
  if (existingUser && existingUser.password !== password) {
    return next(
      new HttpError('Invalid credentials', HttpStatusCode.UNAUTHORIZED)
    );
  } else if (!existingUser) {
    return next(new HttpError('User not found', HttpStatusCode.NOT_FOUND));
  }
  res.json({
    message: 'Logged in!',
    user: existingUser.toObject({ getters: true }),
  });
};
