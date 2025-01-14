import FetchAPI from "./FetchAPI";
export default class EMSTFUtil {
    constructor() {

    }
    login = async (userName, userPassword) => {
        let fetchAPI = new FetchAPI();
        try {
            return await fetchAPI.login({ userName, userPassword });
        } catch (error) {
            throw error.message
        }
    }
}