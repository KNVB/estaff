import useRosterTable from "./useRosterTable";
import HeaderRows from "../common/rows/HeaderRows.jsx";
import RosterBody from "./RosterBody.jsx";
import ShiftInfoLegend from "../common/ShiftInfoLegend.jsx";
export default function RosterTable({ rosterViewerData, dataAction }) {
    const { activeShiftList, calendarDateList, nonStandardWorkingHourSummary, roster, rosterMonth, systemParam } = rosterViewerData;
    const highLightAction = useRosterTable();
    return (
        <table className="m-1 p-0 rosterTable">
            <HeaderRows
                caption="EMSTF Computer Operator Roster"
                calendarDateList={calendarDateList}
                dataAction={dataAction}
                highLightAction={highLightAction}
                rosterMonth={rosterMonth}
                systemParam={systemParam} />
            <RosterBody
                calendarDateList={calendarDateList}
                dataAction={dataAction}
                highLightAction={highLightAction}
                nonStandardWorkingHourSummary={nonStandardWorkingHourSummary}
                roster={roster} />
            <tfoot>
                <tr>
                    <td colSpan="7" className="pt-1">
                        <ShiftInfoLegend activeShiftList={activeShiftList} />
                    </td>
                    <td colSpan={37}>
                    </td>
                </tr>
            </tfoot>
        </table>
    );
}