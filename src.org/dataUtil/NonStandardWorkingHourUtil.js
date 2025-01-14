import FetchAPI from "../util/FetchAPI";
export default class NonStandardWorkingHourUtil {
    #fetchAPI;
    constructor() {
        this.#fetchAPI = new FetchAPI();
    }
    async addRecord(record){
        return await this.#fetchAPI.addNonStandardWorkingHourRecord(record);
    }
    async deleteRecord(recordId){
        return await this.#fetchAPI.deleteNonStandardWorkingHourRecord(recordId);
    }
    async getNonStandardWorkingHourList(year, month) {
        return await this.#fetchAPI.getNonStandardWorkingHourList(year, month + 1);
    }
    async updateRecord(record){
        return await this.#fetchAPI.updateNonStandardWorkingHourRecord(record);
    }
}