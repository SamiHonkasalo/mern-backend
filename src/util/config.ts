import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 5000;
let MONGODB_URI = process.env.MONGODB_URI || '';
let TOKEN_CODE = process.env.JWT_CODE || '';
let MAP_BOX_API = process.env.MAP_BOX_API;

if (process.env.NODE_ENV === 'development') {
  MONGODB_URI = process.env.TEST_MONGODB_URI || '';
}
export default { PORT, MONGODB_URI, TOKEN_CODE, MAP_BOX_API };
