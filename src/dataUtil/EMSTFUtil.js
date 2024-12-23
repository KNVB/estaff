import FetchAPI from "../util/FetchAPI";
export default class EMSTFUtil {
    constructor() {

    }
    login = async (userName, usePassword) => {
        let fetchAPI = new FetchAPI();
        try{
            return await fetchAPI.emstfLogin(userName, usePassword);
        }catch (error){
            throw error.message
        }        
    }
}