import handleAPIError from "../../common/handleAPIError.jsx";
import useRosterScheduler from "./useRosterScheduler";
import Loading from "../../common/Loading.jsx";
import RosterSchedulerTable from "./RosterSchedulerTable.jsx";
export default function RosterScheduler(){
    const { error, isLoading, rosterSchedulerData, dataAction } = useRosterScheduler();    
    let result;
    switch (true){
        case (error):
            result=handleAPIError(error);
            break;
        case (isLoading):
            result=<Loading />;
            break;
        default:
            document.title = "EMSTF Staff Roster Scheduler";
            result=<RosterSchedulerTable dataAction={dataAction} rosterSchedulerData={rosterSchedulerData} />
            break;
    };
    return result;        
}