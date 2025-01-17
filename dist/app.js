"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const places_routes_1 = __importDefault(require("./routes/places-routes"));
const users_routes_1 = __importDefault(require("./routes/users-routes"));
const http_error_1 = require("./models/http-error");
const config_1 = __importDefault(require("./util/config"));
const http_status_code_1 = __importDefault(require("./models/http-status-code"));
const app = express_1.default();
app.use(body_parser_1.default.json());
app.use('/uploads/images', express_1.default.static(path_1.default.join('uploads', 'images')));
app.use(cors_1.default());
app.use('/api/places', places_routes_1.default);
app.use('/api/users', users_routes_1.default);
app.use((req, res, next) => {
    next(new http_error_1.HttpError('Unknown route', 404));
});
app.use((error, req, res, next) => {
    if (req.file) {
        fs_1.default.unlink(req.file.path, (err) => {
            console.log(err);
        });
    }
    if (res.headersSent) {
        return next(error);
    }
    let defaultCode = error.code || 500;
    // If code is found in httpstatus codes, add it as the status, otherwise add 500
    if (Object.values(http_status_code_1.default).includes(defaultCode.toString())) {
        res.status(defaultCode);
    }
    else {
        res.status(500);
    }
    res.json({ message: error.message || 'An unknown error occurred' });
});
mongoose_1.default
    .connect(config_1.default.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
    .then(() => app.listen(config_1.default.PORT))
    .catch((err) => console.log(err));
