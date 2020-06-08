import express from 'express';
import { signup, login, getUsers } from '../controllers/users-controllers';
import { check } from 'express-validator';

let router = express.Router();

router.get('/', getUsers);

router.post(
  '/signup',
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail({ gmail_remove_dots: false }).isEmail(),
    check('password').isLength({ min: 5 }),
  ],
  signup
);

router.post('/login', login);

export default router;
