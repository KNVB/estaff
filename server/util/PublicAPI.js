import fs from "fs";
import Express from 'express';
import HKOAD from "./HKO_AD.js";
import NonStandardWorkingHour from "../classes/NonStandardWorkingHour.js";
import Roster from "../classes/Roster.js";
import ShiftInfo from "../classes/ShiftInfo.js";
export default function PublicAPI(adminUtil, systemParam) {
    const router = Express.Router();
    router.get('/:action', async (req, res, next) => {
        switch (req.params.action) {
            case "getRosterViewerData":
                sendResponse(res, getRosterViewerData, {
                    month: req.query.month, year: req.query.year,
                    systemParam
                });
                break;
          
            default:
                next();
                break;
        }
    });
    router.post('/:action', async (req, res, next) => {
        switch (req.params.action) {
            case "loginAD":
                sendResponse(res, loginAD, {
                    adUserName: req.body.adUserName,
                    adPassword: req.body.adPassword
                });
                break;
            default:
                next();
                break;
        }
    });
    return router;
}
//====================================================================================================================================
let getRosterViewerData = async (params) => {
    let nonStandardWorkingHour = new NonStandardWorkingHour();
    let roster = new Roster();
    let rosterData = await roster.getRoster(params.year, params.month);
    let shiftInfo = new ShiftInfo();
    let sP = structuredClone(params.systemParam);
    await shiftInfo.init();

    sP.monthPickerMinDate = new Date(sP.monthPickerMinDate.year, sP.monthPickerMinDate.month - 1, sP.monthPickerMinDate.date);
    sP.noOfPrevDate = 0;
    let nonStandardWorkingHourSummary = await nonStandardWorkingHour.getNonStandardWorkingHourSummary(params.year, params.month);
    return {
        "activeShiftList": shiftInfo.activeShiftList,
        rosterData,
        systemParam: sP,
        nonStandardWorkingHourSummary
    }
}
let loginAD = async params => {
    let config = {
        baseDN: process.env["AD_DOMAIN"],
        hkoUserDN: "OU=DFS_Drive_CS,OU=People," + process.env["AD_DOMAIN"],
        hkoGroupDN: "OU=Group Objects," + process.env["AD_DOMAIN"],
        tlsOptions: { ca: [fs.readFileSync(process.env["AD_CA_CERT"])] },
        url: process.env["AD_LDAP_URL"]
    };
    //console.log(config);
    let hkoAD = new HKOAD(config);
    try {
        await hkoAD.bind(params.adUserName + "@ad.hko.hksarg", params.adPassword);
        //console.log(result);
        return true
    } catch (error) {
        throw (error)
    } finally {
        await hkoAD.unbind();
    }
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