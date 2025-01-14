export default function DateCell({ calendarDate,  isHighLightCell  }) {    
    let isToday = false;
    let textContent = '';
    if (calendarDate) {
        isToday = calendarDate.isToday;
        textContent = calendarDate.dateOfMonth;
    }
    return (
        <td className={"borderCell dateCell text-center" + (isHighLightCell ? " highlightCell" : "") + (isToday ? " todayCell" : "")} title={(isToday ?"Today":"")}>
            {textContent}
        </td>
    )
}