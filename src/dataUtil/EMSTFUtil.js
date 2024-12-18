import FetchAPI from "../util/FetchAPI";
export default class EMSTFUtil {
    constructor() {

    }
    adLogin = async (userName, usePassword) => {
        let fetchAPI = new FetchAPI();
        try{
            return await fetchAPI.adLogin(userName, usePassword);
        }catch (error){
            throw error.message
        }        
    }
}