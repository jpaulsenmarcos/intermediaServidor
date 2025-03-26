const pinataUrl = "https://api.pinata.cloud/pinning/pinFileToIPFS";
const uploadToPinata = async (fileBuffer, filneName) => {
    let data = new FormData();
    const blob = new Blob([fileBuffer])
    const metadata = JSON.stringify({
        name: filneName
    });
    const options = JSON.stringify({
        cidVersion: 0,
    })

    data.append('file', blob, filneName);
    data.append('pinataMetadata', metadata);
    data.append('pinataOptions', options);
    try {
        const pinataApiKey = process.env.PINATA_KEY;
        const pinataSecretApiKey = process.env.PINATA_SECRET
        const response = await fetch(pinataUrl, {
            method: 'POST',
            body: data,
            headers: {
                'pinata_api_key': pinataApiKey,
                'pinata_secret_api_key': pinataSecretApiKey
            }
        });
        if (!response.ok) {
            throw new Error(`Error al subir el archivo: ${response.statusText}`);
        }
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error al subir el archivo a Pinata: ', error)
        throw error;
    }
}

module.exports = { uploadToPinata }