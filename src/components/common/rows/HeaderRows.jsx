import CaptionCell from "../cells/CaptionCell.jsx";
import DateRow from "./DateRow.jsx";
import DayRow from "./DayRow.jsx";
import HolidayRow from "./HolidayRow.jsx";
import MonthPicker from "../calendarPicker/monthPicker/MonthPicker.jsx";
export default function HeaderRows({ caption, calendarDateList, dataAction, highLightAction, rosterMonth, systemParam }) {
    return (
        <thead>
            <tr>
                <CaptionCell colSpan="42">
                    {caption}
                </CaptionCell>
            </tr>
            <tr>
                <CaptionCell colSpan="42">
                    <MonthPicker minDate={systemParam.monthPickerMinDate} onChange={dataAction.updateRosterMonth} value={rosterMonth} />
                </CaptionCell>
            </tr>
            <HolidayRow calendarDateList={calendarDateList} noOfPrevDate={systemParam.noOfPrevDate} />
            <DayRow calendarDateList={calendarDateList} noOfPrevDate={systemParam.noOfPrevDate} />
            <DateRow calendarDateList={calendarDateList} highLightAction={highLightAction} noOfPrevDate={systemParam.noOfPrevDate} />
        </thead>
    );
}