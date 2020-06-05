import { RequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { HttpError } from '../models/http-error';
import { User } from '../models/user';

let DUMMY_USERS: User[] = [
  {
    id: 'u1',
    name: 'Sami Honkasalo',
    email: 'test@test.com',
    password: 'testing',
  },
];

export const getUsers: RequestHandler = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
};
export const signup: RequestHandler = (req, res, next) => {
  const { name, email, password } = req.body;

  if (DUMMY_USERS.find((u) => u.email === email)) {
    next(new HttpError('Email already in use', 422));
    return;
  }

  const newUser = { id: uuidv4(), name, email, password };

  DUMMY_USERS.push(newUser);
  res.status(201).json({ user: newUser });
};
export const login: RequestHandler = (req, res, next) => {
  const { email, password } = req.body;

  const user = DUMMY_USERS.find(
    (u) => u.email === email && u.password === password
  );
  if (!user) {
    next(
      new HttpError(
        'Error logging in, please check your email and password',
        401
      )
    );
  } else {
    res.json({ message: 'Logged in!' });
  }
};
