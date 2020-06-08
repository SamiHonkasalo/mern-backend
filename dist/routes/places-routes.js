"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const places_controllers_1 = require("../controllers/places-controllers");
const express_validator_1 = require("express-validator");
const file_upload_1 = __importDefault(require("../middleware/file-upload"));
let router = express_1.default.Router();
router.get('/:placeId', places_controllers_1.getPlaceById);
router.get('/user/:userId', places_controllers_1.getPlacesByUserId);
router.post('/', file_upload_1.default.single('image'), [
    express_validator_1.check('title').not().isEmpty(),
    express_validator_1.check('description').isLength({ min: 5 }),
    express_validator_1.check('address').not().isEmpty(),
], places_controllers_1.createPlace);
router.patch('/:placeId', [express_validator_1.check('title').not().isEmpty(), express_validator_1.check('description').isLength({ min: 5 })], places_controllers_1.updatePlace);
router.delete('/:placeId', places_controllers_1.deletePlace);
exports.default = router;
