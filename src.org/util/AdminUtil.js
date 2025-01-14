import FetchAPI from "./FetchAPI";
export default class AdminUtil{
    constructor(){
        let fetchAPI=new FetchAPI();
        this.login=async loginObj=>{
            return await fetchAPI.login(loginObj);
        }
        this.logout=async()=>{
            return await fetchAPI.logout();
        }
    }
}