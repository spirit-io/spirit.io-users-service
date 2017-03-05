const crypto = require('crypto');


/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
export function genRandomString(length: number) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
export function sha512(password: string, salt: string) {
    let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    let value = hash.digest('hex');
    return {
        salt: salt,
        hash: value
    };
};



