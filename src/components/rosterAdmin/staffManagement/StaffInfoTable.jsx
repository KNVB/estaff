import { Button } from "react-bootstrap";
import { DashCircleFill, PlusCircleFill } from 'react-bootstrap-icons';

export default function StaffInfoTable({formItem,staffAction}){
    let blackListedShiftPattern = "(a|(b[1]?)|c|d[123]?)(,(a|(b[1]?)|c|d[123]?))*";
    let submitUpdate=e=>{
        let form = e.target.form;
        e.preventDefault();
        formItem.doUpdate(form,staffAction);
    }
    return (
        <div className="d-flex flex-grow-1 justify-content-center">
            <form onSubmit={() => { return false }}>
                <table className="border m-1 p-0">
                    <thead>
                        <tr>
                            <th className="border border-dark text-center" colSpan={4}>{(staffAction === "edit") ? "Edit" : "Add"} Staff Info</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-dark">Staff Name</td>
                            <td className="border border-dark">
                                <input name="staffName" onChange={formItem.updateTextField} required type="text" value={formItem.staffInfo.staffName} />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-dark">Staff Post</td>
                            <td className="border border-dark">
                                <input name="staffPost" onChange={formItem.updateTextField} pattern="S{0,1}ITO\d{1,2}" required type="text" value={formItem.staffInfo.staffPost} />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-dark">Duty Pattern</td>
                            <td className="border border-dark">
                                <input checked={(formItem.staffInfo.dutyPattern === "day")} name="dutyPattern" onChange={formItem.updateDutyPattern} required type="radio" value="day" />Monday to Friday<br />
                                <input checked={(formItem.staffInfo.dutyPattern === "operator")} name="dutyPattern" onChange={formItem.updateDutyPattern} required type="radio" value="operator" />Regular Shift (operator)
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-dark">Available Shift</td>
                            <td className="border border-dark">
                                <div className="d-flex justify-content-between gap-1">
                                    {
                                        Object.keys(formItem.activeShiftList).map(shiftType => (
                                            <label key={shiftType}>
                                                {shiftType}
                                                <input
                                                    checked={formItem.staffInfo.availableShift.includes(shiftType)}
                                                    name="availableShift"
                                                    onChange={formItem.updateAvailableShift}
                                                    type="checkbox"
                                                    value={shiftType} />
                                            </label>
                                        ))
                                    }
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-dark">Black Listed Shift Type</td>
                            <td className="border border-dark">
                                <div className="d-flex flex-row flex-grow-1">
                                    <div className="border border-dark d-flex flex-column flex-grow-1">
                                        {
                                            formItem.staffInfo.blackListedShiftPattern.map((pattern, index) => (
                                                <div className="align-items-center d-flex flex-grow-1" key={"blackListedShiftPattern_" + index}>
                                                    <input
                                                        name={"blackListedShiftPattern_" + index}
                                                        onChange={formItem.updateShiftPattern}
                                                        pattern={blackListedShiftPattern}
                                                        required
                                                        type="text"
                                                        value={pattern} />&nbsp;
                                                    <DashCircleFill className="cursor-pointer" onClick={e => formItem.removeShiftPattern(index)} />
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div className="align-items-center border border-dark d-flex flex-grow-1 justify-content-center">
                                        <PlusCircleFill className="cursor-pointer" onClick={formItem.addShiftPattern} />
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-dark">No. of Working Hour Per Day</td>
                            <td className="border border-dark">
                                <input onChange={formItem.updateTextField} name="workingHourPerDay" pattern="\d+.?\d*" required type="text" value={formItem.staffInfo.workingHourPerDay} />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-dark">Join Date</td>
                            <td className="border border-dark">                              
                                <DatePicker
                                    locale="en-ca"
                                    onChange={joinDate => formItem.updateDate("joinDate", joinDate)}
                                    required={true}
                                    value={formItem.staffInfo.joinDate} />
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="border border-dark text-center" colSpan={4}>
                                <Button onClick={formItem.backToITOlList}>Cancel</Button>&nbsp;
                                <Button onClick={submitUpdate}>{(staffAction === "edit") ? "Update" : "Add"} Staff Info </Button>
                            </td>
                        </tr>
                    </tfoot>    
                </table>    
            </form>
        </div>    
    )
}