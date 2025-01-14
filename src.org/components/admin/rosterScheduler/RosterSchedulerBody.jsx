import EventHandler from "./EventHandler";
import ShiftRow from "./StaffShiftRow.jsx";
import PreferredShiftRow from "./PreferredShiftRow.jsx";
import VacantShiftRow from "./VacantShiftRow.jsx";
export default function RosterSchedulerBody({ dataAction, rosterSchedulerData, rosterSchedulerTableUtil }) {
    let rowList = [];
    let eventHandler = new EventHandler(dataAction, rosterSchedulerTableUtil);
    rosterSchedulerData.staffIdList.forEach(staffId => {
        rowList.push(
            <ShiftRow
                calendarDateList={rosterSchedulerData.calendarDateList}
                dataAction={dataAction}
                eventHandler={eventHandler}
                staffId={staffId}
                key={"rosterRow_" + staffId}
                nonStandardWorkingHour={rosterSchedulerData.nonStandardWorkingHourSummary[staffId]}
                previousMonthShiftList={rosterSchedulerData.previousMonthShiftList[staffId]}
                roster={rosterSchedulerData.roster[staffId]}
                rosterSchedulerTableUtil={rosterSchedulerTableUtil}
                rowIndex={rosterSchedulerTableUtil.getRowIndex("rosterRow_" + staffId)}
                systemParam={rosterSchedulerData.systemParam}
            />
        );
        rowList.push(
            <PreferredShiftRow
                calendarDateList={rosterSchedulerData.calendarDateList}
                dataAction={dataAction}
                eventHandler={eventHandler}
                itoId={staffId}
                key={"preferredShiftRow_" + staffId}
                preferredShiftList={rosterSchedulerData.preferredShiftList[staffId]}
                rowIndex={rosterSchedulerTableUtil.getRowIndex("preferredShiftRow_" + staffId)}
                systemParam={rosterSchedulerData.systemParam}
                rosterSchedulerTableUtil={rosterSchedulerTableUtil}              
            />
        )
    });
    return (
        <tbody>
            {rowList}
            <VacantShiftRow
                calendarDateList={rosterSchedulerData.calendarDateList}
                systemParam={rosterSchedulerData.systemParam}
                rosterSchedulerTableUtil={rosterSchedulerTableUtil}
                vacantShiftList={rosterSchedulerData.vacantShiftList}
            />
        </tbody>
    )
}