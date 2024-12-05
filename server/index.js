import dotenv from 'dotenv';
import http from 'http';
import Express from 'express';
import PrivateAPI from './util/PrivateAPI.js';
import PublicAPI from "./util/PublicAPI.js";
import SystemParam from './classes/SystemParam.js';

dotenv.config({ path: './.env.' + process.env.NODE_ENV });
let app = new Express();
let httpServer = http.createServer(app);

let systemParam = await SystemParam();
app.use(Express.json());
app.use('/publicAPI', PublicAPI(null, systemParam));
app.use('/privateAPI', PrivateAPI(null, systemParam));
if (process.env.NODE_ENV === "production") {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
   
    app.use(Express.static(path.resolve(__dirname, '../build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
    });
}

httpServer.listen(process.env.VITE_APP_SOCKET_PORT, () => {
    console.log('Express server is running on localhost:' + process.env.VITE_APP_SOCKET_PORT);
});