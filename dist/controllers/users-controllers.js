"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = exports.getUsers = void 0;
const express_validator_1 = require("express-validator");
const http_error_1 = require("../models/http-error");
const user_1 = require("../models/user");
const http_status_code_1 = __importDefault(require("../models/http-status-code"));
exports.getUsers = async (req, res, next) => {
    let users;
    try {
        users = await user_1.User.find({}, '-password');
    }
    catch (e) {
        return next(new http_error_1.HttpError('Error finding users from database', 500));
    }
    res.json({ users: users.map((u) => u.toObject({ getters: true })) });
};
exports.signup = async (req, res, next) => {
    const err = express_validator_1.validationResult(req);
    if (!err.isEmpty()) {
        next(new http_error_1.HttpError('Invalid data', 422));
        return;
    }
    const { name, email, password } = req.body;
    let existingUser;
    try {
        existingUser = await user_1.User.findOne({ email });
    }
    catch (e) {
        return next(new http_error_1.HttpError('Error finding users from database', 500));
    }
    if (existingUser) {
        return next(new http_error_1.HttpError('User already exists', http_status_code_1.default.UNPROCESSABLE_ENTITY));
    }
    const user = new user_1.User({
        name,
        email,
        image: req.file.path,
        password,
        places: [],
    });
    try {
        user.save();
    }
    catch (e) {
        return next(new http_error_1.HttpError('Error signing up the user', http_status_code_1.default.INTERNAL_SERVER_ERROR));
    }
    res.status(201).json({ user: user.toObject({ getters: true }) });
};
exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    let existingUser;
    try {
        existingUser = await user_1.User.findOne({ email });
    }
    catch (e) {
        return next(new http_error_1.HttpError('Error finding users from database', 500));
    }
    if (existingUser && existingUser.password !== password) {
        return next(new http_error_1.HttpError('Invalid credentials', http_status_code_1.default.UNAUTHORIZED));
    }
    else if (!existingUser) {
        return next(new http_error_1.HttpError('User not found', http_status_code_1.default.NOT_FOUND));
    }
    res.json({
        message: 'Logged in!',
        user: existingUser.toObject({ getters: true }),
    });
};
