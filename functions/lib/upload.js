const functions = require("firebase-functions");
const admin = require("firebase-admin");
if (process.env.NODE_ENV === "production") {
    admin.initializeApp(functions.config().firebase);
}
else {
    // Dev mode
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(require("../../serviceAccountKey.json")),
            storageBucket: "mototrax-8fa96.appspot.com"
        });
    }
}
module.exports = function uploadImageToStorage(file) {
    console.log("file", file);
    const storage = admin.storage();
    return new Promise((resolve, reject) => {
        const fileUpload = storage.bucket().file(`${Date.now()}_${file.name}`);
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });
        blobStream.on("error", error => reject(error));
        blobStream.on("finish", () => {
            fileUpload
                .getMetadata()
                .then(metadata => resolve(metadata))
                .catch(error => reject(error));
        });
        blobStream.end(file.data);
    });
};
//# sourceMappingURL=upload.js.map