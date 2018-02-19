const firebase = require("firebase-functions")
const { send } = require("micro")
const { upload, move } = require("micro-upload")

const uploadImageToStorage = require("./upload")

const endpoint = upload(async (req, res) => {
  if (!req.files) {
    return send(res, 400, "no file uploaded")
  }

  try {
    const metadata = await uploadImageToStorage(req.files.file)
    send(res, 200, metadata[0])
  } catch (e) {
    send(res, 500, e.toString())
  }
})

export const api = firebase.https.onRequest(endpoint)

// module.exports = endpoint
