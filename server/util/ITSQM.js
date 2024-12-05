import FetchAPI from "./FetchAPI.js";
export default class ITSQM {
    #commonParam = {
        "list_info": {
            "row_count": 100,
            "start_index": 0,
            "sort_field": "id",
            "sort_order": "asc",
            "get_total_count": true
        }
    };
    #fetchAPI;
    #hkoRootCertPath;
    #hostName;
    #headers;
    #v3APIPath;
    constructor(itsqmServer, hkoRootCertPath, technicianKey) {
        this.#hostName = "https://" + itsqmServer;
        //let v1API = this.#hostName + "/sdpapi/";
        //let v3API = this.#hostName + "/api/v3";
        this.#v3APIPath = this.#hostName + "/api/v3";
        this.#fetchAPI = new FetchAPI();
        this.#hkoRootCertPath = hkoRootCertPath;
        this.#headers = { "authtoken": technicianKey };
    }
    addTimeOffRecord = async () => {
        let method = "post";
        //let params = structuredClone(this.#commonParam);
        let url = this.#v3APIPath + "/requests";
        let params = {
            "request": {
                "description": "EMSTF Time off/Over time application",
                "requester": {
                    "id": "6906",
                    "name": "Leo Wa Sang SZE"
                },
                "subject": "EMSTF Time off/Over time application",
                "template": {
                    "id": "3906"
                },
                "udf_fields": {
                    "udf_pick_5705": "Time Off", //Claim Type
                    "udf_date_5706": {    //End Time
                        "value": "1541060100000"
                    },
                    "udf_date_5707": {   //Start Time
                        "value": "1541146542726"
                    },
                    "udf_decimal_5708":  10.0, //Remaining Time off balance
                    "udf_decimal_5709": 9 //Time off balance available
                }
            }
        };
        let response = await this.#fetchAPI.fetch(
            new URLSearchParams({ input_data: JSON.stringify(params) }),
            method,
            url,
            "json",
            this.#headers,
            this.#hkoRootCertPath);
        console.log(response);
    }
    getEMSTFTeamMember = async () => {
        let method = "get";
        let params = structuredClone(this.#commonParam);
        let url = this.#v3APIPath + "/users";
        params.list_info["search_criteria"] = [
            {
                "condition": "starts with",
                "field": "jobtitle",
                "logical_operator": "and",
                "values": ["ITO"]
            },
            {
                "condition": "starts with",
                "field": "jobtitle",
                "logical_operator": "or",
                "values": ["SITO"]
            },
        ];
        params["fields_required"] = [
            "email_id",
            "id",
            "name",
            "jobtitle",
            "status"
        ];

        let response = await this.#fetchAPI.fetch(
            new URLSearchParams({ input_data: JSON.stringify(params) }),
            method,
            url,
            "json",
            this.#headers,
            this.#hkoRootCertPath);
        return response.users
    }
    query = async query => {
        let data = { "query": query };

        let url = this.#v3APIPath + '/reports/execute_query';
        let response = await this.#fetchAPI.fetch(
            new URLSearchParams({ input_data: JSON.stringify(data) }),
            "post",
            url,
            "json",
            this.#headers,
            this.#hkoRootCertPath);
        return response.execute_query.data;
    }
}