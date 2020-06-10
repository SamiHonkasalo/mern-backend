import aws from 'aws-sdk';
import config from '../util/config';
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import { HttpError } from '../models/http-error';

export default {
  awsSignup(req: Request, res: Response, next: NextFunction) {
    // @ts-ignore
    aws.config.setPromisesDependency();
    aws.config.update({
      accessKeyId: config.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
      region: config.AWS_REGION,
    });
    const s3 = new aws.S3();
    var params = {
      ACL: 'public-read',
      Bucket: config.S3_BUCKET_NAME,
      Body: fs.createReadStream(req.file.path),
      Key: `images/${req.file.filename}`,
    };

    // @ts-ignore
    s3.upload(params, (err, data) => {
      if (err) {
        console.log('Error occured while trying to upload to S3 bucket', err);
        return next(
          new HttpError('Error occured while trying to upload image', 500)
        );
      }

      if (data) {
        fs.unlinkSync(req.file.path); // Empty temp folder
        req.file.path = data.Location;
        next();
      }
    });
  },
};
