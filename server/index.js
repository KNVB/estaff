import fs from "fs";
import http from 'http';
import dotenv from 'dotenv';
import Express from 'express';
import JWT from "./util/JWT.js";
import PublicAPI from "./util/PublicAPI.js";
import PrivateAPI from "./util/PrivateAPI.js";
import SystemParam from './classes/SystemParam.js';
let app = new Express();
let httpServer = http.createServer(app);
let systemParam = await SystemParam();
dotenv.config({ path: './.env.' + process.env.NODE_ENV });
let hkoADConfig = {
    baseDN: process.env["AD_DOMAIN"],
    hkoUserDN: "OU=DFS_Drive_CS,OU=People," + process.env["AD_DOMAIN"],
    hkoGroupDN: "OU=Group Objects," + process.env["AD_DOMAIN"],
    tlsOptions: { ca: [fs.readFileSync(process.env["AD_CA_CERT"])] },
    url: process.env["AD_LDAP_URL"]
}

let jwt = new JWT(process.env.JWT_SECRET, process.env.JWT_EXPIRE_PERIOD);
app.use(Express.json());
app.use('/publicAPI', PublicAPI(hkoADConfig, jwt, systemParam));
app.use('/privateAPI', PrivateAPI(jwt, systemParam));
httpServer.listen(process.env.VITE_APP_SOCKET_PORT, () => {
    console.log('Express server is running on localhost:' + process.env.VITE_APP_SOCKET_PORT);
});