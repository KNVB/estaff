import HolidayCell from "../cells/HolidayCell";
import NameCell from "../cells/NameCell";
export default function HolidayRow({ calendarDateList, noOfPrevDate }){
    let holidayList = [];
    let prevHolidayList = [];
    for (let i = 0; i < noOfPrevDate; i++) {
        prevHolidayList.push(<td className="borderCell holidayCell" key={"prevHoliday_" + i} />);
    }
    calendarDateList.forEach((calendarDate, index) => {
        holidayList.push(<HolidayCell calendarDate={calendarDate} key={'holiday_' + index} />);
    });
    for (let i = calendarDateList.length; i < 31; i++) {
        holidayList.push(
            <HolidayCell key={'holiday_' + i}></HolidayCell>
        );
    }
    return (
        <tr>
            <NameCell>Holiday</NameCell>
            {prevHolidayList}
            {holidayList}
            <td className="borderCell" colSpan="11" key="holiday_31"></td>
        </tr>
    )
}