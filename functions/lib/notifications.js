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
const Expo = require("expo-server-sdk");
const { send } = require("micro");
const firebase = require("./firebase");
const expo = new Expo();
const db = firebase.database();
module.exports.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { token, user } = req.body;
    return db
        .ref(`users/${user}/token`)
        .set(token)
        .then(() => send(res, 200, req.body))
        .catch(err => send(res, 500, err.toString()));
});
module.exports.sendUpdate = (event) => __awaiter(this, void 0, void 0, function* () {
    const status = event.data.val();
    const track = yield db.ref(`tracks/${status.trackId}`).once("value");
    const tokens = yield db
        .ref(`favorites/${event.params.trackId}`)
        .once("value")
        .then(snap => {
        const users = snap.val();
        return Promise.all(Object.keys(users || {})
            .filter(id => users[id]) // Only if favorited is true
            .map(userId => db
            .ref(`users/${userId}/token`)
            .once("value")
            .then(token => token.val())));
    });
    const messages = tokens.map(to => ({
        to,
        sound: "default",
        body: `${track.val().name} updated with a new status! \nTrack is ${status.open ? "open" : "closed"} with condition: ${status.condition}`,
        data: { withSome: "data" }
    }));
    return expo
        .chunkPushNotifications(messages)
        .map((chunk) => __awaiter(this, void 0, void 0, function* () { return yield expo.sendPushNotificationsAsync(chunk); }));
});
//# sourceMappingURL=notifications.js.map