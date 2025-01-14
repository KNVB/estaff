import "./RosterSchedulerTable.css";
import { useEffect } from "react";
import useRosterSchedulerTable from "./useRosterSchedulerTable";
import AutoPlanForm from "./autoPlan/AutoPlanForm.jsx";
import HeaderRows from "../../common/rows/HeaderRows";
import RosterSchedulerBody from "./RosterSchedulerBody.jsx";
import ShiftInfoLegend from "../../common/ShiftInfoLegend.jsx";
export default function RosterSchedulerTable({ dataAction, rosterSchedulerData }) {
    const { activeShiftList, calendarDateList, nonStandardWorkingHourSummary, rosterMonth, systemParam } = rosterSchedulerData;
    const rosterSchedulerTableUtil = useRosterSchedulerTable(rosterSchedulerData);
    useEffect(() => {
        const mouseUp = () => rosterSchedulerTableUtil.endSelect();
        document.addEventListener("mouseup", mouseUp);
        return () => {
            document.removeEventListener("mouseup", mouseUp);
        };
    }, [rosterSchedulerTableUtil]);
    return (
        <table className="m-1 p-0 rosterTable">
            <HeaderRows
                caption="EMSTF Staff Roster Scheduler"
                calendarDateList={calendarDateList}
                dataAction={dataAction}
                highLightAction={rosterSchedulerTableUtil}
                rosterMonth={rosterMonth}
                systemParam={systemParam} />
            <RosterSchedulerBody
                dataAction={dataAction}
                rosterSchedulerData={rosterSchedulerData}
                rosterSchedulerTableUtil={rosterSchedulerTableUtil} />
            <tfoot>
                <tr>
                    <td colSpan="7" className="mt-1">
                        <ShiftInfoLegend activeShiftList={activeShiftList} />
                    </td>
                    <td className="p-1" colSpan={20}>
                        <AutoPlanForm
                            dataAction={dataAction}
                            rosterSchedulerData={rosterSchedulerData} />
                        <div className="d-flex flex-row ms-1">
                            <div className="d-flex flex-column flex-grow-1 mb-1">
                                <div className="d-flex flex-grow-1 justify-content-center">
                                    <div className="clearAllButton" onClick={dataAction.clearAllShiftData}>Clear All Shift Data</div>
                                </div>
                                <div className="d-flex flex-grow-1 justify-content-center mt-1">
                                    <div className="exportButton" onClick={dataAction.exportRosterDataToExcel}>Export To Excel File</div>
                                </div>
                            </div>
                            <div className="d-flex flex-column flex-grow-1">
                                <div className="d-flex flex-grow-1 justify-content-center">
                                    <div className="fillEmptyShiftWithOButton" onClick={dataAction.fillEmptyShiftWithO}>Fill empty shift with "O"</div>
                                </div>
                                <div className="d-flex flex-grow-1 justify-content-center mt-1">
                                    <div className="saveRosterToDBButton" onClick={dataAction.saveRosterToDB}>Save All Data To DB</div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            </tfoot>
        </table>
    );
}