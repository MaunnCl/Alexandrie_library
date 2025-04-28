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
Object.defineProperty(exports, "__esModule", { value: true });
const users_service_1 = require("../../src/services/users.service");
const user_repository_1 = require("../../src/repository/user.repository");
jest.mock('../../src/repository/user.repository');
describe('UsersService', () => {
    const userMock = {
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        password: 'hashedpassword',
        address: '123 Main St',
        country: 'France',
        zipcode: '75000',
        phone: '0102030405',
        dateOfBirth: '2000-01-01',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should create a user', () => __awaiter(void 0, void 0, void 0, function* () {
        user_repository_1.UsersRepository.create.mockResolvedValue(userMock);
        const result = yield users_service_1.UsersService.create(userMock);
        expect(result).toEqual(userMock);
        expect(user_repository_1.UsersRepository.create).toHaveBeenCalledWith(userMock);
    }));
    it('should get all users', () => __awaiter(void 0, void 0, void 0, function* () {
        user_repository_1.UsersRepository.findAll.mockResolvedValue([userMock]);
        const result = yield users_service_1.UsersService.getAll();
        expect(result).toEqual([userMock]);
    }));
    it('should get user by id', () => __awaiter(void 0, void 0, void 0, function* () {
        user_repository_1.UsersRepository.findById.mockResolvedValue(userMock);
        const result = yield users_service_1.UsersService.getById(1);
        expect(result).toEqual(userMock);
    }));
    it('should update user by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const updateData = { firstname: 'Jane' };
        const updatedUser = Object.assign(Object.assign({}, userMock), updateData);
        user_repository_1.UsersRepository.update.mockResolvedValue(updatedUser);
        const result = yield users_service_1.UsersService.update(1, updateData);
        expect(result).toEqual(updatedUser);
    }));
    it('should delete user by id', () => __awaiter(void 0, void 0, void 0, function* () {
        user_repository_1.UsersRepository.delete.mockResolvedValue(userMock);
        const result = yield users_service_1.UsersService.delete(1);
        expect(result).toEqual(userMock);
    }));
    it('should find user by email', () => __awaiter(void 0, void 0, void 0, function* () {
        user_repository_1.UsersRepository.findByEmail.mockResolvedValue(userMock);
        const result = yield users_service_1.UsersService.findByEmail('john.doe@example.com');
        expect(result).toEqual(userMock);
    }));
});
