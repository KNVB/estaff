import axios from "axios";
import fs from 'fs';
import https from 'https';
export default class FetchAPI {
    #api;
    constructor() {
        //================================================================================================================
        // create and configure an axios instance
        // src:https://stackoverflow.com/questions/76116501/axios-response-interceptor-strange-behavior?noredirect=1#comment134237075_76116501
        this.#api = axios.create();
        this.#api.interceptors.response.use(
            null, // default success handler
            (error) => {
                //console.log(error.toJSON());
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
    async fetch(data, method, url, responseType, headers, hkoRootCertPath) {
        const requestObj = {
            url,
            method,
            responseType,
            headers,
            httpsAgent: new https.Agent({ ca: fs.readFileSync(hkoRootCertPath) }),
            [method.toLowerCase() === "get" ? "params" : "data"]: data,
        };
        console.log("=======================");
        console.log("headers="+headers);
        console.log("method=" + method);
        console.log("params=" + data);
        console.log("url=" + url);
        console.log("=======================");
        return (await this.#api(requestObj)).data; // use the created instance
    }

}