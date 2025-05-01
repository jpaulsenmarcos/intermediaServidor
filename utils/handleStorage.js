const multer = require("multer")
const memory = multer.memoryStorage()

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const pathStorage = _dirname + "/../storage";
        callback(null, pathStorage)
    },
    filename: (req, file, callback) => {
        const ext = file.originalname.split(".").pop()
        const filename = "file-" + Date.now() + "." + ext
        callback(null, filename)
    }
})

const uploadMiddleware = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })
const uploadMiddlewareMemory = multer({ storage: memory, limits: { fileSize: 5 * 1024 * 1024 } })
module.exports = { uploadMiddleware, uploadMiddlewareMemory }