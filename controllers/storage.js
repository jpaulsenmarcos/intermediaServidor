const userModel = require('../models/user.js');
const { uploadToPinata } = require('../utils/handleUploadIPFS.js');
const { handleHttpError } = require('../utils/handleError.js');

const uploadImage = async (req, res) => {
    try {
        const fileBuffer = req.file.buffer;
        const filename = req.file.originalname;

        const pinataResponse = await uploadToPinata(fileBuffer, filename);
        const ipsFile = pinataResponse.IpfsHash;

        const ipfsUrl = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipsFile}`

        const userId = req.user._id;

        const user = await userModel.findByIdAndUpdate(
            userId,
            {
                logo: {
                    name: filename,
                    url: ipfsUrl
                }
            },
            { new: true }
        );

        if (!user) {
            return handleHttpError(res, 'USER_NOT_FOUND', 404);
        }
        user.set('passwd', undefined, { strict: false });
        res.json({ user: user });

    } catch (err) {
        console.log(err);
        res.status(500).send('ERROR_UPLOAD_COMPANY_IMAGE');
    }
}

module.exports = { uploadImage };