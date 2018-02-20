const { database, https } = require("firebase-functions");
const cors = require("micro-cors")();
const firebase = require("./firebase");
const notifications = require("./notifications");
exports.imageUpload = https.onRequest(cors(require("./upload")));
exports.registerPush = https.onRequest(cors(notifications.register));
exports.statusUpdate = database
    .ref("/tracks/{trackId}/feed/{status}")
    .onWrite(notifications.sendUpdate);
// Update favorites for push notifications
exports.onFavorite = database
    .ref("/users/{userId}/favorites/{trackId}")
    .onWrite(event => {
    const { trackId, userId } = event.params;
    return firebase
        .database()
        .ref(`/favorites/${trackId}/${userId}`)
        .set(event.data.val());
});
//# sourceMappingURL=index.js.map