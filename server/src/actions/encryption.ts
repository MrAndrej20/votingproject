import nf = require("node-forge");

var iv = "&Y,')6rOcnQ?IHBMU[QTM\-rF][tLk{";
export ={
    encrypt: (data, key) => {
        const cipher = nf.cipher.createCipher("AES-CBC", key);
        cipher.start({ iv });
        cipher.update(nf.util.createBuffer(new Buffer(data)));
        cipher.finish();
        return cipher.output.data;
    },
    decript: (data, key) => {
        const decipher = nf.cipher.createDecipher("AES-CBC", key);
        decipher.start({iv});
        decipher.update(data);
        decipher.finish();
        return decipher.output.data;
    }
}