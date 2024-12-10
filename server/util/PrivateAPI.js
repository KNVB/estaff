import Express from 'express';
import NonStandardWorkingHour from "../classes/NonStandardWorkingHour.js";
import Roster from "../classes/Roster.js";
import RosterExporter from "./RosterExporter.js";
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
            case "getRosterSchedulerData":
                sendResponse(res, getRosterSchedulerData, { month: req.query.month, "systemParam": systemParam, "year": req.query.year });
                break;
            default:
                next();
                break;
        }
    });
    router.post('/:action', async (req, res, next) => {
        switch (req.params.action) {
            case "addStaffInfo":
                sendResponse(res, addStaffInfo, req.body.staffInfo);
                break;
            case "updateStaffInfo":
                sendResponse(res, updateStaffInfo, req.body.staffInfo);
                break;
            case "updateRoster":
                sendResponse(res, updateRoster, req.body);
                break;
            case "exportRosterDataToExcel":
                try {
                    let rosterExporter = new RosterExporter();
                    let outputFileName = (req.body.genExcelData.year % 100) * 100 + req.body.genExcelData.month + ".xlsx";
                    res.setHeader("Content-disposition", "attachment; filename=" + outputFileName);
                    res.setHeader("Content-type", 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    res.send(await rosterExporter.export(req.body.genExcelData));
                } catch (error) {
                    console.log(error);
                    res.status(400).send(error.message);
                }
                break;
            default:
                next();
                break;
        }
    });
    return router;
}
//====================================================================================================================================
let addStaffInfo = async staffInfo => {
    let staffInfoObj = new StaffInfo();
    return await staffInfoObj.addStaffInfo(staffInfo);
}
let getActiveShiftList = async () => {
    let shiftInfo = new ShiftInfo();
    await shiftInfo.init();
    return shiftInfo.activeShiftList;
}
let getRosterSchedulerData = async params => {
    let roster = new Roster();
    let previousMonthShiftList = {};
    let shiftInfo = new ShiftInfo();
    let sP = structuredClone(params.systemParam);
    await shiftInfo.init();
    previousMonthShiftList = await roster.getPreviousMonthShiftList(params.year, params.month, params.systemParam);
    sP.monthPickerMinDate = new Date(sP.monthPickerMinDate.year, sP.monthPickerMinDate.month - 1, sP.monthPickerMinDate.date);
    return {
        activeShiftList: shiftInfo.activeShiftList,
        essentialShift: shiftInfo.essentialShift,
        blackListShiftPattern: await shiftInfo.getBlackListShiftPattern(params.year, params.month),
        preferredShiftList: await roster.getPreferredShiftList(params.year, params.month),
        previousMonthShiftList: previousMonthShiftList,
        systemParam: sP
    }
}
let getStaffList = async () => {
    let staffInfo = new StaffInfo();
    return await staffInfo.getStaffList();
}
let updateRoster = async data => {
    let roster = new Roster();
    return await roster.updateRoster(data);
}
let updateStaffInfo = async staffInfo => {
    let staffInfoUtil = new StaffInfo();
    return await staffInfoUtil.updateStaffInfo(staffInfo);
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