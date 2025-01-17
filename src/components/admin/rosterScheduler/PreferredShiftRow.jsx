import StaffShiftCell from "./StaffShiftCell";
import NameCell from "../../common/cells/NameCell";
import ShiftCell from "../../common/cells/ShiftCell";
import StatCell from "../../common/cells/StatCell";
export default function PreferredShiftRow({ calendarDateList, dataAction, eventHandler, itoId, preferredShiftList, rowIndex, rosterSchedulerTableUtil,systemParam  }) {
    let className = '';
    let preferredShift = '', shiftCellList = [];
   
    for (let i = systemParam.maxConsecutiveWorkingDay - systemParam.noOfPrevDate; i < systemParam.maxConsecutiveWorkingDay; i++) {
        shiftCellList.push(<ShiftCell key={"prev-preferred-" + i} />)
    }
    //console.log(preferredShiftList);
    calendarDateList.forEach((calendarDate, index) => {
        className = rosterSchedulerTableUtil.getSelectedCssClass(calendarDate.dateOfMonth + systemParam.noOfPrevDate, rowIndex);
        if ((preferredShiftList)&&(preferredShiftList[index + 1])) {
            preferredShift = preferredShiftList[index + 1];
        } else {
            preferredShift = '';
        }

        shiftCellList.push(
            <StaffShiftCell
                cssClassName={className.join(" ")}
                eventHandler={eventHandler}
                key={itoId + '_' + index}
                keyDownHandler={eventHandler.handleKeyDownEvent}
                onBlur={e => dataAction.updatePreferredShiftFromTable(itoId, calendarDate.dateOfMonth, e.target.textContent)}
                onPaste={e => eventHandler.handlePaste(e, calendarDate.dateOfMonth)}>
                {preferredShift}
            </StaffShiftCell>
        );
    });
    for (let i = calendarDateList.length; i < 31; i++) {
        shiftCellList.push(<ShiftCell key={"preferred_" + itoId + '_' + i} />);
    }
    return (
        <tr id={"preferredShiftRow_" + itoId}>
            <NameCell isHighLightRow={rosterSchedulerTableUtil.isHighLightRow(rowIndex)}>
                Preferred Shift
            </NameCell>
            {shiftCellList}
            <td className='borderCell' colSpan={6}>
            </td>
            <StatCell></StatCell>
            <StatCell></StatCell>
            <StatCell></StatCell>
            <StatCell></StatCell>
            <StatCell></StatCell>
        </tr>
    );
}