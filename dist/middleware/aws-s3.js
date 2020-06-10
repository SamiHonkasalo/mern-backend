"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const config_1 = __importDefault(require("../util/config"));
const fs_1 = __importDefault(require("fs"));
const http_error_1 = require("../models/http-error");
exports.default = {
    awsSignup(req, res, next) {
        // @ts-ignore
        aws_sdk_1.default.config.setPromisesDependency();
        aws_sdk_1.default.config.update({
            accessKeyId: config_1.default.AWS_ACCESS_KEY_ID,
            secretAccessKey: config_1.default.AWS_SECRET_ACCESS_KEY,
            region: config_1.default.AWS_REGION,
        });
        const s3 = new aws_sdk_1.default.S3();
        var params = {
            ACL: 'public-read',
            Bucket: config_1.default.S3_BUCKET_NAME,
            Body: fs_1.default.createReadStream(req.file.path),
            Key: `images/${req.file.filename}`,
        };
        // @ts-ignore
        s3.upload(params, (err, data) => {
            if (err) {
                console.log('Error occured while trying to upload to S3 bucket', err);
                return next(new http_error_1.HttpError('Error occured while trying to upload image', 500));
            }
            if (data) {
                fs_1.default.unlinkSync(req.file.path); // Empty temp folder
                req.file.path = data.Location;
                next();
            }
        });
    },
};
