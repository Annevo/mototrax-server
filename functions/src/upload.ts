const { upload } = require("micro-upload")

module.exports = upload(async (req, res) => {
  const { send } = require("micro")
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

function uploadImageToStorage(file) {
  const storage = require("./firebase").storage()
  console.log("file", file)

  return new Promise((resolve, reject) => {
    const fileUpload = storage.bucket().file(`${Date.now()}_${file.name}`)
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    })

    blobStream.on("error", error => reject(error))

    blobStream.on("finish", () => {
      fileUpload
        .getMetadata()
        .then(metadata => resolve(metadata))
        .catch(error => reject(error))
    })

    blobStream.end(file.data)
  })
}
