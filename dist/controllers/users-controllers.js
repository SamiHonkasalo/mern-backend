"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = exports.getUsers = void 0;
const uuid_1 = require("uuid");
const express_validator_1 = require("express-validator");
const http_error_1 = require("../models/http-error");
let DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Sami Honkasalo',
        email: 'test@test.com',
        password: 'testing',
    },
];
exports.getUsers = (req, res, next) => {
    res.status(200).json({ users: DUMMY_USERS });
};
exports.signup = (req, res, next) => {
    const err = express_validator_1.validationResult(req);
    if (!err.isEmpty()) {
        next(new http_error_1.HttpError('Invalid data', 422));
        return;
    }
    const { name, email, password } = req.body;
    if (DUMMY_USERS.find((u) => u.email === email)) {
        next(new http_error_1.HttpError('Email already in use', 422));
        return;
    }
    const newUser = { id: uuid_1.v4(), name, email, password };
    DUMMY_USERS.push(newUser);
    res.status(201).json({ user: newUser });
};
exports.login = (req, res, next) => {
    const { email, password } = req.body;
    const user = DUMMY_USERS.find((u) => u.email === email && u.password === password);
    if (!user) {
        next(new http_error_1.HttpError('Error logging in, please check your email and password', 401));
    }
    else {
        res.json({ message: 'Logged in!' });
    }
};
