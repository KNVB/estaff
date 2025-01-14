import jwt from "jsonwebtoken";
export default class JWT {
    #accessTokenSecret;
    #expirePeriod;
    constructor(secret, expirePeriod) {
        this.#accessTokenSecret = secret;
        this.#expirePeriod = expirePeriod;
    }
    isValid = async token => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, accessTokenSecret, (err, user) => {
                if (err) {
                    reject(err)
                }
                resolve(user)
            });
        });
    }
    sign = (dataObj) => {
        return jwt.sign(dataObj, this.#accessTokenSecret, { expiresIn: this.#expirePeriod });
    }
}