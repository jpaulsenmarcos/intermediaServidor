const handleHttpError = (res, message, code = 409) => {
    res.status(code).send(message)
    console.log("ERROR")
}

module.exports = { handleHttpError }