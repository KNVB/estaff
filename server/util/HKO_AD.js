import LDAP from "./LDAP.js";
export default class HKO_AD {
    #baseDN;
    #hkoUserDN;
    #hkoGroupDN;
    #ldap;
    constructor(config) {
        this.#baseDN = config.baseDN;
        this.#ldap = new LDAP(config);
        this.#hkoUserDN = config.hkoUserDN;
        this.#hkoGroupDN = config.hkoGroupDN;

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