"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_controllers_1 = require("../controllers/users-controllers");
const express_validator_1 = require("express-validator");
let router = express_1.default.Router();
router.get('/', users_controllers_1.getUsers);
router.post('/signup', [
    express_validator_1.check('name').not().isEmpty(),
    express_validator_1.check('email').normalizeEmail().isEmail(),
    express_validator_1.check('password').isLength({ min: 5 }),
], users_controllers_1.signup);
router.post('/login', users_controllers_1.login);
exports.default = router;
