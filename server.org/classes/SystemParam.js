import Dbo from "../util/Dbo.js";
export default async function SystemParam() {
    let dbo = new Dbo();

    let finalResult = {
        maxConsecutiveWorkingDay: 0,
        monthPickerMinDate: {},
        noOfPrevDate: 0
    }
    try{
        let resultList=await dbo.getSystemParam();
        resultList.forEach(result => {
            switch (result.param_type) {
                case 'ConsecutiveWorkingDay':
                    finalResult.maxConsecutiveWorkingDay = parseInt(result.param_value);
                    break;
                case "NoOfShiftPerMonth":
                    finalResult.maxNoOfShiftPerMonth = parseInt(result.param_value);
                    break;
                case 'monthPicker':
                    finalResult.monthPickerMinDate = JSON.parse(result.param_value);
                    break;
                case 'tables':
                    finalResult.noOfPrevDate = parseInt(result.param_value);
                    break;
                default:
                    break;
            }
        })
        console.log("Get System Parameter successfully!");
        return finalResult;
    }
    catch(err) {
        console.log("Some wrong when getting System Parameter:" + err);
    }
    finally{
        dbo.close();
    };  
}