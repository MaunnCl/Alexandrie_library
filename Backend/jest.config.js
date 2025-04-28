"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
    rootDir: '.', // <-- reste dans Backend !
    testMatch: ['<rootDir>/tests/**/*.test.ts'],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
        },
    },
};
exports.default = config;
