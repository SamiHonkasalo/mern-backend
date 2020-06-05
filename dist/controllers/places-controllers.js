"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlace = exports.updatePlace = exports.createPlace = exports.getPlacesByUserId = exports.getPlaceById = void 0;
const uuid_1 = require("uuid");
const express_validator_1 = require("express-validator");
const http_error_1 = require("../models/http-error");
let DUMMY_PLACES = [];
DUMMY_PLACES.push({
    id: 'p10',
    title: 'Koti',
    description: 'Kiva paikka',
    location: {
        lat: 62.2803635,
        lng: 25.7734192,
    },
    address: 'Heinämutka 5 A 17',
    creator: 'u1',
});
exports.getPlaceById = (req, res, next) => {
    const placeId = req.params.placeId;
    const place = DUMMY_PLACES.find((p) => p.id === placeId);
    if (!place) {
        next(new http_error_1.HttpError('Could not find a place for the provided id', 404));
    }
    else {
        res.json({ place });
    }
};
exports.getPlacesByUserId = (req, res, next) => {
    const userId = req.params.userId;
    const userPlaces = DUMMY_PLACES.filter((p) => p.creator === userId);
    if (!userPlaces || userPlaces.length === 0) {
        next(new http_error_1.HttpError('Could not find places for the provided user id', 404));
    }
    else {
        res.json({ userPlaces });
    }
};
exports.createPlace = (req, res, next) => {
    const err = express_validator_1.validationResult(req);
    if (!err.isEmpty()) {
        next(new http_error_1.HttpError('Invalid data', 422));
        return;
    }
    const { title, description, location, address, creator } = req.body;
    const createdPlace = {
        id: uuid_1.v4(),
        title,
        description,
        location,
        address,
        creator,
    };
    DUMMY_PLACES.push(createdPlace);
    res.status(201).json({ place: createdPlace });
};
exports.updatePlace = (req, res, next) => {
    const err = express_validator_1.validationResult(req);
    if (!err.isEmpty()) {
        next(new http_error_1.HttpError('Invalid data', 422));
        return;
    }
    const { title, description } = req.body;
    const placeId = req.params.placeId;
    let placeToUpdate;
    const place = DUMMY_PLACES.find((p) => p.id === placeId);
    if (!place) {
        next(new http_error_1.HttpError('Unable to find a place with the id', 404));
    }
    else {
        placeToUpdate = { ...place };
        const placeInd = DUMMY_PLACES.findIndex((p) => p.id === placeId);
        placeToUpdate.title = title;
        placeToUpdate.description = description;
        DUMMY_PLACES[placeInd] = placeToUpdate;
        res.status(200).json({ place: placeToUpdate });
    }
};
exports.deletePlace = (req, res, next) => {
    const placeId = req.params.placeId;
    const place = DUMMY_PLACES.find((p) => p.id === placeId);
    if (!place) {
        next(new http_error_1.HttpError('Unable to find a place with the id', 404));
    }
    else {
        DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
        res.status(200).json({ message: `Deleted place with id: ${placeId}` });
    }
};
