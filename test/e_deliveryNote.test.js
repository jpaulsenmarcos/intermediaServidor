jest.mock('../utils/handleUploadIPFS.js', () => ({
    uploadToPinata: jest.fn().mockResolvedValue({ IpfsHash: 'fakehash' })
}));
jest.mock('axios', () => ({
    get: jest.fn().mockResolvedValue({ data: Buffer.from('PDFDATA') })
}));