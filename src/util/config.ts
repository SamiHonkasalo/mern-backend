import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 5000;
let MONGODB_URI = process.env.MONGODB_URI || '';

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI || '';
}
export default { PORT, MONGODB_URI };