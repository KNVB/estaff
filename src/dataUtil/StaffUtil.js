import FetchAPI from "../util/FetchAPI";
export default class StaffUtil {
    #fetchAPI;
    constructor() {
        this.#fetchAPI = new FetchAPI();
    }
    async addStaffInfo(staffInfo) {
        return await this.#fetchAPI.addStaffInfo(staffInfo);
    }
    async getStaffList() {
        return await this.#fetchAPI.getStaffList();
    }
    async updateStaffInfo(staffInfo) {
        return await this.#fetchAPI.updateStaffInfo(staffInfo);
    }
}