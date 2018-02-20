const path = require("path")
const os = require("os")
const fs = require("fs")
const Busboy = require("busboy")

module.exports = async (req, res) => {
  if (
    req.method === "POST" &&
    req.headers["content-type"].startsWith("multipart/form-data")
  ) {
    const busboy = new Busboy({ headers: req.headers })
    let fileBuffer = new Buffer("")
    req.files = { file: [] }

    busboy.on("field", (fieldname, value) => {
      req.body[fieldname] = value
    })

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      file.on("data", data => {
        fileBuffer = Buffer.concat([fileBuffer, data])
      })

      file.on("end", async () => {
        try {
          const metadata = await uploadImageToStorage({
            fieldname,
            originalname: filename,
            encoding,
            mimetype,
            data: fileBuffer
          })
          res.status(200).send(metadata[0])
        } catch (e) {
          res.status(500).send(e.toString())
        }
      })
    })

    busboy.end(req.rawBody)
    req.pipe(busboy)
  }
}

function uploadImageToStorage(file) {
  const storage = require("./firebase").storage()
  console.log("file", file)

  return new Promise((resolve, reject) => {
    const fileUpload = storage.bucket().file(`${Date.now()}_${file.filename}`)
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
