import CalendarUtility from "../../../util/calendar/CalendarUtility";
export default function DayCell({calendarDate}){
    let isPH = false;
    let textContent = '';
    let title=null;
    if (calendarDate) {
        if (
            calendarDate.isPublicHoliday ||
            calendarDate.dayOfWeek === 0 ||
            calendarDate.dayOfWeek === 6
        ) {
            isPH = true;
            title=calendarDate.festivalInfo
        }
        textContent = CalendarUtility.weekdayNames[calendarDate.dayOfWeek]
    }
    
    return (
        <td className={"borderCell dayCell text-center" + (isPH ? " phCell" : "")} title={title}>
            {textContent}
        </td>
    )
}