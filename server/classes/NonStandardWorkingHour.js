import Dbo from "../util/Dbo.js";
export default class NonStandardWorkingHour {
    constructor() {
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
            return summary;
        } catch (err) {
            console.log("Some wrong when getting Non Standard Working Hour Summary:" + err);
        }
        finally {
            dbo.close();
        };
    }
}