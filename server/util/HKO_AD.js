import LDAP from "./LDAP.js";
import Utility from "./Utility.js";
export default class HKO_AD {
    #hkoUserDN;
    #ldap;
    constructor(config) {
        this.#ldap = new LDAP(config);
        this.#hkoUserDN = "OU=DFS_Drive_CS,OU=People," + config.baseDN;
        //this.#hkoGroupDN = "OU=Group Objects," + config.baseDN;
    }
    async login(userName, password) {
        return await this.#ldap.bind(userName, password);
    }
    async getUserObj(loginName) {
        let opts = {
            attributes: ['*'],
            "filter": "(sAMAccountName=" + Utility.escapeForQuery(loginName) + ")",
            "scope": "sub"
        };        
        let searchResult = await this.search(this.#hkoUserDN, opts);
        return searchResult;
    }
    async search(dn, opts) {
        let temp = await this.#ldap.search(dn, opts);
        let obj = {}, result = [];
        temp.entries.forEach(item => {
            obj = {};
            item.pojo.attributes.forEach(attribute => {
                obj[attribute.type] = ((attribute.values.length > 1) ? attribute.values : attribute.values[0]);
            })
            result.push(obj);
        })
        return result;
    }
    async unbind() {
        await this.#ldap.unbind();
    }
}