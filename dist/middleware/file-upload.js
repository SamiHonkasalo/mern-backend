"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
};
const fileUpload = multer_1.default({
    limits: { fileSize: 500000 },
    storage: multer_1.default.diskStorage({
        destination: (req, file, callback) => {
            callback(null, '../uploads/images');
        },
        filename: (req, file, callback) => {
            const ext = MIME_TYPE_MAP[file.mimetype];
            callback(null, uuid_1.v1() + '.' + ext);
        },
    }),
    fileFilter: (req, file, callback) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        if (isValid) {
            callback(null, true);
        }
        else {
            callback(new Error('Invalid mime type!'));
        }
    },
});
exports.default = fileUpload;
