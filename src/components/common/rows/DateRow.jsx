import NameCell from "../cells/NameCell.jsx";
import DateCell from "../cells/DateCell.jsx";
import StatCell from "../cells/StatCell.jsx";

export default function DateRow({ calendarDateList, highLightAction, noOfPrevDate }) {
    let dateList = [];
    let prevDateList = [];
    let realIndex;
    
    for (let i = 0; i < noOfPrevDate; i++) {
        prevDateList.push(<td className="borderCell dayCell" key={"prevDate_" + i} />);
    }
    calendarDateList.forEach((calendarDate, index) => {
        realIndex = index + noOfPrevDate + 1;        
        dateList.push(<DateCell calendarDate={calendarDate} isHighLightCell={highLightAction.isHighLightCol(realIndex)} key={'date_' + index} />);
    });
    for (let i = calendarDateList.length; i < 31; i++) {
        dateList.push(
            <DateCell key={'date_' + i}></DateCell>
        );
    }
    return (
        <tr>
            <NameCell>
                Resident Support<br />Team Members
            </NameCell>
            {prevDateList}
            {dateList}
            <StatCell rowSpan="1">
                Last
                <br />
                Month
            </StatCell>
            <StatCell rowSpan="1">
                This
                <br />
                Month
            </StatCell>          
            <StatCell rowSpan="1">
                Total
            </StatCell>
            <StatCell rowSpan="1">
                Total No. of
                <br />A Shift
            </StatCell>
            <StatCell rowSpan="1">
                Total No. of
                <br />B Shift
            </StatCell>
            <StatCell rowSpan="1">
                Total No. of
                <br />C Shift
            </StatCell>
            <StatCell rowSpan="1">
                Total No. of
                <br />D Shift
            </StatCell>
            <StatCell rowSpan="1">
                No. of <br />
                working
                <br />
                day
            </StatCell>
        </tr>
    )
}