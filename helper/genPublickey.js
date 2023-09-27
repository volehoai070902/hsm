
const decodeECPointToPublicKey = (data) => {
    if (data.length === 0 || data[0] !== 4) {
      throw new Error("Only uncompressed point format supported");
    }
    // Accoring to ASN encoded value, the first 3 bytes are
    //04 - OCTET STRING
    //41 - Length 65 bytes
    //For secp256k1 curve it's always 044104 at the beginning
    return data.slice(3, 67);
};

export default decodeECPointToPublicKey;