import forge = require("node-forge");
var iv = "jDL3Q23ph27Lg83Q";
export ={
    encrypt: (data, key) => {
        const cipher = forge.cipher.createCipher("AES-CBC", key);
        cipher.start({ iv });
        cipher.update(forge.util.createBuffer(new Buffer(data)));
        cipher.finish();
        return cipher.output.data;
    },
    decript: (data, key) => {
        const decipher = forge.cipher.createDecipher("AES-CBC", key);
        decipher.start({iv});
        decipher.update(data);
        decipher.finish();
        return decipher.output.data;
    }
}