import { Button } from "react-bootstrap";
import './LoginForm.css';
export default function SideBar({ navItemList, content }) {
    document.title = "EMSTF Staff OT and Time Off Application";
    return (
        <div className='main'>
            <div className='d-flex flex-column flex-grow-1 m-1'>
                <div className="d-flex flex-row justify-content-center">
                    <table>
                        <thead>
                            <tr>
                                <th colSpan={2}>
                                    <h1>EMSTF Staff OT and Time Off Application</h1>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='text-end p-1'>HKO AD account name:</td>
                                <td><input type="text"/></td>
                            </tr>
                            <tr>
                                <td className='text-end p-1'>HKO AD account password:</td>
                                <td><input type="text"/></td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td className="text-center pt-3" colSpan={2}>
                                    <Button>Login</Button>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>    
            </div>
        </div>
    )
}