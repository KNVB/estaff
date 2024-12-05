import Dbo from "../util/Dbo.js";
export default class ShiftInfo {
    constructor(){
        this.activeShiftList = {};
        this.essentialShift = "";
    }
    getITOBlackListShiftPattern = async (year, month) => {
        let dboObj = new Dbo();
        let itoBlackListShiftPattern = {};
        try {
            let results = await dboObj.getITOBlackListShiftPattern(year, month);
            console.log("Get (" + year + "," + month + ") ITO black list shift pattern successfully!");
            results.forEach(record => {
                if (itoBlackListShiftPattern[record.ito_id] === undefined) {
                    itoBlackListShiftPattern[record.ito_id] = [];
                }
                if (record.black_list_pattern){
                    itoBlackListShiftPattern[record.ito_id].push(record.black_list_pattern);
                }                
            });
            return itoBlackListShiftPattern;
        } catch (error) {
            console.log("Something wrong when getting ITO black list shift pattern:" + error);
            console.log(itoBlackListShiftPattern);
            throw (error);
        }
        finally {
            dboObj.close();
        };
    }
    async init(){
        let dboObj = new Dbo();
        try{
            let results = await dboObj.getActiveShiftList();
            results.forEach(record => {
                let shift = {};
                shift.cssClassName = record.css_class_name;
                shift.duration = parseFloat(record.shift_duration);
                shift.isEssential = (record.is_essential === 1);
                shift.timeSlot = record.time_slot;
                shift.type = record.shift_type;
                this.activeShiftList[shift.type] = shift;
                if (record.is_essential === 1) {
                    this.essentialShift += shift.type;
                }
            });
            console.log("Get All Active Shift Info. success.");
        }catch (error) {
            console.log("An error occur when getting active shift list from DB.");
            throw (error);
        } finally {
            dboObj.close();
        }
    }
}