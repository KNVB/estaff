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
    async search(dn, opts) {
        const entries = [];
        let referrals = [];
        return new Promise((resolve, reject) => {
            this.#client.search(dn, opts, function (err, response) {
                response.on('searchEntry', function (entry) {
                    entries.push(entry);
                });
                response.on('searchReference', referral => {
                    referrals = referrals.concat(referral.uris);
                });
                response.on('error', error => {
                    return reject(error);
                })
                response.on('end', result => {
                    if (result.status !== 0) {
                        return reject(result.status);
                    }

                    return resolve({
                        entries: entries,
                        referrals: referrals
                    });
                });
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