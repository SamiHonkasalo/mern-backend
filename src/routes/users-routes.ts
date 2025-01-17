import express from 'express';
import { signup, login, getUsers } from '../controllers/users-controllers';
import { check } from 'express-validator';

import fileUpload from '../middleware/file-upload';
import aws from '../middleware/aws-s3';

let router = express.Router();

router.get('/', getUsers);

router.post(
  '/signup',
  fileUpload.single('image'),
  aws.awsSignup,
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail({ gmail_remove_dots: false }).isEmail(),
    check('password').isLength({ min: 5 }),
  ],
  signup
);

router.post('/login', login);

export default router;
