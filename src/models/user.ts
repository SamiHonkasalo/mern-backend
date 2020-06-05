import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { Place, PlaceDocument } from './place';

export type UserDocument = mongoose.Document & {
  name: string;
  email: string;
  password: string;
  image: string;
  places: mongoose.Types.Array<string>;
};

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place' }],
});

userSchema.plugin(uniqueValidator);

export const User = mongoose.model<UserDocument>('User', userSchema);
