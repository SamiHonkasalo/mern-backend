import multer from 'multer';
import { v1 as uuidv1 } from 'uuid';

interface MimeType {
  [key: string]: string;
}
const MIME_TYPE_MAP: MimeType = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
};

const fileUpload = multer({
  limits: { fileSize: 500000 },
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, '../uploads/images');
    },

    filename: (req, file, callback) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      callback(null, uuidv1() + '.' + ext);
    },
  }),
  fileFilter: (req, file, callback) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    if (isValid) {
      callback(null, true);
    } else {
      callback(new Error('Invalid mime type!'));
    }
  },
});

export default fileUpload;
