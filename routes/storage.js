const express = require('express');
const router = express.Router();
const { uploadMiddleware, uploadMiddlewareMemory } = require('../utils/handleStorage.js');
const { uploadImage } = require('../controllers/storage.js');
const authMiddleware = require('../middleware/session.js');

router.patch("/", authMiddleware, uploadMiddlewareMemory.single("image"), (err, req, res, next) => {
    console.log("ERROR:::::::: ", err.code)
    res.status(413).send("Error capturado")
}, uploadImage)

module.exports = router;