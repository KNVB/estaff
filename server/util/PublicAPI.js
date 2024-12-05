import Express from 'express';
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
    return router;
}
//====================================================================================================================================
let getRosterViewerData = async (params) => {
    let nonStandardWorkingHour=new NonStandardWorkingHour();
    let roster = new Roster();
    let rosterData=await roster.getRoster(params.year, params.month);
    let shiftInfo = new ShiftInfo();
    let sP=structuredClone(params.systemParam);
    await shiftInfo.init();

    sP.monthPickerMinDate = new Date(sP.monthPickerMinDate.year, sP.monthPickerMinDate.month - 1, sP.monthPickerMinDate.date);
    sP.noOfPrevDate = 0;
    let nonStandardWorkingHourSummary=await nonStandardWorkingHour.getNonStandardWorkingHourSummary(params.year, params.month);
    return {
        "activeShiftList":shiftInfo.activeShiftList,
        rosterData,
        systemParam:sP,
        nonStandardWorkingHourSummary
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