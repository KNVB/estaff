import axios from "axios";
import Utility from "./Utility";
export default class FetchAPI {
    #api;
    constructor() {
        //================================================================================================================
        // create and configure an axios instance
        // src:https://stackoverflow.com/questions/76116501/axios-response-interceptor-strange-behavior?noredirect=1#comment134237075_76116501
        this.#api = axios.create({
            baseURL: import.meta.env.VITE_APP_SOCKET_URL,
        });
        // add the response interceptor
        this.#api.interceptors.response.use(
            null, // default success handler
            (error) => {
                console.warn(error.toJSON());
                return Promise.reject({
                    status: error.response?.status,
                    message:
                        error.response?.data ?? error.response?.statusText ?? error.message,
                });
            },
            {
                synchronous: true, // optimise interceptor handling
            }
        );
    }
    addStaffInfo = async staffInfo => {
        return (await this.#secureFetch({ "staffInfo": staffInfo }, "post", "/privateAPI/addStaffInfo"));
    }
    exportRosterDataToExcel = async genExcelData => {
        return (await this.#secureFetch(genExcelData, "post", "/privateAPI/exportRosterDataToExcel", "blob"));
    }
    getActiveShiftList = async () => {
        return (await this.#secureFetch(null, "get", "/privateAPI/getActiveShiftList"));
    }
    getRosterSchedulerData = async (year, month) => {
        return (await this.#secureFetch({ year: year, month: month }, "get", "/privateAPI/getRosterSchedulerData"));
    }
    getRosterViewerData = async (year, month) => {
        return (await this.#fetch({ year: year, month: month }, "get", "/publicAPI/getRosterViewerData"));
    }
    getStaffList = async () => {
        return (await this.#secureFetch(null, "get", "/privateAPI/getStaffList"));
    }
    login = async loginObj => {
        return await this.#fetch({ loginObj: loginObj }, "post", "/publicAPI/login");
    }
    logout = async () => {
        return await this.#secureFetch(null, "get", "/privateAPI/logout");
    }
    saveToDB = async (preferredShiftList, roster, rosterMonth) => {
        return (await this.#secureFetch({ preferredShiftList, roster, rosterMonth }, "post", "/privateAPI/updateRoster"));
    }
    updateStaffInfo = async staffInfo => {
        return (await this.#secureFetch({ "staffInfo": staffInfo }, "post", "/privateAPI/updateStaffInfo"));
    }
    //================================================================================================================================
    #downloadFile = (fileName, responseData) => {
        const newBlob = new Blob([responseData]);
        const objUrl = window.URL.createObjectURL(newBlob);
        const link = document.createElement("a");
        link.href = objUrl;
        link.download = fileName;
        link.click();
    }
    #extractFileName = disposition => {
        let result = disposition;
        let firstIndex = result.indexOf("filename=");
        result = result.substring(firstIndex + 9);
        return result;
    }
    #fetch = async (data, method, url, responseType, headers) => {
        const requestObj = {
            url,
            method,
            responseType,
            headers,
            [method.toLowerCase() === "get" ? "params" : "data"]: data,
        };
        console.log(requestObj);
        const response = await this.#api(requestObj);
        if (response.request.responseType === "blob") {
            let fileName = this.#extractFileName(response.headers["content-disposition"]);
            this.#downloadFile(fileName, response.data);
        }
        return response.data;
    }
    #secureFetch = async (data, method, url, responseType) => {        
        let result=await this.#fetch(data, method, url, responseType, {"Authorization": "Bearer "+sessionStorage.getItem("accessToken")});;
        //console.log(result);
        let identity = Utility.decodeJWT(result.accessToken);
        sessionStorage.setItem("accessToken", result.accessToken);
        sessionStorage.setItem("identity",identity);
        return result.result; 
    }
}