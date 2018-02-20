"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase = require("firebase-admin");
const functions = require("firebase-functions");
firebase.initializeApp(functions.config().firebase);
module.exports = firebase;
//# sourceMappingURL=firebase.js.map