const { createHmac } = require(`node:crypto`)

module.exports = {
    genHash: (secret) => createHmac("sha512", secret).digest("hex")
}