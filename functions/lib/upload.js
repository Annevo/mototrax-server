var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { upload } = require("micro-upload");
module.exports = upload((req, res) => __awaiter(this, void 0, void 0, function* () {
    const { send } = require("micro");
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
function uploadImageToStorage(file) {
    const storage = require("./firebase").storage();
    console.log("file", file);
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
}
//# sourceMappingURL=upload.js.map