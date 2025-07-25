"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const users_route_1 = __importDefault(require("./src/routes/users.route"));
const usersRoles_route_1 = __importDefault(require("./src/routes/usersRoles.route"));
const usersProfiles_route_1 = __importDefault(require("./src/routes/usersProfiles.route"));
const role_route_1 = __importDefault(require("./src/routes/role.route"));
const orators_route_1 = __importDefault(require("./src/routes/orators.route"));
const content_route_1 = __importDefault(require("./src/routes/content.route"));
const congress_route_1 = __importDefault(require("./src/routes/congress.route"));
const session_route_1 = __importDefault(require("./src/routes/session.route"));
const history_route_1 = __importDefault(require("./src/routes/history.route"));
const swagger_1 = require("./docs/swagger");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
}));
app.use((req, res, next) => {
    const time = new Date().toString();
    console.log(req.method, req.hostname, req.path, time);
    next();
});
app.use("/api", users_route_1.default);
app.use("/api", usersRoles_route_1.default);
app.use("/api", usersProfiles_route_1.default);
app.use("/api", role_route_1.default);
app.use("/api", orators_route_1.default);
app.use("/api", content_route_1.default);
app.use("/api", congress_route_1.default);
app.use("/api", session_route_1.default);
app.use("/api", history_route_1.default);
(0, swagger_1.setupSwagger)(app);
exports.default = app;
