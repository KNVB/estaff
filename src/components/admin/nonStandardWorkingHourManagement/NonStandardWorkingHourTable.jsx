import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Pencil, PlusLg } from 'react-bootstrap-icons';
import Accordion from 'react-bootstrap/Accordion';
import MonthPicker from "../../common/calendarPicker/monthPicker/MonthPicker.jsx";
import Utility from '../../../util/Utility.js';
export default function NonStandardWorkingHourTable({ list, month, year, updatePeriod }) {
    let itemList = [];
    for (const [staffId, item] of Object.entries(list)) {
        let nonStandardWorkingHourItemTable = null;
        let tableContent = [], totalDurationInHour = 0;
        for (const [date, record] of Object.entries(item.nonStandardWorkingHourList)) {
            totalDurationInHour += record.durationInHour;
            tableContent.push(
                <tr key={"item_" + staffId + "_" + date}>
                    <td className='border'>{Utility.dateTimeFormatter.format(new Date(record.startTime))}</td>
                    <td className='border'>{Utility.dateTimeFormatter.format(new Date(record.endTime))}</td>
                    <td className='border'>{record.claimType}</td>
                    <td className='border'>{record.description}</td>
                    <td className='border'>{record.durationInHour}</td>
                    <td className='border'>
                        {
                            (record.claimType === "training") &&
                            <Link
                                state={{
                                    "record": {
                                        claimType: record.claimType,
                                        "description": record.description,
                                        durationInHour: record.durationInHour,
                                        "id": record.id,
                                        "staffId": staffId,
                                        staffName: item.staffName,
                                        staffPost: item.staffPost,
                                        startTime: new Date(record.startTime),
                                        endTime: new Date(record.endTime)
                                    }
                                }}
                                to="../nonStandardWorkingHourManagement/edit">
                                <Button variant="warning">
                                    <Pencil />
                                    Edit
                                </Button>
                            </Link>
                        }
                    </td>
                </tr>
            );
        }
        if (tableContent.length > 0) {
            tableContent.push(
                <tr key={"item_" + staffId + "_total"}>
                    <td className='border text-end' colSpan={4}>Total:</td>
                    <td className='border'>{totalDurationInHour}</td>
                </tr>
            );
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
                        <th className='border'></th>
                    </tr>
                </thead>
                <tbody>{tableContent}</tbody>
                <tfoot>
                    <tr>
                        <td className='border text-end' colSpan={6}>
                            <Link
                                state={{
                                    "record": {                                        
                                        claimType:"training",
                                        description:"",
                                        durationInHour: 0,
                                        endTime: new Date(),
                                        "id": -1,
                                        "staffId": staffId,
                                        staffName: item.staffName,
                                        staffPost: item.staffPost,
                                        startTime: new Date()
                                    }
                                }}
                                to="../nonStandardWorkingHourManagement/add">
                                <Button>
                                    <PlusLg />
                                    Add A New Record
                                </Button>
                            </Link>
                        </td>
                    </tr>
                </tfoot>
            </table>
        );
        itemList.push(
            <Accordion.Item key={"item_" + staffId} eventKey={staffId}>
                <Accordion.Header>
                    {item.staffPost},{item.staffName} ({Object.keys(item.nonStandardWorkingHourList).length})
                </Accordion.Header>
                <Accordion.Body>{nonStandardWorkingHourItemTable}</Accordion.Body>
            </Accordion.Item>
        );
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