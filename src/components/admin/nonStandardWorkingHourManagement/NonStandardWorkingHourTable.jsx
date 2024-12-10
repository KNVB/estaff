import MonthPicker from "../../common/calendarPicker/monthPicker/MonthPicker.jsx";
export default function NonStandardWorkingHourTable({ list, month, year }) {
    return (
        <table className="m-1 p-0">
            <thead>
                <tr>
                    <th className="text-center" colSpan={5}>EMSTF Staff Non Standard Working Hour Records Management</th>
                </tr>
                <tr>
                    <td className="text-center" colSpan={5}>
                        <MonthPicker value={new Date(year, month, 1)} />
                    </td>
                </tr>
            </thead>
        </table>
    )
}