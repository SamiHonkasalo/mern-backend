"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const http_error_1 = require("../models/http-error");
const API_KEY = 'pk.eyJ1IjoiaG9ua2tpcyIsImEiOiJjazBlc2tkOHcwYzhoM2xtcDQ3cHR2dmJ5In0.uLJ8KdNImk0vTYuhFbvZhA';
async function getCoordsForAddress(address) {
    let data;
    try {
        const url = 'https://api.mapbox.com/geocoding/v5';
        const endpoint = 'mapbox.places';
        const searchText = encodeURIComponent(address);
        const response = await axios_1.default({
            method: 'GET',
            url: `${url}/${endpoint}/${searchText}.json/?access_token=${API_KEY}`,
        });
        data = response.data;
    }
    catch (e) {
        throw new http_error_1.HttpError('Something went wrong', 500);
    }
    if (!data || data.status === 'ZERO_RESULTS') {
        throw new http_error_1.HttpError('Could not find location for the specified address.', 404);
    }
    const [lng, lat] = data.features[0].center;
    return { lat, lng };
}
exports.default = getCoordsForAddress;
