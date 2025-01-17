import StaffShiftCell from "./StaffShiftCell.jsx";
import NameCell from "../../common/cells/NameCell.jsx";
import ShiftCell from "../../common/cells/ShiftCell.jsx";
import StatCell from "../../common/cells/StatCell.jsx";
export default function StaffShiftRow({ calendarDateList, dataAction, eventHandler, staffId, previousMonthShiftList, nonStandardWorkingHour, roster, rowIndex, systemParam, rosterSchedulerTableUtil }) {
    let className = '';
    let shift = '', shiftCellList = [];
    for (let i = systemParam.maxConsecutiveWorkingDay - systemParam.noOfPrevDate; i < systemParam.maxConsecutiveWorkingDay; i++) {
        className = '';
        shift = '';
        if (previousMonthShiftList && (previousMonthShiftList[i] !== undefined)) {
            shift = previousMonthShiftList[i];
            className = dataAction.getShiftCssClassName(staffId,shift);
        }
        shiftCellList.push(
            <ShiftCell
                cssClassName={className}
                key={"prev-" + i}
                title={shift}>
                {shift}
            </ShiftCell>
        )
    }
    calendarDateList.forEach((calendarDate, index) => {
        shift = roster.shiftList[index + 1];
        className = rosterSchedulerTableUtil.getSelectedCssClass(calendarDate.dateOfMonth + systemParam.noOfPrevDate, rowIndex);
        switch (true){
            case (dataAction.isBlackListedShift(index + 1, staffId)):
                className.push("blackListedShift");
                break;
            case (dataAction.isDuplicateShift(index + 1, staffId)):
                className.push("duplicatedShift");
                break;
            default:
                className.push(dataAction.getShiftCssClassName(staffId,shift));
                break            
        }
        shiftCellList.push(
            <StaffShiftCell
                cssClassName={className.join(" ")}
                eventHandler={eventHandler}
                key={staffId + '_' + index}
                keyDownHandler={eventHandler.handleKeyDownEvent}
                onBlur={e => dataAction.updateShiftFromTable(staffId, index + 1, e.target.textContent)}
                onPaste={e => eventHandler.handlePaste(e, calendarDate.dateOfMonth)}
            >
                {shift}
            </StaffShiftCell>
        );
    });
    for (let i = calendarDateList.length; i < 31; i++) {
        shiftCellList.push(<ShiftCell key={staffId + '_' + i}>&nbsp;</ShiftCell>)
    }
    return (
        <tr id={"rosterRow_" + staffId}>
            <NameCell isHighLightRow={rosterSchedulerTableUtil.isHighLightRow(rowIndex)}>
                {roster.staffName}
                <br />
                {roster.staffPost} Extn. 2458
            </NameCell>
            {shiftCellList}
            <StatCell>
                {roster.expectedWorkingHour.toFixed(2)}
            </StatCell>
            <StatCell>
                {roster.actualWorkingHour.toFixed(2)}
            </StatCell>
            <StatCell>
                {nonStandardWorkingHour.toFixed(2)}
            </StatCell>
            <StatCell>
                {roster.lastMonthBalance.toFixed(2)}
            </StatCell>
            <StatCell>
                {roster.thisMonthBalance.toFixed(2)}
            </StatCell>
            <StatCell>
                {roster.totalBalance.toFixed(2)}
            </StatCell>
            <StatCell>
                {roster.aShiftCount}
            </StatCell>
            <StatCell>
                {roster.bxShiftCount}
            </StatCell>
            <StatCell>
                {roster.cShiftCount}
            </StatCell>
            <StatCell>
                {roster.dxShiftCount}
            </StatCell>
            <StatCell>
                {roster.actualWorkingDayCount}
            </StatCell>
        </tr>
    );
}