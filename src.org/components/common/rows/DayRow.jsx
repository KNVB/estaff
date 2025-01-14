import NameCell from "../cells/NameCell.jsx";
import DayCell from "../cells/DayCell.jsx";
import StatCell from "../cells/StatCell.jsx";
export default function DayRow({ calendarDateList, noOfPrevDate,weekdayNames }) {
    let dayList = [];
    let prevDayList = [];
    for (let i = 0; i < noOfPrevDate; i++) {
        prevDayList.push(<td className="borderCell dayCell" key={"prevDay_" + i} />);
    }
    calendarDateList.forEach((calendarDate, index) => {
        dayList.push(<DayCell calendarDate={calendarDate} key={'day_' + index} />);
    });
    for (let i = calendarDateList.length; i < 31; i++) {
        dayList.push(
            <DayCell key={'day_' + i}></DayCell>
        );
    }
    return (
        <tr>
            <NameCell>Days</NameCell>
            {prevDayList}
            {dayList}
            <StatCell rowSpan="2">
                Total
                <br />
                Hour
            </StatCell>
            <StatCell rowSpan="2">
                Actual
                <br />
                Hour
            </StatCell>
            <StatCell rowSpan="2">
                Non Standard
                <br/>
                Working
                <br />
                Hour
            </StatCell>
            <StatCell colSpan="8">
                Hour Off Due
            </StatCell>
        </tr>
    )
}