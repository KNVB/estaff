import { Button } from "react-bootstrap";
import { Trash3 } from 'react-bootstrap-icons';
import useNonStandardWorkingHourForm from "./useNonStandardWorkingHourForm";
import DateTimePicker from "../../common/calendarPicker/dateTimePicker/DateTimePicker";
export default function NonStandardWorkingHourForm({ action }) {
    const { record, formAction } = useNonStandardWorkingHourForm();
    let setDescription = e => {
        let desc = e.target.value;
        if (desc.trim() === "") {
            alert("The description cannot be empty.");
        } else {
            formAction.setDescription(desc);
        }
    }
    let setEndTime = endTime => {
        if (endTime <= record.startTime) {
            alert("The end time must be later than start time.");
        } else {
            formAction.setEndTime(endTime);
        }
    }
    let setStartTime = startTime => {
        if (record.endTime <= startTime) {
            alert("The start time must be earlier than end time.");
        } else {
            formAction.setStartTime(startTime);
        }
    }
    let submitUpdate = e => {
        e.preventDefault();
        if (record.description.trim() === "") {
            alert("The description cannot be empty.");
            return
        }
        if (record.endTime <= record.startTime) {
            alert("The start time must be earlier than end time.");
            return
        }
        formAction.submit(action);
    }
    return (
        <div className="d-flex flex-grow-1 justify-content-center">
            <form onSubmit={() => { return false }}>
                <table className="border m-1 p-0">
                    <thead>
                        <tr>
                            <th className="border border-dark text-center" colSpan={4}>{(action === "edit") ? "Edit" : "Add"} Non Standard Working Hour Record</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-dark">Staff Name:</td>
                            <td className="border border-dark" colSpan={3}>{record.staffName}</td>
                        </tr>
                        <tr>
                            <td className="border border-dark">Staff Post:</td>
                            <td className="border border-dark" colSpan={3}>{record.staffPost}</td>
                        </tr>
                        <tr>
                            <td className="border border-dark">Claim Type:</td>
                            <td className="border border-dark" colSpan={3}>
                                Training
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-dark">Start Time:</td>
                            <td className="border border-dark">
                                <DateTimePicker onChange={(value) => setStartTime(value)} value={record.startTime} />
                            </td>
                            <td className="border border-dark">End Time:</td>
                            <td className="border border-dark">
                                <DateTimePicker onChange={(value) => setEndTime(value)} value={record.endTime} />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-dark">Duration in hour:</td>
                            <td className="border border-dark" colSpan={3}>
                                {record.durationInHour}
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-dark">Description:</td>
                            <td className="border border-dark" colSpan={3}>
                                <textarea className="w-100" onChange={setDescription} required value={record.description} />
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="border border-dark text-center" colSpan={4}>
                                <Button onClick={formAction.backToRecordlList}>Cancel</Button>&nbsp;
                                {
                                    (action === "edit") && 
                                    <><Button onClick={()=>formAction.deleteRecord(record.id)}>Delete</Button>&nbsp;</>
                                }
                                
                                <Button onClick={submitUpdate}>{(action === "edit") ? "Update" : "Add"} Non Standard Working Hour Record </Button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </form>
        </div>
    )
}