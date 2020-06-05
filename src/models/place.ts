import mongoose from 'mongoose';

export type PlaceDocument = mongoose.Document & {
  title: string;
  description: string;
  image: string;
  address: string;
  location: {
    lat: Number;
    lng: Number;
  };
  creator: string;
};

const placeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  creator: { type: String, required: true },
});

export const Place = mongoose.model<PlaceDocument>('Place', placeSchema);
