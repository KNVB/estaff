import ShiftCell from "../../common/cells/ShiftCell";
export default function VacantShiftRow({calendarDateList, systemParam,vacantShiftList,  rosterSchedulerTableUtil}){
    function handleMouseEnterEvent(e) {
        e.preventDefault();
        let cell = e.target.closest("td");
        let rowIndex = cell.closest("tr").rowIndex;
        rosterSchedulerTableUtil.updateHighLightCell(cell.cellIndex, rowIndex);
    }
    function handleMouseLeaveEvent(e) {
        e.preventDefault();
        rosterSchedulerTableUtil.updateHighLightCell(-1, -1);
    }
    let shiftCellList = [], vacantShift;
    for (let i = systemParam.maxConsecutiveWorkingDay - systemParam.noOfPrevDate; i < systemParam.maxConsecutiveWorkingDay; i++) {
        shiftCellList.push(<ShiftCell key={"prev-vacant-" + i} />)
    }
    calendarDateList.forEach(calendarDate => {
        vacantShift = vacantShiftList[calendarDate.dateOfMonth];
        shiftCellList.push(
            <td
                className='borderCell shiftCell'
                onMouseEnter={handleMouseEnterEvent}
                onMouseLeave={handleMouseLeaveEvent}
                key={"vacant-" + (calendarDate.dateOfMonth - 1)}>
                {vacantShift}
            </td>
        );
    });
    for (let i = calendarDateList.length; i < 31; i++) {
        shiftCellList.push(<ShiftCell key={'vacant-' + i} />)
    }
    return (
        <tr>
            <td className="border text-end vacantShiftLabel">Vacant Shifts</td>
            {shiftCellList}
            <td className='borderCell' colSpan={11}></td>
        </tr>
    )
}