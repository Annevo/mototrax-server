"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase = require("firebase-functions");
const { send } = require("micro");
const { upload, move } = require("micro-upload");
const uploadImageToStorage = require("./upload");
const endpoint = upload((req, res) => __awaiter(this, void 0, void 0, function* () {
    if (!req.files) {
        return send(res, 400, "no file uploaded");
    }
    try {
        const metadata = yield uploadImageToStorage(req.files.file);
        send(res, 200, metadata[0]);
    }
    catch (e) {
        send(res, 500, e.toString());
    }
}));
exports.api = firebase.https.onRequest(endpoint);
// module.exports = endpoint
//# sourceMappingURL=index.js.map