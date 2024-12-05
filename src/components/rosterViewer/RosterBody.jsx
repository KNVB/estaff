import RosterRow from "./RosterRow.jsx";
export default function RosterBody({ calendarDateList, dataAction, nonStandardWorkingHourSummary, roster, highLightAction }) {
    let staffIdList = Object.keys(roster);
    return (
        <tbody>
            {
                staffIdList.map((staffId, index) => (
                    <RosterRow
                        calendarDateList={calendarDateList}
                        dataAction={dataAction}
                        highLightAction={highLightAction}
                        staffId={staffId}
                        key={"rosterRow_" + staffId}
                        nonStandardWorkingHour={nonStandardWorkingHourSummary[staffId]}
                        roster={roster[staffId]}
                        rowIndex={(index + 5)}
                    />
                ))
            }
        </tbody>
    )
}