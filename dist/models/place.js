"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Place = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const placeSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    address: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    creator: { type: mongoose_1.default.Types.ObjectId, required: true, ref: 'User' },
});
exports.Place = mongoose_1.default.model('Place', placeSchema);
