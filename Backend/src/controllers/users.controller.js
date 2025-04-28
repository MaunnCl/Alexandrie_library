"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const users_service_1 = require("../services/users.service");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UsersController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                if (!data.password) {
                    res.status(400).json({ error: "Password is required" });
                }
                data.password = yield bcryptjs_1.default.hash(data.password, 10);
                const newUser = yield users_service_1.UsersService.create(data);
                res.status(201).json(newUser);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    static getAll(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield users_service_1.UsersService.getAll();
                res.status(200).json(users);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield users_service_1.UsersService.getById(Number(req.params.id));
                if (!user)
                    res.status(404).json({ message: "User not found" });
                res.status(200).json(user);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield users_service_1.UsersService.update(Number(req.params.id), req.body);
                res.status(200).json(updated);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield users_service_1.UsersService.delete(Number(req.params.id));
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password)
                    res.status(400).json({ error: "Email and password are required" });
                const user = yield users_service_1.UsersService.findByEmail(email);
                if (!user)
                    res.status(401).json({ error: "Invalid credentials" });
                const isMatch = yield bcryptjs_1.default.compare(password, user.password);
                if (!isMatch)
                    res.status(401).json({ error: "Invalid credentials" });
                const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
                res.status(200).json(userWithoutPassword);
            }
            catch (error) {
                console.error("❌ Login error:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    ;
}
exports.UsersController = UsersController;
