import Dbo from "../util/Dbo.js";
import Utility from "../util/Utility.js";
export default class NonStandardWorkingHour {
    constructor() {
    }
    addNonStandardWorkingHourRecord=async record=>{
        let dbo = new Dbo();
        record.id=Utility.getUID();
        try{
            return await dbo.addNonStandardWorkingHourRecord(record);
        }catch (error) {
            console.log("Something wrong when adding a Non Standard Working Hour Record to DB:" + error);
            throw (error);
        }
        finally {
            dbo.close();
        };
    }
    deleteNonStandardWorkingHourRecord=async recordId=>{
        let dbo = new Dbo();
        try{
            return await dbo.deleteNonStandardWorkingHourRecord(recordId);
        }catch (error) {
            console.log("Something wrong when deleting a Non Standard Working Hour Record to DB:" + error);
            throw (error);
        }
        finally {
            dbo.close();
        };
    }
    getNonStandardWorkingHourList = async (year, month) => {
        let dbo = new Dbo();
        let list = {}
        try {
            let resultList = await dbo.getNonStandardWorkingHourList(year, month);
            //console.log(resultList);
            resultList.forEach(record => {
                if (list[record.staff_id] === undefined) {
                    list[record.staff_id] = {
                        nonStandardWorkingHourList:{},
                        staffPost:record.staff_post,
                        staffName:record.staff_name
                    }
                }
                if (record.id !== null) {
                    let startTime = new Date(record.start_time);
                    list[record.staff_id].nonStandardWorkingHourList[startTime.getDate()] = {
                        claimType: record.claim_type,
                        description: record.description,
                        durationInHour: record.no_of_hour_applied_for,
                        endTime: record.end_time,
                        id: record.id,
                        startTime:record.start_time
                    }
                }
            });
            console.log("Get (" + year + "," + month + ") Non Standard Working Hour List successfully!");
            return list;
        } catch (err) {
            console.log("Some wrong when getting Non Standard Working Hour List:" + err);
        }
        finally {
            dbo.close();
        };
    }
    getNonStandardWorkingHourSummary = async (year, month) => {
        let dbo = new Dbo();
        let summary = {}
        try {
            let resultList = await dbo.getNonStandardWorkingHourSummary(year, month);
            resultList.forEach(record => {
                if (record.sum === null) {
                    summary[record.staff_id] = 0;
                } else {
                    summary[record.staff_id] = record.sum;
                }
            });
            console.log("Get (" + year + "," + month + ") Non Standard Working Hour Summary successfully!");
            return summary;
        } catch (err) {
            console.log("Some wrong when getting Non Standard Working Hour Summary:" + err);
        }
        finally {
            dbo.close();
        };
    }
    updateNonStandardWorkingHourRecord=async record=>{
        let dbo = new Dbo();
        try{
            return await dbo.updateNonStandardWorkingHourRecord(record);
        }catch (error) {
            console.log("Something wrong when updating a Non Standard Working Hour Record to DB:" + error);
            throw (error);
        }
        finally {
            dbo.close();
        };
    }
}