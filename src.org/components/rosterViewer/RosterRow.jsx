import NameCell from "../common/cells/NameCell.jsx";
import ShiftCell from "../common/cells/ShiftCell.jsx";
import StatCell from "../common/cells/StatCell.jsx";

export default function RosterRow({ calendarDateList, dataAction, highLightAction, staffId, nonStandardWorkingHour, roster, rowIndex }) {
    let className = "";
    let shiftCellList = [];
    function handleMouseEnterEvent(e) {
        e.preventDefault();
        let cell = e.target.closest("td");
        let rowIndex = cell.closest("tr").rowIndex;
        highLightAction.updateHighLightCell(cell.cellIndex, rowIndex);
    }
    function handleMouseLeaveEvent(e) {
        e.preventDefault();
        highLightAction.updateHighLightCell(-1, -1);
    }
    calendarDateList.forEach((calendarDate, index) => {
        let shift = roster.shiftList[index + 1];
        className = dataAction.getShiftCssClassName(staffId, shift);
        shiftCellList.push(
            <ShiftCell
                cssClassName={className}
                key={staffId + '_' + index}
                onMouseEnter={handleMouseEnterEvent}
                onMouseLeave={handleMouseLeaveEvent}>
                <div className="m-0 p-0">
                    {shift}
                </div>
            </ShiftCell>
        );
    });
    for (let i = calendarDateList.length; i < 31; i++) {
        shiftCellList.push(<ShiftCell key={staffId + '_' + i}>&nbsp;</ShiftCell>)
    }
    return (
        <tr id={"rosterRow_" + staffId}>
            <NameCell isHighLightRow={highLightAction.isHighLightRow(rowIndex)}>
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