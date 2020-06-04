"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlaceByUserId = exports.getPlaceById = void 0;
const http_error_1 = require("../models/http-error");
const DUMMY_PLACES = [];
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
exports.getPlaceByUserId = (req, res, next) => {
    const userId = req.params.userId;
    const userPlaces = DUMMY_PLACES.filter((p) => p.creator === userId);
    if (!userPlaces || userPlaces.length === 0) {
        next(new http_error_1.HttpError('Could not find a place for the provided user id', 404));
    }
    else {
        res.json({ userPlaces });
    }
};
