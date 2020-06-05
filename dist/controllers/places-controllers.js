"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlace = exports.updatePlace = exports.createPlace = exports.getPlacesByUserId = exports.getPlaceById = void 0;
const express_validator_1 = require("express-validator");
const http_error_1 = require("../models/http-error");
const location_1 = __importDefault(require("../util/location"));
const place_1 = require("../models/place");
const http_status_code_1 = __importDefault(require("../models/http-status-code"));
exports.getPlaceById = async (req, res, next) => {
    const placeId = req.params.placeId;
    let place;
    try {
        place = await place_1.Place.findById(placeId);
    }
    catch (e) {
        return next(new http_error_1.HttpError('Error finding place from database', 500));
    }
    if (!place) {
        return next(new http_error_1.HttpError('Could not find a place for the provided id', 404));
    }
    res.json({ place: place.toObject({ getters: true }) });
};
exports.getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.userId;
    let userPlaces;
    try {
        userPlaces = await place_1.Place.find({ creator: userId });
    }
    catch (e) {
        return next(new http_error_1.HttpError('Error finding places from database', 500));
    }
    if (!userPlaces || userPlaces.length === 0) {
        return next(new http_error_1.HttpError('Could not find places for the provided user id', 404));
    }
    res.json({ places: userPlaces.map((p) => p.toObject({ getters: true })) });
};
exports.createPlace = async (req, res, next) => {
    const err = express_validator_1.validationResult(req);
    if (!err.isEmpty()) {
        next(new http_error_1.HttpError('Invalid data', 422));
        return;
    }
    const { title, description, address, creator } = req.body;
    let location;
    try {
        location = await location_1.default(address);
    }
    catch (e) {
        next(e);
        return;
    }
    const createdPlace = new place_1.Place({
        title,
        description,
        address,
        location,
        image: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
        creator,
    });
    try {
        await createdPlace.save();
    }
    catch (e) {
        return next(new http_error_1.HttpError('Failed to create new place', http_status_code_1.default.INTERNAL_SERVER_ERROR));
    }
    res.status(201).json({ place: createdPlace });
};
exports.updatePlace = async (req, res, next) => {
    const err = express_validator_1.validationResult(req);
    if (!err.isEmpty()) {
        next(new http_error_1.HttpError('Invalid data', 422));
        return;
    }
    const { title, description } = req.body;
    const placeId = req.params.placeId;
    let place;
    try {
        place = await place_1.Place.findById(placeId);
    }
    catch (e) {
        return next(new http_error_1.HttpError('Error finding place from database', 500));
    }
    if (!place) {
        return next(new http_error_1.HttpError('Could not find a place for the provided id', 404));
    }
    try {
        place.title = title;
        place.description = description;
        await place.save();
    }
    catch (e) {
        return next(new http_error_1.HttpError('Error updating the place to the database', 500));
    }
    res.status(200).json({ place: place.toObject({ getters: true }) });
};
exports.deletePlace = async (req, res, next) => {
    const placeId = req.params.placeId;
    let place;
    try {
        place = await place_1.Place.findById(placeId);
    }
    catch (e) {
        return next(new http_error_1.HttpError('Error finding place from database', 500));
    }
    if (!place) {
        return next(new http_error_1.HttpError('Could not find a place for the provided id', 404));
    }
    try {
        await place.remove();
    }
    catch (e) {
        return next(new http_error_1.HttpError('Error removing the place from the database', 500));
    }
    res.status(200).json({ message: `Deleted place with id: ${placeId}` });
};
