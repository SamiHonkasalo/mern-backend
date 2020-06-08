import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { HttpError } from '../models/http-error';
import { User, UserDocument } from '../models/user';
import HttpStatusCode from '../models/http-status-code';
import config from '../util/config';

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

  let hashedPassword: string;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (e) {
    return next(
      new HttpError(
        'Unable to create new user',
        HttpStatusCode.INTERNAL_SERVER_ERROR
      )
    );
  }

  const user = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
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
  let token;
  try {
    token = jwt.sign(
      { userId: user.id, email: user.email },
      config.TOKEN_CODE,
      { expiresIn: '1h' }
    );
  } catch (e) {
    return next(
      new HttpError(
        'Error signing up the user',
        HttpStatusCode.INTERNAL_SERVER_ERROR
      )
    );
  }

  res.status(201).json({ userId: user.id, email: user.email, token: token });
};
export const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (e) {
    return next(new HttpError('User not found', 500));
  }
  if (!existingUser) {
    return next(new HttpError('User not found', HttpStatusCode.UNAUTHORIZED));
  }
  let validPassword = false;
  try {
    validPassword = await bcrypt.compare(password, existingUser.password);
  } catch (e) {
    return next(new HttpError('Unable to login', 500));
  }

  if (!validPassword) {
    return next(
      new HttpError('Invalid credentials', HttpStatusCode.UNAUTHORIZED)
    );
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      config.TOKEN_CODE,
      { expiresIn: '1h' }
    );
  } catch (e) {
    return next(
      new HttpError('Error logging in', HttpStatusCode.INTERNAL_SERVER_ERROR)
    );
  }

  res
    .status(201)
    .json({ userId: existingUser.id, email: existingUser.email, token: token });
};
