"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = exports.getUsers = void 0;
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_error_1 = require("../models/http-error");
const user_1 = require("../models/user");
const http_status_code_1 = __importDefault(require("../models/http-status-code"));
const config_1 = __importDefault(require("../util/config"));
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
    let hashedPassword;
    try {
        hashedPassword = await bcryptjs_1.default.hash(password, 12);
    }
    catch (e) {
        return next(new http_error_1.HttpError('Unable to create new user', http_status_code_1.default.INTERNAL_SERVER_ERROR));
    }
    const user = new user_1.User({
        name,
        email,
        image: req.file.path,
        password: hashedPassword,
        places: [],
    });
    try {
        user.save();
    }
    catch (e) {
        return next(new http_error_1.HttpError('Error signing up the user', http_status_code_1.default.INTERNAL_SERVER_ERROR));
    }
    let token;
    try {
        token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, config_1.default.TOKEN_CODE, { expiresIn: '1h' });
    }
    catch (e) {
        return next(new http_error_1.HttpError('Error signing up the user', http_status_code_1.default.INTERNAL_SERVER_ERROR));
    }
    res.status(201).json({ userId: user.id, email: user.email, token: token });
};
exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    let existingUser;
    try {
        existingUser = await user_1.User.findOne({ email });
    }
    catch (e) {
        return next(new http_error_1.HttpError('User not found', 500));
    }
    if (!existingUser) {
        return next(new http_error_1.HttpError('User not found', http_status_code_1.default.UNAUTHORIZED));
    }
    let validPassword = false;
    try {
        validPassword = await bcryptjs_1.default.compare(password, existingUser.password);
    }
    catch (e) {
        return next(new http_error_1.HttpError('Unable to login', 500));
    }
    if (!validPassword) {
        return next(new http_error_1.HttpError('Invalid credentials', http_status_code_1.default.UNAUTHORIZED));
    }
    let token;
    try {
        token = jsonwebtoken_1.default.sign({ userId: existingUser.id, email: existingUser.email }, config_1.default.TOKEN_CODE, { expiresIn: '1h' });
    }
    catch (e) {
        return next(new http_error_1.HttpError('Error logging in', http_status_code_1.default.INTERNAL_SERVER_ERROR));
    }
    res
        .status(201)
        .json({ userId: existingUser.id, email: existingUser.email, token: token });
};
