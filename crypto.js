const { createHmac } = require(`node:crypto`)

function genH(secret) {
    return createHmac("sha512", secret).digest("hex");
}

function genRCode() {
    let s = '';
    for (i = 0; i < 6; i++)
        s += (Math.floor(Math.random() * 10)).toString();
    return s;
}

function genReCode() {
    return createHmac("sha512", genRCode()).digest("hex").slice(0, 6);
}

module.exports = {
    genHash: (secret) => genH(secret),
    genCode: () => genRCode(),
    genRecoveryCode: () => genReCode()
}