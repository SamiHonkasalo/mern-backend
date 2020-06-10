"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
let MONGODB_URI = process.env.MONGODB_URI || '';
let TOKEN_CODE = process.env.JWT_CODE || '';
let MAP_BOX_API = process.env.MAP_BOX_API;
let AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
let AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
let S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
let AWS_REGION = process.env.AWS_REGION;
if (process.env.NODE_ENV === 'development') {
    MONGODB_URI = process.env.TEST_MONGODB_URI || '';
}
exports.default = {
    PORT,
    MONGODB_URI,
    TOKEN_CODE,
    MAP_BOX_API,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    S3_BUCKET_NAME,
    AWS_REGION,
};
