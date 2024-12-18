import LDAP from "./LDAP.js";
export default class HKO_AD {
    #ldap;
    constructor(config) {
        this.#ldap = new LDAP(config);
        //this.#hkoUserDN = "OU=DFS_Drive_CS,OU=People," + config.baseDN;
        //this.#hkoGroupDN = "OU=Group Objects," + config.baseDN;
    }
    async bind(userName, password) {
        return await this.#ldap.bind(userName, password);
    }
    async unbind() {
        await this.#ldap.unbind();
    }
}