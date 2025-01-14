import Express from 'express';
import HKOAD from "./HKO_AD.js";
import NonStandardWorkingHour from "../classes/NonStandardWorkingHour.js";
import Roster from "../classes/Roster.js";
import ShiftInfo from "../classes/ShiftInfo.js";
export default function PublicAPI(hkoADConfig, jwt, systemParam) {
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
            case "login":
                sendResponse(res, doADLogin, { hkoADConfig, jwt, loginObj: req.body.loginObj });
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
let doADLogin = async (params) => {
    let hkoAd = new HKOAD(params.hkoADConfig);
    let loginObj = params.loginObj;
    let jwt = params.jwt;
    try {
        //console.log(loginObj);
        await hkoAd.login(loginObj.userName + "@ad.hko.hksarg", loginObj.userPassword);
        let adUserObj = await hkoAd.getUserObj(loginObj.userName);
        let temp = {
            cn: adUserObj[0].cn,
            department: adUserObj[0].department,
            givenName: adUserObj[0].givenName,
            loginName: adUserObj[0].sAMAccountName,
            sn: adUserObj[0].sn,
            title: adUserObj[0].title
        }
        return jwt.sign(temp);
    } catch (error) {
        /*
        console.log("Something Wrong:");
        console.log(error);
        */
        throw error;
    }
    finally {
        await hkoAd.unbind();
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