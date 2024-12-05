import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Pencil, PlusLg } from 'react-bootstrap-icons';
import Staff from "./Staff";
export default function StaffTable({staffList}){
    let staffRowList = [], isLeft;
    console.log(staffList);
    for (const [staffId, staff] of Object.entries(staffList)) {
        isLeft = (staff.leaveDate !== "2099-12-31");
        staffRowList.push(
            <tr className={(isLeft ? "highLight text-secondary" : "highLight")} key={staffId} title={(isLeft ? staff.staftName+" has left on "+staff.leaveDate : "")}>
                <td className="border">
                    {staff.staffName}
                </td>
                <td className="border text-center">
                    {staff.staffPost}
                </td>
                <td className="border text-center">
                    {staff.availableShift.join(",")}
                </td>
                <td className="border text-center">
                    {staff.workingHourPerDay}
                </td>
                <td className="border text-center">
                    <Link state={{ "staff": staff }} to="../staffManagement/edit">
                        <Button variant="warning"><Pencil /></Button>
                    </Link>
                </td>
            </tr>
        )
    }
    return (
        <table className="border m-1 p-0">
            <thead>
                <tr>
                    <th className="text-center" colSpan={5}>EMSTF Staff Info Management</th>
                </tr>
                <tr>
                    <th className="border text-center">Staff Name</th>
                    <th className="border text-center">Staff Post</th>
                    <th className="border text-center">Available Shift Type</th>
                    <th className="border text-center">No. of Working Hour Per Day</th>
                    <th className="border text-center">Edit</th>
                </tr>
            </thead>
            <tbody>
                {staffRowList}
            </tbody>
            <tfoot>
                <tr>
                    <td className="" colSpan={5}>
                        <div className="d-flex flex-grow-1 justify-content-end p-1">
                            <Link
                                state={{ "staff": Staff() }}
                                to="../itoManagement/add">
                                <Button className="d-flex align-items-center">
                                    <PlusLg />
                                    Add New Staff
                                </Button>
                            </Link>
                        </div>
                    </td>
                </tr>
            </tfoot>
        </table>
    )
}