import dotenv from 'dotenv';
import ITSQM from "../util/ITSQM.js";

dotenv.config({ path: './.env.' + process.env.NODE_ENV });
console.log(process.env["HKO_CA_ROOT_CERT_PATH"])
console.log(process.env["ITSQM_SERVER"]);
console.log(process.env["ITSQM_SERVER_API_KEY"]);
let itsqm=new ITSQM(process.env["ITSQM_SERVER"],process.env["HKO_CA_ROOT_CERT_PATH"],process.env["ITSQM_SERVER_API_KEY"]);
//let result=await itsqm.query("select * from usergroups");
//let result=await itsqm.getEMSTFTeamMember();
//console.log(result);
await itsqm.addTimeOffRecord();
