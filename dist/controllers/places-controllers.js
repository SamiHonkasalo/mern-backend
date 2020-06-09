"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlace = exports.updatePlace = exports.createPlace = exports.getPlacesByUserId = exports.getPlaceById = void 0;
const express_validator_1 = require("express-validator");
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const http_error_1 = require("../models/http-error");
const location_1 = __importDefault(require("../util/location"));
const place_1 = require("../models/place");
const http_status_code_1 = __importDefault(require("../models/http-status-code"));
const user_1 = require("../models/user");
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
    let userWithPlaces;
    try {
        userWithPlaces = await user_1.User.findById(userId).populate('places');
    }
    catch (e) {
        return next(new http_error_1.HttpError('Error finding places from database', 500));
    }
    if (!userWithPlaces || userWithPlaces.places.length === 0) {
        return next(new http_error_1.HttpError('Could not find places for the provided user id', 404));
    }
    res.json({
        // @ts-ignore
        places: userWithPlaces.places.map((p) => p.toObject({ getters: true })),
    });
};
exports.createPlace = async (req, res, next) => {
    const err = express_validator_1.validationResult(req);
    if (!err.isEmpty()) {
        next(new http_error_1.HttpError('Invalid data', 422));
        return;
    }
    const { title, description, address } = req.body;
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
        image: req.file.path,
        creator: req.userData.userId,
    });
    let user;
    try {
        user = await user_1.User.findById(req.userData.userId);
        console.log(user);
    }
    catch (e) {
        return next(new http_error_1.HttpError('Could not find user for the provided id', http_status_code_1.default.INTERNAL_SERVER_ERROR));
    }
    if (!user) {
        return next(new http_error_1.HttpError('Could not find user for the provided id', http_status_code_1.default.NOT_FOUND));
    }
    try {
        const sess = await mongoose_1.default.startSession();
        sess.startTransaction();
        await createdPlace.save({ session: sess });
        user.places.push(createdPlace.id);
        await user.save({ session: sess });
        sess.commitTransaction();
    }
    catch (e) {
        return next(new http_error_1.HttpError('Failed to create new place', http_status_code_1.default.INTERNAL_SERVER_ERROR));
    }
    res.status(201).json({ place: createdPlace });
};
exports.updatePlace = async (req, res, next) => {
    const err = express_validator_1.validationResult(req);
    if (!err.isEmpty()) {
        console.log(err);
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
    if (place.creator.toString() !== req.userData.userId.toString()) {
        return next(new http_error_1.HttpError('User is not the creator of this place', http_status_code_1.default.UNAUTHORIZED));
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
    let user;
    try {
        place = await place_1.Place.findById(placeId);
    }
    catch (e) {
        return next(new http_error_1.HttpError('Error finding place from database', 500));
    }
    if (!place) {
        return next(new http_error_1.HttpError('Could not find a place with the provided id', 404));
    }
    const imagePath = place.image;
    try {
        user = await user_1.User.findById(place.creator);
    }
    catch (e) {
        return next(new http_error_1.HttpError('Could not find a user with the creator id', 500));
    }
    if (!user) {
        return next(new http_error_1.HttpError('Could not find a user with the creator id', 404));
    }
    if (place.creator.toString() !== req.userData.userId.toString()) {
        return next(new http_error_1.HttpError('User is not the creator of this place', http_status_code_1.default.UNAUTHORIZED));
    }
    try {
        const sess = await mongoose_1.default.startSession();
        sess.startTransaction();
        // @ts-ignore
        await place.remove({ session: sess });
        user.places.pull(place);
        await user.save({ session: sess });
        sess.commitTransaction();
    }
    catch (e) {
        return next(new http_error_1.HttpError('Error removing the place from the database', 500));
    }
    fs_1.default.unlink(imagePath, (err) => {
        console.log(err);
    });
    res.status(200).json({ message: `Deleted place with id: ${placeId}` });
};
