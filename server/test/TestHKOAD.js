import HKO_AD from '../util/HKO_AD.js';
import dotenv from 'dotenv';
import fs from "fs";

dotenv.config({ path: './.env.' + process.env.NODE_ENV });
let config = {
    baseDN: process.env["AD_DOMAIN"],
    hkoUserDN: "OU=DFS_Drive_CS,OU=People," + process.env["AD_DOMAIN"],
    hkoGroupDN: "OU=Group Objects," + process.env["AD_DOMAIN"],
    tlsOptions: { ca: [fs.readFileSync(process.env["AD_CA_CERT"])] },
    url: process.env["AD_LDAP_URL"]
}
//console.log(config);
let hkoAD=new HKO_AD(config);
try{
    await hkoAD.bind("cstsang","Mount@in41");
}catch (error){
    console.log(error.message);
}finally{
    await hkoAD.unbind();
}

