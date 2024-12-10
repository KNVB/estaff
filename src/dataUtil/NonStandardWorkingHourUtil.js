import FetchAPI from "../util/FetchAPI";
export default class NonStandardWorkingHourUtil {
    #fetchAPI;
    constructor() {
        this.#fetchAPI = new FetchAPI();
    }
    async getNonStandardWorkingHourList(year, month) {
        return await this.#fetchAPI.getNonStandardWorkingHourList(year, month + 1);
    }
}