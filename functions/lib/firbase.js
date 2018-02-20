const firebase = require("firebase-admin");
if (process.env.NODE_ENV === "production") {
    firebase.initializeApp(functions.config().firebase);
}
else {
    // Dev mode
    if (!firebase.apps.length) {
        firebase.initializeApp({
            credential: firebase.credential.cert(require("../../serviceAccountKey.json")),
            storageBucket: "mototrax-8fa96.appspot.com"
        });
    }
}
module.exports = firebase;
//# sourceMappingURL=firbase.js.map