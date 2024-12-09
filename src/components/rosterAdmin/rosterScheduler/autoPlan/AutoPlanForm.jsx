import "./AutoPlanForm.css";
import useAutoPlanForm from "./useAutoPlanForm";

export default function AutoPlanForm({ rosterSchedulerData, dataAction }) {
    const { startDate, endDate, isReady, iterationCount,planResult, action } = useAutoPlanForm(rosterSchedulerData, dataAction);
    let load=index=>{
        dataAction.load(planResult[index]);
    }
    if (isReady) {        
        return (
            <table className="mt-1">
                <thead>
                    <tr>
                        <td>Auto Planning Start From:</td>
                        <td colSpan={2}>
                            <select onChange={action.updateStartDate} value={startDate}>
                                {
                                    rosterSchedulerData.calendarDateList.map(calendarDate => (
                                        <option key={"startDate_" + calendarDate.dateOfMonth} value={calendarDate.dateOfMonth}>{calendarDate.dateOfMonth}</option>
                                    ))
                                }
                            </select>
                            &nbsp;to&nbsp;
                            <select onChange={action.updateEndDate} value={endDate}>
                                {
                                    rosterSchedulerData.calendarDateList.map(calendarDate => (
                                        <option key={"endDate_" + calendarDate.dateOfMonth} value={calendarDate.dateOfMonth}>{calendarDate.dateOfMonth}</option>
                                    ))
                                }
                            </select>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Iteration Count:</td>
                        <td><input min="1" onChange={action.updateIterationCount} type="number" value={iterationCount} /></td>
                        <td>&nbsp;<div className="autoPlannerButton" onClick={action.autoPlan}>Auto Planner</div></td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={3} >
                         {(planResult.length>0) && 
                            <>
                                <div>AutoPlan result:</div>
                                <ul>
                                    {
                                        planResult.map((result,index)=>(
                                            <li className="cursor-pointer" 
                                                key={"item_"+index} 
                                                onClick={()=>load(index)}>
                                                    Vacant Shift Count: {Object.keys(result.vacantShiftList).length}
                                            </li>
                                        ))
                                    }
                                </ul>
                            </>                            
                         }
                        </td>
                    </tr>
                </tfoot>
            </table>
        )
    }
} 