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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPresignedUrl = getPresignedUrl;
exports.getObjectText = getObjectText;
exports.listObjectsFromPrefix = listObjectsFromPrefix;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const stream_1 = require("stream");
const s3 = new client_s3_1.S3Client({
    region: process.env.BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.BUCKET_SECRET_KEY,
    },
});
function getPresignedUrl(key) {
    return __awaiter(this, void 0, void 0, function* () {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: key,
        });
        return (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 3600 });
    });
}
function getObjectText(key) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const command = new client_s3_1.GetObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: key,
        });
        const { Body } = yield s3.send(command);
        if (!Body || !(Body instanceof stream_1.Readable)) {
            throw new Error("Invalid stream returned by S3");
        }
        const chunks = [];
        try {
            for (var _d = true, Body_1 = __asyncValues(Body), Body_1_1; Body_1_1 = yield Body_1.next(), _a = Body_1_1.done, !_a; _d = true) {
                _c = Body_1_1.value;
                _d = false;
                const chunk = _c;
                chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = Body_1.return)) yield _b.call(Body_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return Buffer.concat(chunks).toString("utf-8");
    });
}
function listObjectsFromPrefix(prefix) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const command = new client_s3_1.ListObjectsV2Command({
            Bucket: process.env.BUCKET_NAME,
            Prefix: prefix,
        });
        const response = yield s3.send(command);
        return ((_a = response.Contents) === null || _a === void 0 ? void 0 : _a.map((obj) => obj.Key)) || [];
    });
}
