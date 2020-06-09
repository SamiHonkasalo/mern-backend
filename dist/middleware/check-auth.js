"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_error_1 = require("../models/http-error");
const http_status_code_1 = __importDefault(require("../models/http-status-code"));
const config_1 = __importDefault(require("../util/config"));
const checkAuth = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req && req.headers && req.headers.authorization
            ? req.headers.authorization.split(' ')[1]
            : null;
        if (!token) {
            return next(new http_error_1.HttpError('Authentication failed', http_status_code_1.default.FORBIDDEN));
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, config_1.default.TOKEN_CODE);
        req.userData = { userId: decodedToken.userId };
        next();
    }
    catch (e) {
        return next(new http_error_1.HttpError('Authentication failed', http_status_code_1.default.FORBIDDEN));
    }
};
exports.default = checkAuth;
