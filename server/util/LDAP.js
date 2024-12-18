import ldap from 'ldapjs';
export default class LDAP {
    #client;
    constructor(config) {
        try {
            this.#client = ldap.createClient(config);
        } catch (error) {
            throw error
        }
    }
    async bind(userName, password) {
        return new Promise((resolve, reject) => {
            this.#client.bind(userName, password, async err => {
                if (err) {
                    reject(err)
                }
                resolve();
            });
        });
    }
    async unbind() {
        return new Promise((resolve, reject) => {
            this.#client.unbind(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
}