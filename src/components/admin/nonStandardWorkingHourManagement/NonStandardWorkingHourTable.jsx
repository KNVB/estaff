import Accordion from 'react-bootstrap/Accordion';
import MonthPicker from "../../common/calendarPicker/monthPicker/MonthPicker.jsx";
import Utility from '../../../util/Utility.js';
export default function NonStandardWorkingHourTable({ list, month, year, updatePeriod }) {
    let itemList = [];
    for (const [staffId, item] of Object.entries(list)) {
        let nonStandardWorkingHourItemTable = null;
        if (Object.keys(item.nonStandardWorkingHourList).length > 0) {
            let nonStandardWorkingHourItemList = [], totalDurationInHour = 0;
            for (const [date, record] of Object.entries(item.nonStandardWorkingHourList)) {
                totalDurationInHour += record.durationInHour;
                nonStandardWorkingHourItemList.push(
                    <tr key={"item_" + staffId + "_" + date}>
                        <td className='border'>{Utility.dateTimeFormatter.format(new Date(record.startTime))}</td>
                        <td className='border'>{Utility.dateTimeFormatter.format(new Date(record.endTime))}</td>
                        <td className='border'>{record.claimType}</td>
                        <td className='border'>{record.description}</td>
                        <td className='border'>{record.durationInHour}</td>
                    </tr>
                )
            }
            nonStandardWorkingHourItemTable = (
                <table className='border w-100'>
                    <thead>
                        <tr>
                            <th className='border'>start time</th>
                            <th className='border'>end time</th>
                            <th className='border'>claim type</th>
                            <th className='border'>description</th>
                            <th className='border'>duration in hour</th>
                        </tr>
                    </thead>
                    <tbody>{nonStandardWorkingHourItemList}</tbody>
                    <tfoot>
                        <tr>
                            <td className='border text-end' colSpan={4}>Total:</td>
                            <td className='border'>{totalDurationInHour}</td>
                        </tr>
                    </tfoot>
                </table>
            );
        }
        if (nonStandardWorkingHourItemTable === null) {
            itemList.push(
                <Accordion.Item key={"item_" + staffId} eventKey={staffId}>
                    <Accordion.Header>{item.staffPost},{item.staffName} ({Object.keys(item.nonStandardWorkingHourList).length})</Accordion.Header>
                </Accordion.Item>
            );
        } else {
            itemList.push(
                <Accordion.Item key={"item_" + staffId} eventKey={staffId}>
                    <Accordion.Header>{item.staffPost},{item.staffName} ({Object.keys(item.nonStandardWorkingHourList).length})</Accordion.Header>
                    <Accordion.Body>{nonStandardWorkingHourItemTable}</Accordion.Body>
                </Accordion.Item>
            );
        }

    }
    return (
        <table className="m-1 p-0">
            <thead>
                <tr>
                    <th className="text-center">EMSTF Staff Non Standard Working Hour Records Management</th>
                </tr>
                <tr>
                    <td className="text-center">
                        <MonthPicker value={new Date(year, month, 1)} onChange={(newMonth) => { updatePeriod(newMonth) }} />
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <Accordion alwaysOpen={false} defaultActiveKey="0">
                            {itemList}
                        </Accordion>
                    </td>
                </tr>
            </tbody>
        </table >
    )
}