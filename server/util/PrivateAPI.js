import Express from 'express';
import ShiftInfo from "../classes/ShiftInfo.js";
import StaffInfo from '../classes/StaffInfo.js';
export default function PrivateAPI(adminUtil, systemParam) {
    const router = Express.Router();
    //===================================================================================================    
    /*
    router.use((req, res, next) => {
        let isAuthenticated = adminUtil.isAuthenticated(req.headers['access-token']);
        console.log("PrivateAPI:access token:" + req.headers['access-token'] + ",isAuthenticated=" + isAuthenticated);
        if (isAuthenticated) {
            next();
        } else {
            res.status(401).send("You are not authorized to access this API, please login first.");
        }
    });
    */
    router.get('/:action', async (req, res, next) => {
        switch (req.params.action) {
            case "getActiveShiftList":
                sendResponse(res, getActiveShiftList);
                break
            case "getStaffList":
                sendResponse(res, getStaffList);
                break;
            /*
            case "getRosterSchedulerData":
                sendResponse(res, getRosterSchedulerData, { month: req.query.month, "systemParam": systemParam, "year": req.query.year });
                break;*/
            default:
                next();
                break;
        }
    });
    return router;
}
//====================================================================================================================================
let getActiveShiftList = async () => {
    let shiftInfo = new ShiftInfo();
    await shiftInfo.init();
    return shiftInfo.activeShiftList;
}
let getStaffList = async () => {
    let staffInfo = new StaffInfo();
    return await staffInfo.getStaffList();
}
//====================================================================================================================================
let sendResponse = async (res, action, param) => {
    try {
        res.send(await action(param));
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
}